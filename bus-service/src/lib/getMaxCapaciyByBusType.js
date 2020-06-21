import AWS from 'aws-sdk';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getMaxCapacityByBusTypeId(id) {
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

  return busType.maxCapacity;
}
