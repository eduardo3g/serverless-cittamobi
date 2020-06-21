const schema = {
  properties: {
    body: {
      type: 'object',
      properties: {
        chassis: {
          type: 'string',
        },
        line_id: {
          type: 'string',
        },
        bus_type_id: {
          type: 'string',
        },
      },
      required: ['chassis', 'line_id', 'bus_type_id'],
    },
  },
  required: ['body'],
};

export default schema;