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
      console.log('dbs not set');
      dbs = {
        minishop: new RedisDatabase({ ...DEFAULT_CONF, db: 0 }),
        template: new RedisDatabase({ ...DEFAULT_CONF, db: 1 }),
        user: new RedisDatabase({ ...DEFAULT_CONF, db: 2 }),
        product: new RedisDatabase({ ...DEFAULT_CONF, db: 3 }),
        category: new RedisDatabase({ ...DEFAULT_CONF, db: 4 }),
      };
    }
  }

  model(name) {
    const select = dbs[name];
    console.log('model name => ', name);
    return {
      set: (key, value) => this.set(select, key, value),
      get: (key) => this.set(select, key),
    };
  }

  set(model, key, value) {
    console.log('set redis');
    model.zrangebylex('cache:minishop.id.index', `test`, '+', 'limit', '0', '1')
      .then(res => res)
      .catch(err => err);
    return true;
  }

  get(model, key) {
    console.log('get redis');
    return true;
  }

}

export default Redis;