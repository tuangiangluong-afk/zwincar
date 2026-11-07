const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/images/social');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

// 1. Avatar Dark (800x800) - Deep Slate #12161E with Terracotta #C9572C & White Kinetic Z
const avatarDarkSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1A202C"/>
      <stop offset="100%" stop-color="#0E1218"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="800" height="800" fill="url(#bgGrad)"/>
  
  <!-- Subtle circular guide aura for circular crop preview -->
  <circle cx="400" cy="400" r="390" fill="none" stroke="#C9572C" stroke-width="2" stroke-opacity="0.12"/>
  <circle cx="400" cy="400" r="360" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.05"/>

  <!-- Monogram Z (Scale: original 48x48 mapped to center ~420x420 px) -->
  <!-- Center is 400, 400. Offset = 400 - 24 * 9.5 = 400 - 228 = 172. Scale = 9.5 -->
  <g transform="translate(172, 172) scale(9.5)" filter="url(#shadow)">
    <!-- Upper Horizon Blade (Terracotta #C9572C) -->
    <polygon points="9,9 39,9 41.5,12 28.5,25 24,20.5 30.5,14 9,14" fill="#C9572C"/>
    <!-- Lower Horizon Blade (Crisp White #FFFFFF for dark background contrast) -->
    <polygon points="39,39 9,39 6.5,36 19.5,23 24,27.5 17.5,34 39,34" fill="#FFFFFF"/>
  </g>
</svg>
`;

// 2. Avatar Terracotta (800x800) - Signature Terracotta #C9572C
const avatarTerracottaSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <radialGradient id="bgTerra" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#DD6538"/>
      <stop offset="100%" stop-color="#B24720"/>
    </radialGradient>
    <filter id="shadowTerra" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#551B08" flood-opacity="0.4"/>
    </filter>
  </defs>

  <rect width="800" height="800" fill="url(#bgTerra)"/>
  <circle cx="400" cy="400" r="380" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-opacity="0.15"/>

  <g transform="translate(172, 172) scale(9.5)" filter="url(#shadowTerra)">
    <!-- Upper Blade White -->
    <polygon points="9,9 39,9 41.5,12 28.5,25 24,20.5 30.5,14 9,14" fill="#FFFFFF"/>
    <!-- Lower Blade Deep Slate #12161E -->
    <polygon points="39,39 9,39 6.5,36 19.5,23 24,27.5 17.5,34 39,34" fill="#12161E"/>
  </g>
</svg>
`;

// 3. Avatar Light (800x800) - Warm Saharan Sand #FAF7F2
const avatarLightSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <filter id="shadowLight" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="#12161E" flood-opacity="0.15"/>
    </filter>
  </defs>

  <rect width="800" height="800" fill="#FAF7F2"/>
  <circle cx="400" cy="400" r="388" fill="none" stroke="#E7DFD5" stroke-width="4"/>

  <g transform="translate(172, 172) scale(9.5)" filter="url(#shadowLight)">
    <!-- Upper Blade Terracotta -->
    <polygon points="9,9 39,9 41.5,12 28.5,25 24,20.5 30.5,14 9,14" fill="#C9572C"/>
    <!-- Lower Blade Deep Slate -->
    <polygon points="39,39 9,39 6.5,36 19.5,23 24,27.5 17.5,34 39,34" fill="#12161E"/>
  </g>
</svg>
`;

async function run() {
  await sharp(Buffer.from(avatarDarkSvg)).png().toFile(path.join(outDir, 'avatar_dark_800x800.png'));
  await sharp(Buffer.from(avatarTerracottaSvg)).png().toFile(path.join(outDir, 'avatar_terracotta_800x800.png'));
  await sharp(Buffer.from(avatarLightSvg)).png().toFile(path.join(outDir, 'avatar_light_800x800.png'));
  console.log('✅ Avatars created in', outDir);
}

run().catch(console.error);
