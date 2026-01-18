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

### インフラ管理
- **Terraform** (インフラ基盤: DynamoDB, S3, Cognito)
- **AWS SAM** (サーバーレス: Lambda, API Gateway)

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

### コードレビュー

CodeRabbitを導入。PRを作成すると自動でAIレビューが実行される。

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

## Terraform（インフラ基盤管理）

DynamoDB、S3、CognitoなどのインフラリソースはTerraformで管理。

### 管理対象リソース
- **DynamoDB**: Workoutsテーブル
- **S3**: フロントエンドホスティング用バケット
- **Cognito**: User Pool & Client
- **S3**: Terraform state保存用バケット（暗号化・バージョニング有効）

### State管理
- S3バックエンド使用
- バケット名: `workout-app-terraform-state-saitoh`
- 暗号化・バージョニング有効

### ハイブリッド構成
```
Terraform（インフラ基盤）:
├─ DynamoDB
├─ S3
└─ Cognito

SAM（アプリケーション層）:
├─ Lambda関数
└─ API Gateway
```

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
├── backend/workout-api/
│   ├── template.yaml  # SAMテンプレート
│   └── src/           # Lambda関数群
└── terraform/         # インフラ定義
    ├── main.tf        # リソース定義
    ├── variables.tf   # 変数定義
    └── outputs.tf     # 出力定義
```
