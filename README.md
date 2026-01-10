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
