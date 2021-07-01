// package 
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
}, pino.destination({
  name: process.env.LOG_NAME || 'spon.user',
  level: process.env.LOG_LEVEL || 'info',
  dest: 'log.log', // omit for stdout
  sync: false // Asynchronous logging
}));

class Logger {
  constructor(serviceName) {
    this.serviceName = serviceName;
  }

  /**
   * @description :: set info log
   * @param {string} method 
   * @param {number} time 
   * @param {string} message 
   */
  info(method, time, message = '200') {
    logger.info({
      service: this.serviceName,
      isSuccess: true,
      executionTime: Date.now() - time,
      method,
      message,
    });
  }

  /**
   * @description :: set error log
   * @param {string} method 
   * @param {number} time 
   * @param {object} error 
   */
  error(method, time, error = {}) {
    Logger.error({
      service: this.serviceName,
      isSuccess: false,
      message: error.message,
      stack: error.stack,
      method,
      executionTime: Date.now() - time
    });
  }
}

export default Logger;