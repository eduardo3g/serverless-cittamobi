import AWS from 'aws-sdk';
import commomMiddleware from '../lib/commomMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getBusTypeById(id) {
  let busType;

  try {
    const result = await dynamodb.get({
      TableName: process.env.BUS_TYPES_TABLE_NAME,
      Key: { id }
    }).promise();

    busType = result.Item;

  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  if (!busType) {
    throw new createError.NotFound(`Categoria de ônibus de ID "${id}" não localizada.`);
  }

  return busType;
}

async function getBusType(event, context) {
  const { id } = event.pathParameters;
  const busType = await getBusTypeById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(busType),
  };
}

export const handler = commomMiddleware(getBusType);
