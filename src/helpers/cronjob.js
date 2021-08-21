// package
import { CronJob } from 'cron';
import moment from 'moment';

import { createWriteStream } from 'fs';
import { SitemapStream } from 'sitemap';

// Models
import OrderModel from './../models/user/order';
import ProductModel from './../models/product/product';

// Consts 
class CronJobs {
  constructor() {
    this.removeOrders();
    this.generateSiteMap();
  }

  /**
   * @description :: remove order not pay
   */
  removeOrders() {
    try {
      const job = new CronJob('* * * * *', async function () {
        let checkDate = new Date();
        checkDate = moment(new Date(checkDate.getTime() - 30 * 60000));
        await OrderModel.updateMany(
          {
            createdAt: { $lte: checkDate },
            status: 0,
          },
          {
            $set: {
              status: 3
            }
          }
        );
      }, null, true, 'Asia/Tehran');
      job.start();
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * @description :: generate sitemap.xml
   */
  generateSiteMap() {
    try {
      const job = new CronJob('* 5 * * * *', async function () {
        const getAllProducts = await ProductModel.find({ status: { $ne: 4 } });
        const sitemap = new SitemapStream({ hostname: 'http://sbon.ir/' });
        const writeStream = createWriteStream('./sitemap.xml');
        sitemap.pipe(writeStream);
        getAllProducts.map(item => {
          sitemap.write({
            loc: item.slug,
            url: item.slug,
            lastmod: item.updatedAt,
            priority: 0.5
          });
        });

        sitemap.end();
      }, null, true, 'Asia/Tehran');
      job.start();
    } catch (err) {
      console.log(err);
    }
  }
}

export default CronJobs;