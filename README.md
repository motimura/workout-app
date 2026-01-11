# Workout Management App

ワークアウト（筋トレ）記録を管理するWebアプリケーション

## 技術スタック

### フロントエンド
- React 19.2.3
- Amazon Cognito Identity JS (認証)

### バックエンド
- AWS Lambda (Python 3.9)
- Amazon API Gateway
- Amazon DynamoDB
- Amazon Cognito (ユーザー認証)
- AWS SAM (デプロイ)

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

## CI/CD

GitHub Actionsを使用した自動デプロイ。mainブランチへのpush時に、変更があったパスのみデプロイが実行される。

| ワークフロー | トリガー | デプロイ先 |
|-------------|---------|-----------|
| deploy-frontend.yml | `frontend/**` の変更 | S3 |
| deploy-backend.yml | `backend/**` の変更 | Lambda/API Gateway (SAM) |

### GitHub Secrets

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

## プロジェクト構成
```
workout-app/
├── .github/workflows/
│   ├── deploy-frontend.yml
│   └── deploy-backend.yml
├── frontend/
│   ├── src/
│   │   └── api/       # API通信とCognito認証
│   └── .env.example
└── backend/workout-api/
    ├── template.yaml  # SAMテンプレート
    └── src/           # Lambda関数群
```