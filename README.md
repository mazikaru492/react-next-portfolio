# react-next-portfolio

Next.js と React で構築されたポートフォリオサイトです。microCMS をヘッドレス CMS として使用し、GitHub の貢献（草）表示、Tech Stack のマーキー表示などの機能を備えています。

## 技術スタック

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- microCMS（ヘッドレス CMS）
- Vercel Analytics

## 主な機能

- プロフィール表示
- GitHub Contributions（草）の表示
- Tech Stack のマーキーアニメーション
- ニュース記事一覧（microCMS から取得）
- お問い合わせフォーム
- レスポンシブデザイン対応

## 必要条件

- Node.js 20 以上 25 未満

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example` を参考に `.env.local` ファイルを作成してください。

```bash
cp .env.example .env.local
```

### 環境変数一覧

| 変数名                  | 説明                                               | 必須                            |
| ----------------------- | -------------------------------------------------- | ------------------------------- |
| MICROCMS_SERVICE_DOMAIN | microCMS のサービスドメイン                        | 本番環境では必須                |
| MICROCMS_API_KEY        | microCMS の API キー                               | 本番環境では必須                |
| GITHUB_USERNAME         | GitHub のユーザー名                                | 任意（デフォルト: mazikaru492） |
| GITHUB_TOKEN            | GitHub Personal Access Token（read:user スコープ） | 任意                            |

ローカル開発では microCMS の設定がなくても起動できます（空データでフォールバック表示）。

GitHub トークンが未設定の場合は、外部 SVG による軽量なフォールバック表示が行われます。

## 開発

### 開発サーバーの起動

```bash
npm run dev
```

Turbopack を使用する場合:

```bash
npm run dev:turbo
```

ブラウザで http://localhost:3000 を開いて確認できます。

### ビルド

```bash
npm run build
```

### 本番サーバーの起動

```bash
npm start
```

### Lint

```bash
npm run lint
```

## ディレクトリ構成

```
my-next-project/
├── app/
│   ├── components/     # 再利用可能なコンポーネント
│   │   ├── Article/
│   │   ├── Footer/
│   │   ├── GitHubContributions/
│   │   ├── Header/
│   │   ├── Hero/
│   │   ├── NewsList/
│   │   ├── Profile/
│   │   ├── TechStackMarquee/
│   │   └── ...
│   ├── contact/        # お問い合わせページ
│   ├── news/           # ニュースページ
│   ├── members/        # メンバーページ
│   ├── lids/           # API ユーティリティ
│   ├── constants/      # 定数定義
│   ├── globals.css     # グローバルスタイル
│   ├── layout.tsx      # ルートレイアウト
│   └── page.tsx        # トップページ
├── public/             # 静的ファイル
└── ...
```

## デプロイ

Vercel へのデプロイを推奨します。

1. Vercel にプロジェクトをインポート
2. 環境変数を設定
3. デプロイ

詳細は Next.js のデプロイドキュメントを参照してください:
https://nextjs.org/docs/app/building-your-application/deploying

## ライセンス

このプロジェクトはプライベートリポジトリです。
