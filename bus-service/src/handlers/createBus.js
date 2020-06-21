import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createError from 'http-errors';
import validator from '@middy/validator';
import commomMiddleware from '../lib/commomMiddleware';
import createBusSchema from '../lib/schemas/createBusSchema';

import { getBusLineById } from './getBusLine';
import { getBusTypeById } from './getBusType';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createBus(event, context) {
  const { chassis, line_id, bus_type_id } = event.body;
  const now = new Date();

  const busLine = await getBusLineById(line_id);
  const busType = await getBusTypeById(bus_type_id);

  if (!busLine) {
    throw new createError.NotFound(`A linha de ônibus com ID ${line_id} não existe.`);
  }

  if (!busType) {
    throw new createError.NotFound(`A categoria de ônibus com ID ${bus_type_id} não existe.`);
  }

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
