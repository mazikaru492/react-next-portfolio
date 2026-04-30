import type { FC } from "react";
import styles from "./index.module.css";

const NatureBackground: FC = () => (
  <div className={styles.wrapper} aria-hidden="true">
    <svg
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      className={styles.svg}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="nb-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#020810" />
          <stop offset="30%" stopColor="#071a2e" />
          <stop offset="60%" stopColor="#0d2e22" />
          <stop offset="100%" stopColor="#163d28" />
        </linearGradient>

        <linearGradient id="nb-mtn1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a2d42" />
          <stop offset="100%" stopColor="#0e1f2e" />
        </linearGradient>

        <linearGradient id="nb-mtn2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a3d2e" />
          <stop offset="100%" stopColor="#0d2218" />
        </linearGradient>

        <linearGradient id="nb-forest" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f2a1a" />
          <stop offset="100%" stopColor="#040c07" />
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

        <filter id="nb-soft" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Sky */}
      <rect width="1920" height="1080" fill="url(#nb-sky)" />

      {/* Aurora borealis effects */}
      <rect width="1920" height="1080" fill="url(#nb-aurora1)" className={styles.aurora1} />
      <rect width="1920" height="1080" fill="url(#nb-aurora2)" className={styles.aurora2} />
      <rect width="1920" height="1080" fill="url(#nb-aurora3)" className={styles.aurora3} />

      {/* Moon glow halo */}
      <circle cx="1500" cy="150" r="120" fill="url(#nb-moon-glow)" />
      {/* Moon */}
      <circle cx="1500" cy="150" r="34" fill="#deeaf8" filter="url(#nb-glow)" className={styles.moon} />
      {/* Moon craters (subtle) */}
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
        <circle cx="32" cy="435" r="0.8" /><circle cx="165" cy="455" r="0.9" />
        <circle cx="325" cy="438" r="0.7" /><circle cx="485" cy="465" r="0.8" />
        <circle cx="645" cy="442" r="0.9" /><circle cx="805" cy="458" r="0.7" />
        <circle cx="965" cy="440" r="0.8" /><circle cx="1125" cy="465" r="0.9" />
        <circle cx="1285" cy="438" r="0.7" /><circle cx="1445" cy="462" r="0.8" />
        <circle cx="1605" cy="440" r="0.9" /><circle cx="1765" cy="458" r="0.7" />
        <circle cx="1880" cy="448" r="0.8" />
      </g>

      {/* Bright stars */}
      <g fill="rgba(255,255,255,0.95)" filter="url(#nb-glow)">
        <circle cx="262" cy="92" r="1.8" /><circle cx="785" cy="135" r="1.6" />
        <circle cx="1045" cy="188" r="1.7" /><circle cx="1350" cy="78" r="2.0" />
        <circle cx="1822" cy="108" r="1.6" /><circle cx="408" cy="295" r="1.8" />
        <circle cx="1095" cy="315" r="1.7" /><circle cx="652" cy="418" r="1.6" />
        <circle cx="1685" cy="385" r="1.8" /><circle cx="138" cy="368" r="1.5" />
      </g>

      {/* Far mountains - blue-grey */}
      <path
        d="M0 680 C80 640,160 660,240 590 C320 520,400 570,480 520 C560 470,640 500,720 455 C800 410,880 450,960 420 C1040 390,1120 440,1200 405 C1280 370,1360 430,1440 395 C1520 360,1600 420,1680 385 C1760 350,1840 405,1920 380 L1920 1080 L0 1080 Z"
        fill="url(#nb-mtn1)"
      />

      {/* Mid mountains - forest green */}
      <path
        d="M0 780 C100 730,200 760,300 700 C400 640,500 690,620 640 C740 590,840 640,960 600 C1080 560,1180 620,1300 575 C1420 530,1540 600,1660 555 C1780 510,1860 575,1920 545 L1920 1080 L0 1080 Z"
        fill="url(#nb-mtn2)"
      />

      {/* Mist between mountains - subtle */}
      <rect
        x="0" y="740" width="1920" height="80"
        fill="rgba(180,220,200,0.045)"
        filter="url(#nb-mist)"
      />

      {/* Near hills */}
      <path
        d="M0 860 C150 830,300 850,450 810 C600 770,750 820,900 790 C1050 760,1200 810,1350 775 C1500 740,1650 800,1800 768 C1860 755,1900 770,1920 765 L1920 1080 L0 1080 Z"
        fill="#132b1c"
      />

      {/* Forest silhouette - tree line */}
      <path
        d="M0 920 L0 900 L12 830 L25 900 L38 888 L50 800 L62 890 L75 878 L88 812 L100 880 L118 895 L130 792 L142 882 L155 870 L168 762 L180 865 L192 882 L205 812 L220 895 L235 895 L248 762 L260 890 L272 878 L285 802 L298 872 L315 892 L330 782 L342 882 L355 874 L368 772 L382 870 L398 892 L415 798 L428 888 L440 878 L455 792 L468 882 L485 898 L500 778 L512 890 L526 880 L540 798 L554 878 L570 898 L585 782 L597 888 L610 878 L625 802 L638 875 L655 898 L670 778 L682 888 L695 880 L710 802 L724 878 L740 898 L755 788 L768 885 L782 878 L795 812 L810 872 L825 900 L840 782 L852 895 L866 884 L880 798 L892 880 L905 898 L920 778 L932 890 L948 882 L962 800 L975 878 L992 900 L1008 784 L1020 892 L1032 884 L1048 800 L1060 878 L1075 900 L1092 775 L1104 890 L1118 882 L1130 802 L1145 875 L1162 898 L1178 780 L1190 888 L1202 878 L1218 804 L1232 872 L1248 898 L1265 790 L1278 888 L1290 880 L1305 808 L1318 872 L1330 900 L1348 790 L1360 885 L1372 878 L1388 810 L1400 872 L1415 902 L1430 788 L1442 890 L1455 882 L1468 802 L1480 878 L1495 900 L1510 780 L1522 890 L1535 884 L1550 804 L1562 878 L1578 900 L1592 780 L1604 890 L1618 882 L1632 808 L1645 875 L1660 900 L1675 782 L1688 888 L1700 880 L1715 802 L1728 875 L1745 900 L1760 788 L1772 888 L1785 880 L1798 810 L1812 872 L1828 898 L1845 788 L1858 885 L1870 878 L1882 802 L1896 875 L1908 882 L1920 878 L1920 1080 L0 1080 Z"
        fill="url(#nb-forest)"
      />

      {/* Ground */}
      <rect x="0" y="975" width="1920" height="105" fill="#030806" />

      {/* Foreground mist */}
      <rect
        x="0" y="930" width="1920" height="70"
        fill="rgba(160,210,180,0.04)"
        filter="url(#nb-mist)"
      />

      {/* Subtle light reflection on ground */}
      <rect
        x="0" y="960" width="1920" height="20"
        fill="rgba(120,180,140,0.03)"
        filter="url(#nb-soft)"
      />
    </svg>
  </div>
);

export default NatureBackground;
