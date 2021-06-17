// Packages
import strongSoap from 'strong-soap';

// Models
import OrderModel from './../../models/user/order';
import ProductModel from './../../models/product/product';
import UserModel from './../../models/user/user';

// Helpers
import MongoHelper from './../../helpers/mongo';
import Response from './../../helpers/response';

// Services
import OfferService from './../../services/product/offer';

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
      let sum = 0;
      Object.assign(req.body, { status: 0, });
      const { products, location, typePayment, offerCode } = req.body;
      for (let index in products) {
        let getProduct = await ProductModel.findById({ _id: products[index].productId });
        let findPrice = false;
        if (getProduct) {
          for (let skus of getProduct.skus) {
            let productSum = 0;
            if (String(products[index].skusId) === String(skus._id)) {
              let calculate = (skus.price * products[index].count) - (((skus.price * products[index].count) * skus.discount) / 100);
              sum += calculate;
              productSum = calculate;
              Object.assign(products[index], {
                skuId: products[index].skusId,
                discount: skus.discount,
                price: skus.price,
                sum: productSum
              });
              findPrice = true;
              break;
            }
          }
        }
        if (!findPrice) {
          return reply.status(404).send(Response.generator(404));
        }
      }
      if (offerCode) {
        const { status, result } = await super.findOne(offerCode);
        if (status === 200) {
          let getUser = await UserModel.findById(req.user._id);
          if (!getUser) {
            return reply.status(404).send(Response.generator(404));
          }
          if (!getUser.offerCodes || !getUser.offerCodes.includes(offerCode)) {
            sum -= result.amount;
            await UserModel.updateOne({ _id: req.user._id }, { $push: { offerCodes: offerCode } });
          }
        }
      }
      const createWallet = await OrderModel.create({
        userId: req.user._id,
        products,
        postPrice: 7000,
        location,
        typePayment,
        sum,
        orderId: Math.floor(Date.now()),
        payment: sum + 7000
      });
      return reply.status(201).send(Response.generator(201, createWallet));
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
          }
          );
        } else {
          await OrderModel.updateOne({ orderId }, { $set: { status: 3 } });
        }
        return reply.redirect(301, `/payment/verify/${orderId}`);
      });
    } catch (err) {
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
        if (result.SalePaymentRequestResult.Token === 0) {
          return reply.send(Response.generator(400, {
            status: result.SalePaymentRequestResult.Status,
            message: result.SalePaymentRequestResult.Message
          }));
        } else {
          await OrderModel.updateOne({ _id: req.body._id }, { $set: { token: result.SalePaymentRequestResult.Token } });
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
      return result ?
        reply.status(200).send(Response.generator(200, getOrder)) :
        reply.status(404).send(Response.generator(404));
    } catch (err) {
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }
}

