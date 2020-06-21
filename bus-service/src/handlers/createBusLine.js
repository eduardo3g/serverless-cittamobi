import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createError from 'http-errors';
import validator from '@middy/validator';
import commomMiddleware from '../lib/commomMiddleware';
import createBusLinesSchema from '../lib/schemas/createBusLinesSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createBusLine(event, context) {
  const { line_code, title, route } = event.body;
  const now = new Date();

  const line = {
    id: uuid(),
    line_code,
    title,
    route,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  try {
    await dynamodb.put({
      TableName: process.env.BUS_LINES_TABLE_NAME,
      Item: line,
    }).promise();
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(line),
  };
}

export const handler = commomMiddleware(createBusLine)
  .use(validator({ inputSchema: createBusLinesSchema }));
