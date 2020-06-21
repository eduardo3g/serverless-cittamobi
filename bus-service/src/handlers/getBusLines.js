import AWS from 'aws-sdk';
import createError from 'http-errors';
import commomMiddleware from '../lib/commomMiddleware';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getBusLines(event, context) {
  let busLines;

  try {
    const result = await dynamodb.scan({
      TableName: process.env.BUS_LINES_TABLE_NAME,
    }).promise();

    busLines = result.Items;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(busLines),
  };
}

export const handler = commomMiddleware(getBusLines);
