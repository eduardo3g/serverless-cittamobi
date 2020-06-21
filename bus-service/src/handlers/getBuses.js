import AWS from 'aws-sdk';
import createError from 'http-errors';
import commomMiddleware from '../lib/commomMiddleware';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getBuses(event, context) {
  let buses;

  try {
    const result = await dynamodb.scan({
      TableName: process.env.BUS_TABLE_NAME,
    }).promise();

    buses = result.Items;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(buses),
  };
}

export const handler = commomMiddleware(getBuses);
