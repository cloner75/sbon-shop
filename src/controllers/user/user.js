// Packages
import { hotp } from 'otplib';
import bcrypt from 'bcrypt';

// Models
import UserModel from './../../models/user/user';
import WalletModel from './../../models/user/wallet';


// Helpers
import JWT from './../../helpers/jsonwebtoken';
import MongoHelper from './../../helpers/mongo';
import Response from './../../helpers/response';
import Logger from './../../helpers/logger';
import Transaction from './../../helpers/transaction';

// Configs
import configs from './../../configs/config';


// Consts
const USER = 'user';
const jwt = new JWT();
const transaction = new Transaction();

/**
 * @description :: The Controller service
 *
 * @class Controller
 * @example
 * var Ctrl = new Controller();
 */
export default class UserController {

  /**
   * @description :: Send Hotp To Phone
   * @param {request} req 
   * @param {Response} reply 
   */
  async hotpSend(req, reply) {
    const start = Date.now();
    try {
      const { phone } = req.body;
      const checkUnique = await UserModel.findOne({ phone });
      if (checkUnique) {
        if (checkUnique.status === 1) {
          Logger.info({
            controller: 'User',
            api: 'hotpSend',
            isSuccess: true,
            message: '409',
            time: start - Date.now()
          });
          return reply.status(409).send(Response.generator(409));
        } else {
          Logger.info({
            controller: 'User',
            api: 'hotpSend',
            isSuccess: true,
            message: '201',
            time: start - Date.now()
          });
          const secret = phone + Date.now();
          const token = hotp.generate(process.env.HOTP_SECRET, secret);
          await transaction.sendSms(phone, token);
          await UserModel.updateOne({ _id: checkUnique._id }, { secret });
          return reply.status(200).send(
            Response.generator(200, {
              createUser: checkUnique
            }));
        }
      } else {
        Logger.info({
          controller: 'User',
          api: 'hotpSend',
          isSuccess: true,
          message: '201',
          time: start - Date.now()
        });
        const secret = phone + Date.now();
        const token = hotp.generate(process.env.HOTP_SECRET, secret);
        await transaction.sendSms(phone, token);
        return reply.status(200).send(
          Response.generator(200, {
            createUser: await UserModel.create({ phone, secret })
          }));
      }
    } catch (err) {
      Logger.error({
        controller: 'User',
        api: 'hotpSend',
        isSuccess: false,
        message: err.message,
        time: start - Date.now()
      });
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }

  /**
   * @description :: Check Hotp 
   * @param {request} req 
   * @param {Response} reply 
   */
  async hotpVerify(req, reply) {
    const start = Date.now();
    const { phone, token } = req.body;
    try {
      const getUser = await UserModel.findOne({ phone });
      if (!getUser) {
        return reply.status(400).send(Response.generator(400));
      }
      const verify = hotp.verify({
        token,
        secret: process.env.HOTP_SECRET,
        counter: getUser.secret,
      });
      if (verify) {
        Logger.info({
          controller: 'User',
          api: 'hotpVerify',
          isSuccess: true,
          message: '202',
          time: start - Date.now()
        });
        return reply.status(202).send(Response.generator(202));
      }

      Logger.info({
        controller: 'User',
        api: 'hotpVerify',
        isSuccess: true,
        message: '400',
        time: start - Date.now()
      });
      return reply.status(400).send(Response.generator(400));
    } catch (err) {
      Logger.error({
        controller: 'User',
        api: 'hotpVerify',
        isSuccess: false,
        message: err.message,
        time: start - Date.now()
      });
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }

  /**
   * @description :: Create Document
   * @param {request} req 
   * @param {Reply} reply 
   */
  async register(req, reply) {
    const start = Date.now();
    try {
      const { username, password, phone } = req.body;
      const salt = await bcrypt.genSaltSync(configs.bcrypt.saltRound);
      const hash = await bcrypt.hashSync(password, salt);
      const completeUser = await UserModel.findOneAndUpdate(
        { phone, status: 0 },
        { username, password: hash, salt, status: 1 },
        { new: true }
      );

      if (completeUser) {
        const { password, salt, ...result } = completeUser.toObject();
        Logger.info({
          controller: 'User',
          api: 'register',
          isSuccess: true,
          message: '200',
          time: start - Date.now()
        });
        await WalletModel.create({
          userId: result._id,
          logs: [{
            action: 'ثبت نام',
          }]
        });
        return reply.send(Response.generator(200, { ...result, token: await jwt.generate(result) }));
      }
      Logger.info({
        controller: 'User',
        api: 'register',
        isSuccess: true,
        message: '404',
        time: start - Date.now()
      });
      return reply.status(404).send(Response.generator(404));
    } catch (err) {
      Logger.error({
        controller: 'User',
        api: 'hotpVerify',
        isSuccess: false,
        message: err.message,
        time: start - Date.now()
      });
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }

  /**
   * @description :: Login User
   * @param {request} req 
   * @param {Reply} reply 
   */
  async login(req, reply) {
    const start = Date.now();
    try {
      const { phone, password: passwordInput } = req.body;
      const getUser = await UserModel.findOne({ phone });
      if (getUser) {
        const { password, phone, locations, ...result } = getUser.toObject();
        const checkPassword = bcrypt.compareSync(passwordInput, password);
        if (checkPassword) {
          Logger.info({
            controller: 'User',
            api: 'login',
            isSuccess: true,
            message: '200',
            time: start - Date.now()
          });
          return reply.send(Response.generator(200, { token: await jwt.generate(result) }));
        }
      }
      Logger.info({
        controller: 'User',
        api: 'login',
        isSuccess: true,
        message: '404',
        time: start - Date.now()
      });
      return reply.status(404).send(Response.generator(404));
    } catch (err) {
      Logger.error({
        controller: 'User',
        api: 'login',
        isSuccess: false,
        message: err.message,
        time: start - Date.now()
      });
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }

  /**
   * @description :: Login User
   * @param {request} req 
   * @param {Reply} reply 
   */
  async refreshToken(req, reply) {
    const start = Date.now();
    let token;
    try {
      token = req.headers.authorization;
      const decode = jwt.verify(token);
      Logger.info({
        controller: 'User',
        api: 'refreshToken',
        isSuccess: true,
        message: '200',
        time: start - Date.now()
      });
      return reply.send(Response.generator(200, { token: decode }));
    } catch (err) {
      if (err.message === 'jwt expired') {
        const decode = jwt.decode(token);
        const getUser = await UserModel.findById(decode._id);
        if (!getUser) {
          return reply.status(404).send(Response.generator(404));
        }
        const { password, salt, phone, ...result } = getUser.toObject();
        token = await jwt.generate(result);
        Logger.info({
          controller: 'User',
          api: 'refreshToken',
          isSuccess: true,
          message: '200',
          time: start - Date.now()
        });
        return reply
          .status(200)
          .send(Response.generator(200, { token }))
          .headers({ 'authorization': token });
      } else {
        return reply.status(500).send(Response.generator(500, err.message));
      }
    }
  }

  /**
   * @description :: Get Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async find(req, reply) {
    const start = Date.now();
    try {
      const { where, options } = MongoHelper.initialMongoQuery(req.query, USER);
      const result = await UserModel.paginate(where, options);
      Logger.info({
        controller: 'User',
        api: 'find',
        isSuccess: true,
        message: '200',
        time: start - Date.now()
      });
      return reply.status(200).send(Response.generator(200, result));
    } catch (err) {
      Logger.error({
        controller: 'User',
        api: 'find',
        isSuccess: false,
        message: err.message,
        time: start - Date.now()
      });
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }

  /**
   * @description :: Get One Document
   * @param {request} req 
   * @param {Reply} reply 
   */
  async findOne(req, reply) {
    const start = Date.now();
    try {
      const { where, options } = MongoHelper.initialMongoQuery(req.query, USER);
      const result = await UserModel.paginate({ _id: req.user._id, ...where }, options);
      Logger.info({
        controller: 'User',
        api: 'findOne',
        isSuccess: true,
        message: '200',
        time: start - Date.now()
      });
      return reply.status(200).send(Response.generator(200, result.docs[0]));
    } catch (err) {
      Logger.error({
        controller: 'User',
        api: 'findOne',
        isSuccess: false,
        message: err.message,
        time: start - Date.now()
      });
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }
  /**
   * @description :: Get One Document
   * @param {request} req 
   * @param {Reply} reply 
   */
  async findOneForComment(req, reply) {
    const start = Date.now();
    try {
      const { usersId, ...query } = req.query;
      const ids = usersId.split(',').filter(item => /^[0-9a-fA-F]{24}$/.test(item.trim()));
      const { where, options } = MongoHelper.initialMongoQuery(query, USER);
      Object.assign(where, { _id: { $in: ids } });
      Object.assign(options, { select: 'username avatar' });
      const result = await UserModel.paginate(where, options);
      Logger.info({
        controller: 'User',
        api: 'findOne',
        isSuccess: true,
        message: '200',
        time: start - Date.now()
      });
      return reply.status(200).send(Response.generator(200, result));
    } catch (err) {
      Logger.error({
        controller: 'User',
        api: 'findOne',
        isSuccess: false,
        message: err.message,
        time: start - Date.now()
      });
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }

  /**
   * @description :: update Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async update(req, reply) {
    const start = Date.now();
    try {
      const { password, ...result } = req.body;
      if (password) {
        const salt = await bcrypt.genSaltSync(configs.bcrypt.saltRound);
        const hash = await bcrypt.hashSync(password, salt);
        Object.assign(result, {
          password: hash,
          salt
        });
      }
      const update = await UserModel.findOneAndUpdate(
        { _id: req.user._id },
        result,
        {
          new: true,
          fields: { password: 0, salt: 0 },
        }
      );
      if (update) {
        Logger.info({
          controller: 'User',
          api: 'update',
          isSuccess: true,
          message: '200',
          time: start - Date.now()
        });
        return reply.send(Response.generator(200, update));
      }
      Logger.info({
        controller: 'User',
        api: 'update',
        isSuccess: true,
        message: '404',
        time: start - Date.now()
      });
      return reply.status(404).send(Response.generator(404));
    } catch (err) {
      Logger.error({
        controller: 'User',
        api: 'update',
        isSuccess: false,
        message: err.message,
        time: start - Date.now()
      });
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }

  /**
   * @description :: update telegram token Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async updateTelegramToken(req, reply) {
    const start = Date.now();
    try {
      const chatId = req.body.chatId;
      const update = await UserModel.findOneAndUpdate(
        { _id: req.user._id },
        { 'telegram.id': chatId },
        {
          new: true,
          fields: { password: 0, salt: 0 },
        }
      );
      if (update) {
        Logger.info({
          controller: 'User',
          api: 'update',
          isSuccess: true,
          message: '200',
          time: start - Date.now()
        });
        return reply.send(Response.generator(200, update));
      }
      Logger.info({
        controller: 'User',
        api: 'update',
        isSuccess: true,
        message: '404',
        time: start - Date.now()
      });
      return reply.status(404).send(Response.generator(404));
    } catch (err) {
      Logger.error({
        controller: 'User',
        api: 'update',
        isSuccess: false,
        message: err.message,
        time: start - Date.now()
      });
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }

  /**
   * @description :: update Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async updateLocation(req, reply) {
    const start = Date.now();
    try {
      const { type, _id, ...location } = req.body;
      let insertData = {
        'locations.$.default': location.default,
        'locations.$.lat': location.lat,
        'locations.$.lng': location.lng,
        'locations.$.originalAddress': location.originalAddress,
        'locations.$.state': location.state,
        'locations.$.country': location.country,
        'locations.$.city': location.city,
        'locations.$.village': location.village,
        'locations.$.zipCode': location.zipCode,
        'locations.$.plaque': location.plaque,
        'locations.$.hasReceiver': location.hasReceiver,
        'locations.$.receiver': {}
      };
      if (location.hasReceiver) {
        Object.assign(insertData, {
          'locations.$.receiver': {
            firstName: location.receiver.firstName,
            lastName: location.receiver.lastName,
            nationalId: location.receiver.nationalId,
            phoneNumber: location.receiver.phoneNumber,
          }
        });
      }
      let update = {};
      // 1 set , 2 update ,3 remove
      switch (type) {
        case 1:
          insertData = {
            default: location.default,
            lat: location.lat,
            lng: location.lng,
            originalAddress: location.originalAddress,
            state: location.state,
            country: location.country,
            city: location.city,
            village: location.village,
            zipCode: location.zipCode,
            plaque: location.plaque,
            hasReceiver: location.hasReceiver,
            receiver: {}
          };
          if (location.hasReceiver) {
            Object.assign(insertData, {
              'receiver': {
                firstName: location.receiver.firstName,
                lastName: location.receiver.lastName,
                nationalId: location.receiver.nationalId,
                phoneNumber: location.receiver.phoneNumber,
              }
            });
          }
          update = await UserModel.findOneAndUpdate({
            _id: req.user._id,
          }, { $push: { locations: insertData } }, {
            new: true,
            fields: { password: 0, salt: 0, phone: 0 },
          });
          break;
        case 2:
          update = await UserModel.findOneAndUpdate({
            _id: req.user._id,
            'locations._id': _id
          }, insertData, {
            new: true,
            fields: { password: 0, salt: 0, phone: 0 },
          });
          break;
        case 3:
          update = await UserModel.findOneAndUpdate({
            _id: req.user._id,
            'locations._id': _id
          }, { $pull: { locations: { _id } } }, {
            new: true,
            fields: { password: 0, salt: 0, phone: 0 },
          });
          break;
      }
      if (update) {
        Logger.info({
          controller: 'User',
          api: 'update',
          isSuccess: true,
          message: '200',
          time: start - Date.now()
        });
        return reply.send(Response.generator(200, update));
      }
      Logger.info({
        controller: 'User',
        api: 'update',
        isSuccess: true,
        message: '404',
        time: start - Date.now()
      });
      return reply.status(404).send(Response.generator(404));
    } catch (err) {
      Logger.error({
        controller: 'User',
        api: 'update',
        isSuccess: false,
        message: err.message,
        time: start - Date.now()
      });
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }
  /**
   * @description :: Remove Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async remove(req, reply) {
    const start = Date.now();
    try {
      const update = await UserModel.updateOne({
        _id: req.user._id,
        type: { $ne: 4 }
      }, { $set: { type: 4 } });
      if (update.nModified) {
        Logger.info({
          controller: 'User',
          api: 'remove',
          isSuccess: true,
          message: '200',
          time: start - Date.now()
        });
        return reply.send(Response.generator(200));
      }

      Logger.info({
        controller: 'User',
        api: 'remove',
        isSuccess: true,
        message: '404',
        time: start - Date.now()
      });
      return reply.status(404).send(Response.generator(404));
    } catch (err) {
      Logger.error({
        controller: 'User',
        api: 'remove',
        isSuccess: false,
        message: err.message,
        time: start - Date.now()
      });
      return reply.status(500).send(Response.generator(500, err.message));
    }
  }

  /**
   * @description :: logout User
   * @param {request} req 
   * @param {Reply} reply 
   */
  async logout(req, reply) {
    try {

    } catch (err) {

    }
  }
}