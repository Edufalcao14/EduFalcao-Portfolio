// Golden Palace Dice case illustrations. Run: node scripts/gp-art.mjs <out-dir>
// The page shows these at roughly half size, so nothing here is set below 22px.
import sharp from 'sharp'
import { writeFileSync } from 'node:fs'
const OUT = process.argv[2]
const W = 1920, H = 1200
const C = { bg: '#0c0b0a', surface: '#17161a', rule: '#3a3732', text: '#f6f1e6', muted: '#b3ac9f', gold: '#f2c14e', dim: '#6a655b' }
const F = `font-family="Menlo, 'JetBrains Mono', monospace"`
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const T = (x, y, t, size, fill = C.muted, anchor = 'start', weight = 'normal') => `<text x="${x}" y="${y}" ${F} font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}">${esc(t)}</text>`
const frame = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1.1" fill="${C.rule}"/></pattern>
<radialGradient id="spot" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${C.gold}" stop-opacity="0.32"/><stop offset="0.55" stop-color="${C.gold}" stop-opacity="0.08"/><stop offset="1" stop-color="${C.gold}" stop-opacity="0"/></radialGradient></defs>
<rect width="${W}" height="${H}" fill="${C.bg}"/><rect width="${W}" height="${H}" fill="url(#grid)"/>
${inner}${T(1800, 1140, 'Golden Palace Dice · React Native · main developer, for Nightborn', 20, C.dim, 'end')}</svg>`
const box = (x, y, w, h, hot = false) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${hot ? C.bg : C.surface}" stroke="${hot ? C.gold : C.rule}" stroke-width="${hot ? 3 : 2}"/>`
const check = (x, y) => `<circle cx="${x}" cy="${y}" r="18" fill="${C.gold}"/><path d="M${x-8} ${y} l6 6 l10 -12" stroke="${C.bg}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
const arrow = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C.rule}" stroke-width="3"/>` + (x1 === x2 ? `<path d="M${x2} ${y2} l-9 -14 h18 z" fill="${C.rule}"/>` : `<path d="M${x2} ${y2} l-14 -9 v18 z" fill="${C.rule}"/>`)
const bar = (x, y, w, gold, t) => `${T(x, y - 14, t, 26, gold ? C.gold : C.text)}<rect x="${x}" y="${y}" width="${w}" height="34" rx="6" fill="${gold ? C.gold : C.rule}"/>`
const head = (kicker, title) => `${T(120, 104, kicker, 24, C.gold)}${T(120, 168, title, 36, C.text)}`
const spot = (x, y, value, lab, size = 104) => `<ellipse cx="${x + 240}" cy="${y - 34}" rx="380" ry="160" fill="url(#spot)"/>${T(x, y, value, size, C.gold, 'start', 'bold')}${T(x, y + 48, lab, 26, C.text)}`
const item = (x, y, w, title, sub) => `${box(x, y, w, 118)}${check(x+46, y+59)}${T(x+92, y+50, title, 30, C.text)}${T(x+92, y+92, sub, 23)}`
const divider = (y) => `<line x1="120" y1="${y}" x2="1800" y2="${y}" stroke="${C.rule}" stroke-width="1"/>`
const para = (x, y, lines, size = 26, fill = C.muted) => lines.map((l, i) => T(x, y + i * (size + 12), l, size, fill)).join('')

const art1 = frame(`${head('IMPACT · FEATURES', 'From the bank to the game, on a regulated casino app')}
${spot(120, 340, '30+', 'features shipped to production, as main developer')}
${spot(1000, 340, '1 bug', 'open for months, closed with a native module', 84)}
${divider(430)}
${item(120, 490, 900, 'Bank account verification', 'TrueLayer open banking, confirmed by the bank')}
${item(120, 628, 900, 'Identity verification', 'itsme, the Belgian digital identity')}
${item(120, 766, 900, 'Game provider integrations', 'third-party providers, one launch flow, one wallet')}
${item(120, 904, 900, 'Payments and wallet', 'several providers, one deposit and cash-out flow')}
${T(1100, 520, 'DEEP LINKS · WEB AND APP', 24)}
${box(1100, 550, 300, 130)}${T(1250, 608, 'web app', 30, C.text, 'middle')}${T(1250, 648, 'a link on any page', 20, C.muted, 'middle')}
${arrow(1400, 600, 1500, 600)}${arrow(1500, 630, 1400, 630)}
${box(1500, 550, 300, 130, true)}${T(1650, 608, 'mobile app', 30, C.gold, 'middle')}${T(1650, 648, 'same screen opens', 20, C.muted, 'middle')}
${para(1100, 740, ['Universal links on iOS, app links on', 'Android. No app? The web sends the', 'visitor to the store.'])}
${T(1100, 900, 'NATIVE MODULE', 24)}
${para(1100, 950, ['Gesture handler and live-table WebView', 'fought over every touch. Now one owner.'])}`)

const layer = (x, y, w, title, sub, hot = false) => `${box(x, y, w, 110, hot)}${T(x+30, y+46, title, 30, hot ? C.gold : C.text)}${T(x+30, y+86, sub, 22)}`
const art2 = frame(`${head('IMPACT · PERFORMANCE', 'Profiled on real low-end devices, fixed at the source')}
${spot(120, 340, '60+ FPS', 'every screen, iOS and Android 14+', 84)}
${spot(760, 340, '-40%', 'p95 dropped frames, low-end Android', 84)}
${spot(1360, 340, '4.1 to 0.9 s', 'cold start', 66)}
${divider(430)}
${T(120, 520, 'COLD START', 24)}
${bar(120, 570, 820, false, '4.1 s  before')}
${bar(120, 660, 180, true, '0.9 s  Hermes + lazy loading')}
${T(120, 770, 'P95 DROPPED FRAMES · LOW-END ANDROID', 24)}
${bar(120, 820, 820, false, 'before')}
${bar(120, 910, 492, true, '-40%  after Android Profiler + Perfetto')}
${para(120, 1010, ['Heavy Reanimated animations saturated the JS thread.', 'Rewritten screen by screen.'], 24)}
${T(1080, 520, 'ONE TOUCH, THREE OWNERS', 24)}
${layer(1080, 550, 720, 'Gesture Handler', 'native gestures: swipe, pan, dismiss')}
${arrow(1440, 660, 1440, 700)}
${layer(1080, 700, 720, 'Native module', 'wraps the WebView, decides who owns the touch', true)}
${arrow(1440, 810, 1440, 850)}
${layer(1080, 850, 720, 'WebView · live table', 'the stream and its betting grid')}
${para(1080, 1010, ['Both layers claimed the same touch,', 'and one of them always lost.'], 24)}`)

const tier = (x, y, w, t, sub, hot = false) => `${box(x, y, w, 100, hot)}${T(x + w/2, y+44, t, 30, hot ? C.gold : C.text, 'middle')}${T(x + w/2, y+80, sub, 21, C.muted, 'middle')}`
const art3 = frame(`${head('IMPACT · QUALITY', 'Four layers of tests, so a regression is caught before a player sees it')}
${spot(120, 340, '-50%', 'regressions reaching production')}
${spot(1000, 340, '18% to 54%', 'test coverage, still climbing', 84)}
${divider(430)}
${tier(360, 500, 400, 'Maestro E2E', 'the real journeys, on device', true)}
${tier(280, 620, 560, 'integration tests', 'React Native Testing Library')}
${tier(200, 740, 720, 'component tests', 'every screen state')}
${tier(120, 860, 880, 'unit tests', 'Jest, every hook and every piece of logic')}
${T(560, 1030, 'per pull request · nightly · before every build', 24, C.muted, 'middle')}
${T(1100, 540, 'WHAT CHANGED', 24)}
${para(1100, 590, ['A pull request cannot merge red.', 'Nightly catches what a PR missed.', 'Pre-build catches what nightly missed.', 'Four chances before a player.'])}
${para(1100, 800, ['15+ bugs caught by Maestro before release.', 'Zero regressions on the critical flows since.'], 26, C.gold)}
${para(1100, 920, ['Hooks, integrations and components first:', 'that is where production was breaking.'], 24)}`)

const node = (x, y, w, t, sub, hot = false) => `${box(x, y, w, 120, hot)}${T(x + w/2, y+52, t, 28, hot ? C.gold : C.text, 'middle')}${T(x + w/2, y+92, sub, 20, C.muted, 'middle')}`
const art4 = frame(`${head('IMPACT · RELEASES', 'A validated release to QA every Friday, with nobody pressing a button')}
${spot(120, 340, '35 to < 5 min', 'per build, Re.Pack reuses the native build', 80)}
${spot(1000, 340, 'every Friday', 'GitHub Actions + Fastlane, hands off', 72)}
${divider(430)}
${node(120, 500, 260, 'Friday', 'scheduled')}
${arrow(380, 560, 420, 560)}
${node(420, 500, 320, 'tests', 'Jest · RNTL · Maestro')}
${arrow(740, 560, 780, 560)}
${node(780, 500, 360, 'native build', 'Fastlane · iOS + Android', true)}
${arrow(1140, 560, 1180, 560)}
${node(1180, 500, 300, 'QA build', 'validated')}
${arrow(1480, 560, 1520, 560)}
${node(1520, 500, 280, 'release', 'QA signs off')}
${T(120, 720, 'OTA UPDATES', 24)}
${para(120, 770, ['JavaScript-only changes ship over the air to QA and', 'production, no store review. Built end to end by me.'])}
${T(120, 900, 'BUILD TIME', 24)}
${bar(120, 950, 820, false, '35 min  before')}
${bar(120, 1040, 116, true, '< 5 min  only the bundle is rebuilt')}
${T(1080, 900, 'RE.PACK', 24)}
${para(1080, 950, ['The native side rarely changes. Re.Pack keeps', 'it and rebuilds only the JavaScript, for QA', 'builds and every local build.'], 24)}`)

const row = (y, k, a, b, imp) => `${T(120, y, k, 26, C.text)}${T(780, y, a, 26, C.muted)}${T(1120, y, b, 26, C.gold)}${T(1520, y, imp, 26, C.text)}<line x1="120" y1="${y+26}" x2="1800" y2="${y+26}" stroke="${C.rule}" stroke-width="1"/>`
const art5 = frame(`${head('IMPACT · MONOREPO', 'Yarn 1 is end of life. The move to pnpm was measured before it was merged')}
${spot(120, 340, '3x faster', 'cold install, every machine and runner', 84)}
${spot(1000, 340, '-2.3 GB', 'on disk, per checkout', 84)}
${divider(430)}
${T(120, 500, 'METRIC', 20)}${T(780, 500, 'YARN 1', 20)}${T(1120, 500, 'PNPM 11', 20, C.gold)}${T(1520, 500, 'CHANGE', 20)}
<line x1="120" y1="520" x2="1800" y2="520" stroke="${C.rule}" stroke-width="2"/>
${row(576, 'cold install', '267 s', '90 s', '3x faster')}
${row(650, 'warm install, relink', '134 s', '43 s', '3x faster')}
${row(724, 'warm install, incremental', '134 s', '~14 s', '10x faster')}
${row(798, 'disk, modules + cache', '6.8 GB', '4.5 GB', '-2.3 GB')}
${row(872, 'node_modules layout', 'hoisted', 'isolated', 'no phantom deps')}
${row(946, 'lockfile', 'yarn.lock', 'pnpm-lock.yaml', 'readable diffs')}
${para(120, 1030, ['Measured 2026-07-28, Apple M1, node 22, yarn 1.22 vs pnpm 11.17. A package can only import what it declares.'], 22)}`)

for (const [name, svg] of [['gp-features', art1], ['gp-performance', art2], ['gp-quality', art3], ['gp-release', art4], ['gp-pnpm', art5]]) {
  writeFileSync(`${OUT}/${name}.svg`, svg)
  await sharp(Buffer.from(svg), { density: 96 }).png().toFile(`${OUT}/${name}.png`)
}
console.log('rendered 5')
