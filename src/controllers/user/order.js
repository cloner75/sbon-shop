// Packages
import strongSoap from 'strong-soap';

// Models
import OrderModel from './../../models/user/order';
import WalletModel from './../../models/user/wallet';

// Helpers
import MongoHelper from './../../helpers/mongo';
import ResponseGenerator from './../../helpers/response';

// Services
import OfferService from './../../services/product/offer';
import OrderService from './../../services/user/order';

// Consts
const Response = new ResponseGenerator('order-service');
const ORDER = 'order';
const METHODS = {
  CREATE: 'create',
  FIND: 'find',
  FIND_ONE: 'find-one',
  REMOVE: 'remove',
  UPDATE: 'update',
  FIND_SUPER_ADMIN: 'findSuperAdmin',
  VERIFY: 'verify',
  PAY: 'pay',
  CANCEL_ORDER: 'cancelOrder',
};

/**
 * @description :: convert toman to rial
 * @param {number} price 
 * @returns rial
 */
const toRial = price => price * 10;

/**
 * @description :: The Controller service
 *
 * @class Controller
 * @example
 * var Ctrl = new Controller();
 */
export default class OrderController extends OfferService {
  constructor() {
    super();
  };

  /**
   * @description :: Create Document
   * @param {request} req 
   * @param {Reply} reply 
   */
  async create(req, reply) {
    try {
      const result = req.user.type === 5 ?
        await OrderService.majorOrderCreate(req) :
        await OrderService.singleOrderCreate(req);
      return reply.status(result.status).send(result.response);
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.CREATE, req.executionTime, err)
      );
    }
  }

  /**
  * @description :: Get One Document
  * @param {request} req 
  * @param {Reply} reply 
  */
  async find(req, reply) {
    try {
      const { where, options } = MongoHelper.initialMongoQuery(req.query, ORDER);
      const result = await OrderModel.paginate({
        userId: req.user._id,
        ...where
      }, options);

      return reply.status(200).send(
        Response.generator(200, result.docs, METHODS.FIND, req.executionTime)
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
  async findSuperAdmin(req, reply) {
    try {
      const { where, options } = MongoHelper.initialMongoQuery(req.query, ORDER);
      // const result = await OrderModel.paginate({ ...where, status: 1 }, options);
      const result = await OrderModel.paginate( where , options);
      return reply.status(200).send(
        Response.generator(200, result, METHODS.FIND_SUPER_ADMIN, req.executionTime)
      );
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.FIND_SUPER_ADMIN, req.executionTime, err)
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
      const orderId = req.params.orderId;
      const getOrder = await OrderModel.findOne({ orderId });
      if (!getOrder) {
        return reply.redirect(301, `/payment/verify/${orderId}`);
      }
      strongSoap.soap.createClient("https://pec.shaparak.ir/NewIPGServices/Confirm/ConfirmService.asmx?WSDL", {}, async (_, client) => {
        const { result } = await client.ConfirmPayment({
          requestData: {
            LoginAccount: process.env.IPG_LOGIN_ACCOUNT,
            Token: getOrder.token
          }
        });
        if (result.ConfirmPaymentResult.Status == 0 && result.ConfirmPaymentResult.RRN) {
          await OrderModel.updateOne({ orderId }, {
            $set: {
              status: 1,
              RRN: String(result.ConfirmPaymentResult.RRN)
            }
          });
          let getWallet = await WalletModel.findOne({ userId: getOrder.userId });
          console.log('get wallet =>', getWallet);
          if (!getWallet) {
            getWallet = await WalletModel.create({
              userId: getOrder.userId,
              amount: 0,
              logs: [{
                action: 'اولین خرید'
              }]
            });
          }
          await WalletModel.updateOne(
            { userId: getOrder.userId },
            {
              $set: { amount: getWallet.amount + getOrder.sbon },
              $push: {
                logs: {
                  action: getOrder.typePayment,
                }
              }
            },
            { upsert: true }
          );
        } else if (result.ConfirmPaymentResult.Status !== -1533) {
          await OrderModel.updateOne({ orderId }, { $set: { status: 3 } });
        }
        return reply.redirect(301, `/payment/verify/${orderId}`);
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
      const orderId = req.body.orderId;
      const getOrder = await OrderModel.findOne({ orderId });
      if (!getOrder) {
        return reply.status(404).send(
          Response.generator(404, {}, METHODS.VERIFY, req.executionTime)
        );
      }
      strongSoap.soap.createClient("https://pec.shaparak.ir/NewIPGServices/Confirm/ConfirmService.asmx?WSDL", {}, async (_, client) => {
        const { result } = await client.ConfirmPayment({
          requestData: {
            LoginAccount: process.env.IPG_LOGIN_ACCOUNT,
            Token: getOrder.token
          }
        });
        Object.assign(result.ConfirmPaymentResult,
          {
            RRN: getOrder.RRN,
            orderStatus: getOrder.status
          }
        );
        return reply.send(
          Response.generator(200, result, METHODS.VERIFY, req.executionTime)
        );
      });
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.VERIFY, req.executionTime, err)
      );
    }
  }


  /**
   * @description :: Pay Off 
   * @param {request} req 
   * @param {Reply} reply 
   */
  async pay(req, reply) {
    try {
      let getOrder = await OrderModel.findById(req.body._id);
      if (!getOrder) {
        return res.staus(404).send(
          Response.generator(404, {}, METHODS.PAY, req.executionTime)
        );
      }
      strongSoap.soap.createClient(process.env.IPG_GET_TOKEN, {}, async (_, client) => {
        const { result } = await client.SalePaymentRequest({
          requestData: {
            LoginAccount: process.env.IPG_LOGIN_ACCOUNT,
            Amount: toRial(getOrder.payment),
            OrderId: getOrder.orderId,
            CallBackUrl: `https://sbon.ir/pay/${getOrder.orderId}`
          }
        });
        if (result.SalePaymentRequestResult.Token === 0) {
          return reply.send(Response.generator(400, {
            status: result.SalePaymentRequestResult.Status,
            message: result.SalePaymentRequestResult.Message
          }));
        } else {
          await OrderModel.updateOne({ _id: req.body._id }, { $set: { token: result.SalePaymentRequestResult.Token } });
          return reply.send(
            Response.generator(
              200,
              {
                token: result.SalePaymentRequestResult.Token,
                address: process.env.IPG_TRANSACTION_URL.concat(result.SalePaymentRequestResult.Token)
              },
              METHODS.PAY,
              req.executionTime
            )
          );
        }
      });
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.PAY, req.executionTime, err)
      );
    }
  }

  /**
  * @description :: Cancel Order
  * @param {request} req 
  * @param {Reply} reply 
  */
  async cancelOrder(req, reply) {
    try {
      const getOrder = await OrderModel.findOneAndUpdate(
        { orderId: req.params.orderId },
        { $set: { status: 3 } },
        { new: true }
      );
      return getOrder ?
        reply.status(200).send(
          Response.generator(200, getOrder, METHODS.CANCEL_ORDER, req.executionTime)
        ) :
        reply.status(404).send(
          Response.generator(404, {}, METHODS.CANCEL_ORDER, req.executionTime)
        );
    } catch (err) {
      return reply.status(500).send(
        Response.ErrorHandler(METHODS.CANCEL_ORDER, req.executionTime, err)
      );
    }
  }
}

