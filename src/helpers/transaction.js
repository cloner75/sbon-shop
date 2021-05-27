// Packages
import axios from 'axios';

// Models

// Helpers
import Logger from './../helpers/logger';
import Response from './../helpers/response';

// Configs


// Consts

/**
 * @description :: The Controller service
 *
 * @class Controller
 * @example
 * var Ctrl = new Controller();
 */
export default class Transaction {

    /**
     * @description :: Send Sms
     * @param {integer} number 
     * @param {string} text 
     */
    async sendSms(number, text) {
        const getToken = await axios({
            method: 'post',
            url: process.env.VERIFY_SMS_TOKEN,
            data: {
                UserApiKey: process.env.API_KEY_SMS,
                SecretKey: process.env.SECRET_KEY_SMS
            }
        });

        await axios({
            method: 'post',
            url: process.env.SEND_SMS,
            data: {
                ParameterArray: [
                    {
                        "Parameter": "VerificationCode",
                        "ParameterValue": text
                    }
                ],
                "Mobile": number,
                "TemplateId": "28049"
            },
            headers: {
                'Content-Type': 'application/json',
                'x-sms-ir-secure-token': getToken.data.TokenKey
            }
        });
        return true;
    }
}