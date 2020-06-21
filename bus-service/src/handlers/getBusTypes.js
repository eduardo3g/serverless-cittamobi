import AWS from 'aws-sdk';
import createError from 'http-errors';
import commomMiddleware from '../lib/commomMiddleware';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getBusTypes(event, context) {
  let busTypes;

  try {
    const result = await dynamodb.scan({
      TableName: process.env.BUS_TYPES_TABLE_NAME,
    }).promise();

    busTypes = result.Items;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(busTypes),
  };
}

export const handler = commomMiddleware(getBusTypes);
