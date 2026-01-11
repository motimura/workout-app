# Workout Management App

ワークアウト（筋トレ）記録を管理するWebアプリケーション

## 技術スタック

### フロントエンド
- React 19.2.3
- React Scripts 5.0.1
- Amazon Cognito Identity JS (認証)

### バックエンド
- AWS Lambda (Python)
- Amazon API Gateway
- Amazon DynamoDB
- Amazon Cognito (ユーザー認証)

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd workout-app
```

### 2. 環境変数の設定

フロントエンド用の環境変数ファイルを作成：

```bash
cd frontend
cp .env.example .env
```

`.env` ファイルを編集し、以下の値を設定：

```
REACT_APP_API_URL=<your-api-gateway-url>
REACT_APP_USER_POOL_ID=<your-cognito-user-pool-id>
REACT_APP_CLIENT_ID=<your-cognito-client-id>
```

### 3. 依存関係のインストール

```bash
npm install
```

### 4. アプリケーションの起動

```bash
npm start
```

ブラウザで `http://localhost:3000` が自動的に開きます。

## 利用可能なコマンド

### `npm start`
開発モードでアプリケーションを起動します。

### `npm test`
テストランナーを対話モードで起動します。

### `npm run build`
本番用にアプリケーションを `build` フォルダにビルドします。

### `npm run eject`
**注意: これは一方向の操作です。一度実行すると元に戻せません。**

Create React Appの設定をカスタマイズする場合に使用します。

## プロジェクト構成

```
workout-app/
├── frontend/           # Reactフロントエンド
│   ├── src/
│   │   ├── api/       # API通信とCognito認証
│   │   └── ...
│   ├── .env           # 環境変数（Git管理外）
│   └── .env.example   # 環境変数テンプレート
└── backend/           # AWS Lambda関数
```

## 機能

- ユーザー登録・認証（Amazon Cognito）
- ワークアウト記録の作成・閲覧・更新・削除
- トレーニング履歴の管理

## CI/CD

GitHub Actionsを使用した自動デプロイを構成しています。

### デプロイフロー
```
mainブランチにpush/マージ
    ↓
GitHub Actions
    ├─ フロントエンド → S3にデプロイ
    └─ バックエンド → SAM経由でLambda/API Gatewayにデプロイ
```

### 必要なGitHub Secrets

| Secret名 | 説明 |
|----------|------|
| `AWS_ROLE_ARN` | フロントエンドデプロイ用OIDCロールのARN |
| `AWS_ROLE_ARN_BACKEND` | バックエンドデプロイ用OIDCロールのARN |
| `S3_BUCKET_NAME` | フロントエンドホスティング用S3バケット名 |
| `SAM_STACK_NAME` | SAMスタック名 |
| `REACT_APP_API_URL` | API GatewayのエンドポイントURL |
| `REACT_APP_USER_POOL_ID` | Cognito User Pool ID |
| `REACT_APP_CLIENT_ID` | Cognito Client ID |

### IAMロール構成

| ロール | 用途 | 主な権限 |
|--------|------|----------|
| フロントエンド用OIDC | GitHub ActionsからS3へデプロイ | S3FullAccess |
| バックエンド用OIDC | GitHub ActionsからSAMデプロイ | Lambda, API Gateway, CloudFormation, S3, Cognito, DynamoDB |
| Lambda実行ロール | Lambda関数の実行時 | DynamoDB, CloudWatch Logs |

## インフラ構成
```
[ユーザー]
    ↓
[S3] ← 静的ウェブホスティング (React)
    ↓
[API Gateway] ← スロットリング設定
    ↓ (Cognito認証)
[Lambda] ← Python 3.9
    ↓
[DynamoDB]
```