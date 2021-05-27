// package 
import pino from 'pino';

export default pino(pino.destination({
    level: 'debug',
    name: 'spon.user',
    dest: 'log.log', // omit for stdout
    sync: true // Asynchronous logging
}));
