import AWS from 'aws-sdk';
import createError from 'http-errors';
import validator from '@middy/validator';
import commomMiddleware from '../lib/commomMiddleware';
import updatePassengerAmountSchema from '../lib/schemas/updatePassengerAmountSchema';

import { getBusById } from './getBus';
import { setBusStatus } from '../lib/setBusStatus';
import { getMaxCapacityByBusTypeId } from '../lib/getMaxCapaciyByBusType';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function updateCurrentBusPassengerAmount(event, context) {
  const { id } = event.pathParameters;
  const { register_type, geolocation } = event.body;

  const bus = await getBusById(id);

  if (!bus) {
    throw new createError.NotFound(`O ônibus com ID ${id} não existe.`);
  }

  const maxCapacity = await getMaxCapacityByBusTypeId(bus.bus_type_id);

  // Avoid negative passengers when current amount is already 0 and register type is 0 (out)
  if (bus.currentPassengerAmount === 0 && register_type === 0) {
    bus.currentPassengerAmount = 0;
  }

  if (bus.currentPassengerAmount === maxCapacity) {
    await setBusStatus(id, 0); // setting the bus to non-available

    throw new createError.Forbidden(`O ônibus com ID ${id} está lotado. Novos passageiros não serão permitidos.`);
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
    UpdateExpression: 'set currentPassengerAmount = :passengerAmount, geolocation.latitude = :lat, geolocation.longitude = :lon',
    ExpressionAttributeValues: {
      ':passengerAmount': bus.currentPassengerAmount,
      ':lat': geolocation.latitude,
      ':lon': geolocation.longitude,
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
