# react-next-portfolio

Next.js + TypeScript + Tailwind CSS で構築した個人ポートフォリオ・ブログサイトです。  
MicroCMS と GitHub API を連携し、ニュース・作品・プロフィール情報を動的に表示します。

## 技術スタック

| 項目 | 内容 |
|---|---|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript 5 |
| UI | React 19 |
| スタイリング | Tailwind CSS v4 + CSS Modules |
| CMS | MicroCMS (`microcms-js-sdk`) |
| 外部 API | GitHub API |
| ホスティング | Vercel |
| パッケージマネージャー | npm |
| Node.js | 22.23.4以降の22.x |

## 主な機能

- プロフィール・経歴タイムライン表示
- GitHub Contributions（草）表示
- GitHub 技術スタックショーケース
- Tech Stack マーキーアニメーション
- ニュース記事一覧・詳細・カテゴリーフィルタ・検索・ページネーション（MicroCMS）
- 作品一覧・詳細（MicroCMS）
- お問い合わせフォーム（Server Actions）
- リアルタイム時刻連動の自然背景アニメーション（太陽/月の位置・空の色）
- レスポンシブデザイン・モバイル最適化
- 基本認証ミドルウェア対応

## セットアップ

### 1. Node.jsと依存関係のインストール

```bash
nvm install
nvm use
npm ci
```

### 2. 環境変数の設定

`.env.example` を参考に `.env.local` を作成してください。

```bash
copy .env.example .env.local   # Windows
# cp .env.example .env.local   # Mac/Linux
```

| 変数名 | 説明 | 必須 |
|---|---|---|
| `MICROCMS_SERVICE_DOMAIN` | MicroCMS のサービスドメイン | 本番環境では必須 |
| `MICROCMS_API_KEY` | MicroCMS の API キー | 本番環境では必須 |
| `GITHUB_USERNAME` | GitHub ユーザー名 | 任意（デフォルト: mazikaru492） |
| `GITHUB_TOKEN` | GitHub Personal Access Token（`read:user` スコープ） | 任意 |

> ローカル開発では MicroCMS の設定がなくても起動できます（空データでフォールバック表示）。  
> GitHub トークン未設定の場合は外部 SVG によるフォールバック表示になります。

## 開発

```bash
# 開発サーバー（webpack）
npm run dev

# 開発サーバー（Turbopack）
npm run dev:turbo

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# Lint
npm run lint
```

ブラウザで http://localhost:3000 を開いて確認できます。

## ディレクトリ構成

```
my-next-project/
├── app/
│   ├── layout.tsx                    # ルートレイアウト
│   ├── page.tsx                      # トップページ
│   ├── globals.css                   # グローバルスタイル・CSS 変数
│   ├── api/
│   │   └── ping/route.ts             # ヘルスチェック API
│   ├── actions/                      # Server Actions（フォーム送信など）
│   ├── components/
│   │   ├── Article/                  # 記事本文レンダリング
│   │   ├── ButtonLink/               # リンクボタン
│   │   ├── Category/                 # カテゴリーフィルタ
│   │   ├── ContactForm/              # お問い合わせフォーム
│   │   ├── Data/                     # データ表示ユーティリティ
│   │   ├── DesktopOnly/              # デスクトップ限定ラッパー
│   │   ├── Footer/                   # フッター
│   │   ├── GitHubContributions/      # GitHub Contributions グラフ
│   │   ├── GitHubTechShowcase/       # 技術スタック & コントリビューション統合表示
│   │   ├── Header/                   # ヘッダー・ナビゲーション
│   │   ├── Menu/
│   │   │   └── Hero/                 # ヒーローセクション
│   │   ├── NatureBackground/         # リアルタイム自然背景 SVG アニメーション
│   │   ├── NewsList/                 # ニュース記事一覧
│   │   ├── OnlineStatusDot/          # オンライン状態インジケーター
│   │   ├── Pagination/               # ページネーション
│   │   ├── Profile/                  # プロフィールカード
│   │   ├── SearchField/              # 検索フィールド
│   │   ├── ShootingGame/             # ブラウザシューティングゲーム
│   │   ├── TechStackMarquee/         # 技術スタックマーキー
│   │   ├── Works/                    # 作品一覧
│   │   └── sheet/                    # UI シートコンポーネント
│   ├── constants/
│   │   └── index.ts                  # グローバル定数
│   ├── lids/
│   │   ├── github.ts                 # GitHub API 呼び出しロジック
│   │   ├── microcms.ts               # MicroCMS API 呼び出しロジック
│   │   └── utils.ts                  # ユーティリティ関数
│   ├── news/                         # ニュース関連ページ
│   │   ├── page.tsx                  # 一覧
│   │   ├── [slug]/page.tsx           # 記事詳細
│   │   ├── category/[id]/page.tsx    # カテゴリー別一覧
│   │   ├── category/[id]/p/[current]/page.tsx
│   │   ├── p/[current]/page.tsx      # ページネーション
│   │   └── search/page.tsx           # 検索結果
│   ├── works/                        # 作品ページ
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── profile/page.tsx              # プロフィール・経歴
│   ├── members/page.tsx              # メンバー一覧
│   ├── contact/page.tsx              # お問い合わせ
│   └── 作ったもの/page.tsx           # ポートフォリオ（日本語パス）
├── public/                           # 静的アセット
│   └── kali-terminal-portfolio.html
├── .env.example                      # 環境変数テンプレート
├── next.config.mjs
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## デプロイ

Vercel へのデプロイを推奨します。

1. Vercel にプロジェクトをインポート
2. 環境変数（`MICROCMS_SERVICE_DOMAIN`、`MICROCMS_API_KEY` など）を設定
3. デプロイ

詳細は [Next.js デプロイドキュメント](https://nextjs.org/docs/app/building-your-application/deploying) を参照してください。

## ライセンス

Private repository — 無断転用禁止。

## Node.jsのセキュリティ更新（CVE-2026-111497）

Node.jsは22.23.4以降の22系列を使用してください。`.nvmrc`／`.node-version`と`engines.node`を合わせ、インストール・開発・ビルド・本番起動の前に実行版を検査します。Next.jsのNode.jsサーバー起動時にも検査し、未修正のランタイムでは要求処理を開始しません。

既存環境では最新コードを取得し、次を実行します。

```bash
git pull --ff-only
nvm install
nvm use
npm ci
npm run build
npm start
```

Windowsなどでnvmを使用しない場合は、Node.js 22.23.4以降の22系列を別途インストールしてから、`npm run check:node`で確認してください。

VercelではNode.js Versionを22.xにし、最新コミットで再デプロイします。パッチ版はVercelが管理するため、設定変更だけで修正済みとは判断せず、デプロイのログと稼働状況を確認してください。直接`next start`を実行する運用でも、古いサービスプロセスを終了して再起動する必要があります。Next.jsやnpmパッケージだけの更新ではNode.js本体は更新されません。
