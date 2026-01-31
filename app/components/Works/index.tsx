import styles from "./index.module.css";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import type { FC, ReactNode } from "react";

// ==========================================
// Type Definitions
// ==========================================

interface Work {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly image?: string;
  readonly technologies: readonly string[];
  readonly githubUrl?: string;
  readonly demoUrl?: string;
}

interface ExternalLinkProps {
  readonly href: string;
  readonly label: string;
  readonly icon: ReactNode;
  readonly text: string;
}

interface WorkCardProps {
  readonly work: Work;
}

// ==========================================
// Constants
// ==========================================

const WORKS_DATA: readonly Work[] = [
  {
    id: "1",
    title: "サンプルプロジェクト1",
    description:
      "プロジェクトの説明文をここに記載します。どのような機能があるか、何を解決するかなどを書きます。",
    technologies: ["React", "TypeScript", "Next.js"],
    githubUrl: "https://github.com/username/project1",
    demoUrl: "https://demo.example.com",
  },
  {
    id: "2",
    title: "サンプルプロジェクト2",
    description:
      "別のプロジェクトの説明文です。作成した背景や使用した技術について説明します。",
    technologies: ["Python", "Flask", "PostgreSQL"],
    githubUrl: "https://github.com/username/project2",
  },
  {
    id: "3",
    title: "サンプルプロジェクト3",
    description:
      "さらに別のプロジェクトです。ユニークな機能や工夫した点をアピールしましょう。",
    technologies: ["JavaScript", "Node.js", "MongoDB"],
    githubUrl: "https://github.com/username/project3",
    demoUrl: "https://demo3.example.com",
  },
] as const;

const SECTION_CONTENT = {
  title: "Works",
  subtitle: "制作したプログラム・プロジェクト",
} as const;

// ==========================================
// Sub Components
// ==========================================

const ExternalLink: FC<ExternalLinkProps> = ({ href, label, icon, text }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={styles.link}
    aria-label={label}
  >
    {icon}
    <span>{text}</span>
  </a>
);

const TechBadge: FC<{ tech: string }> = ({ tech }) => (
  <span className={styles.techBadge}>{tech}</span>
);

const WorkCard: FC<WorkCardProps> = ({ work }) => {
  const { title, description, technologies, githubUrl, demoUrl } = work;

  return (
    <article className={styles.card}>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>

        <div className={styles.technologies}>
          {technologies.map((tech) => (
            <TechBadge key={tech} tech={tech} />
          ))}
        </div>

        <div className={styles.links}>
          {githubUrl && (
            <ExternalLink
              href={githubUrl}
              label={`${title}のGitHubリポジトリ`}
              icon={<FaGithub aria-hidden />}
              text="GitHub"
            />
          )}
          {demoUrl && (
            <ExternalLink
              href={demoUrl}
              label={`${title}のデモサイト`}
              icon={<FaExternalLinkAlt aria-hidden />}
              text="Demo"
            />
          )}
        </div>
      </div>
    </article>
  );
};

// ==========================================
// Main Component
// ==========================================

const Works: FC = () => (
  <section className={styles.container}>
    <h2 className={styles.title}>{SECTION_CONTENT.title}</h2>
    <p className={styles.subtitle}>{SECTION_CONTENT.subtitle}</p>

    <div className={styles.grid}>
      {WORKS_DATA.map((work) => (
        <WorkCard key={work.id} work={work} />
      ))}
    </div>
  </section>
);

export default Works;
