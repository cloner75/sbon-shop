// Package
import Logger from './logger';
// Consts
import configs from './../configs/config';
import { extend } from 'lodash';

/**
 * @description :: Manage Response
 */
class Response extends Logger {
  constructor(serviceName) {
    this.serviceName = serviceName;
    super(serviceName);

  }

  /**
   * @description :: Response Generator
   * @param {object} data 
   */
  generator(status, data = null, method, time) {
    const config = configs.status[status];
    super.info(method, time, config.message);
    return {
      success: config.success,
      message: config.message,
      data,
    };
  }

  /**
   * 
   * @param {string} message 
   */
  ErrorHandler(method, time, error = {}) {
    super.error(method, time, error);
    return {
      success: false,
      message: error.message || '',
      data: {},
    };
  }
}

export default Response;