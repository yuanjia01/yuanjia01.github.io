#!/usr/bin/env node

/**
 * Script helper para obtener tu YouTube Channel ID
 * Uso: node scripts/get-youtube-channel-id.js YOUR_API_KEY
 */

const https = require('https');

const apiKey = process.argv[2];
const username = 'devpicon'; // Tu username de YouTube

if (!apiKey) {
  console.log('❌ Error: Se requiere una API key');
  console.log('\n📖 Uso:');
  console.log('   node scripts/get-youtube-channel-id.js TU_API_KEY\n');
  console.log('💡 Primero obtén tu API key en:');
  console.log('   https://console.cloud.google.com/apis/credentials\n');
  process.exit(1);
}

console.log('🔍 Buscando Channel ID para: @' + username);
console.log('⏳ Consultando YouTube API...\n');

// Intentar por username
const url = `https://www.googleapis.com/youtube/v3/channels?part=id,snippet&forUsername=${username}&key=${apiKey}`;

https.get(url, (res) => {
  let data = '';

  res.on('data', chunk => data += chunk);

  res.on('end', () => {
    try {
      const response = JSON.parse(data);

      if (response.error) {
        console.log('❌ Error de API:', response.error.message);
        console.log('\n💡 Verifica que:');
        console.log('   1. La API key sea válida');
        console.log('   2. YouTube Data API v3 esté habilitada en tu proyecto');
        console.log('   3. La API key tenga permisos para YouTube Data API v3\n');
        process.exit(1);
      }

      if (response.items && response.items.length > 0) {
        const channel = response.items[0];
        console.log('✅ ¡Canal encontrado!\n');
        console.log('📺 Título del canal:', channel.snippet.title);
        console.log('🆔 Channel ID:', channel.id);
        console.log('\n📋 Copia este Channel ID para usarlo en tus secrets:\n');
        console.log('   ' + channel.id);
        console.log('\n✨ ¡Listo! Ahora puedes agregarlo a GitHub Secrets\n');
      } else {
        console.log('⚠️  No se encontró el canal con username:', username);
        console.log('\n💡 Prueba obtenerlo manualmente:');
        console.log('   1. Ve a: https://youtube.com/@' + username);
        console.log('   2. Haz clic derecho → "Ver código fuente"');
        console.log('   3. Busca (Ctrl+F): "channelId"');
        console.log('   4. Copia el ID que aparece (UCxxxxxxxxxxxxxxxxxx)\n');
      }
    } catch (error) {
      console.log('❌ Error parseando respuesta:', error.message);
      console.log('Respuesta raw:', data);
    }
  });
}).on('error', (error) => {
  console.log('❌ Error de red:', error.message);
  process.exit(1);
});
