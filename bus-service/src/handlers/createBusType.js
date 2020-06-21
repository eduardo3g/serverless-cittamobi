import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createError from 'http-errors';
import validator from '@middy/validator';
import commomMiddleware from '../lib/commomMiddleware';
import createBusTypeSchema from '../lib/schemas/createBusTypeSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createBusType(event, context) {
  const { type, description, maxCapacity, entranceDoors, exitDoors } = event.body;
  const now = new Date();

  const busType = {
    id: uuid(),
    type,
    description,
    maxCapacity,
    entranceDoors,
    exitDoors,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  try {
    await dynamodb.put({
      TableName: process.env.BUS_TYPES_TABLE_NAME,
      Item: busType,
    }).promise();
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(busType),
  };
}

export const handler = commomMiddleware(createBusType)
  .use(validator({ inputSchema: createBusTypeSchema }));
