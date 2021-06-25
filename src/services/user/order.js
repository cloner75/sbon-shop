// Models
import OrderModel from "./../../models/user/order";
import ProductModel from './../../models/product/product';
import UserModel from './../../models/user/user';
import OfferService from './../../services/product/offer';

// Helpers
import Response from './../../helpers/response';


/**
 * @description :: The Controller service
 *
 * @class Controller
 * @example
 * var Ctrl = new Controller();
 */
export default class OrderService {

  /**
   * @description :: Get One Document
   * @param {string} code 
   */
  static async singleOrderCreate(req) {
    // req.user.type === 5 ? 'major' :
    const priceField = 'price';
    let sum = 0;
    let allSbon = 0;
    Object.assign(req.body, { status: 0 });
    const { products, location, typePayment, offerCode } = req.body;
    for (let index in products) {
      let getProduct = await ProductModel.findById({ _id: products[index].productId });
      let findPrice = false;
      if (getProduct) {
        for (let skus of getProduct.skus) {
          let sbon = 0;
          if (String(products[index].skusId) === String(skus._id)) {
            let calculate = (skus[priceField] * products[index].count) - (((skus[priceField] * products[index].count) * skus.discount) / 100);
            sbon = skus.sbon * products[index].count;
            sum += calculate;
            allSbon += sbon;
            Object.assign(products[index], {
              skuId: products[index].skusId,
              discount: skus.discount,
              price: skus[priceField],
              sum: calculate,
              sbon
            });
            findPrice = true;
            break;
          }
        }
      }
      if (!findPrice) {
        return { status: 404, response: Response.generator(404) };
      }
    }
    if (offerCode) {
      const { status, result } = await OfferService.findOne(offerCode);
      if (status === 200) {
        let getUser = await UserModel.findById(req.user._id);
        if (!getUser) {
          return { status: 404, response: Response.generator(404) };
        }
        if (!getUser.offerCodes || !getUser.offerCodes.includes(offerCode)) {
          sum -= result.amount;
          await UserModel.updateOne({ _id: req.user._id }, { $push: { offerCodes: offerCode } });
        }
      }
    }
    const createOrder = await OrderModel.create({
      userId: req.user._id,
      products,
      postPrice: Number(process.env.POST_PRICE),
      location,
      typePayment,
      sum,
      sbon: allSbon,
      orderId: Math.floor(Date.now()),
      payment: sum + Number(process.env.POST_PRICE),
    });
    return { status: 200, response: Response.generator(200, createOrder) };
  }

  /**
   * @description :: Get One Document
   * @param {string} code 
   */
  static async majorOrderCreate(req) {
    const priceField = 'major';
    let sum = 0;
    let allSbon = 0;
    Object.assign(req.body, { status: 0 });
    const { products, location, typePayment } = req.body;
    for (let index in products) {
      let getProduct = await ProductModel.findById({ _id: products[index].productId });
      let findPrice = false;
      if (getProduct) {
        for (let skus of getProduct.skus) {
          let sbon = 0;
          if (String(products[index].skusId) === String(skus._id)) {
            let calculate = 0;
            if (skus[priceField]) {
              calculate = skus[priceField] * products[index].count;
              Object.assign(products[index], {
                discount: 0,
                price: skus[priceField],
              });
            } else {
              calculate = (skus['price'] * products[index].count) - (((skus['price'] * products[index].count) * skus.discount) / 100);
              Object.assign(products[index], {
                discount: skus.discount,
                price: skus['price'],
              });
            }
            sbon = skus.sbon * products[index].count;
            sum += calculate;
            allSbon += sbon;
            Object.assign(products[index], {
              skuId: products[index].skusId,
              sum: calculate,
              sbon
            });
            findPrice = true;
            break;
          }
        }
      }
      if (!findPrice) {
        return { status: 404, response: Response.generator(404) };
      }
    }
    const createOrder = await OrderModel.create({
      userId: req.user._id,
      products,
      postPrice: Number(process.env.POST_PRICE),
      location,
      typePayment,
      sum,
      sbon: allSbon,
      orderId: Math.floor(Date.now()),
      payment: sum + Number(process.env.POST_PRICE),
      isMajor: true
    });
    return { status: 200, response: Response.generator(200, createOrder) };


  }
}