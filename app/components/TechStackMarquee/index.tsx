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
import type { ComponentType, SVGProps } from "react";

type Item = {
  label: string;
  Icon: ComponentType<{ className?: string }>;
  colorClass: string;
  url: string;
};

// NotebookLM - Google公式スタイルのノートブックアイコン
const NotebookLMIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
    <path d="M7 7h10v2H7zM7 11h10v2H7zM7 15h7v2H7z" opacity="0.6" />
    <circle cx="18" cy="18" r="4" fill="#4285F4" />
    <path d="M17.2 16.8l1.6 2.4M18.8 16.8l-1.6 2.4" stroke="white" strokeWidth="0.8" fill="none" />
  </svg>
);

// Sora 2 - OpenAI公式スタイルのビデオ生成アイコン
const Sora2Icon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

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
        <stop offset="25%" stopColor="#9B72CB" />
        <stop offset="50%" stopColor="#D96570" />
        <stop offset="75%" stopColor="#D96570" />
        <stop offset="100%" stopColor="#4285F4" />
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

// Nmap - ネットワークスキャンロゴ
const NmapIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 6v2M12 16v2M6 12h2M16 12h2" stroke="currentColor" strokeWidth="2" />
    <path d="M8.46 8.46l1.42 1.42M14.12 14.12l1.42 1.42M8.46 15.54l1.42-1.42M14.12 9.88l1.42-1.42" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

// NaokinAI - モダンAIロゴ
const NaokinAIIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.18l6.5 3.64v7.27L12 18.73l-6.5-3.64V7.82L12 4.18z" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 6v2M12 16v2M6.5 9l1.73 1M15.77 14l1.73 1M6.5 15l1.73-1M15.77 10l1.73-1" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

// Perplexity.ai - 公式アスタリスクロゴ
const PerplexityIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2v8.5M12 13.5V22M2 12h8.5M13.5 12H22M4.93 4.93l6.01 6.01M13.06 13.06l6.01 6.01M4.93 19.07l6.01-6.01M13.06 10.94l6.01-6.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

// 全16項目のTech Stack
// ROW_1: NotebookLM, Sora 2, Gemini, GPT, MySQL, Next.js, Python, Kali Linux
const ROW_1: Item[] = [
  {
    label: "NotebookLM",
    Icon: NotebookLMIcon as ComponentType<{ className?: string }>,
    colorClass: "text-[#4285F4]", // Google Blue
    url: "https://notebooklm.google.com",
  },
  {
    label: "Sora 2",
    Icon: Sora2Icon as ComponentType<{ className?: string }>,
    colorClass: "text-[#10A37F]", // OpenAI Green
    url: "https://openai.com/sora",
  },
  {
    label: "Gemini",
    Icon: GeminiIcon as ComponentType<{ className?: string }>,
    colorClass: "text-white", // Gradient inside
    url: "https://gemini.google.com",
  },
  {
    label: "GPT",
    Icon: OpenAIIcon as ComponentType<{ className?: string }>,
    colorClass: "text-[#10A37F]", // OpenAI Green
    url: "https://openai.com/gpt-4",
  },
  {
    label: "MySQL",
    Icon: SiMysql,
    colorClass: "text-[#4479A1]", // MySQL Blue
    url: "https://www.mysql.com",
  },
  {
    label: "Next.js",
    Icon: SiNextdotjs,
    colorClass: "text-white",
    url: "https://nextjs.org",
  },
  {
    label: "Python",
    Icon: SiPython,
    colorClass: "text-[#3776AB]", // Python Blue
    url: "https://www.python.org",
  },
  {
    label: "Kali Linux",
    Icon: SiKalilinux,
    colorClass: "text-[#557C94]", // Kali Blue
    url: "https://www.kali.org",
  },
];

// ROW_2: HTML5, CSS, Notion, GitHub, Linux, Nmap, NaokinAI, PerplexityAI
const ROW_2: Item[] = [
  {
    label: "HTML5",
    Icon: SiHtml5,
    colorClass: "text-[#E34F26]", // HTML5 Orange
    url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
  },
  {
    label: "CSS",
    Icon: SiCss3,
    colorClass: "text-[#1572B6]", // CSS3 Blue
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
  },
  {
    label: "Notion",
    Icon: SiNotion,
    colorClass: "text-white",
    url: "https://www.notion.so",
  },
  {
    label: "GitHub",
    Icon: SiGithub,
    colorClass: "text-white",
    url: "https://github.com",
  },
  {
    label: "Linux",
    Icon: SiLinux,
    colorClass: "text-[#FCC624]", // Tux Yellow
    url: "https://www.linux.org",
  },
  {
    label: "Nmap",
    Icon: NmapIcon as ComponentType<{ className?: string }>,
    colorClass: "text-[#00A86B]", // Nmap Green
    url: "https://nmap.org",
  },
  {
    label: "NaokinAI",
    Icon: NaokinAIIcon as ComponentType<{ className?: string }>,
    colorClass: "text-[#8B5CF6]", // Violet
    url: "#",
  },
  {
    label: "PerplexityAI",
    Icon: PerplexityIcon as ComponentType<{ className?: string }>,
    colorClass: "text-[#20808D]", // Perplexity Teal
    url: "https://www.perplexity.ai",
  },
];

function MarqueeRow({ items, reverse }: { items: Item[]; reverse?: boolean }) {
  const repeated = Array(20).fill(items).flat();

  return (
    <div className="w-full overflow-hidden">
      <div
        className={
          "flex w-max items-center gap-3 md:gap-16 will-change-transform hover:[animation-play-state:paused] " +
          (reverse ? "animate-marquee-reverse" : "animate-marquee")
        }
      >
        {repeated.map((item, index) => {
          if (!item.Icon) {
            console.warn(`Icon is undefined for item: ${item.label}`);
            return null;
          }

          return (
            <a
              key={`${item.label}-${index}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex flex-col items-center justify-center no-underline opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-300"
            >
              <item.Icon
                className={`h-9 w-9 md:h-12 md:w-12 ${item.colorClass}`}
                aria-hidden
              />
              <span className="text-[10px] md:text-sm font-medium text-gray-300 mt-1 md:mt-2">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default function TechStackMarquee() {
  return (
    <section className="w-full max-w-none py-4 md:py-10">
      <div className="mx-auto w-full max-w-none px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Tech Stack
          </h2>
          <p className="mt-2 text-sm text-white/60"></p>
          <br></br>
        </div>

        <div className="mt-4 md:mt-8 w-full max-w-none space-y-3 md:space-y-6">
          <MarqueeRow items={ROW_1} />
          <br></br>
          <MarqueeRow items={ROW_2} reverse />
        </div>
      </div>
    </section>
  );
}
