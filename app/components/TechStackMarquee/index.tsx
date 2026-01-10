import {
  SiNextdotjs,
  SiGithub,
  SiLinux,
  SiPython,
  SiMysql,
  SiNotion,
  SiHtml5,
  SiCss3,
} from "react-icons/si";
import { FaBook, FaVideo, FaBrain, FaRobot, FaTerminal } from "react-icons/fa";
import type { ComponentType } from "react";

type Item = {
  label: string;
  Icon: ComponentType<{ className?: string }>;
  colorClass: string;
  url: string;
};

// 指定リスト: NotebookLM, Sora 2, Gemini, GPT, MySQL, Next.js, Python, Kali Linux, HTML5, CSS, Notion, GitHub, Linux, Nmap
const ROW_1: Item[] = [
  {
    label: "NotebookLM",
    Icon: FaBook,
    colorClass: "text-blue-400",
    url: "https://notebooklm.google.com",
  },
  {
    label: "Sora 2",
    Icon: FaVideo,
    colorClass: "text-purple-400",
    url: "https://openai.com/sora",
  },
  {
    label: "Gemini",
    Icon: FaBrain,
    colorClass: "text-cyan-400",
    url: "https://gemini.google.com",
  },
  {
    label: "GPT",
    Icon: FaRobot,
    colorClass: "text-emerald-400",
    url: "https://openai.com/gpt-4",
  },
  {
    label: "MySQL",
    Icon: SiMysql,
    colorClass: "text-blue-500",
    url: "https://www.mysql.com",
  },
  {
    label: "Next.js",
    Icon: SiNextdotjs,
    colorClass: "text-zinc-100",
    url: "https://nextjs.org",
  },
  {
    label: "Python",
    Icon: SiPython,
    colorClass: "text-yellow-300",
    url: "https://www.python.org",
  },
];

const ROW_2: Item[] = [
  {
    label: "Kali Linux",
    Icon: SiLinux,
    colorClass: "text-blue-400",
    url: "https://www.kali.org",
  },
  {
    label: "HTML5",
    Icon: SiHtml5,
    colorClass: "text-orange-500",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
  },
  {
    label: "CSS",
    Icon: SiCss3,
    colorClass: "text-blue-400",
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
  },
  {
    label: "Notion",
    Icon: SiNotion,
    colorClass: "text-zinc-100",
    url: "https://www.notion.so",
  },
  {
    label: "GitHub",
    Icon: SiGithub,
    colorClass: "text-zinc-200",
    url: "https://github.com",
  },
  {
    label: "Linux",
    Icon: SiLinux,
    colorClass: "text-amber-200",
    url: "https://www.linux.org",
  },
  {
    label: "Nmap",
    Icon: FaTerminal,
    colorClass: "text-green-400",
    url: "https://nmap.org",
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
