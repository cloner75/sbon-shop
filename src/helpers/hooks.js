// Models
import UserModel from './../models/user/user';

// Helpers
import logger from './logger';
import cookieConfig from './../configs/cookie';
import JWT from './jsonwebtoken';
import Auth from './authorization';
import ResponseGenerator from './response';
// Config
import authConfig from './../configs/auth';

// Consts
const Response = new ResponseGenerator('hooks-service');
const AC = new Auth();
const jwt = new JWT();
const role = AC.defineRoles();
const METHODS = {
  refreshToken: 'refresh_token'
};
const userType = {
  0: 'user',
  1: 'affiliate',
  2: 'vip',
  3: 'superadmin',
  4: 'deleted',
  5: 'wholesale'
};

/**
 * @description :: check authorization utils
 * @param {request} req 
 * @param {reply} reply 
 * @returns 
 */
async function checkAuthorization(req, reply) {
  if (authConfig[req.routerPath] && authConfig[req.routerPath].isAuth) {
    if (req.headers.authorization || req.cookies.access_token) {
      req.user = jwt.verify(req.cookies.access_token || req.headers.authorization);
      const permission = await role
        .can(userType[req.user.type])
        .execute(authConfig[req.routerPath].name)
        .on(authConfig[req.routerPath].method);
      if (!permission.granted) {
        return reply.status(403).send(
          Response.generator(
            403,
            {},
            'authorization',
            req.executionTime
          ));
      }
    } else {
      return reply.status(401).send(
        Response.generator(
          401,
          {},
          'authorization',
          req.executionTime
        ));
    }
  }
}

/**
 * @description set new token for client
 * @param {request} request 
 * @param {reply} reply 
 * @param {string} token 
 */
async function refreshToken(req, reply, token) {
  const decode = jwt.decode(token);
  const getUser = await UserModel.findById(decode._id);
  if (!getUser) {
    return reply.status(404).send(
      Response.generator(404, {}, METHODS.refreshToken, req.executionTime)
    );
  }
  const { password, salt, phone, ...result } = getUser.toObject();
  token = await jwt.generate(result);
  reply
    .status(403)
    .setCookie(
      'access_token',
      token,
      cookieConfig
    )
    .send(
      Response.generator(
        403,
        { message: 'jwt expired' },
        'authorization',
        req.executionTime
      )
    );
}


/**
 * @description :: Class For Hooks Service
 */
class Hooks {
  /**
   * @description :: Authorization Hook
   * @param {request} request 
   * @param {reply} reply 
   */
  static async authorization(req, reply) {
    req.executionTime = Date.now();
    try {
      await checkAuthorization(req, reply);
    } catch (err) {
      if (/jwt expired/.test(err.message)) {
        await refreshToken(req, reply, req.cookies.access_token || req.headers.authorization);
      } else {
        return reply.status(403).send(
          Response.generator(
            403,
            { message: err.message },
            'authorization',
            req.executionTime
          )
        );
      }
    }
  };
}

export default Hooks;