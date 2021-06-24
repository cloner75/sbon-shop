// Packages
import strongSoap from 'strong-soap';

// Models
import OrderModel from './../../models/user/order';
import ProductModel from './../../models/product/product';
import UserModel from './../../models/user/user';
import WalletModel from './../../models/user/wallet';

// Helpers
import MongoHelper from './../../helpers/mongo';
import Response from './../../helpers/response';

// Services
import OfferService from './../../services/product/offer';
import OrderService from './../../services/user/order';

// Consts
const ORDER = 'order';

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
      const { where, options } = MongoHelper.initialMongoQuery(req.query, ORDER);
      const result = await OrderModel.paginate({
        userId: req.user._id,
        ...where
      }, options);

      return reply.status(200).send(Response.generator(200, result.docs));
    } catch (err) {
      return reply.status(500).send(Response.generator(500, err.message));
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
      const result = await OrderModel.paginate(where, options);
      return reply.status(200).send(Response.generator(200, result));
    } catch (err) {
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }


  /**
   * @description :: update Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async update(req, reply) {
    console.log('update order =>');
    try {
      const orderId = req.params.orderId;
      const getOrder = await OrderModel.findOne({ orderId });
      console.log('update getOrder => ', getOrder);
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
        console.log('after confirm payment result => ', result);
        if (result.ConfirmPaymentResult.Status == 0 && result.ConfirmPaymentResult.RRN) {
          await OrderModel.updateOne({ orderId }, {
            $set: {
              status: 1,
              RRN: String(result.ConfirmPaymentResult.RRN)
            }
          });
          let getWallet = await WalletModel.findOne({ userId: req.user._id });
          console.log('get wallet =>', getWallet);
          if (!getWallet) {
            getWallet = await WalletModel.create({
              userId: req.user._id,
              amount: 0,
              logs: [{
                action: 'اولین خرید'
              }]
            });
          }
          await WalletModel.updateOne(
            { userId: req.user._id },
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
        } else {
          await OrderModel.updateOne({ orderId }, { $set: { status: 3 } });
        }
        return reply.redirect(301, `/payment/verify/${orderId}`);
      });
    } catch (err) {
      console.log('update err =>', err);
      return reply.status(500).send(Response.generator(500, err.message));
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
        return reply.status(404).send(Response.generator(404, {}));
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
        return reply.send(Response.generator(200, result));
      });
    } catch (err) {
      return reply.status(500).send(Response.generator(500, err.message));
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
        return res.staus(404).send(Response.generator(404, err.message));
      }
      strongSoap.soap.createClient(process.env.IPG_GET_TOKEN, {}, async (_, client) => {
        const { result } = await client.SalePaymentRequest({
          requestData: {
            LoginAccount: process.env.IPG_LOGIN_ACCOUNT,
            Amount: getOrder.payment,
            OrderId: getOrder.orderId,
            CallBackUrl: `https://sbon.ir/pay/${getOrder.orderId}`
          }
        });
        console.log('get result create client soap => ', result);
        if (result.SalePaymentRequestResult.Token === 0) {
          return reply.send(Response.generator(400, {
            status: result.SalePaymentRequestResult.Status,
            message: result.SalePaymentRequestResult.Message
          }));
        } else {
          await OrderModel.updateOne({ _id: req.body._id }, { $set: { token: result.SalePaymentRequestResult.Token } });
          console.log('show result after update =>', {
            token: result.SalePaymentRequestResult.Token,
            address: process.env.IPG_TRANSACTION_URL.concat(result.SalePaymentRequestResult.Token)
          });
          return reply.send(Response.generator(200, {
            token: result.SalePaymentRequestResult.Token,
            address: process.env.IPG_TRANSACTION_URL.concat(result.SalePaymentRequestResult.Token)
          }));
        }
      });
    } catch (err) {
      return reply.status(500).send(Response.generator(500, err.message));
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
        reply.status(200).send(Response.generator(200, getOrder)) :
        reply.status(404).send(Response.generator(404));
    } catch (err) {
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }
}

