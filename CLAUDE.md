# CLAUDE.md

## プロジェクト概要
ワークアウト（筋トレ）記録を管理するWebアプリケーション。
AWS サーバーレスアーキテクチャで構築した個人開発プロジェクト。

## 技術スタック
- フロントエンド: React 19 + Amazon Cognito Identity JS
- バックエンド: AWS Lambda (Python 3.9)
- API: Amazon API Gateway (REST API)
- DB: Amazon DynamoDB
- 認証: Amazon Cognito
- IaC: Terraform + AWS SAM
- CI/CD: GitHub Actions

## ディレクトリ構成
```text
workout-app/
├── .github/workflows/  # CI/CDパイプライン
├── backend/workout-api/ # Lambda関数（Python）
├── frontend/            # React アプリケーション
├── terraform/           # インフラ定義
└── CLAUDE.md
```

## 開発ガイドライン

### コーディング規約
- Python: PEP 8準拠、型ヒント推奨
- JavaScript/React: ESLint設定に従う
- コミットメッセージ: Conventional Commits形式（feat:, fix:, docs:, refactor:, test:）

### アーキテクチャ方針
- Lambda関数は1エンドポイント1関数の原則
- ビジネスロジックはハンドラーから分離し、テスタブルに保つ
- フロントエンドのAPI通信は`src/api/`に集約
- 環境変数で設定を管理し、コードにシークレットを含めない

### DynamoDB設計方針
- シングルテーブルデザインは採用せず、テーブルの役割を明確に分離
- パーティションキーはユーザーIDベース（ユーザーごとのデータアクセスが主）
- ソートキーは`{ISO_timestamp}_{UUID先頭8文字}`形式で時系列ソートと一意性を保証

### テスト方針
- バックエンド: pytest でユニットテスト
- フロントエンド: React Testing Library
- Lambda関数はイベントオブジェクトをモックしてテスト

### ブランチ戦略
- main: 本番デプロイ対象
- feature/*: 機能開発
- fix/*: バグ修正
- PRベースでマージ（一人開発でもPRを作成する）

## よく使うコマンド
```bash
# フロントエンド
cd frontend && npm start        # 開発サーバー起動
cd frontend && npm test         # テスト実行
cd frontend && npm run build    # 本番ビルド

# バックエンド
cd backend/workout-api
sam build --use-container       # ビルド
sam local start-api             # ローカルAPI起動
sam deploy --guided             # デプロイ
python -m pytest tests/unit -v  # ユニットテスト

# Terraform
cd terraform && terraform plan   # 変更確認
cd terraform && terraform apply  # デプロイ
```

## キーパターン
- **認証**: Cognito JWTトークンをAuthorizationヘッダーで送信。Lambda側で`event['requestContext']['authorizer']['claims']['sub']`からuserIdを取得
- **DynamoDB**: PK = `userId`, SK = `workoutId`。PAY_PER_REQUESTモード
- **Lambdaレスポンス**: 全レスポンスにCORSヘッダー（`Access-Control-Allow-Origin: '*'`）を含める
- **環境変数**: `TABLE_NAME`でDynamoDBテーブル名を参照

## CI/CD
GitHub Actionsでmainブランチへのpush時に自動デプロイ:
- `frontend/**` 変更 → S3デプロイ
- `backend/**` 変更 → SAMデプロイ
- OIDC認証によるAWSアクセス（長期キー不使用）

## 注意事項
- `.env`ファイルはGit管理外。`.env.example`を参照して作成
- AWS認証情報はコードに含めない
- DynamoDBのテーブル名は環境変数`TABLE_NAME`で指定

## GitHub Secrets
`AWS_ROLE_ARN`, `AWS_ROLE_ARN_BACKEND`, `S3_BUCKET_NAME`, `SAM_STACK_NAME`, `REACT_APP_API_URL`, `REACT_APP_USER_POOL_ID`, `REACT_APP_CLIENT_ID`
