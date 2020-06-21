const schema = {
  properties: {
    body: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        maxCapacity: {
          type: 'number',
        },
        entranceDoors: {
          type: 'number',
        },
        exitDoors: {
          type: 'number',
        }
      },
      required: ['type', 'entranceDoors', 'exitDoors'],
    },
  },
  required: ['body'],
};

export default schema;