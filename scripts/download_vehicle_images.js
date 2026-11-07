const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const https = require('https');

const vehicles = [
  {
    name: 'hyundai-staria.webp',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Hyundai_Staria_1X7A0321.jpg'
  },
  {
    name: 'toyota-hilux.webp',
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/2020_Toyota_Hilux_Revo_4x4_Double-Cab_2.8_Rocco.jpg'
  },
  {
    name: 'volkswagen-golf-8.webp',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/2020_Volkswagen_Golf_Style_1.5_Front.jpg'
  }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'ZwinCarBot/1.0 (contact@zwincar.com)' } }, response => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', err => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  const tmpDir = '/tmp/vehicle_downloads';
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  for (const v of vehicles) {
    const tmpFile = path.join(tmpDir, v.name.replace('.webp', '.jpg'));
    console.log(`Downloading ${v.name} from ${v.url}...`);
    await download(v.url, tmpFile);
    
    const targetFile = path.join(__dirname, '../public/images/vehicles', v.name);
    console.log(`Processing ${v.name} to 800x500 webp...`);
    
    await sharp(tmpFile)
      .resize(800, 500, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 82 })
      .toFile(targetFile);
      
    const stat = fs.statSync(targetFile);
    console.log(`✅ ${v.name} saved (${stat.size} bytes)`);
  }
}

run().catch(console.error);
