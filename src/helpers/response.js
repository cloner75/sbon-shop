// Package

// Consts
import configs from './../configs/config';

/**
 * @description :: Manage Response
 */
class Response {
    constructor() {
    }
    /**
     * @description :: Response Generator
     * @param {object} data 
     */
    static generator(status, data = null) {
        const config = configs.status[status];
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
    static ErrorHandler(message) {
        
    }
}

export default Response;