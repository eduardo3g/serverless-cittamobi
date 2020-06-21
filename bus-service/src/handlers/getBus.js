import AWS from 'aws-sdk';
import commomMiddleware from '../lib/commomMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getBusById(id) {
  let bus;

  try {
    const result = await dynamodb.get({
      TableName: process.env.BUS_TABLE_NAME,
      Key: { id }
    }).promise();

    bus = result.Item;

  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  if (!bus) {
    throw new createError.NotFound(`Ônibus de ID "${id}" não localizado.`);
  }

  return bus;
}

async function getBus(event, context) {
  const { id } = event.pathParameters;
  const bus = await getBusById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(bus),
  };
}

export const handler = commomMiddleware(getBus);
