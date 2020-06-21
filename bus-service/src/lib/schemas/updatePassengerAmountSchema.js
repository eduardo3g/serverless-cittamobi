const schema = {
  properties: {
    body: {
      type: 'object',
      properties: {
        register_type: {
          type: 'number',
        },
        geolocation: {
          type: 'object',
          properties: {
            latitude: {
              type: 'number',
            },
            longitude: {
              type: 'number'
            },
          },
        },
      },
      required: ['register_type'],
    },
  },
  required: ['body'],
};

export default schema;