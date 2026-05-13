const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const TMP_DIR = path.join(ROOT_DIR, 'tmp_init', 'development');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

async function optimizeLogos() {
  console.log('🖼️  Optimizando logos...\n');

  try {
    // Logo blanco
    const logoWhitePath = path.join(TMP_DIR, 'devpicon-logo-blanco.png');
    if (fs.existsSync(logoWhitePath)) {
      await sharp(logoWhitePath)
        .resize(200, 138, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png({ quality: 85, compressionLevel: 9 })
        .toFile(path.join(PUBLIC_DIR, 'logo-white-optimized.png'));
      console.log('✅ Logo blanco optimizado (200x138px)');
    } else {
      console.log('⚠️  Logo blanco no encontrado en:', logoWhitePath);
    }

    // Logo negro
    const logoDarkPath = path.join(TMP_DIR, 'devpicon-logo-negro.png');
    if (fs.existsSync(logoDarkPath)) {
      await sharp(logoDarkPath)
        .resize(200, 138, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png({ quality: 85, compressionLevel: 9 })
        .toFile(path.join(PUBLIC_DIR, 'logo-dark-optimized.png'));
      console.log('✅ Logo negro optimizado (200x138px)');
    } else {
      console.log('⚠️  Logo negro no encontrado en:', logoDarkPath);
    }

    // Avatar
    const avatarPath = path.join(TMP_DIR, 'avatar_con_fondoblanco.png');
    if (fs.existsSync(avatarPath)) {
      await sharp(avatarPath)
        .resize(800, 800, { fit: 'cover' })
        .png({ quality: 90, compressionLevel: 9 })
        .toFile(path.join(PUBLIC_DIR, 'avatar-optimized.png'));
      console.log('✅ Avatar optimizado (800x800px)');
      console.log('   💡 Nota: Considera remover el fondo blanco con remove.bg');
    } else {
      console.log('⚠️  Avatar no encontrado en:', avatarPath);
    }

    console.log('\n✨ Optimización completada!\n');
    console.log('📊 Estadísticas:');

    // Mostrar tamaños
    const files = ['logo-white-optimized.png', 'logo-dark-optimized.png', 'avatar-optimized.png'];
    files.forEach(file => {
      const filePath = path.join(PUBLIC_DIR, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`   ${file}: ${sizeKB} KB`);
      }
    });

    console.log('\n📝 Para usar las versiones optimizadas, actualiza las rutas en tu código:');
    console.log('   - /logo-white.png → /logo-white-optimized.png');
    console.log('   - /logo-dark.png → /logo-dark-optimized.png');
    console.log('   - /avatar.png → /avatar-optimized.png');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

optimizeLogos();
