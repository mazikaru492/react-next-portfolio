import styles from "./index.module.css";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import type { FC, ReactNode } from "react";
import type { Work } from "@/app/lids/microcms";

// ==========================================
// Type Definitions
// ==========================================

interface ExternalLinkProps {
  readonly href: string;
  readonly label: string;
  readonly icon: ReactNode;
  readonly text: string;
}

interface WorkCardProps {
  readonly work: Work;
}

interface WorksProps {
  readonly works: readonly Work[];
}

// ==========================================
// Constants
// ==========================================

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

const Works: FC<WorksProps> = ({ works }) => (
  <section className={styles.container}>
    <h2 className={styles.title}>{SECTION_CONTENT.title}</h2>
    <p className={styles.subtitle}>{SECTION_CONTENT.subtitle}</p>

    {works.length > 0 ? (
      <div className={styles.grid}>
        {works.map((work) => (
          <WorkCard key={work.id} work={work} />
        ))}
      </div>
    ) : (
      <p className={styles.subtitle}>現在、制作物はありません</p>
    )}
  </section>
);

export default Works;
