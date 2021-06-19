// Packages
import mongoose from 'mongoose';

// Helpers
import CronJobs from './cronjob';

// Confis
import SwaggerConfig from './../configs/swagger';
/**
 * @description :: Class For Connection Service
 */
class Connection {
  /**
   * @description :: Constructor
   * @param {class} app
   */
  constructor(app) {
    this._port = process.env.PORT;
    this.app = app;
  }

  /**
   * @description :: Setting And Router
   */
  async settings() {

    await this.app.register(require('fastify-express'));
    this.app.use(require('cors')());
    this.app.use(require('dns-prefetch-control')());
    this.app.use(require('frameguard')());
    this.app.use(require('hsts')());
    this.app.use(require('ienoopen')());
    this.app.use(require('x-xss-protection')());

    this.app.addContentTypeParser('*', (_req, done) => done());
    this.app.setErrorHandler((error, _request, reply) => {
      if (error) {
        reply.send(error);
      }
    });
    this.app.register(require('fastify-swagger'), SwaggerConfig.options);
    this.app.register(require('./../routers/product'), {
      logLevel: process.env.LOG_LEVEL,
      prefix: '/api/v1/product'
    });
    // this.app.register(require('./../routers/option'), {
    //   logLevel: process.env.LOG_LEVEL,
    //   prefix: '/api/v1/option'
    // });
    // this.app.register(require('./../routers/user'), {
    //   logLevel: process.env.LOG_LEVEL,
    //   prefix: '/api/v1/user'
    // });
    // this.app.register(require('./../routers/telegram'), {
    //   logLevel: process.env.LOG_LEVEL,
    //   prefix: '/api/v1/bot'
    // });
    this.app.register(require('./../routers/csv'), {
      logLevel: process.env.LOG_LEVEL,
      prefix: '/api/v1/csv'
    });
    // this.app.register(require('./../routers/minishop'), {
    //   logLevel: process.env.LOG_LEVEL,
    //   prefix: '/api/v1/minishop'
    // });
    // this.app.register(require('./../routers/pay'), {
    //   logLevel: process.env.LOG_LEVEL,
    //   prefix: '/pay'
    // });


    return this.app;
  }

  /**
   * @description :: Connect To Mongodb
   */
  database() {
    const {
      MONGO_HOST,
      MONGO_PORT,
      MONGO_DATABASE,
      MONGO_USERNAME,
      MONGO_PASSWORD
    } = process.env;
    let dbConfig = {
      auth: ''
    };
    switch (process.env.NODE_ENV) {
      case 'production':
        Object.assign(dbConfig, {
          address: `mongodb://${MONGO_USERNAME}:4V5Z!M*pTgBsZiNOp#DK%Hq@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`
        });
        break;
      case 'development':
        Object.assign(dbConfig, {
          address: `mongodb://127.0.0.1:27017/${MONGO_DATABASE}`
        });
        break;
    }
    if (mongoose.connection.readyState === 0) {
      mongoose.connect(
        `${dbConfig.address}?${dbConfig.auth}`,
        {
          useNewUrlParser: true,
          useFindAndModify: false,
          useCreateIndex: true,
          useUnifiedTopology: true,
        },
        (error) => {
          if (error) {
            console.error(`Mongo error :${error}`);
            process.exit(1);
          } else {
            console.info('🚀 Mongodb ready at :', dbConfig.address);
          }
        },
      );
    }
  }

  /**
   * @description :: Start Server
   * @param {class} app
   */
  server() {
    this.settings()
      .then(_response => {
        this.app.listen(this._port, process.env.HOST, (err, address) => {
          if (err) {
            console.error(err);
            process.exit(1);
          }
          console.log(`🚀 Server ready at ${address}`);
          this.database();
          new CronJobs();
          this.app.swagger();
        });
      });
  }
}

export default Connection;
