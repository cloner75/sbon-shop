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
const PRODUCT_BODY = {
  type: 'object',
  required: ['titleFa', 'titleEn', 'brandId', 'categoriesId', 'body', 'slug', 'images', 'attributes', 'skus'],
  properties: {
    titleFa: { type: 'string' },
    titleEn: { type: 'string' },
    brandId: { type: 'string', pattern: '/^[0-9a-fA-F]{24}$/' },
    categoriesId: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '/^[0-9a-fA-F]{24}$/'
      }
    },
    keyWords: {
      type: 'array',
      items: { type: 'string' }
    },
    body: { type: 'string' },
    slug: { type: 'string' },
    images: {
      type: 'array',
      items: { type: 'string' }
    },
    attributes: {
      type: 'object',
      required: ['name', 'items'],
      properties: {
        name: { type: 'string' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            required: ['value', 'key'],
            properties: {
              default: { type: 'boolean' },
              value: { type: 'string' },
              key: { type: 'string' },

            }
          }
        }
      }
    },

    skus: {
      type: 'array',
      items: {
        type: 'object',
        required: ['image', 'key', 'name', 'price', 'discount', 'sbon', 'stock'],
        properties: {
          default: { type: 'boolean' },
          image: { type: 'string' },
          key: { type: 'string' },
          name: { type: 'string' },
          price: { type: 'number' },
          vipPrice: { type: 'number' },
          discount: { type: 'number' },
          sbon: { type: 'number' },
          stock: { type: 'number' },
          options: {
            type: 'array',
            required: ['key', 'value'],
            items: {
              type: 'object',
              properties: {
                key: { type: 'string' },
                value: { type: 'string' },
              }
            }
          }
        }
      }
    },

    description: { type: 'boolean' },
    isShow: { type: 'boolean' },
    type: { type: 'number' },
    status: { type: 'number' },
  }
};
const PRODUCT_QUERY = {
  type: 'object',
  properties: {}
};
const PRODUCT_PARAM = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', pattern: "/^[0-9a-fA-F]{24}$/" },
  }
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
        description: 'Create New Products',
        tags: ['product-service'],
        summary: 'create products collection',
        body: PRODUCT_BODY
      }
    },

    // @description ::  Schema Update
    update: {
      schema: {
        description: 'Update One Products',
        tags: ['product-service'],
        summary: 'Update product collection',
        params: PRODUCT_PARAM,
        body: PRODUCT_BODY,
      }
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
        description: 'Find Products',
        tags: ['product-service'],
        summary: 'Find product collection',
        querystring: PRODUCT_QUERY
      },
    },

    // @description :: Schema FindOne
    findOne: {
      schema: {
        description: 'Find One Product',
        tags: ['product-service'],
        summary: 'Find One Product collection',
        params: PRODUCT_PARAM,
        querystring: PRODUCT_QUERY,
      }
    },

    // @description :: Schema Delete
    delete: {
      schema: {
        description: 'Delete One Product',
        tags: ['product-service'],
        summary: 'Delete One  product collection',
        params: PRODUCT_PARAM
      },
    },
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
            sub: joi.array().items(
              joi.object({
                name: joi.string().trim().required(),
                slug: joi.string().trim().required(),
                image: joi.string().trim(),
                banner: joi.string().trim(),
                sub: joi.array().items(
                  joi.object({
                    name: joi.string().trim().required(),
                    slug: joi.string().trim().required(),
                    image: joi.string().trim(),
                    banner: joi.string().trim(),
                  })),
              }))
          })
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
            image: joi.string().trim(),
            banner: joi.string().trim(),
            sub: joi.array().items(
              joi.object({
                _id: joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/),
                name: joi.string().trim().required(),
                banner: joi.string().trim(),
                slug: joi.string().trim().required(),
                image: joi.string().trim(),
                sub: joi.array().items(
                  joi.object({
                    _id: joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/),
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
  }

};
