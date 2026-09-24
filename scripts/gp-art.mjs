// Golden Palace Dice case illustrations. Kept in the repo so they can be re-rendered.
// Run: node scripts/gp-art.mjs <out-dir>
import sharp from 'sharp'
import { writeFileSync } from 'node:fs'
const OUT = process.argv[2]
const W = 1920, H = 1200
const C = { bg: '#0c0b0a', surface: '#17161a', rule: '#3a3732', text: '#f6f1e6', muted: '#a8a195', gold: '#f2c14e', dim: '#5a554c' }
const F = `font-family="Menlo, 'JetBrains Mono', monospace"`
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const label = (x, y, t, size = 22, fill = C.muted, anchor = 'start', weight = 'normal') => `<text x="${x}" y="${y}" ${F} font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}" letter-spacing="${size <= 22 ? 2 : 0}">${esc(t)}</text>`
const frame = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1.1" fill="${C.rule}"/></pattern>
<radialGradient id="spot" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${C.gold}" stop-opacity="0.32"/><stop offset="0.55" stop-color="${C.gold}" stop-opacity="0.08"/><stop offset="1" stop-color="${C.gold}" stop-opacity="0"/></radialGradient></defs>
<rect width="${W}" height="${H}" fill="${C.bg}"/><rect width="${W}" height="${H}" fill="url(#grid)"/>
${inner}${label(1800, 1130, 'Golden Palace Dice · React Native · main developer, for Nightborn', 16, C.dim, 'end')}</svg>`
const box = (x, y, w, h, stroke = C.rule, fill = C.surface, r = 12, sw = 2) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`
const check = (x, y) => `<circle cx="${x}" cy="${y}" r="15" fill="${C.gold}"/><path d="M${x-7} ${y} l5 5 l9 -10" stroke="${C.bg}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
const arrow = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C.rule}" stroke-width="2"/>` + (x1 === x2 ? `<path d="M${x2} ${y2} l-7 -12 h14 z" fill="${C.rule}"/>` : `<path d="M${x2} ${y2} l-12 -7 v14 z" fill="${C.rule}"/>`)
const bar = (x, y, w, gold, t) => `${label(x, y - 12, t, 20, gold ? C.gold : C.text)}<rect x="${x}" y="${y}" width="${w}" height="30" rx="5" fill="${gold ? C.gold : C.rule}"/>`
const head = (kicker, title) => `${label(120, 96, kicker, 20, C.gold)}${label(120, 150, title, 28, C.text)}`
const spot = (x, y, value, lab, size = 88) => `<ellipse cx="${x + 220}" cy="${y - 30}" rx="360" ry="150" fill="url(#spot)"/>${label(x, y, value, size, C.gold, 'start', 'bold')}${label(x, y + 44, lab, 20, C.text)}`
const item = (x, y, w, title, sub) => `${box(x, y, w, 100)}${check(x+40, y+50)}${label(x+80, y+44, title, 23, C.text)}${label(x+80, y+78, sub, 16)}`
const divider = (y) => `<line x1="120" y1="${y}" x2="1800" y2="${y}" stroke="${C.rule}" stroke-width="1"/>`

const art1 = frame(`${head('IMPACT · FEATURES', 'From the bank to the game, on a regulated casino app')}
${spot(120, 330, '30+', 'features shipped to production, as main developer')}
${spot(900, 330, '1 bug', 'open for months, closed with a native module', 72)}
${divider(420)}
${item(120, 470, 780, 'Bank account verification', 'TrueLayer open banking, the account confirmed by the bank')}
${item(120, 590, 780, 'Identity verification', 'itsme, the Belgian digital identity, wired into onboarding')}
${item(120, 710, 780, 'Game provider integrations', 'third-party providers behind one launch flow, one wallet')}
${item(120, 830, 780, 'Payments and wallet', 'several providers, one deposit and cash-out flow, player limits')}
${label(1000, 500, 'DEEP LINKS · WEB AND APP', 18)}
${box(1000, 530, 320, 150, C.rule, C.surface)}${label(1160, 595, 'web app', 24, C.text, 'middle')}${label(1160, 632, 'a link on any page', 15, C.muted, 'middle')}
${arrow(1320, 590, 1470, 590)}${arrow(1470, 620, 1320, 620)}
${box(1470, 530, 330, 150, C.gold, C.bg, 12, 3)}${label(1635, 595, 'mobile app', 24, C.gold, 'middle')}${label(1635, 632, 'opens the same screen', 15, C.muted, 'middle')}
${label(1000, 740, 'Universal links on iOS, app links on Android; the web', 17)}
${label(1000, 768, 'falls back to the store when the app is not installed.', 17)}
${label(1000, 840, 'NATIVE MODULE', 18)}
${label(1000, 878, 'The gesture handler and the live-table WebView fought over', 17)}
${label(1000, 906, 'every touch for months. The module decides who owns it.', 17)}`)

const layer = (x, y, w, title, sub, hot = false) => `${box(x, y, w, 92, hot ? C.gold : C.rule, hot ? C.bg : C.surface, 12, hot ? 3 : 2)}${label(x+26, y+40, title, 22, hot ? C.gold : C.text)}${label(x+26, y+72, sub, 15)}`
const art2 = frame(`${head('IMPACT · PERFORMANCE', 'Profiled on real low-end devices, fixed at the source')}
${spot(120, 330, '60+ FPS', 'every screen, iOS and Android 14+', 76)}
${spot(760, 330, '-40%', 'p95 dropped frames on low-end Android', 76)}
${spot(1340, 330, '4.1 to 0.9 s', 'cold start', 60)}
${divider(420)}
${label(120, 490, 'COLD START', 18)}
${bar(120, 530, 800, false, '4.1 s  before')}
${bar(120, 600, 176, true, '0.9 s  after Hermes + lazy loading')}
${label(120, 700, 'P95 DROPPED FRAMES · LOW-END ANDROID', 18)}
${bar(120, 740, 800, false, 'before')}
${bar(120, 810, 480, true, '-40%  after profiling with Android Profiler + Perfetto')}
${label(120, 900, 'Heavy Reanimated animations were saturating the JS thread on cheap phones.', 17)}
${label(120, 928, 'Disabled or rewritten, screen by screen, file by file.', 17)}
${label(1080, 490, 'ONE TOUCH, THREE OWNERS', 18)}
${layer(1080, 520, 720, 'Gesture Handler', 'native gestures: swipe, pan, dismiss')}
${arrow(1440, 612, 1440, 646)}
${layer(1080, 646, 720, 'Native module', 'wraps the WebView, decides who owns the touch', true)}
${arrow(1440, 738, 1440, 772)}
${layer(1080, 772, 720, 'WebView · live-table canvas', 'the stream and its interactive betting grid')}
${label(1080, 910, 'A bug nobody had closed. Both layers claimed the same touch,', 17)}
${label(1080, 938, 'and one of them always lost.', 17)}`)

const tier = (x, y, w, t, sub, hot = false) => `${box(x, y, w, 84, hot ? C.gold : C.rule, hot ? C.bg : C.surface, 12, hot ? 3 : 2)}${label(x + w/2, y+36, t, 22, hot ? C.gold : C.text, 'middle')}${label(x + w/2, y+66, sub, 15, C.muted, 'middle')}`
const art3 = frame(`${head('IMPACT · QUALITY', 'Four layers of tests, so a regression is caught before a player sees it')}
${spot(120, 330, '-50%', 'regressions reaching production')}
${spot(900, 330, '18% to 54%', 'test coverage of the codebase, still climbing', 72)}
${divider(420)}
${tier(380, 480, 340, 'Maestro E2E', 'the real journeys, on device', true)}
${tier(320, 584, 460, 'integration tests', 'React Native Testing Library')}
${tier(240, 688, 620, 'component tests', 'every screen state, React Native Testing Library')}
${tier(160, 792, 780, 'unit tests', 'Jest · every hook and every piece of logic')}
${label(550, 930, 'per pull request · nightly · before every build', 17, C.muted, 'middle')}
${label(1080, 520, 'WHERE THE REGRESSIONS CAME FROM', 18)}
${label(1080, 560, 'Hooks, integrations and components were covered first,', 17)}
${label(1080, 588, 'because that is where production was breaking.', 17)}
${label(1080, 660, 'WHAT CHANGED FOR THE TEAM', 18)}
${label(1080, 700, 'A pull request cannot merge red. A nightly run catches', 17)}
${label(1080, 728, 'what a PR missed. A pre-build run catches what nightly', 17)}
${label(1080, 756, 'missed. Three chances before QA, four before a player.', 17)}
${label(1080, 830, '15+ bugs caught by Maestro before release,', 17, C.gold)}
${label(1080, 858, 'zero regressions on the critical flows since.', 17, C.gold)}`)

const node = (x, y, w, t, sub, hot = false) => `${box(x, y, w, 104, hot ? C.gold : C.rule, hot ? C.bg : C.surface, 12, hot ? 3 : 2)}${label(x + w/2, y+44, t, 22, hot ? C.gold : C.text, 'middle')}${label(x + w/2, y+78, sub, 15, C.muted, 'middle')}`
const art4 = frame(`${head('IMPACT · RELEASES', 'GitHub Actions and Fastlane hand a validated release to QA, every Friday, hands off')}
${spot(120, 330, '35 to < 5 min', 'per build, with Re.Pack reusing the native build', 68)}
${spot(900, 330, 'every Friday', 'a release to QA with nobody pressing a button', 60)}
${divider(420)}
${node(120, 480, 260, 'Friday', 'scheduled trigger')}
${arrow(380, 532, 420, 532)}
${node(420, 480, 320, 'tests', 'Jest · RNTL · Maestro')}
${arrow(740, 532, 780, 532)}
${node(780, 480, 360, 'native build', 'Fastlane · iOS + Android', true)}
${arrow(1140, 532, 1180, 532)}
${node(1180, 480, 300, 'QA build', 'validated, delivered')}
${arrow(1480, 532, 1520, 532)}
${node(1520, 480, 280, 'release', 'when QA signs off')}
${label(120, 680, 'OTA UPDATES', 18)}
${label(120, 718, 'A second pipeline ships JavaScript-only changes over the air, to QA and to production,', 17)}
${label(120, 746, 'with no store review. Set up from the project config to the GitHub Actions workflows.', 17)}
${label(120, 830, 'BUILD TIME', 18)}
${bar(120, 870, 800, false, '35 min  before')}
${bar(120, 940, 110, true, '< 5 min  Re.Pack rebuilds only the bundle')}
${label(1080, 830, 'RE.PACK', 18)}
${label(1080, 868, 'The native side of a build rarely changes. Re.Pack keeps', 17)}
${label(1080, 896, 'it and rebuilds only the JavaScript, for QA builds and', 17)}
${label(1080, 924, 'for every developer’s local build.', 17)}`)

const row = (y, k, a, b, imp) => `${label(120, y, k, 19, C.text)}${label(760, y, a, 19, C.muted)}${label(1120, y, b, 19, C.gold)}${label(1560, y, imp, 19, C.text)}<line x1="120" y1="${y+20}" x2="1800" y2="${y+20}" stroke="${C.rule}" stroke-width="1"/>`
const art5 = frame(`${head('IMPACT · MONOREPO', 'Yarn 1 is end of life. The move to pnpm was measured before it was merged')}
${spot(120, 330, '3x faster', 'cold install on every machine and CI runner', 76)}
${spot(900, 330, '-2.3 GB', 'on disk, per checkout', 76)}
${divider(420)}
${label(120, 490, 'METRIC', 15)}${label(760, 490, 'YARN 1', 15)}${label(1120, 490, 'PNPM 11', 15, C.gold)}${label(1560, 490, 'CHANGE', 15)}
<line x1="120" y1="508" x2="1800" y2="508" stroke="${C.rule}" stroke-width="2"/>
${row(552, 'cold install, empty store', '267 s', '90 s', '3x faster')}
${row(616, 'warm install, full relink', '134 s', '43 s', '3x faster')}
${row(680, 'warm install, incremental', '134 s', '~14 s', '10x faster')}
${row(744, 'disk, node_modules + cache', '6.8 GB', '4.5 GB', '-2.3 GB')}
${row(808, 'node_modules layout', 'hoisted', 'isolated symlinks', 'no phantom deps')}
${row(872, 'lockfile', 'yarn.lock', 'pnpm-lock.yaml', 'readable diffs')}
${label(120, 960, 'Measured 2026-07-28 on an Apple M1, node 22, yarn 1.22 against pnpm 11.17, both runs including the postinstall TypeScript builds.', 16)}
${label(120, 990, 'No hoisting means a package can only import what it declares. A whole class of works-on-my-machine bugs stops being possible.', 16)}`)

for (const [name, svg] of [['gp-features', art1], ['gp-performance', art2], ['gp-quality', art3], ['gp-release', art4], ['gp-pnpm', art5]]) {
  writeFileSync(`${OUT}/${name}.svg`, svg)
  await sharp(Buffer.from(svg), { density: 96 }).png().toFile(`${OUT}/${name}.png`)
}
console.log('rendered 5')
