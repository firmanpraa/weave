// Sample data reproducing the figures shown in the Figma "Report Page" frame (node 377:351).
// Chart series are reconstructed from the drawn curves; labelled values match the design text.

export const summaryStats = {
  bounceRate: '70.22%',
  items: [
    { value: '13,088', label: 'Total visitors' },
    { value: '488', label: 'Total sessions' },
    { value: '6,4', label: 'Avg pages/ session' },
  ],
}

/* Active users: visits per minute over the last 30 minutes (21 samples). */
export const activeUsers = {
  total: 325,
  series: [93, 0, 37, 0, 19, 0, 52, 37, 37, 19, 0, 0, 0, 0, 37, 88, 27, 55, 37, 27, 47].map(
    (value, i) => ({ minute: i, value }),
  ),
  ticks: ['02.10', '02.15', '02.20', '02.25', '02.30'],
}

export const topCountries = {
  total: '9,823',
  change: '89%',
  rows: [
    { code: 'id', name: 'Indonesia', share: '27%' },
    { code: 'fr', name: 'France', share: '19%' },
    { code: 'es', name: 'Spain', share: '12%' },
    { code: 'it', name: 'Italy', share: '10%' },
    { code: 'be', name: 'Belgium', share: '8%' },
  ] as const,
}

export const newVsReturning = [
  { name: 'New Users', value: 89.4, color: '#27bb8d' },
  { name: 'Returning Users', value: 10.6, color: '#f8cf80' },
]

export const topPages = {
  total: '3,134',
  change: '23%',
  rows: [
    { path: 'home', share: 34 },
    { path: 'about', share: 26 },
    { path: 'works', share: 12 },
    { path: 'process', share: 5 },
    { path: 'contact', share: 5 },
  ],
}

/* Bounce rate: x is measured in grid columns (0–12), as drawn in the design.
   Values were sampled from the design's curves every half column. */
const sampledCurrent = [15.81, 15.26, 15.44, 16.18, 17.28, 19.12, 21.14, 23.71, 26.84, 30.15, 34.01, 38.24, 43.01, 48.16, 53.86, 60.11, 66.91, 74.08, 82.17, 90.81, 99.82]
const sampledLast = [19.85, 18.2, 16.36, 14.89, 13.24, 11.58, 10.29, 9.01, 8.27, 7.54, 7.17, 7.54, 8.82, 11.95, 18.57, 27.39, 37.87, 49.45, 62.32, 76.29, 90.44]
const bouncePoints = sampledCurrent.map((c, i) => ({ g: i / 2, current: c, last: sampledLast[i] }))
// The design's tooltip sits at column 7.75; add that sample on the curve.
bouncePoints.splice(16, 0, { g: 7.75, current: (60.11 + 66.91) / 2, last: (27.39 + 37.87) / 2 })

export const bounceRate = {
  change: '89%',
  activeIndex: 16,
  activeLabel: { current: 'Jun 5, 2024', last: 'Jun 5, 2023' },
  // Tooltip figures exactly as written in the design for the highlighted point.
  activeValues: { current: 62.55, last: 28.55 },
  xTicks: [
    { at: 0.24, label: 'May 2024' },
    { at: 3.8, label: 'Jun 2024' },
    { at: 7.3, label: 'Jul 2024' },
    { at: 10.8, label: 'Aug 2024' },
  ],
  series: bouncePoints.map(({ g, current, last }) => {
    // Confidence band edges fitted to the band drawn in the design.
    const lower = 15 + 0.46 * g * g
    const upper = 15.5 + 2.2 * g + 0.8 * g * g
    return { g, current, last, band: [Math.min(lower, current), Math.max(upper, current)] as [number, number] }
  }),
}

/* Trends: daily values from May 7 (day 0) to Jun 24 (day 48). */
const pageViews = [590, 600, 625, 630, 670, 730, 720, 640, 560, 555, 470, 500, 680, 500, 500, 520, 650, 340, 360, 270, 265, 330, 340, 440, 420, 370, 450, 560, 600, 612]
const projected = [612, 520, 470, 455, 470, 600, 610, 640, 620]
const occurrencesHome: Array<[number, number]> = [
  [0, 75], [4, 65], [8, 85], [12, 100], [16, 115], [20, 155], [24, 150], [28, 105], [30, 40], [32, 60], [36, 55], [39, 0], [44, 10], [46, 100], [50, 105], [50.5, 80],
]
const occurrencesWorks: Array<[number, number]> = [
  [0, 20], [3, 18], [6, 45], [10, 55], [12, 80], [13, 65], [16, 60], [19, 40], [22, 25], [25, 45], [27, 70], [29, 55], [32, 30], [35, 35], [38, 30], [41, 40], [44, 55], [47, 70], [50, 80],
]
const interpolate = (points: Array<[number, number]>, x: number) => {
  if (x < points[0][0] || x > points[points.length - 1][0]) return undefined
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i]
    const [x0, y0] = points[i - 1]
    if (x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0 || 1)
  }
  return undefined
}
export const trends = {
  activeDay: 29,
  activeLabel: 'Jun 5, 2023',
  // Evenly spaced, as laid out in the design.
  xTicks: ['May 7', 'May 15', 'May 24', 'May 31', 'Jun 7', 'Jun 15', '24 Jun'].map((label, k) => ({ at: k * 8, label })),
  series: Array.from({ length: 51 }, (_, day) => ({
    day,
    views: day < pageViews.length ? pageViews[day] : undefined,
    projected: day >= 29 && day < 29 + projected.length ? projected[day - 29] : undefined,
    home: interpolate(occurrencesHome, day),
    works: interpolate(occurrencesWorks, day),
  })),
}

/* Behavior flow: four steps of page-to-page traffic, labels as in the design. */
export const behaviorFlow = {
  visitors: '2,135',
  nodes: [
    { name: 'Homepage', meta: ['100%', '1,692'] },
    { name: 'Works', meta: ['52%', '812'] },
    { name: 'About', meta: ['27%', '424'] },
    { name: 'Process', meta: ['13%', '267'] },
    { name: 'Drop-Off', meta: ['8%', '180'], dropOff: true },
    { name: 'Contact Me', meta: ['49%', '303'] },
    { name: 'Work Details', meta: ['32%', '120'] },
    { name: 'About', meta: ['12%', '112'] },
    { name: 'Drop-Off', meta: ['5%', '70'], dropOff: true },
    { name: 'Schedule a Call', meta: ['100%', '1,535'] },
  ],
  links: [
    { source: 0, target: 1, value: 812 },
    { source: 0, target: 2, value: 424 },
    { source: 0, target: 3, value: 267 },
    { source: 0, target: 4, value: 180 },
    { source: 1, target: 5, value: 220 },
    { source: 1, target: 6, value: 120 },
    { source: 1, target: 7, value: 62 },
    { source: 1, target: 8, value: 40 },
    { source: 2, target: 5, value: 83 },
    { source: 2, target: 7, value: 50 },
    { source: 2, target: 8, value: 30 },
    { source: 5, target: 9, value: 303 },
  ],
}

export const signupFunnel = [
  { step: 'Total Sessions', count: '488', value: 100, color: '#b7f8e4', ink: '#010101' },
  { step: 'Works Page Clicked', count: '276', value: 66, color: '#77dcbc', ink: '#010101' },
  { step: 'Button Clicked', count: '83', value: 32, color: '#27bb8d', ink: '#010101' },
  { step: 'Form Submitted', count: '25', value: 18, color: '#004737', ink: '#ffffff' },
]
