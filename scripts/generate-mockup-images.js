const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDir = path.join(__dirname, '..', 'public', 'images', 'projects');

// Project 1: Distributed Cache
const svgCache = `
<svg width="1200" height="675" viewBox="0 0 1200 675" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="675" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#090912"/>
      <stop offset="50%" stop-color="#111122"/>
      <stop offset="100%" stop-color="#0a0a14"/>
    </linearGradient>
    <linearGradient id="purpleGlow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6E56CF"/>
      <stop offset="100%" stop-color="#22D3EE"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(30, 27, 50, 0.8)"/>
      <stop offset="100%" stop-color="rgba(18, 16, 32, 0.9)"/>
    </linearGradient>
    <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="675" fill="url(#bg)"/>

  <!-- Subtle Grid Lines -->
  <g stroke="rgba(255,255,255,0.03)" stroke-width="1">
    ${Array.from({ length: 24 }).map((_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="675"/>`).join('')}
    ${Array.from({ length: 14 }).map((_, i) => `<line x1="0" y1="${i * 50}" x2="1200" y2="${i * 50}"/>`).join('')}
  </g>

  <!-- Top App Window Bar -->
  <rect x="60" y="40" width="1080" height="595" rx="16" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
  <rect x="60" y="40" width="1080" height="48" rx="16" fill="rgba(255,255,255,0.03)"/>
  <circle cx="90" cy="64" r="6" fill="#EF4444" opacity="0.8"/>
  <circle cx="110" cy="64" r="6" fill="#F59E0B" opacity="0.8"/>
  <circle cx="130" cy="64" r="6" fill="#10B981" opacity="0.8"/>
  <text x="600" y="70" fill="rgba(255,255,255,0.4)" font-family="monospace" font-size="13" text-anchor="middle">nexus-cache-cluster // telemetry-dashboard v2.4</text>

  <!-- Title & Status -->
  <text x="100" y="130" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">High-Throughput Distributed Cache Architecture</text>
  <rect x="100" y="146" width="94" height="24" rx="12" fill="rgba(16, 185, 129, 0.15)" stroke="#10B981" stroke-width="1"/>
  <circle cx="114" cy="158" r="4" fill="#10B981"/>
  <text x="126" y="162" fill="#10B981" font-family="monospace" font-size="11" font-weight="bold">CLUSTER HEALTHY</text>

  <!-- Top Metric Cards -->
  <g transform="translate(100, 185)">
    <rect x="0" y="0" width="220" height="90" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)"/>
    <text x="20" y="32" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12">PEAK THROUGHPUT</text>
    <text x="20" y="65" fill="#22D3EE" font-family="monospace" font-size="28" font-weight="bold">154,200</text>
    <text x="150" y="65" fill="#94A3B8" font-family="monospace" font-size="13">QPS</text>
  </g>

  <g transform="translate(340, 185)">
    <rect x="0" y="0" width="220" height="90" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)"/>
    <text x="20" y="32" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12">P99 LATENCY</text>
    <text x="20" y="65" fill="#A78BFA" font-family="monospace" font-size="28" font-weight="bold">4.2</text>
    <text x="75" y="65" fill="#94A3B8" font-family="monospace" font-size="13">ms</text>
    <text x="120" y="65" fill="#10B981" font-family="monospace" font-size="12">-68% vs baseline</text>
  </g>

  <g transform="translate(580, 185)">
    <rect x="0" y="0" width="220" height="90" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)"/>
    <text x="20" y="32" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12">CACHE HIT RATIO</text>
    <text x="20" y="65" fill="#F472B6" font-family="monospace" font-size="28" font-weight="bold">94.8%</text>
    <text x="130" y="65" fill="#10B981" font-family="monospace" font-size="12">Optimal</text>
  </g>

  <g transform="translate(820, 185)">
    <rect x="0" y="0" width="220" height="90" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)"/>
    <text x="20" y="32" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12">ACTIVE NODES (RAFT)</text>
    <text x="20" y="65" fill="#34D399" font-family="monospace" font-size="28" font-weight="bold">12 / 12</text>
    <text x="145" y="65" fill="#94A3B8" font-family="monospace" font-size="12">Quorum</text>
  </g>

  <!-- Left: Consistent Hashing Ring Visual -->
  <g transform="translate(250, 440)">
    <circle cx="0" cy="0" r="110" stroke="rgba(110, 86, 207, 0.3)" stroke-width="2" fill="none" stroke-dasharray="6 6"/>
    <circle cx="0" cy="0" r="110" stroke="url(#purpleGlow)" stroke-width="3" fill="none" stroke-dasharray="120 400" filter="url(#glowFilter)"/>
    
    <!-- Nodes on ring -->
    <circle cx="0" cy="-110" r="14" fill="#6E56CF" stroke="#FFFFFF" stroke-width="2"/>
    <circle cx="95" cy="-55" r="10" fill="#22D3EE"/>
    <circle cx="95" cy="55" r="10" fill="#6E56CF"/>
    <circle cx="0" cy="110" r="14" fill="#22D3EE" stroke="#FFFFFF" stroke-width="2"/>
    <circle cx="-95" cy="55" r="10" fill="#6E56CF"/>
    <circle cx="-95" cy="-55" r="10" fill="#22D3EE"/>

    <circle cx="0" cy="0" r="40" fill="rgba(110, 86, 207, 0.15)" stroke="#6E56CF" stroke-width="1"/>
    <text x="0" y="5" fill="#FFFFFF" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">ROUTER</text>
  </g>

  <!-- Right: Real-time Bar Chart -->
  <g transform="translate(560, 310)">
    <rect x="0" y="0" width="500" height="270" rx="12" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)"/>
    <text x="24" y="36" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">QPS Ingress &amp; Replication Stream</text>
    
    <!-- Grid -->
    <line x1="24" y1="210" x2="476" y2="210" stroke="rgba(255,255,255,0.1)"/>
    <line x1="24" y1="140" x2="476" y2="140" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4 4"/>
    <line x1="24" y1="70" x2="476" y2="70" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4 4"/>

    <!-- Bars -->
    ${[40, 65, 80, 55, 90, 110, 130, 95, 120, 145, 135, 150, 125, 140, 160, 130, 145, 170, 155, 165]
      .map((h, i) => `<rect x="${30 + i * 22}" y="${210 - h}" width="14" height="${h}" rx="3" fill="url(#purpleGlow)" opacity="0.85"/>`)
      .join('')}

    <text x="30" y="240" fill="#64748B" font-family="monospace" font-size="11">00:00</text>
    <text x="240" y="240" fill="#64748B" font-family="monospace" font-size="11">12:00</text>
    <text x="440" y="240" fill="#64748B" font-family="monospace" font-size="11">NOW</text>
  </g>
</svg>
`;

// Project 2: Real-time Collab Canvas
const svgCollab = `
<svg width="1200" height="675" viewBox="0 0 1200 675" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg2" x1="0" y1="0" x2="1200" y2="675" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0b0b14"/>
      <stop offset="50%" stop-color="#141424"/>
      <stop offset="100%" stop-color="#0a0a14"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#818CF8"/>
    </linearGradient>
    <linearGradient id="cardGrad2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(24, 24, 42, 0.85)"/>
      <stop offset="100%" stop-color="rgba(15, 15, 26, 0.95)"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="675" fill="url(#bg2)"/>

  <!-- Dot Grid for Canvas -->
  <g fill="rgba(255,255,255,0.06)">
    ${Array.from({ length: 30 }).flatMap((_, x) =>
      Array.from({ length: 16 }).map((_, y) => `<circle cx="${x * 40 + 20}" cy="${y * 40 + 20}" r="1.5"/>`)
    ).join('')}
  </g>

  <!-- App Window -->
  <rect x="60" y="40" width="1080" height="595" rx="16" fill="url(#cardGrad2)" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
  <rect x="60" y="40" width="1080" height="48" rx="16" fill="rgba(255,255,255,0.03)"/>
  <circle cx="90" cy="64" r="6" fill="#EF4444" opacity="0.8"/>
  <circle cx="110" cy="64" r="6" fill="#F59E0B" opacity="0.8"/>
  <circle cx="130" cy="64" r="6" fill="#10B981" opacity="0.8"/>
  <text x="600" y="70" fill="rgba(255,255,255,0.4)" font-family="monospace" font-size="13" text-anchor="middle">hyperflow-canvas // multiplayer-session #room-804</text>

  <!-- Active Avatars -->
  <g transform="translate(940, 52)">
    <circle cx="0" cy="12" r="14" fill="#6E56CF" stroke="#FFFFFF" stroke-width="1.5"/>
    <text x="0" y="16" fill="#FFFFFF" font-family="system-ui" font-size="10" font-weight="bold" text-anchor="middle">AN</text>
    <circle cx="24" cy="12" r="14" fill="#22D3EE" stroke="#FFFFFF" stroke-width="1.5"/>
    <text x="24" y="16" fill="#000000" font-family="system-ui" font-size="10" font-weight="bold" text-anchor="middle">SJ</text>
    <circle cx="48" cy="12" r="14" fill="#F43F5E" stroke="#FFFFFF" stroke-width="1.5"/>
    <text x="48" y="16" fill="#FFFFFF" font-family="system-ui" font-size="10" font-weight="bold" text-anchor="middle">MC</text>
    <circle cx="72" cy="12" r="14" fill="#10B981" stroke="#FFFFFF" stroke-width="1.5"/>
    <text x="72" y="16" fill="#FFFFFF" font-family="system-ui" font-size="10" font-weight="bold" text-anchor="middle">+9</text>
  </g>

  <!-- Canvas Surface Items -->
  <g transform="translate(140, 140)">
    <!-- Node 1: Video Input -->
    <rect x="0" y="0" width="240" height="150" rx="12" fill="rgba(110, 86, 207, 0.12)" stroke="#6E56CF" stroke-width="2"/>
    <rect x="16" y="16" width="208" height="80" rx="8" fill="rgba(0,0,0,0.4)"/>
    <text x="120" y="60" fill="#A78BFA" font-family="monospace" font-size="12" text-anchor="middle">▶ 4K HDR Feed</text>
    <text x="16" y="125" fill="#FFFFFF" font-family="system-ui" font-size="14" font-weight="bold">Ingress Pipeline A</text>

    <!-- Connector Line -->
    <path d="M 240 75 C 340 75, 340 225, 440 225" stroke="#38BDF8" stroke-width="3" fill="none" stroke-dasharray="6 6"/>

    <!-- Node 2: Processing Matrix -->
    <g transform="translate(440, 150)">
      <rect x="0" y="0" width="280" height="180" rx="12" fill="rgba(34, 211, 238, 0.08)" stroke="#22D3EE" stroke-width="2"/>
      <text x="20" y="36" fill="#FFFFFF" font-family="system-ui" font-size="16" font-weight="bold">WebGL Filter Shaders</text>
      <text x="20" y="58" fill="#94A3B8" font-family="monospace" font-size="12">FPS: 60.0 • Latency: 18ms</text>
      
      <rect x="20" y="75" width="240" height="24" rx="6" fill="rgba(255,255,255,0.05)"/>
      <rect x="20" y="75" width="190" height="24" rx="6" fill="#6E56CF"/>
      <text x="28" y="91" fill="#FFFFFF" font-family="monospace" font-size="11">GPU Memory: 78%</text>

      <rect x="20" y="110" width="240" height="24" rx="6" fill="rgba(255,255,255,0.05)"/>
      <rect x="20" y="110" width="220" height="24" rx="6" fill="#22D3EE"/>
      <text x="28" y="126" fill="#000000" font-family="monospace" font-size="11" font-weight="bold">Sync Buffer: Optimal</text>
    </g>

    <!-- Multiplayer Cursors -->
    <!-- Cursor 1 -->
    <g transform="translate(380, 80)">
      <polygon points="0,0 6,18 10,12 18,10" fill="#22D3EE"/>
      <rect x="14" y="14" width="80" height="22" rx="4" fill="#22D3EE"/>
      <text x="20" y="29" fill="#000000" font-family="system-ui" font-size="10" font-weight="bold">Alex N.</text>
    </g>

    <!-- Cursor 2 -->
    <g transform="translate(760, 260)">
      <polygon points="0,0 6,18 10,12 18,10" fill="#EC4899"/>
      <rect x="14" y="14" width="76" height="22" rx="4" fill="#EC4899"/>
      <text x="20" y="29" fill="#FFFFFF" font-family="system-ui" font-size="10" font-weight="bold">Sarah J.</text>
    </g>
  </g>

  <!-- Bottom Floating Stats Bar -->
  <g transform="translate(250, 530)">
    <rect x="0" y="0" width="700" height="64" rx="14" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    <text x="40" y="38" fill="#FFFFFF" font-family="monospace" font-size="13">⚡ SYNC: <tspan fill="#10B981">&lt; 25ms</tspan></text>
    <line x1="180" y1="16" x2="180" y2="48" stroke="rgba(255,255,255,0.1)"/>
    <text x="210" y="38" fill="#FFFFFF" font-family="monospace" font-size="13">CRDT: <tspan fill="#38BDF8">Yjs In-Memory</tspan></text>
    <line x1="420" y1="16" x2="420" y2="48" stroke="rgba(255,255,255,0.1)"/>
    <text x="450" y="38" fill="#FFFFFF" font-family="monospace" font-size="13">PEERS: <tspan fill="#F43F5E">1,420 Connected</tspan></text>
  </g>
</svg>
`;

// Project 3: Cloud Microservices Platform
const svgCloud = `
<svg width="1200" height="675" viewBox="0 0 1200 675" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg3" x1="0" y1="0" x2="1200" y2="675" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0a0d16"/>
      <stop offset="50%" stop-color="#101827"/>
      <stop offset="100%" stop-color="#070a12"/>
    </linearGradient>
    <linearGradient id="cloudGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#10B981"/>
      <stop offset="100%" stop-color="#3B82F6"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="675" fill="url(#bg3)"/>

  <!-- Top App Window Bar -->
  <rect x="60" y="40" width="1080" height="595" rx="16" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
  <rect x="60" y="40" width="1080" height="48" rx="16" fill="rgba(255,255,255,0.03)"/>
  <circle cx="90" cy="64" r="6" fill="#EF4444" opacity="0.8"/>
  <circle cx="110" cy="64" r="6" fill="#F59E0B" opacity="0.8"/>
  <circle cx="130" cy="64" r="6" fill="#10B981" opacity="0.8"/>
  <text x="600" y="70" fill="rgba(255,255,255,0.4)" font-family="monospace" font-size="13" text-anchor="middle">cloud-mesh // kubernetes-cluster-prod-us-east-1</text>

  <!-- Title -->
  <text x="100" y="130" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">Cloud Microservices Migration Platform</text>
  <text x="100" y="156" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="14">Zero-downtime Strangler Fig migration with AWS EKS &amp; Kafka Event Streaming</text>

  <!-- Diagram Nodes -->
  <!-- API Gateway -->
  <g transform="translate(100, 200)">
    <rect x="0" y="0" width="180" height="120" rx="12" fill="rgba(59, 130, 246, 0.1)" stroke="#3B82F6" stroke-width="2"/>
    <text x="90" y="45" fill="#3B82F6" font-family="system-ui" font-size="15" font-weight="bold" text-anchor="middle">Traffic Ingress</text>
    <text x="90" y="75" fill="#FFFFFF" font-family="monospace" font-size="20" font-weight="bold" text-anchor="middle">40k RPS</text>
    <text x="90" y="100" fill="#10B981" font-family="monospace" font-size="11" text-anchor="middle">Envoy Proxy</text>
  </g>

  <!-- Connectors -->
  <line x1="280" y1="260" x2="380" y2="260" stroke="#10B981" stroke-width="3" stroke-dasharray="4 4"/>
  <line x1="560" y1="260" x2="660" y2="260" stroke="#10B981" stroke-width="3" stroke-dasharray="4 4"/>

  <!-- Kafka Event Bus -->
  <g transform="translate(380, 200)">
    <rect x="0" y="0" width="180" height="120" rx="12" fill="rgba(245, 158, 11, 0.1)" stroke="#F59E0B" stroke-width="2"/>
    <text x="90" y="45" fill="#F59E0B" font-family="system-ui" font-size="15" font-weight="bold" text-anchor="middle">Kafka Event Bus</text>
    <text x="90" y="75" fill="#FFFFFF" font-family="monospace" font-size="18" font-weight="bold" text-anchor="middle">50M Ev/Day</text>
    <text x="90" y="100" fill="#94A3B8" font-family="monospace" font-size="11" text-anchor="middle">3x Multi-AZ</text>
  </g>

  <!-- Microservices Pods Grid -->
  <g transform="translate(660, 160)">
    <rect x="0" y="0" width="380" height="200" rx="14" fill="rgba(16, 185, 129, 0.08)" stroke="#10B981" stroke-width="2"/>
    <text x="24" y="36" fill="#10B981" font-family="system-ui" font-size="14" font-weight="bold">Kubernetes Service Mesh (32 Pods)</text>
    
    ${Array.from({ length: 4 }).flatMap((_, r) =>
      Array.from({ length: 8 }).map((_, c) => 
        `<rect x="${24 + c * 42}" y="${55 + r * 32}" width="34" height="22" rx="4" fill="rgba(16, 185, 129, 0.25)" stroke="#10B981"/>`
      )
    ).join('')}
  </g>

  <!-- Bottom Terminal View -->
  <g transform="translate(100, 390)">
    <rect x="0" y="0" width="940" height="200" rx="12" fill="rgba(0, 0, 0, 0.6)" stroke="rgba(255,255,255,0.08)"/>
    <text x="20" y="32" fill="#64748B" font-family="monospace" font-size="12">root@control-plane:~# kubectl get ingress -n production</text>
    <text x="20" y="60" fill="#10B981" font-family="monospace" font-size="12">NAME                CLASS   HOSTS             ADDRESS          PORTS   AGE</text>
    <text x="20" y="85" fill="#F1F5F9" font-family="monospace" font-size="12">api-v2-production   alb     api.nexus.io      10.124.8.44      80, 443 148d  [HEALTHY]</text>
    <text x="20" y="110" fill="#F1F5F9" font-family="monospace" font-size="12">auth-service-v3     alb     auth.nexus.io     10.124.9.12      80, 443 148d  [HEALTHY]</text>
    <text x="20" y="135" fill="#A78BFA" font-family="monospace" font-size="12">billing-gateway     alb     billing.nexus.io  10.124.10.8      80, 443 92d   [HEALTHY]</text>
    <text x="20" y="165" fill="#22D3EE" font-family="monospace" font-size="12">✓ Strangler Fig Cutover Complete: 100% traffic shifted with 0 errors</text>
  </g>
</svg>
`;

async function generate() {
  await sharp(Buffer.from(svgCache)).webp({ quality: 90 }).toFile(path.join(targetDir, 'distributed-cache.webp'));
  console.log('✓ Created distributed-cache.webp');

  await sharp(Buffer.from(svgCollab)).webp({ quality: 90 }).toFile(path.join(targetDir, 'realtime-collab.webp'));
  console.log('✓ Created realtime-collab.webp');

  await sharp(Buffer.from(svgCloud)).webp({ quality: 90 }).toFile(path.join(targetDir, 'cloud-scale.webp'));
  console.log('✓ Created cloud-scale.webp');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
