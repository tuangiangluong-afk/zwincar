const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/images/social');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

// Checkmark SVG path helper
const checkIcon = `<path d="M4 12l5 5L20 6" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
const shieldIcon = `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="#C9572C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;
const planeIcon = `<path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 20.5 3c-1-1-3-.5-4.5 1L12.5 7.5 4.3 5.7c-.5-.1-1 .1-1.3.5l-.8 1.1c-.3.4-.2 1 .2 1.3L8 13l-3 3-2.5-.5c-.4-.1-.8.1-1 .4l-.4.6c-.2.4-.1.8.2 1.1l3.5 2.5 2.5 3.5c.3.3.7.4 1.1.2l.6-.4c.3-.2.5-.6.4-1L8.9 21l3-3 4.4 5.6c.3.4.9.5 1.3.2l1.1-.8c.4-.3.6-.8.5-1.3z" fill="#38BDF8"/>`;
const carIcon = `<path d="M5 17h14m-14 0a2 2 0 01-2-2V9a2 2 0 012-2h1.5a2 2 0 011.6.8L9.5 10h5l1.4-2.2a2 2 0 011.6-.8H19a2 2 0 012 2v6a2 2 0 01-2 2m-14 0a2 2 0 100 4 2 2 0 000-4zm14 0a2 2 0 100 4 2 2 0 000-4z" fill="none" stroke="#F59E0B" stroke-width="2"/>`;

// ==========================================
// 1. FACEBOOK BANNER (1640 x 624 px)
// ==========================================
const facebookBannerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1640" height="624" viewBox="0 0 1640 624">
  <defs>
    <linearGradient id="fbBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B0E13"/>
      <stop offset="50%" stop-color="#121720"/>
      <stop offset="100%" stop-color="#1A1412"/>
    </linearGradient>

    <radialGradient id="fbGlow" cx="85%" cy="30%" r="55%">
      <stop offset="0%" stop-color="#C9572C" stop-opacity="0.32"/>
      <stop offset="60%" stop-color="#C9572C" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

    <radialGradient id="fbGlowLeft" cx="15%" cy="80%" r="45%">
      <stop offset="0%" stop-color="#C9572C" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

    <filter id="fbShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="1640" height="624" fill="url(#fbBg)"/>
  <rect width="1640" height="624" fill="url(#fbGlow)"/>
  <rect width="1640" height="624" fill="url(#fbGlowLeft)"/>

  <!-- Subtle Architectural Lines -->
  <g stroke="#FFFFFF" stroke-opacity="0.04" stroke-width="1.5">
    <line x1="0" y1="520" x2="1640" y2="520"/>
    <line x1="0" y1="120" x2="1640" y2="120"/>
    <circle cx="1380" cy="312" r="280" fill="none" stroke="#C9572C" stroke-opacity="0.12" stroke-dasharray="8 8"/>
    <circle cx="1380" cy="312" r="190" fill="none" stroke="#FFFFFF" stroke-opacity="0.06"/>
  </g>

  <!-- Big Decorative Background Monogram on Right -->
  <g transform="translate(1180, 112) scale(8.5)" opacity="0.08">
    <polygon points="9,9 39,9 41.5,12 28.5,25 24,20.5 30.5,14 9,14" fill="#C9572C"/>
    <polygon points="39,39 9,39 6.5,36 19.5,23 24,27.5 17.5,34 39,34" fill="#FFFFFF"/>
  </g>

  <!-- Top Bar / Badge -->
  <g transform="translate(100, 75)">
    <rect width="365" height="38" rx="19" fill="#1A202C" stroke="#C9572C" stroke-width="1.5" stroke-opacity="0.6"/>
    <circle cx="22" cy="19" r="6" fill="#C9572C"/>
    <text x="38" y="24" fill="#F1ECE4" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" letter-spacing="1.5">LOCATION DE VOITURE AU MAROC</text>
  </g>

  <!-- Main Brand Title -->
  <g transform="translate(100, 155)">
    <!-- Logo Icon -->
    <g transform="translate(0, 5) scale(1.65)">
      <polygon points="9,9 39,9 41.5,12 28.5,25 24,20.5 30.5,14 9,14" fill="#C9572C"/>
      <polygon points="39,39 9,39 6.5,36 19.5,23 24,27.5 17.5,34 39,34" fill="#FFFFFF"/>
    </g>
    <!-- Brand Wordmark -->
    <text x="85" y="65" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="64" fill="#FFFFFF" letter-spacing="-1">Zwin<tspan fill="#C9572C">Car</tspan><tspan font-size="28" fill="#FFFFFF" dx="8" font-weight="bold" opacity="0.8">.com</tspan></text>
  </g>

  <!-- Value Proposition Headline -->
  <g transform="translate(100, 280)">
    <text x="0" y="0" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="36" fill="#FFFFFF" letter-spacing="-0.5">
      SANS CAUTION CB <tspan fill="#C9572C">-</tspan> ZERO BLOCAGE BANCAIRE
    </text>
    <text x="0" y="38" font-family="Arial, Helvetica, sans-serif" font-weight="normal" font-size="20" fill="#B8C1CC">
      Fini les empreintes de 1 500 EUR a l arrivee. Cartes de debit et especes acceptees.
    </text>
  </g>

  <!-- 3 Key Value Pillars (Cards) -->
  <g transform="translate(100, 365)">
    <!-- Card 1 -->
    <g transform="translate(0, 0)">
      <rect width="280" height="64" rx="14" fill="#181E27" stroke="#2B3545" stroke-width="1.2"/>
      <g transform="translate(16, 18) scale(1.1)">${shieldIcon}</g>
      <text x="50" y="29" fill="#C9572C" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="bold">0 EUR Caution CB</text>
      <text x="50" y="49" fill="#8F9BA8" font-family="Arial, Helvetica, sans-serif" font-size="12">Formule Serenite ou 300 EUR cash</text>
    </g>

    <!-- Card 2 -->
    <g transform="translate(295, 0)">
      <rect width="280" height="64" rx="14" fill="#181E27" stroke="#2B3545" stroke-width="1.2"/>
      <g transform="translate(16, 20) scale(1)">${checkIcon}</g>
      <text x="50" y="29" fill="#10B981" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="bold">Livraison Offerte</text>
      <text x="50" y="49" fill="#8F9BA8" font-family="Arial, Helvetica, sans-serif" font-size="12">Aeroport et Riad sans attente</text>
    </g>

    <!-- Card 3 -->
    <g transform="translate(590, 0)">
      <rect width="280" height="64" rx="14" fill="#181E27" stroke="#2B3545" stroke-width="1.2"/>
      <g transform="translate(16, 18) scale(1.1)">${carIcon}</g>
      <text x="50" y="29" fill="#F59E0B" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="bold">Modele Garanti</text>
      <text x="50" y="49" fill="#8F9BA8" font-family="Arial, Helvetica, sans-serif" font-size="12">Ou surclassement offert</text>
    </g>
  </g>

  <!-- Right Contact Box -->
  <g transform="translate(1080, 230)">
    <rect width="460" height="205" rx="20" fill="#161C24" stroke="#C9572C" stroke-width="1.5" stroke-opacity="0.4" filter="url(#fbShadow)"/>
    <text x="35" y="45" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="18" fill="#F1ECE4">ASSISTANCE ET RESERVATION</text>
    <text x="35" y="70" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="#8F9BA8">Confirmation immediate par nos agents locaux</text>
    
    <rect x="35" y="92" width="390" height="52" rx="12" fill="#25D366" fill-opacity="0.15" stroke="#25D366" stroke-width="1.2"/>
    <text x="55" y="124" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="17" fill="#25D366">WhatsApp 24/7 : +212 720 794 046</text>
    
    <text x="35" y="176" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="15" fill="#C9572C">Site officiel : www.zwincar.com</text>
  </g>

  <!-- Footer Hubs Bar -->
  <g transform="translate(100, 560)">
    <text x="0" y="0" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" fill="#718096" letter-spacing="1">
      VILLES DESSERVIES : <tspan fill="#F1ECE4">MARRAKECH - AGADIR - CASABLANCA - FES - TANGER - RABAT - OUARZAZATE - NADOR</tspan>
    </text>
  </g>
</svg>
`;

// ==========================================
// 2. YOUTUBE BANNER (2560 x 1440 px)
// Strict safe area for Mobile & Desktop: X: 507 to 2053, Y: 508 to 931
// ==========================================
const youtubeBannerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="2560" height="1440" viewBox="0 0 2560 1440">
  <defs>
    <radialGradient id="ytRadial" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#19202B"/>
      <stop offset="60%" stop-color="#0E1218"/>
      <stop offset="100%" stop-color="#07090C"/>
    </radialGradient>

    <radialGradient id="ytCenterGlow" cx="50%" cy="50%" r="40%">
      <stop offset="0%" stop-color="#C9572C" stop-opacity="0.25"/>
      <stop offset="70%" stop-color="#C9572C" stop-opacity="0.03"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

    <filter id="ytGlowFilter" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- TV Canvas Background -->
  <rect width="2560" height="1440" fill="url(#ytRadial)"/>
  <rect width="2560" height="1440" fill="url(#ytCenterGlow)"/>

  <!-- Watermark for TV Viewers -->
  <g transform="translate(1900, 480) scale(15)" opacity="0.03">
    <polygon points="9,9 39,9 41.5,12 28.5,25 24,20.5 30.5,14 9,14" fill="#C9572C"/>
    <polygon points="39,39 9,39 6.5,36 19.5,23 24,27.5 17.5,34 39,34" fill="#FFFFFF"/>
  </g>

  <!-- ============================================================ -->
  <!-- CENTRAL SAFE ZONE (X: 520, Y: 520 -> 1520 x 400 px) -->
  <!-- ============================================================ -->
  <g id="safe-area" transform="translate(520, 520)">
    
    <!-- Top Pill -->
    <g transform="translate(0, 15)">
      <rect width="360" height="32" rx="16" fill="#1C2330" stroke="#C9572C" stroke-width="1.2" stroke-opacity="0.7"/>
      <circle cx="18" cy="16" r="5" fill="#C9572C"/>
      <text x="32" y="21" fill="#F1ECE4" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" letter-spacing="1.5">LA CHAINE OFFICIELLE ZWINCAR</text>
    </g>

    <!-- Main Brand Title + Logo -->
    <g transform="translate(0, 65)">
      <g transform="translate(0, 8) scale(1.65)" filter="url(#ytGlowFilter)">
        <polygon points="9,9 39,9 41.5,12 28.5,25 24,20.5 30.5,14 9,14" fill="#C9572C"/>
        <polygon points="39,39 9,39 6.5,36 19.5,23 24,27.5 17.5,34 39,34" fill="#FFFFFF"/>
      </g>
      <text x="85" y="65" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="64" fill="#FFFFFF" letter-spacing="-1.5">
        Zwin<tspan fill="#C9572C">Car</tspan><tspan font-size="28" fill="#FFFFFF" dx="8" font-weight="bold" opacity="0.8">.com</tspan>
      </text>
    </g>

    <!-- Main Tagline in Safe Area -->
    <g transform="translate(0, 180)">
      <text x="0" y="0" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" letter-spacing="-0.5">
        LOCATION VOITURE MAROC <tspan fill="#C9572C">-</tspan> SANS CAUTION CB
      </text>
      <text x="0" y="34" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#B8C1CC">
        Guides routes - Radars et Pieges - Tizi n Tichka et Desert - Arnaques caution evitees
      </text>
    </g>

    <!-- Content Pillars / Badges (Row of 3) -->
    <g transform="translate(0, 260)">
      <g transform="translate(0, 0)">
        <rect width="250" height="52" rx="12" fill="#151B24" stroke="#2B3648" stroke-width="1.2"/>
        <text x="16" y="24" fill="#C9572C" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="bold">0 EUR Bloque sur CB</text>
        <text x="16" y="42" fill="#8F9BA8" font-family="Arial, Helvetica, sans-serif" font-size="11">Cartes debit et cash acceptes</text>
      </g>

      <g transform="translate(265, 0)">
        <rect width="250" height="52" rx="12" fill="#151B24" stroke="#2B3648" stroke-width="1.2"/>
        <text x="16" y="24" fill="#10B981" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="bold">Guides et Itineraires</text>
        <text x="16" y="42" fill="#8F9BA8" font-family="Arial, Helvetica, sans-serif" font-size="11">Atlas, Merzouga, Cote Sud</text>
      </g>

      <g transform="translate(530, 0)">
        <rect width="250" height="52" rx="12" fill="#151B24" stroke="#2B3648" stroke-width="1.2"/>
        <text x="16" y="24" fill="#38BDF8" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="bold">8 Aeroports Couverts</text>
        <text x="16" y="42" fill="#8F9BA8" font-family="Arial, Helvetica, sans-serif" font-size="11">Livraison terminal et riad</text>
      </g>
    </g>

    <!-- Right Side CTA Box in Safe Area -->
    <g transform="translate(1000, 30)">
      <rect width="480" height="300" rx="20" fill="#141923" stroke="#C9572C" stroke-width="1.5" stroke-opacity="0.5" filter="url(#ytGlowFilter)"/>
      
      <rect x="35" y="30" width="230" height="28" rx="8" fill="#C9572C" fill-opacity="0.2"/>
      <text x="47" y="49" fill="#FF8453" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold">NOUVELLE VIDEO / SEMAINE</text>

      <text x="35" y="95" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="22" fill="#FFFFFF">CONSEILS ROUTIERS MAROC</text>
      <text x="35" y="125" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#8F9BA8">Tous les secrets pour rouler serein au Maroc</text>

      <!-- WhatsApp Row -->
      <rect x="35" y="150" width="410" height="48" rx="10" fill="#25D366" fill-opacity="0.15" stroke="#25D366" stroke-width="1"/>
      <text x="50" y="180" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="16" fill="#25D366">WhatsApp Dedie : +212 720 794 046</text>

      <!-- Web URL -->
      <rect x="35" y="210" width="410" height="48" rx="10" fill="#C9572C" fill-opacity="0.15" stroke="#C9572C" stroke-width="1"/>
      <text x="50" y="240" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="16" fill="#FF7A45">Reservation 24/7 : www.zwincar.com</text>
    </g>

    <!-- Bottom Strip in Safe Area -->
    <g transform="translate(0, 360)">
      <text x="0" y="0" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" fill="#6B798A" letter-spacing="1">
        MARRAKECH - AGADIR - CASABLANCA - FES - TANGER - RABAT - OUARZAZATE - NADOR
      </text>
    </g>

  </g>
</svg>
`;

// ==========================================
// 3. TWITTER / X BANNER (1500 x 500 px)
// ==========================================
const twitterBannerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="500" viewBox="0 0 1500 500">
  <defs>
    <linearGradient id="twBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E1218"/>
      <stop offset="100%" stop-color="#1B1715"/>
    </linearGradient>
    <radialGradient id="twGlow" cx="80%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#C9572C" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1500" height="500" fill="url(#twBg)"/>
  <rect width="1500" height="500" fill="url(#twGlow)"/>

  <g transform="translate(360, 90)">
    <rect width="320" height="30" rx="15" fill="#1C2330" stroke="#C9572C" stroke-width="1.2"/>
    <text x="25" y="20" fill="#F1ECE4" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="bold" letter-spacing="1.5">LOCATION VOITURE MAROC</text>

    <g transform="translate(0, 45)">
      <g transform="translate(0, 4) scale(1.3)">
        <polygon points="9,9 39,9 41.5,12 28.5,25 24,20.5 30.5,14 9,14" fill="#C9572C"/>
        <polygon points="39,39 9,39 6.5,36 19.5,23 24,27.5 17.5,34 39,34" fill="#FFFFFF"/>
      </g>
      <text x="68" y="48" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="50" fill="#FFFFFF">
        Zwin<tspan fill="#C9572C">Car</tspan><tspan font-size="22" fill="#FFFFFF" dx="6" font-weight="bold" opacity="0.8">.com</tspan>
      </text>
    </g>

    <text x="0" y="160" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="26" fill="#FFFFFF">
      SANS CAUTION CB - ZERO BLOCAGE BANCAIRE
    </text>
    <text x="0" y="190" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#8F9BA8">
      Debit et Cash acceptes - Livraison aeroport et riad offerte - 8 villes au Maroc
    </text>

    <g transform="translate(0, 220)">
      <text x="0" y="0" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="14" fill="#25D366">
        WhatsApp : +212 720 794 046  |  Site : zwincar.com
      </text>
    </g>
  </g>
</svg>
`;

// ==========================================
// 4. LINKEDIN COMPANY BANNER (1584 x 396 px)
// ==========================================
const linkedinBannerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1584" height="396" viewBox="0 0 1584 396">
  <defs>
    <linearGradient id="liBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E1218"/>
      <stop offset="60%" stop-color="#141922"/>
      <stop offset="100%" stop-color="#1E1715"/>
    </linearGradient>
    <radialGradient id="liGlow" cx="85%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#C9572C" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1584" height="396" fill="url(#liBg)"/>
  <rect width="1584" height="396" fill="url(#liGlow)"/>

  <g transform="translate(360, 65)">
    <g transform="translate(0, 0)">
      <g transform="translate(0, 4) scale(1.35)">
        <polygon points="9,9 39,9 41.5,12 28.5,25 24,20.5 30.5,14 9,14" fill="#C9572C"/>
        <polygon points="39,39 9,39 6.5,36 19.5,23 24,27.5 17.5,34 39,34" fill="#FFFFFF"/>
      </g>
      <text x="70" y="50" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="52" fill="#FFFFFF">
        Zwin<tspan fill="#C9572C">Car</tspan><tspan font-size="24" fill="#FFFFFF" dx="6" font-weight="bold" opacity="0.8">.com</tspan>
      </text>
    </g>

    <text x="0" y="115" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="24" fill="#FFFFFF">
      Plateforme de Mobilite Touristique au Maroc Sans Caution CB
    </text>
    <text x="0" y="145" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#8F9BA8">
      Flotte verifiee - 8 Hubs Aeroportuaires - Modeles garantis - Conciergerie WhatsApp 24/7
    </text>

    <g transform="translate(0, 180)">
      <text x="0" y="0" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" fill="#C9572C" letter-spacing="1">
        MARRAKECH - AGADIR - CASABLANCA - FES - TANGER - RABAT - OUARZAZATE - NADOR
      </text>
      <text x="0" y="30" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="bold" fill="#25D366">
        WhatsApp : +212 720 794 046  |  www.zwincar.com
      </text>
    </g>
  </g>
</svg>
`;

async function run() {
  await sharp(Buffer.from(facebookBannerSvg)).png().toFile(path.join(outDir, 'facebook_banner_1640x624.png'));
  console.log('✅ Facebook banner generated: 1640x624');

  await sharp(Buffer.from(youtubeBannerSvg)).png().toFile(path.join(outDir, 'youtube_banner_2560x1440.png'));
  console.log('✅ YouTube banner generated: 2560x1440');

  await sharp(Buffer.from(twitterBannerSvg)).png().toFile(path.join(outDir, 'twitter_banner_1500x500.png'));
  console.log('✅ Twitter/X banner generated: 1500x500');

  await sharp(Buffer.from(linkedinBannerSvg)).png().toFile(path.join(outDir, 'linkedin_banner_1584x396.png'));
  console.log('✅ LinkedIn banner generated: 1584x396');
}

run().catch(console.error);
