// Modules
import moment from 'jalali-moment';

// Models
import offerModel from "./../../models/product/offer";

/**
 * @description :: The Controller service
 *
 * @class Controller
 * @example
 * var Ctrl = new Controller();
 */
export default class OfferService {
  /**
   * @description :: Get One Document
   * @param {string} code 
     * @param {string} code 
   * @param {string} code 
   */
  static async findOne(code) {
    const result = await offerModel.findOne({ code });
    if (!result || !result.status) {
      return { status: 404 };
    } else if (moment().locale('fa').format('YYYY-MM-DD') > moment(result.expirationTime).format('YYYY-MM-DD')) {
      await offerModel.updateOne({ code: req.params.code }, { status: 0 });
      return { status: 404 };
    } else {
      return { status: 200, result };
    }
  }
}