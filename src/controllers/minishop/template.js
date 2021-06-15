// Packages

// Models
import TemplateModel from './../../models/minishop/template';

// Helpers
import MongoHelper from './../../helpers/mongo';
import Response from './../../helpers/response';
import Logger from './../../helpers/logger';


// Consts
const TEMPLATE = 'template';

/**
 * @description :: The Controller service
 *
 * @class Controller
 * @example
 * var Ctrl = new Controller();
 */
export default class OptionController {
  /**
   * @description :: Create Document
   * @param {request} req 
   * @param {Reply} reply 
   */
  async create(req, reply) {
    try {
      const createTemplate = await TemplateModel.create(req.body);
      Logger.info({
        controller: 'Template',
        api: 'create',
        isSuccess: true,
        message: '201',
      });
      return reply.status(201).send(Response.generator(201, createTemplate));
    } catch (err) {
      Logger.error({
        controller: 'Template',
        api: 'create',
        isSuccess: false,
        message: err.message,
      });
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }

  /**
  * @description :: Get One Document
  * @param {request} req 
  * @param {Reply} reply 
  */
  async find(req, reply) {
    try {
      const { where, options } = MongoHelper.initialMongoQuery(req.query, TEMPLATE);
      const result = await TemplateModel.paginate(where, options);
      Logger.info({
        controller: 'Template',
        api: 'find',
        isSuccess: true,
        message: '200',
      });
      return reply.status(200).send(Response.generator(200, result.docs));
    } catch (err) {
      Logger.error({
        controller: 'Template',
        api: 'find',
        isSuccess: false,
        message: err.message,
      });
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }

  /**
  * @description :: Get One Document
  * @param {request} req 
  * @param {Reply} reply 
  */
  async findOne(req, reply) {
    try {
      const { where, options } = MongoHelper.initialMongoQuery(req.query, TEMPLATE);
      const result = await TemplateModel.paginate({
        _id: req.params.id,
        ...where
      }, options);

      Logger.info({
        controller: 'Template',
        api: 'findOne',
        isSuccess: true,
        message: '200',
      });
      if (!result.docs[0]) {
        return reply.status(404).send(Response.generator(404));
      }
      result = result.docs[0];
      const htmlTest = `
      <!DOCTYPE html>
            <html>
            <head>
            <title>Page Title</title>
            </head>
            <header>
            <menu>${result.header.menu}</menu>
            <value>${result.header.value}</value>
            <img src="${result.logo}" />
            </header>
            <body>
            
            <h1>This is a Heading</h1>
            <p>This is a paragraph.</p>

            </body>
            </html>
      `;
      return reply.type('text/html').send(htmlTest);
    } catch (err) {
      Logger.error({
        controller: 'Template',
        api: 'findOne',
        isSuccess: false,
        message: err.message,
      });
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }

  /**
   * @description :: update Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async update(req, reply) {
    try {
      const update = await TemplateModel.findOneAndUpdate(
        {
          _id: req.params.id
        },
        req.body,
        {
          new: true,
        }
      );

      Logger.info({
        controller: 'Template',
        api: 'update',
        isSuccess: true,
        message: '200',
      });
      return update ? reply.send(Response.generator(200, update)) :
        reply.status(404).send(Response.generator(404));
    } catch (err) {
      Logger.info({
        controller: 'Template',
        api: 'update',
        isSuccess: false,
        message: err.message,
      });
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }

  /**
   * @description :: Delete Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async remove(req, reply) {
    try {
      const remove = await TemplateModel.deleteOne(
        { _id: req.params.id },
      );

      Logger.info({
        controller: 'Template',
        api: 'remove',
        isSuccess: true,
        message: '200',
      });
      return remove.n ?
        reply.send(Response.generator(200)) :
        reply.status(404).send(Response.generator(404));
    } catch (err) {
      Logger.info({
        controller: 'Template',
        api: 'remove',
        isSuccess: false,
        message: err.message,
      });
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }
}