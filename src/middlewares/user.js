// Packages
import joi from 'joi';

// Confings
import configs from './../configs/config';
const messages = {
  'any.required': configs.errors[1],
  'object.unknown': configs.errors[1],
  'array.base': configs.errors[2],
  'string.base': configs.errors[2],
  'string.pattern.base': configs.errors[2],
  'any.only': configs.errors[2],
  'string.empty': configs.errors[10],
  'string.min': configs.errors[11],
  'string.max': configs.errors[12],
};

// Export Schemas
export default {
  // @description :: Export Deafualt Messages
  messages,

  // @description ::  Schema hotp send
  hotpSend: {
    schema: {
      body: joi
        .object({
          phone: joi
            .string()
            .trim()
            .pattern(/^09\d{9}$/)
            .required(),
        })
        .unknown(),
    },
    validatorCompiler: ({ schema }) => {
      return (data) => schema.validate(data);
    },
  },

  // @description :: hotp verify
  hotpVerify: {
    schema: {
      body: joi
        .object({
          token: joi.any().required(),
          phone: joi
            .string()
            .trim()
            .pattern(/^09\d{9}$/)
            .required(),
        })
        .unknown(),
    },
    validatorCompiler: ({ schema }) => {
      return (data) => schema.validate(data);
    },
  },

  // @description ::  Schema Register
  register: {
    schema: {
      body: joi
        .object({
          username: joi.string().trim().required(),
          password: joi.string().trim().required(),
          phone: joi
            .string()
            .trim()
            .pattern(/^09\d{9}$/)
            .required()
        })
    },
    validatorCompiler: ({ schema }) => {
      return (data) => schema.validate(data);
    },
  },

  // @description ::  Schema Register
  login: {
    schema: {
      body: joi
        .object({
          password: joi.string().trim().required(),
          phone: joi
            .string()
            .trim()
            .pattern(/^09\d{9}$/)
            .required(),
        })
    },
    validatorCompiler: ({ schema }) => {
      return (data) => schema.validate(data);
    },
  },

  // @description :: Schema Find
  find: {
    schema: {
      querystring: joi
        .object({
          skip: joi.number(),
          limit: joi.number(),
          sort: joi
            .string()
            .trim()
            .valid('createdAt', 'updatedAt'),
          order: joi.string().trim().valid('asc', 'desc'),
          fields: joi.string().trim(),
        })
    },
    validatorCompiler: ({ schema }) => {
      return (data) => schema.validate(data);
    },
  },

  // @description :: Schema findOneForComment
  findOneForComment: {
    schema: {
      querystring: joi
        .object({
          skip: joi.number(),
          limit: joi.number(),
          sort: joi.string().trim().valid('createdAt', 'updatedAt'),
          order: joi.string().trim().valid('asc', 'desc'),
          fields: joi.string().trim(),
          usersId: joi.string().trim().required().messages(messages)
        })
        .unknown(),
    },
    validatorCompiler: ({ schema }) => {
      return (data) => schema.validate(data);
    },

  },
  // @description :: Schema FindOne
  findOne: {
    schema: {
      params: joi.object({
        id: joi
          .string()
          .trim()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages(messages),
      }),
      querystring: joi
        .object({
          skip: joi.number(),
          limit: joi.number(),
          sort: joi
            .string()
            .trim()
            .valid('createdAt', 'updatedAt'),
          order: joi.string().trim().valid('asc', 'desc'),
          fields: joi.string().trim(),
        })
        .unknown(),
    },
    validatorCompiler: ({ schema }) => {
      return (data) => schema.validate(data);
    },
  },

  // @description ::  Schema Update
  update: {
    schema: {
      params: joi.object({
        id: joi
          .string()
          .trim()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages(messages),
      }),
      body: joi
        .object({
          // username: joi.string().trim(),
          name: joi.string().trim(),
          family: joi.string().trim(),
          address: joi.string().trim(),
          password: joi.string().trim(),
          email: joi.string().trim(),
          avatar: joi.string().trim(),
          nationalCode: joi.string().trim(),
          // phone: joi
          //     .string()
          //     .trim()
          //     .pattern(/^09\d{9}$/)
        }).unknown()
    },
    validatorCompiler: ({ schema }) => {
      return (data) => schema.validate(data);
    },
  },

  updateTelegramToken: {
    schema: {
      body: joi.object({
        chatId: joi
          .string()
          .trim()
          .required()
          .messages(messages),
      }),
    },
    validatorCompiler: ({ schema }) => {
      return (data) => schema.validate(data);
    },
  },
  // @description :: Schema Delete
  delete: {
    schema: {
      body: joi.object({}),
      params: joi
        .object({
          id: joi
            .string()
            .trim()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages(messages),
        }),
    },
    validatorCompiler: ({ schema }) => {
      return (data) => schema.validate(data);
    },
  },

  list: {

    // @description :: Schema Create
    create: {
      schema: {
        body: joi.object({
          name: joi.string().trim().required(),
          products: joi.array().items(joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/)).required(),
        })
      },
      validatorCompiler: ({ schema }) => {
        return (data) => schema.validate(data);
      },
    },

    // @description :: Schema Find
    find: {
      schema: {
        querystring: joi
          .object({
            skip: joi.number(),
            limit: joi.number(),
            sort: joi
              .string()
              .trim()
              .valid('createdAt', 'updatedAt'),
            order: joi.string().trim().valid('asc', 'desc'),
            fields: joi.string().trim(),
          })
      },
      validatorCompiler: ({ schema }) => {
        return (data) => schema.validate(data);
      },
    },

    // @description :: Schema FindOne
    findOne: {
      schema: {
        params: joi.object({
          id: joi
            .string()
            .trim()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages(messages),
        }),
        querystring: joi
          .object({
            skip: joi.number(),
            limit: joi.number(),
            sort: joi
              .string()
              .trim()
              .valid('createdAt', 'updatedAt'),
            order: joi.string().trim().valid('asc', 'desc'),
            fields: joi.string().trim(),
          })
          .unknown(),
      },
      validatorCompiler: ({ schema }) => {
        return (data) => schema.validate(data);
      },
    },

    // @description ::  Schema Update
    update: {
      schema: {
        params: joi.object({
          id: joi
            .string()
            .trim()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages(messages),
        }),
        body: joi
          .object({
            name: joi.string().trim().required(),
            products: joi.array().items(joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/)).required(),
          })
      },
      validatorCompiler: ({ schema }) => {
        return (data) => schema.validate(data);
      },
    },

    // @description :: Schema Delete
    delete: {
      schema: {
        params: joi
          .object({
            id: joi
              .string()
              .trim()
              .pattern(/^[0-9a-fA-F]{24}$/)
              .required()
              .messages(messages),
          })
      },
      validatorCompiler: ({ schema }) => {
        return (data) => schema.validate(data);
      },
    },
  }
};
