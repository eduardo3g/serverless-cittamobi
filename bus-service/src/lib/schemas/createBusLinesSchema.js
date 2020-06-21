const schema = {
  properties: {
    body: {
      type: 'object',
      properties: {
        line_code: {
          type: 'string',
        },
        title: {
          type: 'string',
        },
        route: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
      required: ['line_code', 'title', 'route'],
    },
  },
  required: ['body'],
};

export default schema;