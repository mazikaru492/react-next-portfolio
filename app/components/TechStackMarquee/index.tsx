import {
  SiNextdotjs,
  SiGithub,
  SiLinux,
  SiPython,
  SiMysql,
  SiNotion,
  SiHtml5,
  SiCss3,
  SiKalilinux,
} from "react-icons/si";
import Image from "next/image";
import type { ComponentType, SVGProps } from "react";

// ==========================================
// 公式アイコン（公式サイトから再現）
// ==========================================

// Google Gemini - 公式スパークルロゴ
const GeminiIcon = (props: SVGProps<SVGSVGElement>) => (
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

// OpenAI GPT - 公式ロゴ
const OpenAIIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
  </svg>
);

// Nmap - 公式ロゴ（目＋レーダー）
const NmapIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path
      d="M12 4C5.5 4 1 12 1 12s4.5 8 11 8 11-8 11-8-4.5-8-11-8z"
      fill="none"
      stroke="#51A0D5"
      strokeWidth="1.5"
    />
    <circle cx="12" cy="12" r="5" fill="none" stroke="#51A0D5" strokeWidth="1.2" />
    <circle cx="12" cy="12" r="3" fill="none" stroke="#51A0D5" strokeWidth="1" />
    <circle cx="12" cy="12" r="1.5" fill="#51A0D5" />
    <path d="M12 5v14M5 12h14" stroke="#51A0D5" strokeWidth="0.5" opacity="0.6" />
  </svg>
);

// Napkin AI - 公式ロゴ（3つの斜めバー）
const NapkinIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <rect x="4" y="4" width="4" height="14" rx="1" transform="rotate(-15 6 11)" fill="#6366F1" />
    <rect x="10" y="6" width="4" height="12" rx="1" transform="rotate(-15 12 12)" fill="#8B5CF6" />
    <rect x="16" y="8" width="4" height="10" rx="1" transform="rotate(-15 18 13)" fill="#A78BFA" />
  </svg>
);

// Perplexity AI - 公式ロゴ（Simple Icons）
const PerplexityIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.4904 0v7.0896H1.6023v10.3976h2.8882V24l6.932-6.3591v6.2005h1.1554v-6.0469l6.9318 6.1807v-6.4879h2.8882V7.0896zm-3.4657-4.531v4.531h-5.355l5.355-4.531zm-13.2862.0676 4.8691 4.4634H5.6458V2.6262zM2.7576 16.332V8.245h7.8476l-6.1149 6.1147v1.9723H2.7576zm2.8882 5.0404v-3.8852h.0001v-2.6488l5.7763-5.7764v7.0111l-5.7764 5.2993zm12.7086.0248-5.7766-5.1509V9.0618l5.7766 5.7766v6.5588zm2.8882-5.0652h-1.733v-1.9723L13.3948 8.245h7.8478v8.087z" />
  </svg>
);

// Jupyter - 公式ロゴ（オレンジの円弧とグレーのリング）
const JupyterIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 1.5c5.8 0 10.5 4.7 10.5 10.5S17.8 22.5 12 22.5 1.5 17.8 1.5 12 6.2 1.5 12 1.5z" fill="#767677" />
    <path d="M12 2.5c-1.5 0-2.9.35-4.15.97l.85 1.47A8.02 8.02 0 0112 4c1.17 0 2.28.25 3.3.69l.85-1.47A9.47 9.47 0 0012 2.5z" fill="#F37726" />
    <circle cx="4.5" cy="5" r="1.2" fill="#767677" />
    <circle cx="19" cy="18" r="1" fill="#767677" />
    <circle cx="17" cy="6" r=".8" fill="#767677" />
  </svg>
);

// GitHub Copilot - 公式ロゴ（メガネをかけたロボット顔）
const CopilotIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 1C7.03 1 3 5.03 3 10v4c0 2.21 1.79 4 4 4h1.5c.28 0 .5.22.5.5v2.5c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-2.5c0-.28.22-.5.5-.5H17c2.21 0 4-1.79 4-4v-4c0-4.97-4.03-9-9-9zm-4 11.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5 3c-.83 0-1.5-.45-1.5-1s.67-1 1.5-1 1.5.45 1.5 1-.67 1-1.5 1zm3-3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </svg>
);

// VSCode - 公式ロゴ（青い折れ曲がったライン）
const VSCodeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.583 0L8.958 8.25 3.5 4l-2.5 1.5v13l2.5 1.5 5.458-4.25L17.583 24l5.417-2.5V2.5L17.583 0zM6.375 15.25l-3.25-2.5v-1.5l3.25 2.5v1.5zm9.083-3.25L7 17.75v-2.5L13.5 12 7 8.75v-2.5l8.458 5.75z" fill="#007ACC" />
  </svg>
);

// Antigravity - カスタムロゴ（上向き矢印または浮遊するAマーク）
const AntigravityIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <defs>
      <linearGradient id="antigravity-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
    </defs>
    <path d="M12 2L3 20h4l1.5-4h7l1.5 4h4L12 2zm0 6l2.5 6h-5L12 8z" fill="url(#antigravity-grad)" />
    <path d="M12 2L9 6l3-1 3 1-3-4z" fill="#A855F7" opacity="0.6" />
  </svg>
);

// ==========================================
// Tech Stack データ
// ==========================================

type TechItem = {
  label: string;
  Icon?: ComponentType<{ className?: string; style?: React.CSSProperties }>;
  imageSrc?: string;  // PNG画像のパス
  color: string;
  url: string;
};

// ROW 1: AI & Development Tools
const ROW_1: TechItem[] = [
  {
    label: "NotebookLM",
    imageSrc: "/notebooklm.png",  // PNG画像を使用
    color: "#ffffff",
    url: "https://notebooklm.google.com",
  },
  {
    label: "Sora 2",
    imageSrc: "/sora.png",  // PNG画像を使用
    color: "#3B82F6",
    url: "https://sora-2.org",
  },
  {
    label: "Gemini",
    Icon: GeminiIcon as ComponentType<{ className?: string }>,
    color: "#8E75B2",
    url: "https://gemini.google.com",
  },
  {
    label: "GPT",
    Icon: OpenAIIcon as ComponentType<{ className?: string }>,
    color: "#10A37F",
    url: "https://openai.com/gpt-4",
  },
  {
    label: "MySQL",
    Icon: SiMysql,
    color: "#4479A1",
    url: "https://www.mysql.com",
  },
  {
    label: "Next.js",
    Icon: SiNextdotjs,
    color: "#ffffff",
    url: "https://nextjs.org",
  },
  {
    label: "Python",
    Icon: SiPython,
    color: "#3776AB",
    url: "https://www.python.org",
  },
  {
    label: "Kali Linux",
    Icon: SiKalilinux,
    color: "#557C94",
    url: "https://www.kali.org",
  },
];

// ROW 2: Web & Security Tools
const ROW_2: TechItem[] = [
  {
    label: "HTML5",
    Icon: SiHtml5,
    color: "#E34F26",
    url: "https://developer.mozilla.org/docs/Web/HTML",
  },
  {
    label: "CSS3",
    Icon: SiCss3,
    color: "#1572B6",
    url: "https://developer.mozilla.org/docs/Web/CSS",
  },
  {
    label: "Notion",
    Icon: SiNotion,
    color: "#ffffff",
    url: "https://www.notion.so",
  },
  {
    label: "GitHub",
    Icon: SiGithub,
    color: "#ffffff",
    url: "https://github.com",
  },
  {
    label: "Linux",
    Icon: SiLinux,
    color: "#FCC624",
    url: "https://www.linux.org",
  },
  {
    label: "Nmap",
    Icon: NmapIcon as ComponentType<{ className?: string }>,
    color: "#51A0D5",
    url: "https://nmap.org",
  },
  {
    label: "Napkin AI",
    Icon: NapkinIcon as ComponentType<{ className?: string }>,
    color: "#8B5CF6",
    url: "https://app.napkin.ai",
  },
  {
    label: "Perplexity",
    Icon: PerplexityIcon as ComponentType<{ className?: string }>,
    color: "#20808D",
    url: "https://www.perplexity.ai",
  },
  {
    label: "ジュピター",
    Icon: JupyterIcon as ComponentType<{ className?: string }>,
    color: "#F37726",
    url: "https://jupyter.org",
  },
  {
    label: "GitHubコパイロット",
    Icon: CopilotIcon as ComponentType<{ className?: string }>,
    color: "#ffffff",
    url: "https://github.com/features/copilot",
  },
  {
    label: "VSCode",
    Icon: VSCodeIcon as ComponentType<{ className?: string }>,
    color: "#007ACC",
    url: "https://code.visualstudio.com",
  },
  {
    label: "Antigravity",
    Icon: AntigravityIcon as ComponentType<{ className?: string }>,
    color: "#A855F7",
    url: "https://blog.google/products/gemini/google-antigravity/",
  },
];

// ==========================================
// コンポーネント
// ==========================================

function MarqueeRow({ items, reverse }: { items: TechItem[]; reverse?: boolean }) {
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className="w-full overflow-hidden">
      <div
        className={`flex w-max items-center gap-6 md:gap-16 will-change-transform hover:[animation-play-state:paused] ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {repeated.map((item, i) => (
          <a
            key={`${item.label}-${i}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex flex-col items-center gap-1.5 md:gap-2 opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300"
          >
            {item.imageSrc ? (
              <Image
                src={item.imageSrc}
                alt={item.label}
                width={44}
                height={44}
                className="h-8 w-8 md:h-11 md:w-11 object-contain"
              />
            ) : item.Icon ? (
              <item.Icon
                className="h-8 w-8 md:h-11 md:w-11"
                style={{ color: item.color }}
                aria-hidden
              />
            ) : null}
            <span className="text-[10px] md:text-xs font-medium text-gray-400">
              {item.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function TechStackMarquee() {
  return (
    <section className="w-full py-6 md:py-12">
      <div className="text-center mb-6 md:mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Tech Stack
        </h2>
        <p className="mt-2 text-sm text-white/50">
          日々使用している技術・ツール
        </p>
      </div>

      <div className="space-y-4 md:space-y-8">
        <MarqueeRow items={ROW_1} />
        <MarqueeRow items={ROW_2} reverse />
      </div>
    </section>
  );
}
