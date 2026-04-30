CLAUDE.md
Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

Tradeoff: These guidelines bias toward caution over speed. For trivial tasks, use judgment.

1. Think Before Coding
   Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

State your assumptions explicitly. If uncertain, ask.
If multiple interpretations exist, present them - don't pick silently.
If a simpler approach exists, say so. Push back when warranted.
If something is unclear, stop. Name what's confusing. Ask. 2. Simplicity First
Minimum code that solves the problem. Nothing speculative.

No features beyond what was asked.
No abstractions for single-use code.
No "flexibility" or "configurability" that wasn't requested.
No error handling for impossible scenarios.
If you write 200 lines and it could be 50, rewrite it.
Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

3. Surgical Changes
   Touch only what you must. Clean up only your own mess.

When editing existing code:

Don't "improve" adjacent code, comments, or formatting.
Don't refactor things that aren't broken.
Match existing style, even if you'd do it differently.
If you notice unrelated dead code, mention it - don't delete it.
When your changes create orphans:

Remove imports/variables/functions that YOUR changes made unused.
Don't remove pre-existing dead code unless asked.
The test: Every changed line should trace directly to the user's request.

4. Goal-Driven Execution
   Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

"Add validation" → "Write tests for invalid inputs, then make them pass"
"Fix the bug" → "Write a test that reproduces it, then make it pass"
"Refactor X" → "Ensure tests pass before and after"
For multi-step tasks, state a brief plan:

1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
   Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

These guidelines are working if: fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come

---

## Project-Specific: my-next-project

**For detailed project information, refer to [PROJECT-GUIDE.md](../PROJECT-GUIDE.md)**

### Quick Reference

- **Tech Stack**: Next.js 16, TypeScript, React 19, Tailwind CSS v4, MicroCMS
- **Architecture**: App Router (pages in `app/`), Server Components, API Routes
- **Key APIs**: MicroCMS, GitHub API
- **Hosting**: Vercel

### Critical Do's & Don'ts

✅ **DO:**

- Use TypeScript strict mode
- Store secrets in `.env.local` (never commit)
- Test builds locally before pushing: `npm run build`
- Keep CSS Modules scoped to components
- Use Server Actions for form handling

❌ **DON'T:**

- Commit `.env.local` or API keys
- Use `any` type without clear reason
- Access production DB directly
- Mix Pages Router with App Router
- Ignore TypeScript/lint errors in production builds

See `PROJECT-GUIDE.md` → **Section 3: 禁止事項** for detailed rules.

## 1. プロジェクト概要

**Next.js + TypeScript + Tailwind CSS で構築した個人ポートフォリオ・ブログサイト。MicroCMS と GitHub API を連携し、ニュース・作品・プロフィール情報を動的に表示。Vercel にホスト。**

### 技術スタック

| 項目                       | 選択肢                        |
| -------------------------- | ----------------------------- |
| **フレームワーク**         | Next.js 16 (App Router)       |
| **言語**                   | TypeScript                    |
| **UI**                     | React 19                      |
| **スタイリング**           | Tailwind CSS v4 + CSS Modules |
| **CMS**                    | MicroCMS                      |
| **外部API**                | GitHub API                    |
| **ホスティング**           | Vercel                        |
| **パッケージマネージャー** | npm                           |
| **Node バージョン**        | >=20 <25                      |

### 主要機能

- ポートフォリオ表示（ニュース・作品・プロフィール）
- MicroCMS からコンテンツ取得
- GitHub 連携（コントリビューション表示）
- 検索・カテゴリーフィルタリング
- レスポンシブデザイン
- 認証ミドルウェア（基本認証対応）

---

## 2. ディレクトリマップ

```
my-next-project/
├── .claude/
│   ├── claude.md                    # Claude Code 行動ガイドライン
│   └── skills/
│       └── find-skills/
│           └── SKILL.md             # スキル検索ガイド
├── app/                             # Next.js App Router メインディレクトリ
│   ├── layout.tsx                   # ルートレイアウト
│   ├── page.tsx                     # トップページ
│   ├── globals.css                  # グローバルスタイル
│   ├── api/                         # API ルート
│   │   └── ping/route.ts            # ヘルスチェック
│   ├── actions/                     # サーバーアクション
│   ├── components/                  # React コンポーネント
│   │   ├── Header/                  # ヘッダー
│   │   ├── Footer/                  # フッター
│   │   ├── Menu/
│   │   │   └── Hero/                # ヒーロー表示
│   │   ├── Article/                 # 記事コンポーネント
│   │   ├── Category/                # カテゴリーフィルタ
│   │   ├── ContactForm/             # お問い合わせ
│   │   ├── Data/                    # データ表示
│   │   ├── GitHubContributions/     # GitHub連携
│   │   ├── GitHubTechShowcase/      # 技術スタック表示
│   │   ├── NewsList/                # ニュース一覧
│   │   ├── Pagination/              # ページネーション
│   │   ├── Profile/                 # プロフィール
│   │   ├── SearchField/             # 検索フィールド
│   │   ├── ShootingGame/            # ゲーム要素
│   │   ├── TechStackMarquee/        # 技術スタック表示
│   │   ├── Works/                   # 作品一覧
│   │   ├── sheet/                   # UI シート
│   │   ├── DesktopOnly/             # デスクトップ限定表示
│   │   └── OnlineStatusDot/         # オンライン状態表示
│   ├── constants/
│   │   └── index.ts                 # グローバル定数
│   ├── lids/                        # ロジック・データ取得
│   │   ├── github.ts                # GitHub API 連携
│   │   ├── microcms.ts              # MicroCMS API 連携
│   │   └── utils.ts                 # ユーティリティ関数
│   ├── news/                        # ニュース関連ページ
│   │   ├── page.tsx                 # ニュース一覧
│   │   ├── layout.tsx
│   │   ├── [slug]/                  # 記事詳細
│   │   ├── category/[id]/           # カテゴリーフィルタ
│   │   ├── search/                  # 検索結果
│   │   └── p/[current]/             # ページネーション
│   ├── works/                       # 作品ページ
│   │   ├── page.tsx
│   │   ├── [slug]/                  # 作品詳細
│   │   └── layout.tsx
│   ├── profile/                     # プロフィールページ
│   ├── members/                     # メンバーページ
│   ├── contact/                     # お問い合わせ
│   ├── contect/                     # 別フォーム（typo 注意）
│   └── 作ったもの/                  # ポートフォリオ（日本語パス）
├── public/                          # 静的アセット
│   └── kali-terminal-portfolio.html # 特殊コンテンツ
├── .env.local                       # ローカル環境変数（.gitignore）
├── .env.example                     # 環境変数テンプレート
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.mjs
├── next.config.ts
├── tailwind.config.js
├── postcss.config.mjs
├── eslint.config.mjs
├── css-modules.d.ts                 # CSS Modules 型定義
├── next-env.d.ts
├── proxy.ts                         # プロキシ設定
├── README.md
├── PROJECT-GUIDE.md                 # このファイル
└── skills-lock.json                 # スキル管理ロック

```

### 主要ディレクトリの役割

| ディレクトリ      | 説明                                                                     |
| ----------------- | ------------------------------------------------------------------------ |
| `app/`            | Next.js App Router (v13+)。ページとレイアウト、API、コンポーネントを集約 |
| `app/components/` | 再利用可能な React コンポーネント。CSS Modules で スコープ付きスタイル   |
| `app/lids/`       | API 呼び出し・データ取得ロジック（GitHub、MicroCMS）                     |
| `app/api/`        | Next.js API Route。バックエンド処理                                      |
| `app/actions/`    | Server Actions。フォーム送信など                                         |
| `public/`         | 静的ファイル。直接配信                                                   |
| `.claude/`        | Claude Code エージェント向けドキュメント・スキル                         |

---

## 3. 禁止事項（Critical Rules）

### ⛔ 絶対にやってはいけないこと

#### 3.1 環境変数・認証情報の露出

**禁止行為：**

- `.env.local` や `.env.production.local` をコミットする
- API キー、シークレットキーを コード内に記述する
- GitHub token、MicroCMS API キーをコメントや console.log に残す
- AWS、Vercel などの認証情報をログに出力する

**正しいやり方：**

- 環境変数は `.env.example` にテンプレートのみ記載（値は含めない）
- `process.env` または `process.env.NEXT_PUBLIC_*` で参照
- ローカル開発時は `.env.local` で管理（.gitignore に追加済み）
- CI/CD では Vercel Environment Variables を使用

**確認コマンド：**

```bash
git status  # コミット前に .env* ファイルが含まれていないか確認
```
