import styles from "./index.module.css";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

type Work = {
  id: string;
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
};

// ここに作品データを追加してください
const works: Work[] = [
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
];

export default function Works() {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Works</h2>
      <p className={styles.subtitle}>制作したプログラム・プロジェクト</p>

      <div className={styles.grid}>
        {works.map((work) => (
          <article key={work.id} className={styles.card}>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{work.title}</h3>
              <p className={styles.cardDescription}>{work.description}</p>

              <div className={styles.technologies}>
                {work.technologies.map((tech) => (
                  <span key={tech} className={styles.techBadge}>
                    {tech}
                  </span>
                ))}
              </div>

              <div className={styles.links}>
                {work.githubUrl && (
                  <a
                    href={work.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                    aria-label={`${work.title}のGitHubリポジトリ`}
                  >
                    <FaGithub />
                    <span>GitHub</span>
                  </a>
                )}
                {work.demoUrl && (
                  <a
                    href={work.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                    aria-label={`${work.title}のデモサイト`}
                  >
                    <FaExternalLinkAlt />
                    <span>Demo</span>
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
