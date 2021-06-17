// package
import { CronJob } from 'cron';
import moment from 'moment';

// Models
import OrderModel from './../models/user/order';

// Consts 
class CronJobs {
  constructor() {
    this.removeOrders();
  }

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
}

export default CronJobs;