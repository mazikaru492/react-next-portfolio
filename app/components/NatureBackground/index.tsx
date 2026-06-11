"use client";

import { useEffect, useRef, useState, type CSSProperties, type FC } from "react";
import styles from "./index.module.css";

const SWAY_CLASSES = [
  styles.sway1,
  styles.sway2,
  styles.sway3,
  styles.sway4,
  styles.sway5,
] as const;

type Tree = {
  cx: number;
  baseY: number;
  h: number;
  fill: string;
  sway: string;
};

function buildConiferPath(cx: number, baseY: number, h: number): string {
  const w = h * 0.42;
  const top = baseY - h;
  const trunkW = Math.max(h * 0.024, 1.4);
  return [
    `M${cx} ${top}`,
    `L${cx - w * 0.16} ${top + h * 0.16}`,
    `L${cx - w * 0.30} ${top + h * 0.13}`,
    `L${cx - w * 0.20} ${top + h * 0.30}`,
    `L${cx - w * 0.42} ${top + h * 0.40}`,
    `L${cx - w * 0.30} ${top + h * 0.54}`,
    `L${cx - w * 0.52} ${top + h * 0.64}`,
    `L${cx - w * 0.38} ${top + h * 0.78}`,
    `L${cx - w * 0.58} ${top + h * 0.90}`,
    `L${cx - trunkW} ${top + h * 0.95}`,
    `L${cx - trunkW} ${baseY}`,
    `L${cx + trunkW} ${baseY}`,
    `L${cx + trunkW} ${top + h * 0.95}`,
    `L${cx + w * 0.58} ${top + h * 0.90}`,
    `L${cx + w * 0.38} ${top + h * 0.78}`,
    `L${cx + w * 0.52} ${top + h * 0.64}`,
    `L${cx + w * 0.30} ${top + h * 0.54}`,
    `L${cx + w * 0.42} ${top + h * 0.40}`,
    `L${cx + w * 0.20} ${top + h * 0.30}`,
    `L${cx + w * 0.30} ${top + h * 0.13}`,
    `L${cx + w * 0.16} ${top + h * 0.16}`,
    "Z",
  ].join(" ");
}

function rand(i: number, seed: number): number {
  const v = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return v - Math.floor(v);
}

function generateRow(opts: {
  count: number;
  baseY: number;
  minH: number;
  maxH: number;
  fill: string;
  seed: number;
}): Tree[] {
  const { count, baseY, minH, maxH, fill, seed } = opts;
  const trees: Tree[] = [];
  const span = 2000;
  const step = span / (count - 1);
  for (let i = 0; i < count; i++) {
    const jitterX = (rand(i, seed) - 0.5) * step * 0.9;
    const cx = -40 + step * i + jitterX;
    const h = minH + rand(i + 100, seed) * (maxH - minH);
    const yJitter = rand(i + 200, seed) * 10;
    trees.push({
      cx,
      baseY: baseY + yJitter,
      h,
      fill,
      sway: SWAY_CLASSES[Math.floor(rand(i + 300, seed) * SWAY_CLASSES.length)],
    });
  }
  return trees;
}

const farTrees = generateRow({
  count: 36,
  baseY: 905,
  minH: 90,
  maxH: 170,
  fill: "#0d3a24",
  seed: 1,
});

const midTrees = generateRow({
  count: 30,
  baseY: 970,
  minH: 170,
  maxH: 290,
  fill: "#0a3620",
  seed: 2,
});

const nearTrees = generateRow({
  count: 22,
  baseY: 1040,
  minH: 250,
  maxH: 420,
  fill: "#081f16",
  seed: 3,
});

// 牛（左向き・原点が足元・脚スイング＆体の上下動つき。位置と向きは親の g が制御）
const Cow: FC = () => (
  <g style={{ "--nb-gait": "1s", "--nb-amp": "7deg" } as CSSProperties}>
    {/* 奥側の脚（対角ペアで交互に振る） */}
    <g transform="translate(-24 -28)">
      <g className={styles.legB}>
        <path d="M-3.5 0 L3.5 0 L2.8 28 L-2.8 28 Z" fill="#15241d" />
      </g>
    </g>
    <g transform="translate(19 -28)">
      <g className={styles.legA}>
        <path d="M-3.5 0 L3.5 0 L2.8 28 L-2.8 28 Z" fill="#15241d" />
      </g>
    </g>
    <g className={styles.bob}>
      {/* 胴体（白ベース） */}
      <ellipse cx="0" cy="-44" rx="45" ry="20" fill="#cfd8d2" />
      {/* ホルスタイン模様 */}
      <g fill="#20342a">
        <ellipse cx="-14" cy="-50" rx="14" ry="9" />
        <ellipse cx="22" cy="-40" rx="12" ry="8" />
        <ellipse cx="-30" cy="-36" rx="8" ry="6" />
      </g>
      {/* 頭 */}
      <ellipse cx="-50" cy="-60" rx="13" ry="11" fill="#cfd8d2" />
      {/* 鼻先 */}
      <ellipse cx="-59" cy="-56" rx="8" ry="6" fill="#9fb0a6" />
      {/* 耳 */}
      <ellipse
        cx="-42"
        cy="-70"
        rx="7"
        ry="3.5"
        fill="#20342a"
        transform="rotate(-25 -42 -70)"
      />
      {/* 角 */}
      <path d="M-54 -69 q-5 -7 1 -10 q-1 5 3 8 Z" fill="#e8e4d8" />
      {/* しっぽ */}
      <path d="M43 -52 q11 6 9 26 q-4 -16 -12 -20 Z" fill="#cfd8d2" />
    </g>
    {/* 手前側の脚 */}
    <g transform="translate(-34 -28)">
      <g className={styles.legA}>
        <path d="M-3.5 0 L3.5 0 L2.8 28 L-2.8 28 Z" fill="#1c2f26" />
      </g>
    </g>
    <g transform="translate(31 -28)">
      <g className={styles.legB}>
        <path d="M-3.5 0 L3.5 0 L2.8 28 L-2.8 28 Z" fill="#1c2f26" />
      </g>
    </g>
  </g>
);

// キツネ（左向き・歩行ポーズ・原点が足元）
const Fox: FC = () => (
  <g style={{ "--nb-gait": "0.5s", "--nb-amp": "18deg" } as CSSProperties}>
    {/* 奥側の脚 */}
    <g transform="translate(-18 -14)">
      <g className={styles.legB}>
        <path d="M-2.4 0 L2.4 0 L1.6 14 L-1.6 14 Z" fill="#3a2010" />
      </g>
    </g>
    <g transform="translate(20 -13)">
      <g className={styles.legA}>
        <path d="M-2.6 0 L2.6 0 L1.7 13 L-1.7 13 Z" fill="#3a2010" />
      </g>
    </g>
    <g className={styles.bob}>
      {/* 尻尾（ふさふさ・先端は白） */}
      <path
        d="M30 -28 C42 -34 54 -32 60 -22 C64 -14 60 -6 52 -5 C46 -4 41 -8 43 -13 C36 -13 32 -20 28 -22 Z"
        fill="#c2622f"
      />
      <path
        d="M53 -15 C58 -14 61 -10 57 -6 C53 -3 47 -5 47 -10 C47 -13 50 -15 53 -15 Z"
        fill="#f2e8d8"
      />
      {/* 奥側の耳 */}
      <path d="M-30 -37 L-27 -51 L-20 -37 Z" fill="#a04f26" />
      {/* 体・頭（細身の胴、とがった鼻先） */}
      <path
        d="M-48 -27 C-41 -31 -36 -33 -30 -34 C-26 -38 -22 -40 -18 -40
           C-10 -39 -2 -38 6 -38 C16 -40 26 -38 31 -32 C34 -27 34 -21 32 -16
           L30 -10 C24 -13 18 -15 12 -15 C4 -16 -4 -15 -10 -13
           C-14 -17 -17 -22 -19 -26 C-28 -24 -38 -25 -48 -27 Z"
        fill="#c2622f"
      />
      {/* 手前の耳（内側は濃い色） */}
      <path d="M-24 -37 L-19 -55 L-12 -37 Z" fill="#c2622f" />
      <path d="M-21 -39 L-19 -50 L-16 -39 Z" fill="#5a2a14" />
      {/* 喉から胸の白毛 */}
      <path
        d="M-45 -26 C-36 -23 -28 -20 -22 -15 C-18 -10 -14 -9 -11 -13 L-14 -23 C-24 -26 -34 -26 -45 -26 Z"
        fill="#f2e8d8"
      />
      {/* 鼻先・目 */}
      <circle cx="-48" cy="-27" r="2" fill="#241208" />
      <circle cx="-31" cy="-31" r="1.6" fill="#241208" />
    </g>
    {/* 手前側の脚 */}
    <g transform="translate(-13 -14)">
      <g className={styles.legA}>
        <path d="M-2.4 0 L2.4 0 L1.6 14 L-1.6 14 Z" fill="#55290f" />
      </g>
    </g>
    <g transform="translate(25 -13)">
      <g className={styles.legB}>
        <path d="M-2.6 0 L2.6 0 L1.7 13 L-1.7 13 Z" fill="#55290f" />
      </g>
    </g>
  </g>
);

// 熊（左向き・原点が足元）
const Bear: FC = () => (
  <g style={{ "--nb-gait": "0.8s", "--nb-amp": "9deg" } as CSSProperties}>
    {/* 奥側の脚 */}
    <g transform="translate(-22 -16)">
      <g className={styles.legB}>
        <path d="M-4.5 0 L4.5 0 L3.8 16 L-3.8 16 Z" fill="#2a1a10" />
      </g>
    </g>
    <g transform="translate(24 -16)">
      <g className={styles.legA}>
        <path d="M-4.5 0 L4.5 0 L3.8 16 L-3.8 16 Z" fill="#2a1a10" />
      </g>
    </g>
    <g className={styles.bob}>
      {/* 胴体（背中の盛り上がり） */}
      <path
        d="M-44 -14 C-50 -34 -38 -52 -14 -55 C8 -58 30 -52 38 -38 C44 -28 45 -20 40 -14 Z"
        fill="#4a3020"
      />
      {/* しっぽ */}
      <circle cx="41" cy="-22" r="4" fill="#4a3020" />
      {/* 耳 */}
      <circle cx="-56" cy="-56" r="5.5" fill="#4a3020" />
      <circle cx="-44" cy="-59" r="5.5" fill="#4a3020" />
      {/* 頭 */}
      <circle cx="-50" cy="-46" r="13" fill="#4a3020" />
      {/* 鼻先 */}
      <ellipse cx="-61" cy="-42" rx="8" ry="5.5" fill="#6a4a32" />
      <circle cx="-67" cy="-43" r="2.5" fill="#1a0e06" />
      {/* 目 */}
      <circle cx="-52" cy="-49" r="1.6" fill="#1a0e06" />
    </g>
    {/* 手前側の脚 */}
    <g transform="translate(-32 -16)">
      <g className={styles.legA}>
        <path d="M-4.5 0 L4.5 0 L3.8 16 L-3.8 16 Z" fill="#3a2516" />
      </g>
    </g>
    <g transform="translate(33 -16)">
      <g className={styles.legB}>
        <path d="M-4.5 0 L4.5 0 L3.8 16 L-3.8 16 Z" fill="#3a2516" />
      </g>
    </g>
  </g>
);

// 鷹（左向き・原点が体の中心・羽ばたきつき）
// 鉤型のくちばし、黄色い目、指状に分かれた風切羽、扇状の尾羽で猛禽らしさを表現
const Hawk: FC = () => (
  <g>
    {/* 奥側の翼（指状の風切羽つき） */}
    <g transform="translate(3 -4)">
      <g className={styles.wingFar}>
        <path
          d="M0 0 C8 -8 18 -13 28 -15 C36 -16.5 44 -16 48 -14
             L41 -10.5 L47 -9 L39 -5.5 L44 -3.5 L35 -1 L38 1
             C27 4.5 13 5 2 3.5 Z"
          fill="#3e2a1a"
        />
      </g>
    </g>
    {/* 尾羽（扇状に重ねる） */}
    <path d="M24 -3 L46 -8 L42 -1 Z" fill="#5d4330" />
    <path d="M24 -2 L48 -3 L44 3 Z" fill="#4a3424" />
    <path d="M24 0 L46 5 L38 6 Z" fill="#5d4330" />
    {/* 体（頭から尾へ流線形） */}
    <path
      d="M-20 -3 C-12 -8.5 0 -9.5 10 -7 C18 -5 26 -3 30 -2
         C26 1 18 3.5 10 4.5 C0 6 -10 5 -16 1 C-19 -0.5 -20 -1.5 -20 -3 Z"
      fill="#5a3e28"
    />
    {/* 胸元の明るい羽毛 */}
    <path
      d="M-18 0 C-12 4 -4 5.2 4 4.6 C-4 6.4 -13 5.6 -18 1.5 Z"
      fill="#c9b08a"
    />
    {/* 頭 */}
    <path
      d="M-20 -3 C-21 -8 -25 -11 -29 -10.5 C-33 -10 -35.5 -7 -36 -4.5
         L-30 -2 C-27 0.5 -22 0.5 -20 -3 Z"
      fill="#4a3220"
    />
    {/* くちばし（鉤型・基部は黄色いロウ膜） */}
    <path
      d="M-33 -5 C-36 -5 -38 -4 -38.5 -2.8 C-38.7 -1.9 -37.6 -1.4 -36.6 -1.7
         C-37 -0.4 -36 0.2 -34.8 -0.6 L-32 -2.2 Z"
      fill="#2a1c10"
    />
    <path d="M-32 -5 L-34.5 -4.7 L-34 -3 L-32 -3.4 Z" fill="#d8a030" />
    {/* 目（猛禽の黄色い虹彩） */}
    <circle cx="-27" cy="-6" r="1.9" fill="#e8b830" />
    <circle cx="-27.6" cy="-6.2" r="1" fill="#100a06" />
    {/* たたんだ脚 */}
    <path d="M-6 4.5 L-1 4.5 L-2 6.5 L-6 6.5 Z" fill="#d8a030" />
    {/* 手前の翼 */}
    <g transform="translate(0 -4)">
      <g className={styles.wingNear}>
        <path
          d="M0 0 C8 -8 18 -13 28 -15 C36 -16.5 44 -16 48 -14
             L41 -10.5 L47 -9 L39 -5.5 L44 -3.5 L35 -1 L38 1
             C27 4.5 13 5 2 3.5 Z"
          fill="#6b4a2e"
        />
        {/* 雨覆（うわばね）の濃い帯 */}
        <path
          d="M4 -1 C12 -6.5 22 -10.5 32 -12.5 C25 -8.5 14 -3.5 7 0.5 Z"
          fill="#4a3220"
          opacity="0.65"
        />
      </g>
    </g>
  </g>
);

// ===== 動物エージェント =====
// dir: -1 = 左へ進む（コンポーネントのデフォルトの向き）、1 = 右へ進む（左右反転）
type AnimalSpecies = "cow" | "fox" | "bear" | "hawk";

type Agent = {
  species: AnimalSpecies;
  x: number;
  y: number;
  dir: 1 | -1;
  speed: number; // px/秒
  scale: number;
  state: "walk" | "idle";
  timer: number; // 次の行動決定までの秒数
  baseY: number; // 鷹の基準高度
  phase: number; // 鷹の上下動の位相
};

function createAgents(): Agent[] {
  return [
    { species: "cow", x: 380, y: 1052, dir: -1, speed: 22, scale: 1.05, state: "walk", timer: 6, baseY: 1052, phase: 0 },
    { species: "fox", x: 1080, y: 1054, dir: 1, speed: 55, scale: 1, state: "walk", timer: 5, baseY: 1054, phase: 0 },
    { species: "fox", x: 1620, y: 1050, dir: -1, speed: 50, scale: 0.85, state: "walk", timer: 7, baseY: 1050, phase: 0 },
    { species: "bear", x: 760, y: 1052, dir: -1, speed: 30, scale: 1, state: "walk", timer: 8, baseY: 1052, phase: 0 },
    { species: "hawk", x: 1500, y: 320, dir: -1, speed: 85, scale: 1, state: "walk", timer: 0, baseY: 320, phase: 2 },
  ];
}

// 画面(viewBox 1920)の外側。ここを越えたら反対側 or ランダムな側から再出現
const WORLD_LEFT = -160;
const WORLD_RIGHT = 2080;

const AnimalSprite: FC<{ species: AnimalSpecies }> = ({ species }) => {
  switch (species) {
    case "cow":
      return <Cow />;
    case "bear":
      return <Bear />;
    case "hawk":
      return <Hawk />;
    default:
      return <Fox />;
  }
};

type RowProps = { trees: Tree[] };
const TreeRow: FC<RowProps> = ({ trees }) => (
  <>
    {trees.map((t, i) => (
      <g key={i} className={`${styles.tree} ${t.sway}`}>
        <path d={buildConiferPath(t.cx, t.baseY, t.h)} fill={t.fill} />
      </g>
    ))}
  </>
);

type Phase = "night" | "dawn" | "morning" | "day" | "afternoon" | "dusk";

type SkyPalette = {
  phase: Phase;
  sky: [string, string, string, string]; // 0%, 30%, 60%, 100%
  // Celestial body
  bodyType: "sun" | "moon";
  bodyColor: string;
  bodyGlowInner: string;
  bodyGlowMid: string;
  bodyGlowOuter: string;
  starsOpacity: number;
  auroraOpacity: number;
};

// Continuous interpolation between key time-of-day palettes.
// Hours: 0=midnight, 6=sunrise, 12=noon, 18=sunset
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
function lerpHex(a: string, b: string, t: number): string {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  const r = Math.round(lerp(pa[0], pb[0], t));
  const g = Math.round(lerp(pa[1], pb[1], t));
  const bl = Math.round(lerp(pa[2], pb[2], t));
  return `#${[r, g, bl].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

type Keyframe = {
  hour: number;
  sky: [string, string, string, string];
  bodyColor: string;
  glowInner: string;
  glowMid: string;
  glowOuter: string;
  starsOpacity: number;
  auroraOpacity: number;
  bodyType: "sun" | "moon";
};

const KEYFRAMES: Keyframe[] = [
  // Deep night
  {
    hour: 0,
    sky: ["#020912", "#06182a", "#0d2a3f", "#152f3a"],
    bodyColor: "#deeaf8",
    glowInner: "#c8dcf0",
    glowMid: "#7aa8d4",
    glowOuter: "#3060a0",
    starsOpacity: 1,
    auroraOpacity: 1,
    bodyType: "moon",
  },
  // Pre-dawn
  {
    hour: 5,
    sky: ["#0a1a30", "#23304a", "#5a4a5a", "#7a5a4a"],
    bodyColor: "#e0e0f0",
    glowInner: "#d0c0d0",
    glowMid: "#a07090",
    glowOuter: "#503060",
    starsOpacity: 0.4,
    auroraOpacity: 0.5,
    bodyType: "moon",
  },
  // Sunrise
  {
    hour: 6,
    sky: ["#3a3a5a", "#c87050", "#f0a060", "#f8c890"],
    bodyColor: "#ffd080",
    glowInner: "#ffb060",
    glowMid: "#ff8040",
    glowOuter: "#c04020",
    starsOpacity: 0,
    auroraOpacity: 0,
    bodyType: "sun",
  },
  // Morning
  {
    hour: 8,
    sky: ["#7ab8e8", "#a0d0f0", "#c8e0f0", "#e0e8d8"],
    bodyColor: "#fff0c0",
    glowInner: "#ffe080",
    glowMid: "#ffc040",
    glowOuter: "#ff8800",
    starsOpacity: 0,
    auroraOpacity: 0,
    bodyType: "sun",
  },
  // Noon
  {
    hour: 12,
    sky: ["#4a90d8", "#7ab8e8", "#b0d8f0", "#d8e8d8"],
    bodyColor: "#ffffff",
    glowInner: "#fff8d0",
    glowMid: "#ffe080",
    glowOuter: "#ffa040",
    starsOpacity: 0,
    auroraOpacity: 0,
    bodyType: "sun",
  },
  // Afternoon
  {
    hour: 16,
    sky: ["#5aa0d8", "#90c0e0", "#d0d8d0", "#e8c8a0"],
    bodyColor: "#fff0a0",
    glowInner: "#ffd060",
    glowMid: "#ff9030",
    glowOuter: "#e05010",
    starsOpacity: 0,
    auroraOpacity: 0,
    bodyType: "sun",
  },
  // Sunset
  {
    hour: 18,
    sky: ["#4a3060", "#a04050", "#e07040", "#f8a060"],
    bodyColor: "#ff8030",
    glowInner: "#ff6020",
    glowMid: "#d03010",
    glowOuter: "#601020",
    starsOpacity: 0,
    auroraOpacity: 0,
    bodyType: "sun",
  },
  // Twilight
  {
    hour: 19,
    sky: ["#1a1a3a", "#3a2a4a", "#6a3040", "#8a4030"],
    bodyColor: "#e8d8e8",
    glowInner: "#c8a8c8",
    glowMid: "#806090",
    glowOuter: "#302050",
    starsOpacity: 0.5,
    auroraOpacity: 0.6,
    bodyType: "moon",
  },
  // Night
  {
    hour: 21,
    sky: ["#051621", "#0d2d45", "#174a35", "#23613d"],
    bodyColor: "#deeaf8",
    glowInner: "#c8dcf0",
    glowMid: "#7aa8d4",
    glowOuter: "#3060a0",
    starsOpacity: 1,
    auroraOpacity: 1,
    bodyType: "moon",
  },
  // Loop back to midnight
  {
    hour: 24,
    sky: ["#020912", "#06182a", "#0d2a3f", "#152f3a"],
    bodyColor: "#deeaf8",
    glowInner: "#c8dcf0",
    glowMid: "#7aa8d4",
    glowOuter: "#3060a0",
    starsOpacity: 1,
    auroraOpacity: 1,
    bodyType: "moon",
  },
];

function getPalette(hours: number): SkyPalette {
  let a = KEYFRAMES[0];
  let b = KEYFRAMES[KEYFRAMES.length - 1];
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    if (hours >= KEYFRAMES[i].hour && hours <= KEYFRAMES[i + 1].hour) {
      a = KEYFRAMES[i];
      b = KEYFRAMES[i + 1];
      break;
    }
  }
  const t = (hours - a.hour) / (b.hour - a.hour || 1);
  const sky: [string, string, string, string] = [
    lerpHex(a.sky[0], b.sky[0], t),
    lerpHex(a.sky[1], b.sky[1], t),
    lerpHex(a.sky[2], b.sky[2], t),
    lerpHex(a.sky[3], b.sky[3], t),
  ];
  // Choose body type based on whichever keyframe is closer
  const bodyType: "sun" | "moon" = t < 0.5 ? a.bodyType : b.bodyType;
  // Phase label
  let phase: Phase = "night";
  if (hours >= 5 && hours < 7) phase = "dawn";
  else if (hours >= 7 && hours < 11) phase = "morning";
  else if (hours >= 11 && hours < 15) phase = "day";
  else if (hours >= 15 && hours < 17) phase = "afternoon";
  else if (hours >= 17 && hours < 19.5) phase = "dusk";
  else phase = "night";

  return {
    phase,
    sky,
    bodyType,
    bodyColor: lerpHex(a.bodyColor, b.bodyColor, t),
    bodyGlowInner: lerpHex(a.glowInner, b.glowInner, t),
    bodyGlowMid: lerpHex(a.glowMid, b.glowMid, t),
    bodyGlowOuter: lerpHex(a.glowOuter, b.glowOuter, t),
    starsOpacity: lerp(a.starsOpacity, b.starsOpacity, t),
    auroraOpacity: lerp(a.auroraOpacity, b.auroraOpacity, t),
  };
}

// Arc path: sun/moon rises at 6:00 (left) and sets at 18:00 (right).
// Outside daytime, the body sits on the night arc on the opposite side.
function getBodyPosition(hours: number): { cx: number; cy: number } {
  // Daytime arc: 6 → 18, peak at 12
  // Nighttime arc: 18 → 6 (next day), peak at 0/24
  const isDay = hours >= 6 && hours <= 18;
  const t = isDay ? (hours - 6) / 12 : ((hours + 24 - 18) % 24) / 12; // 0..1 across the visible arc
  const cx = 200 + t * 1520; // left → right across viewBox 1920
  // Parabolic arc; peak height differs between sun (higher) and moon (slightly lower)
  const peakY = isDay ? 90 : 130;
  const baseY = 560;
  const cy = baseY - (baseY - peakY) * Math.sin(Math.PI * t);
  return { cx, cy };
}

const NatureBackground: FC = () => {
  const [hours, setHours] = useState<number>(() => {
    const d = new Date();
    return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
  });

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setHours(d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600);
    };
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  // 動物の行動シミュレーション: 歩く・立ち止まる・方向転換し、
  // 画面外へ消えたらランダムな側から再出現する。画面内には常に3匹以上を維持
  const agentsRef = useRef<Agent[]>(null as unknown as Agent[]);
  if (!agentsRef.current) agentsRef.current = createAgents();
  const animalRefs = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const agents = agentsRef.current;
    let raf = 0;
    let last = performance.now();

    const respawn = (a: Agent) => {
      const fromLeft = Math.random() < 0.5;
      a.x = fromLeft ? WORLD_LEFT + 10 : WORLD_RIGHT - 10;
      a.dir = fromLeft ? 1 : -1;
      a.state = "walk";
      a.timer = 6 + Math.random() * 6;
      if (a.species === "hawk") a.baseY = 220 + Math.random() * 220;
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const t = now / 1000;

      for (const a of agents) {
        if (a.species === "hawk") {
          // 鷹は止まらず羽ばたきながら滑空。上下にゆらぎながら横断する
          a.x += a.dir * a.speed * dt;
          a.y = a.baseY + Math.sin(t * 1.4 + a.phase) * 22;
          if (a.x < WORLD_LEFT || a.x > WORLD_RIGHT) respawn(a);
          continue;
        }

        a.timer -= dt;
        if (a.timer <= 0) {
          const onScreen = a.x > 40 && a.x < 1880;
          const r = Math.random();
          if (!onScreen) {
            // 画面外では立ち止まらない
            a.state = "walk";
            a.timer = 3;
          } else if (r < 0.5) {
            a.state = "walk";
            a.timer = 4 + Math.random() * 6;
          } else if (r < 0.78) {
            a.state = "idle";
            a.timer = 2 + Math.random() * 3.5;
          } else {
            // 方向転換して歩き出す
            a.dir = (a.dir * -1) as 1 | -1;
            a.state = "walk";
            a.timer = 5 + Math.random() * 6;
          }
        }
        if (a.state === "walk") a.x += a.dir * a.speed * dt;
        if (a.x < WORLD_LEFT || a.x > WORLD_RIGHT) respawn(a);
      }

      // 画面内が3匹未満なら、画面外の個体を画面に向けて歩かせる
      const visible = agents.filter((a) => a.x > 0 && a.x < 1920).length;
      if (visible < 3) {
        for (const a of agents) {
          if (a.x <= 0 || a.x >= 1920) {
            a.dir = a.x <= 0 ? 1 : -1;
            a.state = "walk";
          }
        }
      }

      agents.forEach((a, i) => {
        const el = animalRefs.current[i];
        if (!el) return;
        const sx = a.dir === 1 ? -a.scale : a.scale;
        el.setAttribute(
          "transform",
          `translate(${a.x} ${a.y}) scale(${sx} ${a.scale})`,
        );
        el.style.setProperty("--nb-walk", a.state === "walk" ? "running" : "paused");
      });

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  const palette = getPalette(hours);
  const { cx, cy } = getBodyPosition(hours);
  const isSun = palette.bodyType === "sun";


  return (
    <div className={styles.wrapper} aria-hidden="true">
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMax slice"
        className={styles.svg}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="nb-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={palette.sky[0]} />
            <stop offset="30%" stopColor={palette.sky[1]} />
            <stop offset="60%" stopColor={palette.sky[2]} />
            <stop offset="100%" stopColor={palette.sky[3]} />
          </linearGradient>

          <linearGradient id="nb-mtn1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a4558" />
            <stop offset="100%" stopColor="#1a3244" />
          </linearGradient>

          <linearGradient id="nb-mtn2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#336655" />
            <stop offset="100%" stopColor="#224433" />
          </linearGradient>

          <radialGradient id="nb-body-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={palette.bodyGlowInner} stopOpacity="0.95" />
            <stop offset="50%" stopColor={palette.bodyGlowMid} stopOpacity={isSun ? 0.45 : 0.25} />
            <stop offset="100%" stopColor={palette.bodyGlowOuter} stopOpacity="0" />
          </radialGradient>

          <radialGradient id="nb-aurora1" cx="25%" cy="30%" r="55%">
            <stop offset="0%" stopColor="#00c853" stopOpacity="0.09" />
            <stop offset="100%" stopColor="#00c853" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="nb-aurora2" cx="75%" cy="20%" r="50%">
            <stop offset="0%" stopColor="#00acc1" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#00acc1" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="nb-aurora3" cx="50%" cy="10%" r="60%">
            <stop offset="0%" stopColor="#4a9c6a" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#4a9c6a" stopOpacity="0" />
          </radialGradient>

          <filter id="nb-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="nb-mist" x="0%" y="0%" width="100%" height="100%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        {/* Sky */}
        <rect width="1920" height="1080" fill="url(#nb-sky)" />

        {/* Aurora — fades during daytime */}
        <g opacity={palette.auroraOpacity}>
          <rect width="1920" height="1080" fill="url(#nb-aurora1)" className={styles.aurora1} />
          <rect width="1920" height="1080" fill="url(#nb-aurora2)" className={styles.aurora2} />
          <rect width="1920" height="1080" fill="url(#nb-aurora3)" className={styles.aurora3} />
        </g>

        {/* Sun / Moon — position by time */}
        <circle cx={cx} cy={cy} r={isSun ? 180 : 120} fill="url(#nb-body-glow)" />
        <circle
          cx={cx}
          cy={cy}
          r={isSun ? 56 : 34}
          fill={palette.bodyColor}
          filter="url(#nb-glow)"
          className={isSun ? styles.sun : styles.moon}
        />
        {!isSun && (
          <>
            <circle cx={cx - 10} cy={cy - 10} r="5" fill="rgba(0,0,0,0.08)" />
            <circle cx={cx + 12} cy={cy + 8} r="3.5" fill="rgba(0,0,0,0.07)" />
            <circle cx={cx - 2} cy={cy + 13} r="2.5" fill="rgba(0,0,0,0.06)" />
          </>
        )}

        {/* Stars - fade out during day */}
        <g
          fill="rgba(255,255,255,0.7)"
          className={styles.stars}
          opacity={palette.starsOpacity}
        >
          <circle cx="45" cy="28" r="0.8" /><circle cx="128" cy="72" r="0.9" />
          <circle cx="210" cy="38" r="0.7" /><circle cx="358" cy="95" r="0.8" />
          <circle cx="492" cy="55" r="0.9" /><circle cx="574" cy="22" r="0.7" />
          <circle cx="688" cy="88" r="0.8" /><circle cx="798" cy="42" r="0.9" />
          <circle cx="912" cy="18" r="0.7" /><circle cx="1038" cy="68" r="0.8" />
          <circle cx="1168" cy="32" r="0.9" /><circle cx="1295" cy="82" r="0.7" />
          <circle cx="1415" cy="22" r="0.8" /><circle cx="1538" cy="62" r="0.9" />
          <circle cx="1665" cy="38" r="0.7" /><circle cx="1788" cy="25" r="0.8" />
          <circle cx="72" cy="148" r="0.8" /><circle cx="215" cy="165" r="0.9" />
          <circle cx="348" cy="195" r="0.7" /><circle cx="478" cy="148" r="0.8" />
          <circle cx="608" cy="175" r="0.9" /><circle cx="728" cy="155" r="0.7" />
          <circle cx="858" cy="185" r="0.8" /><circle cx="985" cy="145" r="0.9" />
          <circle cx="1108" cy="198" r="0.7" /><circle cx="1238" cy="168" r="0.8" />
          <circle cx="1365" cy="188" r="0.9" /><circle cx="1495" cy="255" r="0.7" />
          <circle cx="1625" cy="178" r="0.8" /><circle cx="1758" cy="195" r="0.9" />
          <circle cx="55" cy="248" r="0.8" /><circle cx="185" cy="278" r="0.9" />
          <circle cx="318" cy="258" r="0.7" /><circle cx="448" cy="288" r="0.8" />
          <circle cx="578" cy="248" r="0.9" /><circle cx="708" cy="275" r="0.7" />
          <circle cx="838" cy="258" r="0.8" /><circle cx="968" cy="288" r="0.9" />
          <circle cx="1098" cy="258" r="0.7" /><circle cx="1228" cy="278" r="0.8" />
          <circle cx="1358" cy="252" r="0.9" /><circle cx="1488" cy="282" r="0.7" />
          <circle cx="1618" cy="258" r="0.8" /><circle cx="1748" cy="278" r="0.9" />
          <circle cx="92" cy="348" r="0.8" /><circle cx="245" cy="375" r="0.9" />
          <circle cx="395" cy="355" r="0.7" /><circle cx="545" cy="382" r="0.8" />
          <circle cx="695" cy="348" r="0.9" /><circle cx="845" cy="372" r="0.7" />
          <circle cx="995" cy="348" r="0.8" /><circle cx="1145" cy="375" r="0.9" />
          <circle cx="1295" cy="352" r="0.7" /><circle cx="1445" cy="378" r="0.8" />
          <circle cx="1595" cy="355" r="0.9" /><circle cx="1745" cy="372" r="0.7" />
        </g>

        {/* Bright stars */}
        <g
          fill="rgba(255,255,255,0.95)"
          filter="url(#nb-glow)"
          opacity={palette.starsOpacity}
        >
          <circle cx="262" cy="92" r="1.8" /><circle cx="785" cy="135" r="1.6" />
          <circle cx="1045" cy="188" r="1.7" /><circle cx="1350" cy="78" r="2.0" />
          <circle cx="1822" cy="108" r="1.6" /><circle cx="408" cy="295" r="1.8" />
          <circle cx="1095" cy="315" r="1.7" /><circle cx="652" cy="418" r="1.6" />
          <circle cx="1685" cy="385" r="1.8" /><circle cx="138" cy="368" r="1.5" />
        </g>

        {/* Far mountains - blue-grey ridges */}
        <path
          d="M0 660 L80 600 L150 640 L240 560 L330 605 L410 540 L500 590 L590 530 L680 580 L770 525 L860 570 L950 510 L1050 565 L1150 525 L1240 560 L1340 510 L1440 555 L1540 520 L1640 555 L1740 520 L1840 545 L1920 525 L1920 1080 L0 1080 Z"
          fill="url(#nb-mtn1)"
        />

        {/* Mid mountains - forest green */}
        <path
          d="M0 770 L100 720 L200 760 L300 695 L420 740 L530 690 L640 735 L760 685 L880 730 L1000 695 L1120 740 L1240 700 L1360 740 L1480 695 L1600 735 L1720 700 L1840 730 L1920 715 L1920 1080 L0 1080 Z"
          fill="url(#nb-mtn2)"
        />

        {/* Mist between mountains */}
        <rect x="0" y="740" width="1920" height="80" fill="rgba(180,220,200,0.09)" filter="url(#nb-mist)" />

        {/* Far conifer band */}
        <TreeRow trees={farTrees} />

        {/* Near hills */}
        <path
          d="M0 880 C150 850,300 870,450 830 C600 790,750 840,900 810 C1050 780,1200 830,1350 795 C1500 760,1650 820,1800 788 C1860 775,1900 790,1920 785 L1920 1080 L0 1080 Z"
          fill="#2f5d52"
        />

        {/* Mid conifer band */}
        <TreeRow trees={midTrees} />

        {/* Foreground mist */}
        <rect x="0" y="940" width="1920" height="60" fill="rgba(160,210,180,0.095)" filter="url(#nb-mist)" />

        {/* Near conifer band - foreground */}
        <TreeRow trees={nearTrees} />

        {/* Ground */}
        <rect x="0" y="1040" width="1920" height="40" fill="#2a4a42" />

        {/* Animals — 歩き回り、立ち止まり、向きを変え、画面外に出たら再出現する */}
        {agentsRef.current.map((a, i) => (
          <g
            key={i}
            ref={(el) => {
              animalRefs.current[i] = el;
            }}
            transform={`translate(${a.x} ${a.y}) scale(${
              a.dir === 1 ? -a.scale : a.scale
            } ${a.scale})`}
          >
            <AnimalSprite species={a.species} />
          </g>
        ))}
      </svg>
    </div>
  );
};

export default NatureBackground;
