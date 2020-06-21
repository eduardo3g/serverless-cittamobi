import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function setBusStatus(id, available) {
  const params = {
    TableName: process.env.BUS_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set isAvailable = :available',
    ExpressionAttributeValues: {
      ':available': available,
    },
    ReturnValues: 'ALL_NEW',
  };

  const result = await dynamodb.update(params).promise();

  return result.Attributes;
}