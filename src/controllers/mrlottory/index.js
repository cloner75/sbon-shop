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
      if (req.body.childs.length > 3) {
        return reply.send(
          Response.generator(
            400,
            { message: 'child error' },
            METHODS.CREATE,
            req.executionTime
          )
        );
      }
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
            Response.generator(201, {
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



  /**
   * @description :: verify Pay
   * @param {request} req 
   * @param {reply} reply 
   * @returns 
   */
  async verify(req, reply) {
    try {
      const { orderId } = req.body;
      const getOrder = await MrLottroyUserModel.findOne({ orderId });
      if (!getOrder) {
        return reply.status(404).send(
          Response.generator(404, { }, METHODS.VERIFY, req.executionTime)
        );
      }
      strongSoap.soap.createClient("https://pec.shaparak.ir/NewIPGServices/Confirm/ConfirmService.asmx?WSDL", { }, async (_, client) => {
        const { result } = await client.ConfirmPayment({
          requestData: {
            LoginAccount: process.env.IPG_LOGIN_ACCOUNT,
            Token: getOrder.token
          }
        });
        if (result.ConfirmPaymentResult.Status == 0 && result.ConfirmPaymentResult.RRN) {
          await MrLottroyUserModel.updateOne({ orderId }, {
            $set: {
              status: 1,
              RRN: String(result.ConfirmPaymentResult.RRN)
            }
          });
        } else if (result.ConfirmPaymentResult.Status !== -1533) {
          await MrLottroyUserModel.updateOne({ orderId }, { $set: { status: 3 } });
        }
        return reply.redirect(301, `/payment/verify/${orderId}`);
      });
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.VERIFY, req.executionTime, err)
      );
    }
  }

}