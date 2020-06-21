import AWS from 'aws-sdk';
import createError from 'http-errors';
import validator from '@middy/validator';
import commomMiddleware from '../lib/commomMiddleware';
import updatePassengerAmountSchema from '../lib/schemas/updatePassengerAmountSchema';

import { getBusById } from './getBus';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function updateCurrentBusPassengerAmount(event, context) {
  const { id } = event.pathParameters;
  const { register_type } = event.body;

  const bus = await getBusById(id);

  if (!bus) {
    throw new createError.NotFound(`O ônibus com ID ${id} não existe.`);
  }

  // Avoid negative passengers when current amount is already 0 and register type is 0 (out)
  if (bus.currentPassengerAmount === 0 && register_type === 0) {
    bus.currentPassengerAmount = 0;
  }

  // Increment one passenger
  if (register_type === 1) {
    bus.currentPassengerAmount = bus.currentPassengerAmount + 1;
  }

  if (register_type === 0 && bus.currentPassengerAmount > 0) {
    bus.currentPassengerAmount = bus.currentPassengerAmount - 1;
  }

  const params = {
    TableName: process.env.BUS_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set currentPassengerAmount = :passengerAmount',
    ExpressionAttributeValues: {
      ':passengerAmount': bus.currentPassengerAmount,
    },
    ReturnValues: 'ALL_NEW',
  };

  let updatedBus;

  try {
    const result = await dynamodb.update(params).promise();

    updatedBus = result.Attributes;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedBus),
  };
}

export const handler = commomMiddleware(updateCurrentBusPassengerAmount)
  .use(validator({ inputSchema: updatePassengerAmountSchema }));
