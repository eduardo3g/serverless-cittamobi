import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createError from 'http-errors';
import validator from '@middy/validator';
import commomMiddleware from '../lib/commomMiddleware';
import createBusSchema from '../lib/schemas/createBusSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createBus(event, context) {
  const { chassis, line_id, bus_type_id } = event.body;
  const now = new Date();

  const bus = {
    id: uuid(),
    chassis,
    line_id,
    bus_type_id,
    currentPassengerAmount: 0,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  try {
    await dynamodb.put({
      TableName: process.env.BUS_TABLE_NAME,
      Item: bus,
    }).promise();
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(bus),
  };
}

export const handler = commomMiddleware(createBus)
  .use(validator({ inputSchema: createBusSchema }));
