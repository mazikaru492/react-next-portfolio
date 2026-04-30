# Project Guide: my-next-project

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

#### 3.2 クライアント情報・個人情報の公開

**禁止行為：**

- クライアント名・企業名をパブリックコードに記載
- ユーザーのメールアドレス・電話番号を README や config に公開
- 本人の住所・実名を不注意で含める
- AWS Account ID、Vercel Project ID を public リポに記載
- デバッグ時の実データを GitHub に push する

**正しいやり方：**

- クライアント識別子は環境変数化
- 機密データはサーバーサイドのみで処理
- README は一般向けの説明のみ
- 開発時の test data は `.gitignore` に除外

#### 3.3 本番環境への無断アクセス・変更

**禁止行為：**

- 本番 DB に直接 SQL 実行
- Vercel Production Environment を開発テスト用に使用
- 本番 API key でローカル開発
- 本番データベース（MicroCMS 本番サーバー）を削除・修正
- 本番デプロイ前に十分なテストを行わない

**正しいやり方：**

- 開発は本番と独立した環境で実施
- Vercel Preview Environment でテスト
- MicroCMS のスキーマ変更は事前に確認
- Deploy 前に `npm run build && npm start` でローカル確認

#### 3.4 依存関係・パッケージの不正な操作

**禁止行為：**

- `npm install` で出たセキュリティ警告を無視したまま commit
- 不明なパッケージを無断で追加
- `package-lock.json` を手動で編集
- 古い脆弱性のあるバージョンを使い続ける
- Node バージョン（>=20 <25）を守らない

**正しいやり方：**

- セキュリティ警告は定期的に `npm audit fix` で解決
- 新しいパッケージは README に記載・チームで確認
- `npm audit` を CI/CD に組み込む
- Node バージョンは `.nvmrc` または `package.json` engines で指定

#### 3.5 型安全性・構文エラーの放置

**禁止行為：**

- `any` 型を多用（型の意味がない）
- TypeScript エラーを `// @ts-ignore` で黙殺
- 未定義変数・関数を使用
- コンポーネントの props 型を定義しない
- エラーハンドリングなしで API 呼び出し

**正しいやり方：**

- 常に `tsconfig.json` で strict: true
- 型推論が効くように十分な型情報を提供
- `// @ts-expect-error` は最小限に・コメント付き
- エラーハウンダリー（Error Boundary）を配置
- API 呼び出しは try-catch で保護

#### 3.6 スタイリング・レイアウトの競合

**禁止行為：**

- CSS Modules と Tailwind を混在させて競合を起こす
- グローバル CSS を無制限に追加
- `!important` の過剰使用
- 未使用な CSS を削除しない
- ブレークポイント（Tailwind）を一貫性なく使用

**正しいやり方：**

- スタイル責務を明確に（Tailwind か CSS Modules かを決める）
- 現在のプロジェクト方針：**Tailwind + CSS Modules（コンポーネント固有スタイル）**
- グローバルスタイルは `globals.css` のみ
- PurgeCSS（Tailwind）が未使用クラスを自動削除

#### 3.7 Next.js App Router 特有の誤り

**禁止行為：**

- `pages/` ディレクトリを App Router と混在させる
- Server Component 内で `useState` や `useContext` を使用
- Client Component で直接 DB 接続
- `getStaticProps` / `getServerSideProps` を使用（Pages Router 専用）
- ダイナミックルート `[slug]` でデータベースクエリを毎回実行

**正しいやり方：**

- App Router のみを使用（`app/` ディレクトリ）
- `'use client'` でクライアント側を明示
- API Route 経由でサーバー処理
- ISR / Streaming を活用してパフォーマンス向上

#### 3.8 セキュリティ・認証の落とし穴

**禁止行為：**

- Basic Auth（nextjs-basic-auth-middleware）パスワードを平文保存
- CORS を `*` に設定
- SQL Injection / XSS 脆弱性を放置
- `sanitize-html` なしで UGC（ユーザー生成コンテンツ）を表示
- CSRF トークンなしでフォーム送信

**正しいやり方：**

- Basic Auth パスワードは環境変数化（ハッシュ化を検討）
- CORS は必要なオリジンのみホワイトリスト
- MicroCMS から取得した HTML は `sanitize-html` で処理
- お問い合わせフォームは Server Action で検証

#### 3.9 デプロイ・CI/CD の失敗

**禁止行為：**

- `npm run build` が失敗したまま Vercel に push
- 型エラーをそのまま本番に
- lint エラーを無視して commit
- マイグレーション（DB スキーマ変更）を未実施
- 環境変数設定忘れで本番エラー

**正しいやり方：**

- ローカルで必ず `npm run build` をテスト
- `npm run lint` でコード品質確認
- Vercel Preview Environment で本番相当の動作確認
- 環境変数は Vercel Settings で確認・セット
- デプロイ後は `/api/ping` で疎通確認

#### 3.10 コード品質・メンテナンス性

**禁止行為：**

- コメントなしで複雑なロジック記述
- コンポーネント内で複数責務を混在
- 魔法の数字（magic number）を直書き
- ファイル名を日本語混在で不統一（×`作ったもの/page.tsx`）
- 変数名が短すぎて意図が不明（×`d`, `fn`, `c`）

**正しいやり方：**

- 複雑な処理は `lids/utils.ts` に共通化
- 1 コンポーネント = 1 責務（Single Responsibility Principle）
- 定数は `constants/index.ts` に集約
- ファイル名は英語で統一（URL パスも）
- 変数名は意図が明確（`userData`, `fetchArticleBySlug`）

---

## 4. 緊急時のチェックリスト

本番環境で問題が発生した場合：

- [ ] Vercel のログを確認（Build / Runtime）
- [ ] 環境変数が全て設定されているか確認
- [ ] MicroCMS API 疎通確認（`/api/ping`）
- [ ] GitHub API rate limit 確認
- [ ] ブラウザ DevTools でエラー確認
- [ ] `.env.local` をコミットしていないか確認
- [ ] Node バージョンが >=20 <25 か確認
- [ ] `npm audit` で脆弱性チェック

---

## 5. コマンドリファレンス

```bash
# 開発サーバー起動（通常）
npm run dev

# 開発サーバー起動（Turbo モード - 高速）
npm run dev:turbo

# ビルド（本番想定）
npm run build

# 本番サーバー起動（ビルド後）
npm start

# Lint チェック
npm run lint

# 脆弱性チェック
npm audit

# 脆弱性修正
npm audit fix
```

---

**最終確認日：2026年4月30日**
**作成者：Claude Code Agent**
