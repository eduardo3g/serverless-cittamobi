import AWS from 'aws-sdk';
import commomMiddleware from '../lib/commomMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getBusLineById(id) {
  let busLine;

  try {
    const result = await dynamodb.get({
      TableName: process.env.BUS_LINES_TABLE_NAME,
      Key: { id }
    }).promise();

    busLine = result.Item;

  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  if (!busLine) {
    throw new createError.NotFound(`Linha de ônibus de ID "${id}" não localizada.`);
  }

  return busLine;
}

async function getBusLine(event, context) {
  const { id } = event.pathParameters;
  const busLine = await getBusLineById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(busLine),
  };
}

export const handler = commomMiddleware(getBusLine);
