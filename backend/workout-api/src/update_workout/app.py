import json
import os
from decimal import Decimal
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

def lambda_handler(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']
    workout_id = event['pathParameters']['id']
    
    try:
        body = json.loads(event['body'])
        
        table.update_item(
            Key={
                'userId': user_id,
                'workoutId': workout_id
            },
            UpdateExpression='SET #date = :date, exercises = :exercises, memo = :memo',
            ExpressionAttributeNames={
                '#date': 'date'
            },
            ExpressionAttributeValues={
                ':date': body['date'],
                ':exercises': body['exercises'],
                ':memo': body.get('memo', '')
            }
        )
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': 'Updated successfully'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }
