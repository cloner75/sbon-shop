// Models
import offerModel from "./../../models/product/offer";
import userModel from './../../models/user/user';

// Helper
import MongoHelper from "./../../helpers/mongo";
import ResponseGenerator from "./../../helpers/response";

// Services
import OfferService from './../../services/product/offer';


// Consts
const Response = new ResponseGenerator('offer-service');
const OFFER = 'offer';
const METHODS = {
  CREATE: 'create',
  FIND: 'find',
  FIND_ONE: 'find-one',
  FIND_ONE_DASHBOARD: 'find-dashboard',
  UPDATE: 'update'
};

/**
 * @description :: The Controller service
 *
 * @class Controller
 * @example
 * var Ctrl = new Controller();
 */
export default class Offer extends OfferService {
  constructor() {
    super();
  }

  /**
   * @description :: Get Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async find(req, reply) {
    try {
      const { where, options } = MongoHelper.initialMongoQuery(req.query, OFFER);
      const result = await offerModel.paginate(where, options);
      return reply.send(
        Response.generator(200, result, METHODS.FIND, req.executionTime)
      );
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.FIND, req.executionTime, err)
      );
    }
  }

  /**
   * @description :: Get One Document
   * @param {request} req 
   * @param {Reply} reply 
   */
  async findOne(req, reply) {
    try {
      const { status, result } = await super.findOne(req.params.code);
      if (status === 200) {
        const getUser = await userModel.findOne({ _id: req.user._id });
        if (getUser && !getUser.offerCodes.includes(req.params.code)) {
          return reply.send(
            Response.generator(200, result, METHODS.FIND_ONE, req.executionTime)
          );
        }
      }
      return reply.status(404).send(
        Response.generator(404, {}, METHODS.FIND_ONE, req.executionTime)
      );
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.FIND_ONE, req.executionTime, err)
      );
    }
  }

  /**
   * @description :: Find One For DashBoard
   * @param {request} req 
   * @param {Reply} reply 
   */
  async findOneDashboard(req, reply) {
    try {
      const { where, options } = MongoHelper.initialMongoQuery(req.query, OFFER);
      const result = await offerModel.paginate({ ...where, _id: req.params.id }, options);
      return reply.send(
        Response.generator(200, result, METHODS.FIND_ONE_DASHBOARD, req.executionTime)
      );
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.FIND_ONE_DASHBOARD, req.executionTime, err)
      );
    }
  }

  /**
   * @description :: Create Document
   * @param {request} req 
   * @param {Reply} reply 
   */
  async create(req, reply) {
    try {
      const result = await offerModel.create({ ...req.body, ownerId: req.user._id });
      return reply.status(200).send(
        Response.generator(200, result, METHODS.CREATE, req.executionTime)
      );
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.CREATE, req.executionTime, err)
      );
    }
  }

  /**
   * @description :: update Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async update(req, reply) {
    try {
      const result = await offerModel.findOneAndUpdate({
        _id: req.params.id,
      },
        { ...req.body, ownerId: req.user._id },
        { new: true }
      );
      return result ?
        reply.status(200).send(
          Response.generator(200, result, METHODS.UPDATE, req.executionTime)
        ) :
        reply.status(404).send(
          Response.generator(404, {}, METHODS.UPDATE, req.executionTime)
        );
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.UPDATE, req.executionTime, err)
      );
    }
  }
}