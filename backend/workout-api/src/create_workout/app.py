import json
import boto3
import uuid
import os
from datetime import datetime
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get('TABLE_NAME', 'Workouts')
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        # リクエストボディの取得
        body = json.loads(event['body'])
        
        # ワークアウトIDの生成（日時 + UUID）
        workout_id = f"{datetime.now().isoformat()}_{str(uuid.uuid4())[:8]}"
        
        # DynamoDBに保存するアイテム
        user_id = event['requestContext']['authorizer']['claims']['sub']
        item = {
            'userId': user_id,
            'workoutId': workout_id,
            'date': body['date'],
            'exercises': body['exercises'],
            'memo': body.get('memo', '')
        }
        
        # DynamoDBに保存
        table.put_item(Item=item)
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',  # CORS対応
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST,GET,DELETE,OPTIONS'
            },
            'body': json.dumps({
                'message': 'Workout created successfully',
                'workoutId': workout_id
            })
        }
    
    except KeyError as e:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'Missing required field: {str(e)}'})
        }
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Internal server error'})
        }