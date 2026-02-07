"use client";

import {
  SiNextdotjs,
  SiGithub,
  SiLinux,
  SiPython,
  SiMysql,
  SiNotion,
  SiKalilinux,
  SiTypescript,
  SiReact,
  SiDocker,
} from "react-icons/si";
import Image from "next/image";
import type { ComponentType, FC, SVGProps } from "react";
import { memo, useSyncExternalStore } from "react";

// ==========================================
// Types & Interfaces
// ==========================================

/** Proficiency tier — controls visual emphasis in the marquee */
type ProficiencyTier = "primary" | "secondary";

type SvgIconProps = SVGProps<SVGSVGElement>;

/**
 * Flexible icon component type compatible with both
 * react-icons and custom SVG components.
 */
type IconComponent = ComponentType<{
  className?: string;
  style?: React.CSSProperties;
}>;

interface TechItem {
  readonly label: string;
  readonly Icon?: IconComponent;
  readonly imageSrc?: string;
  readonly color: string;
  readonly url: string;
  readonly tier: ProficiencyTier;
}

interface MarqueeRowProps {
  readonly items: readonly TechItem[];
  readonly reverse?: boolean;
}

interface TechIconProps {
  readonly item: TechItem;
}

// ==========================================
// Constants
// ==========================================

const ICON_SIZE = {
  mobile: "h-6 w-6 sm:h-8 sm:w-8",
  desktop: "md:h-10 md:w-10 lg:h-11 lg:w-11",
} as const;

const ICON_DIMENSIONS = {
  width: 44,
  height: 44,
} as const;

const MARQUEE_CONFIG = {
  repeatCount: 4,
  gap: "gap-4 sm:gap-6 md:gap-10 lg:gap-16",
} as const;

const SECTION_CONTENT = {
  title: "Tech Stack",
  subtitle: "実務・個人開発で日常的に使用している技術とツール",
} as const;

// ==========================================
// Accessibility
// ==========================================

function subscribePrefersReducedMotion(callback: () => void): () => void {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

/** Respects user's reduced-motion preference using React 18+ useSyncExternalStore */
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribePrefersReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

// ==========================================
// SVG Icon Components
// ==========================================

const GeminiIcon: FC<SvgIconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z"
      fill="url(#gemini-gradient)"
    />
    <defs>
      <linearGradient id="gemini-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4285F4" />
        <stop offset="50%" stopColor="#9B72CB" />
        <stop offset="100%" stopColor="#D96570" />
      </linearGradient>
    </defs>
  </svg>
);

const OpenAIIcon: FC<SvgIconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
  </svg>
);

const NmapIcon: FC<SvgIconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path
      d="M12 4C5.5 4 1 12 1 12s4.5 8 11 8 11-8 11-8-4.5-8-11-8z"
      fill="none"
      stroke="#51A0D5"
      strokeWidth="1.5"
    />
    <circle
      cx="12"
      cy="12"
      r="5"
      fill="none"
      stroke="#51A0D5"
      strokeWidth="1.2"
    />
    <circle
      cx="12"
      cy="12"
      r="3"
      fill="none"
      stroke="#51A0D5"
      strokeWidth="1"
    />
    <circle cx="12" cy="12" r="1.5" fill="#51A0D5" />
    <path
      d="M12 5v14M5 12h14"
      stroke="#51A0D5"
      strokeWidth="0.5"
      opacity="0.6"
    />
  </svg>
);

const PerplexityIcon: FC<SvgIconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.4904 0v7.0896H1.6023v10.3976h2.8882V24l6.932-6.3591v6.2005h1.1554v-6.0469l6.9318 6.1807v-6.4879h2.8882V7.0896zm-3.4657-4.531v4.531h-5.355l5.355-4.531zm-13.2862.0676 4.8691 4.4634H5.6458V2.6262zM2.7576 16.332V8.245h7.8476l-6.1149 6.1147v1.9723H2.7576zm2.8882 5.0404v-3.8852h.0001v-2.6488l5.7763-5.7764v7.0111l-5.7764 5.2993zm12.7086.0248-5.7766-5.1509V9.0618l5.7766 5.7766v6.5588zm2.8882-5.0652h-1.733v-1.9723L13.3948 8.245h7.8478v8.087z" />
  </svg>
);

// ==========================================
// Tech Stack Data — Organized by Proficiency
// ==========================================

/**
 * Primary: Daily-driver technologies with production experience.
 * Secondary: Actively used in projects or learning with strong fundamentals.
 */

const CORE_STACK: readonly TechItem[] = [
  {
    label: "Next.js",
    Icon: SiNextdotjs,
    color: "#ffffff",
    url: "https://nextjs.org",
    tier: "primary",
  },
  {
    label: "TypeScript",
    Icon: SiTypescript,
    color: "#3178C6",
    url: "https://www.typescriptlang.org",
    tier: "primary",
  },
  {
    label: "React",
    Icon: SiReact,
    color: "#61DAFB",
    url: "https://react.dev",
    tier: "primary",
  },
  {
    label: "Python",
    Icon: SiPython,
    color: "#3776AB",
    url: "https://www.python.org",
    tier: "primary",
  },
  {
    label: "Kali Linux",
    Icon: SiKalilinux,
    color: "#557C94",
    url: "https://www.kali.org",
    tier: "primary",
  },
  {
    label: "MySQL",
    Icon: SiMysql,
    color: "#4479A1",
    url: "https://www.mysql.com",
    tier: "secondary",
  },
  {
    label: "Linux",
    Icon: SiLinux,
    color: "#FCC624",
    url: "https://www.linux.org",
    tier: "secondary",
  },
  {
    label: "Nmap",
    Icon: NmapIcon as IconComponent,
    color: "#51A0D5",
    url: "https://nmap.org",
    tier: "secondary",
  },
] as const;

const TOOLS_AND_AI: readonly TechItem[] = [
  {
    label: "Claude",
    imageSrc: "/71e5edacdced21bdad944b9f545291bf.jpg",
    color: "#F97316",
    url: "https://claude.ai",
    tier: "secondary",
  },
  {
    label: "Docker Desktop",
    Icon: SiDocker,
    color: "#2496ED",
    url: "https://www.docker.com/products/docker-desktop/",
    tier: "secondary",
  },
  {
    label: "GitHub Copilot",
    imageSrc: "/copilot.png",
    color: "#ffffff",
    url: "https://github.com/features/copilot",
    tier: "primary",
  },
  {
    label: "GitHub",
    Icon: SiGithub,
    color: "#ffffff",
    url: "https://github.com",
    tier: "primary",
  },
  {
    label: "ChatGPT",
    Icon: OpenAIIcon as IconComponent,
    color: "#10A37F",
    url: "https://openai.com/gpt-4",
    tier: "secondary",
  },
  {
    label: "Gemini",
    Icon: GeminiIcon as IconComponent,
    color: "#8E75B2",
    url: "https://gemini.google.com",
    tier: "secondary",
  },
  {
    label: "Perplexity",
    Icon: PerplexityIcon as IconComponent,
    color: "#20808D",
    url: "https://www.perplexity.ai",
    tier: "secondary",
  },
  {
    label: "NotebookLM",
    imageSrc: "/notebooklm.png",
    color: "#ffffff",
    url: "https://notebooklm.google.com",
    tier: "secondary",
  },
  {
    label: "Sora",
    imageSrc: "/sora.png",
    color: "#3B82F6",
    url: "https://sora-2.org",
    tier: "secondary",
  },
  {
    label: "VS Code",
    imageSrc: "/vscode.png",
    color: "#007ACC",
    url: "https://code.visualstudio.com",
    tier: "secondary",
  },
  {
    label: "Jupyter",
    imageSrc: "/jupyter.png",
    color: "#F37726",
    url: "https://jupyter.org",
    tier: "secondary",
  },
  {
    label: "Notion",
    Icon: SiNotion,
    color: "#ffffff",
    url: "https://www.notion.so",
    tier: "secondary",
  },
] as const;

// ==========================================
// Sub-Components
// ==========================================

const TechIcon: FC<TechIconProps> = memo(({ item }) => {
  const iconClassName = `${ICON_SIZE.mobile} ${ICON_SIZE.desktop}`;

  if (item.imageSrc) {
    return (
      <Image
        src={item.imageSrc}
        alt={item.label}
        width={ICON_DIMENSIONS.width}
        height={ICON_DIMENSIONS.height}
        className={`${iconClassName} object-contain`}
        loading="lazy"
      />
    );
  }

  if (item.Icon) {
    return (
      <item.Icon
        className={iconClassName}
        style={{ color: item.color }}
        aria-hidden="true"
      />
    );
  }

  return null;
});

TechIcon.displayName = "TechIcon";

const TechLink: FC<{ readonly item: TechItem; readonly index: number }> = memo(
  ({ item, index }) => (
    <a
      key={`${item.label}-${index}`}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0 flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2 transition-all duration-300 min-w-[50px] sm:min-w-[60px] md:min-w-[70px]"
      aria-label={`${item.label} — 公式サイトへ`}
    >
      <div className="p-1.5">
        <TechIcon item={item} />
      </div>
      <span className="text-[8px] sm:text-[10px] md:text-xs font-medium text-center leading-tight max-w-[60px] sm:max-w-[80px] md:max-w-none truncate text-white/70">
        {item.label}
      </span>
    </a>
  ),
);

TechLink.displayName = "TechLink";

const MarqueeRow: FC<MarqueeRowProps> = memo(({ items, reverse = false }) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const repeatedItems = prefersReducedMotion
    ? items
    : Array.from({ length: MARQUEE_CONFIG.repeatCount }, () => items).flat();

  const animationClass = prefersReducedMotion
    ? ""
    : reverse
      ? "animate-marquee-reverse"
      : "animate-marquee";

  return (
    <div className="w-full overflow-hidden">
      <div
        className={`
          flex items-center ${MARQUEE_CONFIG.gap}
          will-change-transform hover:[animation-play-state:paused]
          ${animationClass}
          ${prefersReducedMotion ? "flex-wrap justify-center w-full" : "w-max"}
          py-2 px-2 overflow-visible
        `}
      >
        {repeatedItems.map((item, index) => (
          <TechLink key={`${item.label}-${index}`} item={item} index={index} />
        ))}
      </div>
    </div>
  );
});

MarqueeRow.displayName = "MarqueeRow";

// ==========================================
// Main Component
// ==========================================

const TechStackMarquee: FC = () => (
  <section
    className="w-full py-8 sm:py-12 md:py-20 mt-6 sm:mt-8 md:mt-12"
    aria-labelledby="tech-stack-title"
  >
    <div className="text-center mb-6 sm:mb-10 md:mb-16 px-4">
      <h2
        id="tech-stack-title"
        className="text-xl sm:text-2xl md:text-3xl font-bold text-white"
      >
        {SECTION_CONTENT.title}
      </h2>
      <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-white/50 max-w-md mx-auto">
        {SECTION_CONTENT.subtitle}
      </p>
    </div>

    <div className="space-y-4 sm:space-y-6 md:space-y-10">
      <MarqueeRow items={CORE_STACK} />
      <MarqueeRow items={TOOLS_AND_AI} reverse />
    </div>
  </section>
);

export default TechStackMarquee;
