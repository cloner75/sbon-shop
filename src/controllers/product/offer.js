// Models
import offerModel from "./../../models/product/offer";
import userModel from './../../models/user/user';

// Helper
import MongoHelper from "./../../helpers/mongo";
import Response from "./../../helpers/response";
import Logger from "./../../helpers/logger";

// Services
import OfferService from './../../services/product/offer';


// Consts
const OFFER = 'offer';

/**
 * @description :: The Controller service
 *
 * @class Controller
 * @example
 * var Ctrl = new Controller();
 */
export default class Offer extends OfferService {
    constructor() {
        super();
    }

    /**
     * @description :: Get Documents
     * @param {request} req 
     * @param {Reply} reply 
     */
    async find(req, reply) {
        const start = Date.now();
        try {
            const { where, options } = MongoHelper.initialMongoQuery(req.query, OFFER);
            const result = await offerModel.paginate(where, options);
            Logger.info({
                controller: 'Offer',
                api: 'find',
                isSuccess: true,
                ip: req.clientIp,
                message: '200',
                time: start - Date.now()
            });
            return reply.send(Response.generator(200, result));
        } catch (err) {
            Logger.error({
                controller: 'Offer',
                api: 'find',
                isSuccess: false,
                ip: req.clientIp,
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
            const { status, result } = await super.findOne(req.params.code);
            Logger.info({
                controller: 'Offer',
                api: 'findOne',
                isSuccess: true,
                ip: req.clientIp,
                message: '200',
                time: start - Date.now()
            });
            if (status === 200) {
                const getUser = await userModel.findOne({ _id: req.user._id });
                if (getUser) {
                    if (!getUser.offerCodes.includes(req.params.code)) {
                        return reply.send(Response.generator(200, result));
                    }
                }
            }
            return reply.status(404).send(Response.generator(404));
        } catch (err) {
            Logger.error({
                controller: 'Offer',
                api: 'findOne',
                isSuccess: false,
                ip: req.clientIp,
                message: err.message,
                time: start - Date.now()
            });
            return reply.status(500).send(Response.generator(500, err.message));
        }
    }

    /**
     * @description :: Find One For DashBoard
     * @param {request} req 
     * @param {Reply} reply 
     */
    async findOneDashboard(req, reply) {
        const start = Date.now();
        try {
            const { where, options } = MongoHelper.initialMongoQuery(req.query, OFFER);
            const result = await offerModel.paginate({ ...where, _id: req.params.id }, options);
            Logger.info({
                controller: 'Offer',
                api: 'findOneDashabord',
                isSuccess: true,
                ip: req.clientIp,
                message: '200',
                time: start - Date.now()
            });
            return reply.send(Response.generator(200, result));
        } catch (err) {
            Logger.error({
                controller: 'Offer',
                api: 'findOneDashabord',
                isSuccess: false,
                ip: req.clientIp,
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
    async create(req, reply) {
        const start = Date.now();
        try {
            const result = await offerModel.create({ ...req.body, ownerId: req.user._id });
            Logger.info({
                controller: 'Offer',
                api: 'create',
                isSuccess: true,
                ip: req.clientIp,
                message: '200',
                time: start - Date.now()
            });
            return reply.status(200).send(Response.generator(200, result));
        } catch (err) {
            Logger.error({
                controller: 'Offer',
                api: 'create',
                isSuccess: true,
                ip: req.clientIp,
                message: '200',
                time: start - Date.now()
            });
            return reply.status(500).send(err);
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
            const result = await offerModel.findOneAndUpdate({
                _id: req.params.id,
                // minishop: req.user.minishop
            },
                { ...req.body, ownerId: req.user._id },
                { new: true }
            );
            Logger.info({
                controller: 'Offer',
                api: 'update',
                isSuccess: true,
                ip: req.clientIp,
                message: '200',
                time: start - Date.now()
            });
            return result ?
                reply.status(200).send(Response.generator(200, result)) :
                reply.status(404).send(Response.generator(404));
        } catch (err) {
            Logger.error({
                controller: 'Offer',
                api: 'update',
                isSuccess: true,
                ip: req.clientIp,
                message: '200',
                time: start - Date.now()
            });
            return reply.status(500).send(err);
        }
    }
}