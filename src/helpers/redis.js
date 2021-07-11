import RedisDatabase from 'ioredis';

const MODELS = {
  minishop: 0,
  template: 1,
  user: 2,
  product: 3,
  category: 4,
};
const DEFAULT_CONF = {
  port: 6379,
  host: "127.0.0.1",
};
let dbs = null;

class Redis {
  constructor() {
    if (!dbs) {
      dbs = {
        minishop: new RedisDatabase({ ...DEFAULT_CONF, db: 0 }),
        template: new RedisDatabase({ ...DEFAULT_CONF, db: 1 }),
        user: new RedisDatabase({ ...DEFAULT_CONF, db: 2 }),
        product: new RedisDatabase({ ...DEFAULT_CONF, db: 3 }),
        category: new RedisDatabase({ ...DEFAULT_CONF, db: 4 }),
      };
      console.info('🚀 Redis ready at :', DEFAULT_CONF.port);
    }
  }

  /**
   * @description :: select model for queries
   * @param {string} name 
   * @returns 
   */
  model(name) {
    return {
      set: async (key, value) => await this.set(dbs[name], key, value),
      get: async (key) => await this.get(dbs[name], key),
      remove: async (key) => await this.remove(dbs[name], key),
    };
  }

  /**
   * @description :: set value by hmset
   * @param {string} model 
   * @param {string} key 
   * @param {pbject} value 
   * @returns 
   */
  async set(model, key, value) {
    try {
      return await model.set(key, JSON.stringify(value));
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
  async get(model, key) {
    try {
      const result = await model.get(key);
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
  async remove(model, key) {
    try {
      return await model.del(key);
    } catch (err) {
      throw new Error(err);
    }
  }

}

export default Redis;