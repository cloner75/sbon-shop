// package 
import pino from 'pino';

export default pino(pino.destination({
  level: process.env.LOG_LEVEL || 'info',
  name: 'spon.user',
  // dest: 'log.log', // omit for stdout
  sync: false // Asynchronous logging
}));
