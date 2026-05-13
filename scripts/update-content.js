require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const https = require('https');

const CONTENT_FILE = path.join(__dirname, '..', 'src', 'data', 'content.json');

// Configuración
const CONFIG = {
  youtube: {
    channelId: '@devpicon',
    // Alternativa: usar RSS feed de YouTube
    rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCYourChannelID'
  },
  devto: {
    username: 'devpicon'
  },
  medium: {
    username: 'devpicon',
    rssUrl: 'https://medium.com/feed/@devpicon'
  },
  spotify: {
    showId: '1iyrRtXu0hrOQJyA7vdGiX',
    // Nota: Spotify requiere autenticación OAuth, usar RSS si está disponible
  }
};

/**
 * Hace una petición HTTPS y devuelve el resultado como string
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

/**
 * Parsea XML simple (para RSS feeds)
 */
function parseXmlValue(xml, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, 'i');
  const match = xml.match(regex);
  if (!match) return '';

  let value = match[1].trim();
  // Limpiar CDATA
  value = value.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');
  return value;
}

/**
 * Obtiene los 2 últimos videos de YouTube usando la API
 */
async function getLatestYouTubeVideos() {
  try {
    console.log('📺 Obteniendo últimos 2 videos de YouTube...');

    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    if (!apiKey || !channelId) {
      console.log('⚠️  YOUTUBE_API_KEY o YOUTUBE_CHANNEL_ID no configurados');
      console.log('   Tip: Configura las variables en .env.local o GitHub Secrets');
      return [{
        title: 'Configura YouTube API para auto-actualizar',
        description: 'Ve a API_SETUP.md para instrucciones',
        url: 'https://youtube.com/@devpicon',
        date: new Date().toISOString().split('T')[0],
        image: ''
      }];
    }

    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&order=date&maxResults=2&type=video`;

    const response = await fetchUrl(url);
    const data = JSON.parse(response);

    if (data.items && data.items.length > 0) {
      return data.items.map(video => ({
        title: video.snippet.title,
        description: video.snippet.description.substring(0, 200) || video.snippet.title,
        url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
        date: video.snippet.publishedAt.split('T')[0],
        image: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url || ''
      }));
    }

    return [];
  } catch (error) {
    console.error('❌ Error obteniendo videos de YouTube:', error.message);
    return [];
  }
}

/**
 * Obtiene el último episodio de podcast de Spotify
 */
async function getLatestPodcastEpisode() {
  try {
    console.log('🎙️  Obteniendo último episodio de podcast...');

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.log('⚠️  SPOTIFY_CLIENT_ID o SPOTIFY_CLIENT_SECRET no configurados');
      console.log('   Tip: Configura las variables en .env.local o GitHub Secrets');
      return {
        title: 'Configura Spotify API para auto-actualizar',
        description: 'Ve a API_SETUP.md para instrucciones',
        url: `https://open.spotify.com/show/${CONFIG.spotify.showId}`,
        date: new Date().toISOString().split('T')[0],
        image: ''
      };
    }

    // Paso 1: Obtener token de acceso usando Client Credentials Flow
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const tokenResponse = await new Promise((resolve, reject) => {
      const https = require('https');
      const postData = 'grant_type=client_credentials';

      const options = {
        hostname: 'accounts.spotify.com',
        path: '/api/token',
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': postData.length
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      });

      req.on('error', reject);
      req.write(postData);
      req.end();
    });

    const { access_token } = JSON.parse(tokenResponse);

    // Paso 2: Obtener episodios del show
    const showUrl = `https://api.spotify.com/v1/shows/${CONFIG.spotify.showId}/episodes?limit=1`;
    const episodesResponse = await new Promise((resolve, reject) => {
      const https = require('https');
      const url = new URL(showUrl);

      const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      });

      req.on('error', reject);
      req.end();
    });

    const episodesData = JSON.parse(episodesResponse);

    if (episodesData.items && episodesData.items.length > 0) {
      const episode = episodesData.items[0];
      return {
        title: episode.name,
        description: episode.description.substring(0, 200) || episode.name,
        url: episode.external_urls.spotify,
        date: episode.release_date,
        image: episode.images[0]?.url || ''
      };
    }

    return null;
  } catch (error) {
    console.error('❌ Error obteniendo episodio de podcast:', error.message);
    return null;
  }
}

/**
 * Obtiene el último artículo de Dev.to
 */
async function getLatestDevToArticle() {
  try {
    console.log('📝 Obteniendo último artículo de Dev.to...');

    const url = `https://dev.to/api/articles?username=${CONFIG.devto.username}&per_page=1`;
    const response = await fetchUrl(url);
    const articles = JSON.parse(response);

    if (articles && articles.length > 0) {
      const article = articles[0];
      return {
        title: article.title,
        description: article.description || article.title,
        url: article.url,
        date: article.published_at.split('T')[0],
        image: article.cover_image || article.social_image || ''
      };
    }

    return null;
  } catch (error) {
    console.error('❌ Error obteniendo artículo de Dev.to:', error.message);
    return null;
  }
}

/**
 * Obtiene el último artículo de Medium (usando RSS)
 */
async function getLatestMediumArticle() {
  try {
    console.log('📰 Obteniendo último artículo de Medium...');

    const response = await fetchUrl(CONFIG.medium.rssUrl);

    // Parsear el primer item del RSS
    const items = response.split('<item>');
    if (items.length > 1) {
      const firstItem = items[1];

      const title = parseXmlValue(firstItem, 'title');
      const link = parseXmlValue(firstItem, 'link');
      const pubDate = parseXmlValue(firstItem, 'pubDate');
      const description = parseXmlValue(firstItem, 'description')
        .replace(/<[^>]*>/g, '') // Quitar HTML
        .substring(0, 200); // Limitar longitud

      // Extraer imagen del content:encoded si existe
      const content = parseXmlValue(firstItem, 'content:encoded');
      const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
      const image = imgMatch ? imgMatch[1] : '';

      return {
        title: title,
        description: description,
        url: link,
        date: new Date(pubDate).toISOString().split('T')[0],
        image: image
      };
    }

    return null;
  } catch (error) {
    console.error('❌ Error obteniendo artículo de Medium:', error.message);
    return null;
  }
}

/**
 * Actualiza el archivo content.json con el nuevo contenido
 */
async function updateContentFile() {
  console.log('🚀 Actualizando contenido...\n');

  // Obtener contenido de todas las fuentes
  const [videos, podcast, devto, medium] = await Promise.all([
    getLatestYouTubeVideos(),
    getLatestPodcastEpisode(),
    getLatestDevToArticle(),
    getLatestMediumArticle()
  ]);

  // Usar Dev.to o Medium, el que esté más reciente
  let blog = devto;
  if (medium && devto) {
    blog = new Date(medium.date) > new Date(devto.date) ? medium : devto;
  } else if (medium) {
    blog = medium;
  }

  // Leer el archivo actual
  let currentContent = {};
  try {
    const fileContent = fs.readFileSync(CONTENT_FILE, 'utf8');
    currentContent = JSON.parse(fileContent);
  } catch (error) {
    console.log('⚠️  No se pudo leer el archivo actual, creando uno nuevo');
  }

  // Actualizar con el nuevo contenido
  const newContent = {
    latestContent: {
      videos: videos.length > 0 ? videos : (currentContent.latestContent?.videos || []),
      podcast: podcast || currentContent.latestContent?.podcast || {},
      blog: blog || currentContent.latestContent?.blog || {}
    },
    lastUpdated: new Date().toISOString()
  };

  // Guardar el archivo
  fs.writeFileSync(
    CONTENT_FILE,
    JSON.stringify(newContent, null, 2),
    'utf8'
  );

  console.log('\n✅ Contenido actualizado exitosamente!\n');
  console.log('📊 Resumen:');
  if (videos.length > 0) {
    videos.forEach((video, index) => {
      console.log(`   Video ${index + 1}: ${video.title}`);
    });
  }
  console.log(`   Podcast: ${newContent.latestContent.podcast.title}`);
  console.log(`   Blog: ${newContent.latestContent.blog.title}`);
  console.log(`\n📅 Última actualización: ${newContent.lastUpdated}`);
}

// Ejecutar
updateContentFile().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
