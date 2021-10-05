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

  // @description ::  Schema Create
  create: {
    schema: {
      body: joi
        .object({
          name: joi.string().trim().required().messages(messages),
          email: joi.string().trim().email().required().messages(messages),
          family: joi.string().trim().required().messages(messages),
          lastCertificate: joi.string().trim().required().messages(messages),
          gender: joi.string().trim().valid('male', 'female', 'other').required().messages(messages),
          birthday: joi.string().trim().required().messages(messages),
          placeOfBirthday: joi.string().trim().required().messages(messages),
          picture: joi.string().trim().required().messages(messages),
          maritalStatus: joi.string().trim().valid('married', 'single').required().messages(messages),
          doubleChance: joi.boolean().required().messages(messages),
          countChild: joi.number().required().messages(messages),
          childs: joi.array().items(joi.object({
            name: joi.string().trim().messages(messages),
            family: joi.string().trim().messages(messages),
            lastCertificate: joi.string().trim().messages(messages),
            gender: joi.string().trim().valid('male', 'female', 'other').messages(messages),
            birthday: joi.string().trim().messages(messages),
            placeOfBirthday: joi.string().trim().messages(messages),
            picture: joi.string().trim().messages(messages),
            maritalStatus: joi.string().trim().valid('married', 'single').messages(messages),
          })).messages(messages),
          passport: joi.object({
            number: joi.string().trim().messages(messages),
            expired: joi.string().trim().messages(messages),
            picture: joi.string().trim().messages(messages),
          }).messages(messages),
          spouse: joi.object({
            name: joi.string().trim().messages(messages),
            family: joi.string().trim().messages(messages),
            lastCertificate: joi.string().trim().messages(messages),
            birthday: joi.string().trim().messages(messages),
            address: joi.string().trim().messages(messages),
            passport: joi.object({
              picture: joi.string().trim().messages(messages),
              number: joi.string().trim().messages(messages),
              expired: joi.string().trim().messages(messages)
            })
          })
        })
    },
    validatorCompiler: ({ schema }) => {
      return (data) => schema.validate(data);
    },
  },
  // @description ::  Schema Create
  verify: {
    schema: {
      body: joi
        .object({
          orderId: joi.string().trim().required().messages(messages),
        })
    },
    validatorCompiler: ({ schema }) => {
      return (data) => schema.validate(data);
    },
  },
};