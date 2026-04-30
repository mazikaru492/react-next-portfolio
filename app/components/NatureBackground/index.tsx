import type { FC } from "react";
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
  fill: "#143a26",
  seed: 1,
});

const midTrees = generateRow({
  count: 30,
  baseY: 970,
  minH: 170,
  maxH: 290,
  fill: "#0f321f",
  seed: 2,
});

const nearTrees = generateRow({
  count: 22,
  baseY: 1040,
  minH: 250,
  maxH: 420,
  fill: "#0b1d15",
  seed: 3,
});

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

const NatureBackground: FC = () => (
  <div className={styles.wrapper} aria-hidden="true">
    <svg
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMax slice"
      className={styles.svg}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="nb-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#051621" />
          <stop offset="30%" stopColor="#0d2d45" />
          <stop offset="60%" stopColor="#174a35" />
          <stop offset="100%" stopColor="#23613d" />
        </linearGradient>

        <linearGradient id="nb-mtn1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a2d42" />
          <stop offset="100%" stopColor="#0e1f2e" />
        </linearGradient>

        <linearGradient id="nb-mtn2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a3d2e" />
          <stop offset="100%" stopColor="#0d2218" />
        </linearGradient>

        <radialGradient id="nb-moon-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c8dcf0" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#7aa8d4" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3060a0" stopOpacity="0" />
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

      {/* Aurora */}
      <rect width="1920" height="1080" fill="url(#nb-aurora1)" className={styles.aurora1} />
      <rect width="1920" height="1080" fill="url(#nb-aurora2)" className={styles.aurora2} />
      <rect width="1920" height="1080" fill="url(#nb-aurora3)" className={styles.aurora3} />

      {/* Moon */}
      <circle cx="1500" cy="150" r="120" fill="url(#nb-moon-glow)" />
      <circle cx="1500" cy="150" r="34" fill="#deeaf8" filter="url(#nb-glow)" className={styles.moon} />
      <circle cx="1490" cy="140" r="5" fill="rgba(0,0,0,0.08)" />
      <circle cx="1512" cy="158" r="3.5" fill="rgba(0,0,0,0.07)" />
      <circle cx="1498" cy="163" r="2.5" fill="rgba(0,0,0,0.06)" />

      {/* Stars - tiny */}
      <g fill="rgba(255,255,255,0.7)" className={styles.stars}>
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
      <g fill="rgba(255,255,255,0.95)" filter="url(#nb-glow)">
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
        fill="#163530"
      />

      {/* Mid conifer band */}
      <TreeRow trees={midTrees} />

      {/* Foreground mist */}
      <rect x="0" y="940" width="1920" height="60" fill="rgba(160,210,180,0.095)" filter="url(#nb-mist)" />

      {/* Near conifer band - foreground */}
      <TreeRow trees={nearTrees} />

      {/* Ground */}
      <rect x="0" y="1040" width="1920" height="40" fill="#0a1814" />
    </svg>
  </div>
);

export default NatureBackground;
