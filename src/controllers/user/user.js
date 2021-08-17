// Packages
import { hotp } from 'otplib';
import bcrypt from 'bcrypt';

// Models
import UserModel from './../../models/user/user';
import WalletModel from './../../models/user/wallet';


// Helpers
import JWT from './../../helpers/jsonwebtoken';
import MongoHelper from './../../helpers/mongo';
import ResponseGenerator from './../../helpers/response';
import Transaction from './../../helpers/transaction';

// Configs
import configs from './../../configs/config';
import cookieConfig from './../../configs/cookie';

// Consts
const Response = new ResponseGenerator('user-service');
const jwt = new JWT();
const transaction = new Transaction();
const METHODS = {
  hotpSend: 'hotpSend',
  hotpVerify: 'hotpVerify',
  register: 'register',
  login: 'login',
  refreshToken: 'refreshToken',
  find: 'find',
  findOne: 'findOne',
  findOneForComment: 'findOneForComment',
  update: 'update',
  updateSuperAdmin: 'updateSuperAdmin',
  updateSuperAdminBio: 'updateSuperAdminBio',
  findSuperAadmin: 'findSuperAadmin',
  updateTelegramToken: 'updateTelegramToken',
  updateLocation: 'updateLocation',
  updateInstallment: 'updateInstallment',
  remove: 'remove',
  logout: 'logout',
};
const USER = 'user';

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
    try {
      const { phone } = req.body;
      const checkUnique = await UserModel.findOne({ phone });
      if (checkUnique) {
        if (checkUnique.status === 1) {
          return reply.status(409).send(Response.generator(409, {}, METHODS.hotpSend, req.executionTime));
        } else {
          const secret = phone + Date.now();
          const token = hotp.generate(process.env.HOTP_SECRET, secret);
          await transaction.sendSms(phone, token);
          await UserModel.updateOne({ _id: checkUnique._id }, { secret });
          return reply.status(200).send(
            Response.generator(200, {
              createUser: checkUnique
            }, METHODS.hotpSend, req.executionTime)
          );
        }
      } else {
        const secret = phone + Date.now();
        const token = hotp.generate(process.env.HOTP_SECRET, secret);
        await transaction.sendSms(phone, token);
        return reply.status(200).send(
          Response.generator(200,
            {
              createUser: await UserModel.create({ phone, secret })
            },
            METHODS.hotpSend,
            req.executionTime
          )
        );
      }
    } catch (err) {
      return reply.status(500).send(Response.ErrorHandler(METHODS.hotpSend, req.executionTime, err));
    }
  }

  /**
   * @description :: Check Hotp 
   * @param {request} req 
   * @param {Response} reply 
   */
  async hotpVerify(req, reply) {
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
        return reply.status(202).send(Response.generator(202, {}, METHODS.hotpVerify, req.executionTime));
      }
      return reply.status(400).send(Response.generator(400, {}, METHODS.hotpVerify, req.executionTime));
    } catch (err) {
      return reply.status(500).send(Response.ErrorHandler(METHODS.hotpVerify, req.executionTime, err));
    }
  }

  /**
   * @description :: Create Document
   * @param {request} req 
   * @param {Reply} reply 
   */
  async register(req, reply) {
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
        await WalletModel.create({
          userId: result._id,
          logs: [{
            action: 'ثبت نام',
          }]
        });
        const resultToken = await jwt.generate(result);
        return reply
          .setCookie(
            'access_token',
            resultToken,
            cookieConfig
          )
          .send(
            Response.generator(200,
              { ...result, token: resultToken },
              METHODS.register, req.executionTime
            )
          );
      }
      return reply.status(404).send(Response.generator(404, {}, METHODS.register, req.executionTime));
    } catch (err) {
      return reply.status(500).send(Response.ErrorHandler(METHODS.register, req.executionTime, err));
    }
  }

  /**
   * @description :: Login User
   * @param {request} req 
   * @param {Reply} reply 
   */
  async login(req, reply) {
    try {
      const { phone, password: passwordInput } = req.body;
      const getUser = await UserModel.findOne({ phone });
      if (getUser) {
        const { password, phone, locations, ...result } = getUser.toObject();
        const checkPassword = bcrypt.compareSync(passwordInput, password);
        const resultToken = await jwt.generate(result);
        if (checkPassword) {
          return reply
            .setCookie(
              'access_token',
              resultToken,
              cookieConfig
            )
            .send(
              Response.generator(200,
                { token: resultToken },
                METHODS.login, req.executionTime
              )
            );
        }
      }
      return reply.status(404).send(Response.generator(404, {}, METHODS.login, req.executionTime));
    } catch (err) {
      return reply.status(500).send(Response.ErrorHandler(METHODS.login, req.executionTime, err));
    }
  }

  /**
   * @description :: Login User
   * @param {request} req 
   * @param {Reply} reply 
   */
  async refreshToken(req, reply) {
    let token;
    try {
      token = req.headers.authorization;
      const decode = jwt.verify(token);
      return reply.send(
        Response.generator(200,
          { token: decode },
          METHODS.refreshToken, req.executionTime
        )
      );
    } catch (err) {
      if (/jwt expired/.test(err.message)) {
        const decode = jwt.decode(token);
        const getUser = await UserModel.findById(decode._id);
        if (!getUser) {
          return reply.status(404).send(
            Response.generator(404, {}, METHODS.refreshToken, req.executionTime)
          );
        }
        const { password, salt, phone, ...result } = getUser.toObject();
        token = await jwt.generate(result);
        return reply
          .status(200)
          .send(Response.generator(200, { token }, METHODS.refreshToken, req.executionTime))
          .headers({ 'authorization': token });
      } else {
        return reply.status(500).send(Response.ErrorHandler(METHODS.refreshToken, req.executionTime, err));
      }
    }
  }

  /**
   * @description :: Get Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async find(req, reply) {
    try {
      const { where, options } = MongoHelper.initialMongoQuery(req.query, USER);
      const result = await UserModel.paginate(where, options);
      return reply.status(200).send(Response.generator(200, result, METHODS.find, req.executionTime));
    } catch (err) {
      return reply.status(500).send(Response.ErrorHandler(METHODS.find, req.executionTime, err));
    }
  }

  /**
   * @description :: Get One Document
   * @param {request} req 
   * @param {Reply} reply 
   */
  async findOne(req, reply) {
    try {
      const { where, options } = MongoHelper.initialMongoQuery(req.query, USER);
      const result = await UserModel.paginate({ _id: req.user._id, ...where }, options);
      return reply.status(200).send(Response.generator(200, result.docs[0], METHODS.findOne, req.executionTime));
    } catch (err) {
      return reply.status(500).send(Response.ErrorHandler(METHODS.findOne, req.executionTime, err));
    }
  }
  /**
   * @description :: Get One Document
   * @param {request} req 
   * @param {Reply} reply 
   */
  async findOneForComment(req, reply) {
    try {
      const { usersId, ...query } = req.query;
      const ids = usersId.split(',').filter(item => /^[0-9a-fA-F]{24}$/.test(item.trim()));
      const { where, options } = MongoHelper.initialMongoQuery(query, USER);
      Object.assign(where, { _id: { $in: ids } });
      Object.assign(options, { select: 'username avatar' });
      const result = await UserModel.paginate(where, options);
      return reply.status(200).send(Response.generator(200, result, METHODS.findOneForComment, req.executionTime));
    } catch (err) {
      return reply.status(500).send(Response.ErrorHandler(METHODS.findOneForComment, req.executionTime, err));
    }
  }

  /**
   * @description :: update Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async update(req, reply) {
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
        return reply.send(Response.generator(200, update, METHODS.update, req.executionTime));
      }
      return reply.status(404).send(Response.generator(404, {}, METHODS.update, req.executionTime));
    } catch (err) {
      return reply.status(500).send(Response.ErrorHandler(METHODS.update, req.executionTime, err));
    }
  }


  /**
   * @description :: update Documents By Superadmin
   * @param {request} req 
   * @param {Reply} reply 
   */
  async updateSuperAdmin(req, reply) {
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
        { _id: req.params.id },
        result,
        {
          new: true,
          fields: { password: 0, salt: 0 },
        }
      );
      if (update) {
        return reply.send(Response.generator(200, update, METHODS.updateSuperAdmin, req.executionTime));
      }
      return reply.status(404).send(Response.generator(404, {}, METHODS.updateSuperAdmin, req.executionTime));
    } catch (err) {
      return reply.status(500).send(Response.ErrorHandler(METHODS.updateSuperAdmin, req.executionTime, err));
    }
  }

  /**
    * @description :: update Bio
    * @param {request} req 
    * @param {Reply} reply 
    */
  async updateSuperAdminBio(req, reply) {
    try {
      const { description, files } = req.body;
      const update = await UserModel.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { bio: { description, files } } },
        {
          new: true,
          fields: { password: 0, salt: 0 },
        }
      );
      if (update) {
        return reply.send(Response.generator(200, update, METHODS.updateSuperAdminBio, req.executionTime));
      }
      return reply.status(404).send(Response.generator(404, {}, METHODS.updateSuperAdminBio, req.executionTime));
    } catch (err) {
      return reply.status(500).send(Response.ErrorHandler(METHODS.updateSuperAdminBio, req.executionTime, err));
    }
  }

  /**
    * @description :: find one user
    * @param {request} req 
    * @param {Reply} reply 
    */
  async findSuperAadmin(req, reply) {
    try {
      const { where, options } = MongoHelper.initialMongoQuery(req.query, USER);
      const result = await UserModel.paginate({
        ...where,
        _id: req.params.id
      }, options);
      return reply.status(200).send(Response.generator(200, result.docs[0], METHODS.findSuperAadmin, req.executionTime));
    } catch (err) {
      return reply.status(500).send(Response.ErrorHandler(METHODS.findSuperAadmin, req.executionTime, err));
    }
  }


  /**
   * @description :: update telegram token Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async updateTelegramToken(req, reply) {
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
        return reply.send(Response.generator(200, update, METHODS.updateTelegramToken, req.executionTime));
      }
      return reply.status(404).send(Response.generator(404, {}, METHODS.updateTelegramToken, req.executionTime));
    } catch (err) {
      return reply.status(500).send(Response.ErrorHandler(METHODS.updateTelegramToken, req.executionTime, err));
    }
  }

  /**
   * @description :: update Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async updateLocation(req, reply) {
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
        return reply.send(Response.generator(200, update, METHODS.updateLocation, req.executionTime));
      }
      return reply.status(404).send(Response.generator(404, {}, METHODS.updateLocation, req.executionTime));
    } catch (err) {
      return reply.status(500).send(Response.ErrorHandler(METHODS.updateLocation, req.executionTime, err));
    }
  }


  /**
   * @description :: update Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async updateInstallment(req, reply) {
    try {
      const { check, turnover, nationalCard } = req.body;
      const update = await UserModel.updateOne(
        { _id: req.user._id },
        { $set: { Installment: { check, turnover, nationalCard } } },
        { new: true }
      );
      if (update) {
        return reply.send(Response.generator(200, update, METHODS.updateInstallment, req.executionTime));
      }
      return reply.status(404).send(Response.generator(404, {}, METHODS.updateInstallment, req.executionTime));
    } catch (err) {
      return reply.status(500).send(Response.ErrorHandler(METHODS.updateInstallment, req.executionTime, err));
    }
  }


  /**
   * @description :: Remove Documents
   * @param {request} req 
   * @param {Reply} reply 
   */
  async remove(req, reply) {
    try {
      const update = await UserModel.updateOne({
        _id: req.user._id,
        type: { $ne: 4 }
      }, { $set: { type: 4 } });
      if (update.nModified) {
        return reply.send(Response.generator(200, {}, METHODS.remove, req.executionTime));
      }
      return reply.status(404).send(Response.generator(404, {}, METHODS.remove, req.executionTime));
    } catch (err) {
      return reply.status(500).send(Response.ErrorHandler(METHODS.remove, req.executionTime, err));
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