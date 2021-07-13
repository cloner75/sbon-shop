import RedisDatabase from 'ioredis';

const MODELS = {
  minishop: {
    index: 0,
    prefix: 'minishops.'
  },
  template: {
    index: 1,
    prefix: 'templates.'
  },
  user: {
    index: 2,
    prefix: 'users.'
  },
  product: {
    index: 3,
    prefix: 'products.'
  },
  category: {
    index: 4,
    prefix: 'categorys.'
  },
};

let dbs = null;

class Redis {
  constructor() {
    this.default_conf = {
      port: Number(process.env.REDIS_PORT),
      host: process.env.REDIS_HOST,
    };
    if (!dbs) {
      dbs = {
        minishop: new RedisDatabase({ ...this.default_conf, db: 0 }),
        template: new RedisDatabase({ ...this.default_conf, db: 1 }),
        user: new RedisDatabase({ ...this.default_conf, db: 2 }),
        product: new RedisDatabase({ ...this.default_conf, db: 3 }),
        category: new RedisDatabase({ ...this.default_conf, db: 4 }),
      };
      console.info('🚀 Redis ready at :', this.default_conf.port);
    }
  }

  /**
   * @description :: select model for queries
   * @param {string} name 
   * @returns 
   */
  model(name) {
    return {
      set: async (key, value) => await this.set(dbs[name], MODELS[name].prefix, key, value),
      get: async (key) => await this.get(dbs[name], MODELS[name].prefix, key),
      remove: async (key) => await this.remove(dbs[name], MODELS[name].prefix, key),
    };
  }

  /**
   * @description :: set value by hmset
   * @param {string} model 
   * @param {string} key 
   * @param {pbject} value 
   * @returns 
   */
  async set(model, prefix, key, value) {
    try {
      return await model.hmset(prefix.concat(key), { value: JSON.stringify(value) });
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * @description :: get key
   * @param {string} model 
   * @param {string} key 
   * @returns 
   */
  async get(model, prefix, key) {
    try {
      const result = await model.hget(prefix.concat(key), 'value');
      return result ? JSON.parse(result) : false;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * @description :: remove key
   * @param {string} model 
   * @param {string} key 
   * @returns 
   */
  async remove(model, prefix, key) {
    try {
      return await model.del(prefix.concat(key), 'value');
    } catch (err) {
      throw new Error(err);
    }
  }

}

export default Redis;