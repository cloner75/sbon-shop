// Packages
import mongoose from 'mongoose';
import fs from 'fs';

// Helpers
import CronJobs from './cronjob';
import Redis from './redis';

// Models
import ProductModel from './../models/product/product';

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
    this.app.register(require('fastify-cookie'), {
      secret: process.env.SECRET_JWT,
    });
    this.app.use(require('cors')());
    this.app.use(require('dns-prefetch-control')());
    this.app.use(require('frameguard')());
    this.app.use(require('hsts')());
    this.app.use(require('ienoopen')());
    this.app.use(require('x-xss-protection')());
    this.app.use(require('express-device').capture());
    // this.app.use(require('cookie-parser')());
    this.app.addContentTypeParser('*', (_req, done) => done());
    this.app.setErrorHandler((error, _request, reply) => {
      if (error) {
        reply.send(error);
      }
    });

    this.app.get('/redirect', (req, reply) => {
      return reply.redirect(+req.query.code, req.query.url);
    });

    this.app.register(require('./../routers/product'), {
      logLevel: process.env.LOG_LEVEL,
      prefix: '/api/v1/product'
    });
    this.app.register(require('./../routers/option'), {
      logLevel: process.env.LOG_LEVEL,
      prefix: '/api/v1/option'
    });
    this.app.register(require('./../routers/user'), {
      logLevel: process.env.LOG_LEVEL,
      prefix: '/api/v1/user'
    });
    this.app.register(require('./../routers/telegram'), {
      logLevel: process.env.LOG_LEVEL,
      prefix: '/api/v1/bot'
    });
    this.app.register(require('./../routers/csv'), {
      logLevel: process.env.LOG_LEVEL,
      prefix: '/api/v1/csv'
    });
    this.app.register(require('./../routers/minishop'), {
      logLevel: process.env.LOG_LEVEL,
      prefix: '/api/v1/minishop'
    });
    this.app.register(require('./../routers/pay'), {
      logLevel: process.env.LOG_LEVEL,
      prefix: '/pay'
    });
    this.app.register(require('../routers/seo'), {
      logLevel: process.env.LOG_LEVEL,
      prefix: '/api/v1/seo'
    });
    this.app.register(require('../routers/mrLottory'), {
      logLevel: process.env.LOG_LEVEL,
      prefix: '/api/v1/mrlottory'
    });
    this.app.register(require('../routers/management'), {
      logLevel: process.env.LOG_LEVEL,
      prefix: '/api/v1/management'
    });


    this.app.get('/v/:shortid', async (req, reply) => {
      try {
        const { shortid } = req.params;
        if (!shortid) {
          return reply.status(301).redirect('/search');
        }
        let getUrl = await ProductModel.findOne({ shortid });
        return reply.status(301).redirect(getUrl ? `/product/${getUrl._id}/${getUrl.slug}` : '/search');
      } catch (err) {
        console.log(err);
        return reply.status(301).redirect('/search');
      }
    });

    this.app.get('/sitemap.xml', (req, reply) => {
      fs.readFile(`./sitemap.xml`, (_err, fileBuffer) => {
        reply
          .header('Content-Type', `application/xml`)
          .send(fileBuffer);
      });
    });

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
   * @description :: error handler 
   */
  globalErrorHandler() {
    process.on('unhandledRejection', (reason, promise) => {
      console.log('unhandledRejection');
    });

    process.on('rejectionHandled', (promise) => {
      console.log('rejectionHandled');
    });

    process.on('uncaughtException', (err, origin) => {
      console.log('uncaughtException');
    });
  }

  /**
   * @description :: Connection Redis For Cache
   */
  Cache() {
    switch (process.env.NODE_ENV) {
      case 'development':
        new Redis();
        break;
      case 'production':
        if (process.env.REDIS_HOST && process.env.REDIS_PORT) {
          new Redis();
        }
        break;
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
          this.Cache();
          this.database();
          new CronJobs();
          console.log(`🚀 Server ready at ${address}`);
        });
      });
  }
}

export default Connection;
