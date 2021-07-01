// Helpers
import logger from './logger';
import JWT from './jsonwebtoken';
import Auth from './authorization';
import Response from './response';

// Config
import authConfig from './../configs/auth';

// Consts
const AC = new Auth();
const jwt = new JWT();
const role = AC.defineRoles();
const userType = {
  0: 'user',
  1: 'affiliate',
  2: 'vip',
  3: 'superadmin',
  4: 'deleted',
  5: 'wholesale'
};

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
      if (authConfig[req.routerPath] && authConfig[req.routerPath].isAuth) {
        if (req.headers.authorization) {
          req.user = jwt.verify(req.headers.authorization);
          const permission = await role
            .can(userType[req.user.type])
            .execute(authConfig[req.routerPath].name)
            .on(authConfig[req.routerPath].method);
          if (!permission.granted) {
            return reply.status(403).send(Response.generator(403));
          }
        } else {
          return reply.status(401).send(Response.generator(401));
        }
      }
    } catch (err) {
      return reply.status(403).send(Response.generator(403, err.message));
    }
  };
}

export default Hooks;