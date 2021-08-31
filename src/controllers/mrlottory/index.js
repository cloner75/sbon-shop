// Packages
import strongSoap from 'strong-soap';

// Models
import MrLottroyUserModel from './../../models/mrlottory/user';

// Helpers
import MongoHelper from './../../helpers/mongo';
import ResponseGenerator from './../../helpers/response';


// Consts
const MR_LOTTORY = 'mrlottory';
const Response = new ResponseGenerator('mrLottory-service');
const METHODS = {
  CREATE: 'create-user'
};

/**
 * @description :: The Controller service
 *
 * @class Controller
 * @example
 * var Ctrl = new Controller();
 */
export default class MrLottoryController {
  /**
   * @description :: Create Document
   * @param {request} req 
   * @param {Reply} reply 
   */
  async createUser(req, reply) {
    try {
      let orderId = await MrLottroyUserModel.count();
      orderId += 10000010;
      let createOption = await MrLottroyUserModel.create({
        userId: req.user._id,
        ...req.body,
        status: 0,
        orderId
      });
      strongSoap.soap.createClient(process.env.IPG_GET_TOKEN, { }, async (_, client) => {
        const { result } = await client.SalePaymentRequest({
          requestData: {
            LoginAccount: process.env.IPG_LOGIN_ACCOUNT,
            Amount: 1500000,
            OrderId: orderId,
            CallBackUrl: `https://sbon.ir/mrlottory/pay/${orderId}`
          }
        });
        if (result.SalePaymentRequestResult.Token === 0) {
          await MrLottroyUserModel.remove({ _id: createOption._id });
          return reply.send(Response.generator(400, {
            status: result.SalePaymentRequestResult.Status,
            message: result.SalePaymentRequestResult.Message
          }));
        } else {
          await MrLottroyUserModel.updateOne({ _id: createOption._id }, {
            $set: {
              token: result.SalePaymentRequestResult.Token
            }
          });
          createOption.token = result.SalePaymentRequestResult.Token;
          createOption.address = process.env.IPG_TRANSACTION_URL.concat(result.SalePaymentRequestResult.Token);
          return reply.status(201).send(
            Response.generator(201, createOption, {
              token: result.SalePaymentRequestResult.Token,
              address: process.env.IPG_TRANSACTION_URL.concat(result.SalePaymentRequestResult.Token)
            }, METHODS.CREATE, req.executionTime)
          );
        }
      });
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.CREATE, req.executionTime, err)
      );
    }
  }
}