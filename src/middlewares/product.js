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

  // Product
  pro: {
    // @description ::  Schema Create
    create: {
      schema: {
        body: joi
          .object({
            titleFa: joi.string().trim().required(),
            titleEn: joi.string().trim().required(),
            titleAffiliate: joi.object({ en: joi.string(), fa: joi.string() }),
            titleVip: joi.object({ en: joi.string(), fa: joi.string() }),
            titleColleague: joi.object({ en: joi.string(), fa: joi.string() }),
            isFake: joi.boolean(),
            priority: joi.number(),
            referenceId: joi
              .string()
              .pattern(/^[0-9a-fA-F]{24}$/),
            brandId: joi
              .string()
              .trim()
              .pattern(/^[0-9a-fA-F]{24}$/)
              .required(),
            categoriesId: joi.array().items(
              joi
                .string()
                .trim()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .required()
            ),
            keyWords: joi.array().items(joi.string().trim()),
            description: joi.string(),
            body: joi.string().trim().required(),
            slug: joi.string().trim().required(),
            isShow: joi.bool(),
            type: joi.number(),
            status: joi.number(),
            images: joi.array().items(joi.string().trim().required()),
            attributes: joi.array().items(joi.object({
              name: joi.string().trim().required(),
              items: joi.array().items(joi.object({
                default: joi.boolean(),
                value: joi.string().trim().required(),
                key: joi.string().trim().required(),
              }))
            })).required(),
            skus: joi.array().items({
              default: joi.boolean().required(),
              image: joi.string(),
              key: joi.string().trim().required(),
              name: joi.string().trim().required(),
              price: joi.number().required(),
              major: joi.number(),
              discount: joi.number().required(),
              sbon: joi.number().required(),
              stock: joi.number().required(),
              options: joi.array().items(joi.object({
                key: joi.string().trim(),
                value: joi.string().trim(),
              })),
            }).required(),
          })
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
          .object({})
          .unknown(),
      },
      validatorCompiler: ({ schema }) => {
        return (data) => schema.validate(data);
      },
    },

    // @description :: Schema Search
    search: {
      schema: {
        querystring: joi
          .object({
            type: joi.number().valid(1, 2),
            title: joi.string().trim(),
            brandId: joi.string().trim(),
            categoriesId: joi.string().trim(),
            priceMin: joi.number(),
            priceMax: joi.number()
          })
          .unknown(),
      },
      validatorCompiler: ({ schema }) => {
        return (data) => schema.validate(data);
      },
    },
    // @description :: Schema Find
    find: {
      schema: {
        querystring: joi
          .object({})
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
          .object({})
          .unknown(),
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
          .unknown(),
      },
      validatorCompiler: ({ schema }) => {
        return (data) => schema.validate(data);
      },
    }
  },

  // Comment
  com: {
    // @description ::  Schema Create
    create: {
      schema: {
        body: joi
          .object({
            referId: joi
              .string()
              .trim()
              .pattern(/^[0-9a-fA-F]{24}$/),
            userId: joi
              .string()
              .trim()
              .pattern(/^[0-9a-fA-F]{24}$/).required(),
            productId: joi
              .string()
              .trim()
              .pattern(/^[0-9a-fA-F]{24}$/).required(),
            skuId: joi
              .string()
              .trim()
              .pattern(/^[0-9a-fA-F]{24}$/),
            ratings: joi.array().items(joi.object({
              key: joi.string().trim(),
              value: joi.number(),
            })),
            offer: joi.number().valid(0, 1, 2),
            addvantages: joi.array().items(joi.string().trim()),
            disAddvantages: joi.array().items(joi.string().trim()),
            message: joi.string().trim().required(),
          })
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
            status: joi.number().required().valid(0, 1, 2)
          })
          .unknown(),
      },
      validatorCompiler: ({ schema }) => {
        return (data) => schema.validate(data);
      },
    },

    // @description :: Schema Find
    find: {
      schema: {
        querystring: joi
          .object({})
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
          .object({})
          .unknown(),
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
          })
          .unknown(),
      },
      validatorCompiler: ({ schema }) => {
        return (data) => schema.validate(data);
      },
    }
  },

  // Category
  cat: {
    // @description ::  Schema Create
    create: {
      schema: {
        body: joi
          .object({
            name: joi.string().trim().required(),
            slug: joi.string().trim().required(),
            image: joi.string().trim(),
            banner: joi.string().trim(),
            description: joi.string(),
            sub: joi.array().items(
              joi.object({
                name: joi.string().trim().required(),
                slug: joi.string().trim().required(),
                image: joi.string().trim(),
                banner: joi.string().trim(),
                description: joi.string(),
                sub: joi.array().items(
                  joi.object({
                    name: joi.string().trim().required(),
                    slug: joi.string().trim().required(),
                    image: joi.string().trim(),
                    description: joi.string(),
                    banner: joi.string().trim(),
                  })),
              }))
          }).unknown()
      }, validatorCompiler: ({ schema }) => {
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
            _id: joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/),
            name: joi.string().trim().required(),
            slug: joi.string().trim().required(),
            description: joi.string(),
            image: joi.string().trim(),
            banner: joi.string().trim(),
            sub: joi.array().items(
              joi.object({
                _id: joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/),
                name: joi.string().trim().required(),
                banner: joi.string().trim(),
                description: joi.string(),
                slug: joi.string().trim().required(),
                image: joi.string().trim(),
                sub: joi.array().items(
                  joi.object({
                    _id: joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/),
                    description: joi.string(),
                    name: joi.string().trim().required(),
                    slug: joi.string().trim().required(),
                    banner: joi.string().trim(),
                    image: joi.string().trim(),
                  })),
              }))
          })
      }, validatorCompiler: ({ schema }) => {
        return (data) => schema.validate(data);
      },
    },

    // @description :: Schema Find
    find: {
      schema: {
        querystring: joi
          .object({})
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
          .object({})
          .unknown(),
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
          .unknown(),
      },
      validatorCompiler: ({ schema }) => {
        return (data) => schema.validate(data);
      },
    }
  },

  // Offer
  offer: {
    // @description ::  Schema Create
    create: {
      schema: {
        body: joi.object({
          categoryIds: joi.array().items(joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/)),
          status: joi.number().valid(0, 1).required(),
          type: joi.number().valid(1, 2).required(),
          amount: joi.number().required(),
          code: joi.string().trim().required(),
          title: joi.string().trim().required(),
          expirationTime: joi.string().trim().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
        })
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
            categoryIds: joi.array().items(joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/)),
            status: joi.number().valid(0, 1).required(),
            type: joi.number().valid(1, 2).required(),
            amount: joi.number().required(),
            code: joi.string().trim().required(),
            title: joi.string().trim().required(),
            expirationTime: joi.string().trim().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
          })
          .unknown(),
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
            code: joi.string().trim(),
            title: joi.string().trim(),
            status: joi.number().valid(0, 1),
            type: joi.number().valid(1, 2),
            expirationTime: joi.string().trim().pattern(/^\d{4}-\d{2}-\d{2}$/),
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
          code: joi
            .string()
            .trim()
            .required()
            .messages(messages),
        }),
        querystring: joi.object({}),
      },
      validatorCompiler: ({ schema }) => {
        return (data) => schema.validate(data);
      },
    },

    // @description :: Schema FindOne
    findOneDashboard: {
      schema: {
        params: joi.object({
          id: joi
            .string()
            .trim()
            .required()
            .messages(messages),
        }),
        querystring: joi.object({}),
      },
      validatorCompiler: ({ schema }) => {
        return (data) => schema.validate(data);
      },
    },
  },

  // Order
  brand: {
    // @description ::  Schema Create
    create: {
      schema: {
        body: joi
          .object({
            name: joi.object({
              fa: joi.string().trim().required(),
              en: joi.string().trim().required(),
            }),
            icon: joi.string().trim().required(),
            slug: joi.string().trim().required(),
          })
      }, validatorCompiler: ({ schema }) => {
        return (data) => schema.validate(data);
      }
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
            name: joi.object({
              fa: joi.string().trim().required(),
              en: joi.string().trim().required(),
            }),
            slug: joi.string().trim().required(),
            icon: joi.string().trim().required(),
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
          .object({})
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
          .object({})
          .unknown(),
      },
      validatorCompiler: ({ schema }) => {
        return (data) => schema.validate(data);
      },
    },

    // @description :: Schema Remove
    delete: {
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
          .object({})
          .unknown(),
      },
      validatorCompiler: ({ schema }) => {
        return (data) => schema.validate(data);
      },
    },
  },

  // Installment
  installment: {
    create: {
      schema: {
        body: joi
          .object({
            categoryId: joi
              .string()
              .trim()
              .pattern(/^[0-9a-fA-F]{24}$/).required(),
            plans: joi.array().items(
              joi.object({
                checkCount: joi.number().required(),
                prepayment: joi.number().required(),
                interest: joi.number().required(),
              })
            ).required()
          })
      }, validatorCompiler: ({ schema }) => {
        return (data) => schema.validate(data);
      }
    },

    find: {
      schema: {
        querystring: joi
          .object({})
          .unknown(),
      }, validatorCompiler: ({ schema }) => {
        return (data) => schema.validate(data);
      }
    },

    findOne: {
      schema: {
        querystring: joi
          .object({})
          .unknown(),
        params: joi
          .object({
            id: joi
              .string()
              .trim()
              .pattern(/^[0-9a-fA-F]{24}$/)
              .required(),
          })
      }, validatorCompiler: ({ schema }) => {
        return (data) => schema.validate(data);
      }
    },

    update: {
      schema: {
        body: joi
          .object({
            categoryId: joi
              .string()
              .trim()
              .pattern(/^[0-9a-fA-F]{24}$/).required(),
            plans: joi.array().items(
              joi.object({
                checkCount: joi.number().required(),
                prepayment: joi.number().required(),
                interest: joi.number().required(),
              }).unknown()
            ).required()
          }),
        params: joi.object({
          id: joi
            .string()
            .trim()
            .pattern(/^[0-9a-fA-F]{24}$/).required(),
        })
      }, validatorCompiler: ({ schema }) => {
        return (data) => schema.validate(data);
      }
    },

    remove: {
      schema: {
        params: joi
          .object({
            id: joi
              .string()
              .trim()
              .pattern(/^[0-9a-fA-F]{24}$/).required(),
          })
      }, validatorCompiler: ({ schema }) => {
        return (data) => schema.validate(data);
      }
    },
  }

};
