
// Models
import BrandModel from "./../../models/product/brand";

// Helper
import MongoHelper from "./../../helpers/mongo";
import Response from "./../../helpers/response";
import Logger from "./../../helpers/logger";

// Const
const BRAND = 'brand';

/**
 * @description :: The Controller service
 *
 * @class Controller
 * @example
 * var Ctrl = new Controller();
 */
export default class Brand {

    /**
     * @description :: Get Documents
     * @param {request} req 
     * @param {Reply} reply 
     */
    async find(req, reply) {
        const start = Date.now();
        try {
            const { where, options } = MongoHelper.initialMongoQuery(req.query, BRAND);
            const result = await BrandModel.paginate(where, options);
            Logger.info({
                controller: 'Brand',
                api: 'find',
                isSuccess: true,
                ip: req.clientIp,
                message: '200',
                time: start - Date.now()
            });
            return reply.send(Response.generator(200, result));
        } catch (err) {
            Logger.error({
                controller: 'Brand',
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
            const { where, options } = MongoHelper.initialMongoQuery(req.query, BRAND);
            const result = await BrandModel.paginate({ ...where, _id: req.params.id }, options);
            Logger.info({
                controller: 'Brand',
                api: 'findOne',
                isSuccess: true,
                ip: req.clientIp,
                message: '200',
                time: start - Date.now()
            });
            return reply.send(Response.generator(200, result));
        } catch (err) {
            Logger.error({
                controller: 'Brand',
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
     * @description :: Create Document
     * @param {request} req 
     * @param {Reply} reply 
     */
    async create(req, reply) {
        const start = Date.now();
        try {
            const result = await BrandModel.create({ ...req.body, ownerId: req.user._id });
            Logger.info({
                controller: 'Brand',
                api: 'findOne',
                isSuccess: true,
                ip: req.clientIp,
                message: '200',
                time: start - Date.now()
            });
            return reply.status(200).send(Response.generator(200, result));
        } catch (err) {
            Logger.error({
                controller: 'Brand',
                api: 'create',
                isSuccess: false,
                ip: req.clientIp,
                message: err.message,
                time: start - Date.now()
            });
            return reply.status(500).send(Response.generator(500, err.message));
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
            const _id = req.params.id;
            const result = await BrandModel.findOneAndUpdate({ _id }, { ...req.body, ownerId: req.user._id }, { new: true });
            Logger.info({
                controller: 'Brand',
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
                controller: 'Brand',
                api: 'update',
                isSuccess: false,
                ip: req.clientIp,
                message: err.message,
                time: start - Date.now()
            });
            return reply.status(500).send(Response.generator(500, err.message));
        }
    }

    /**
     * @description :: Remove Documents
     * @param {request} req 
     * @param {Reply} reply 
     */
    async remove(req, reply) {
        const start = Date.now();
        try {
            const _id = req.params.id;
            const result = await BrandModel.findOneAndDelete({ _id });
            if (result) {
                Logger.info({
                    controller: 'Brand',
                    api: 'remove',
                    isSuccess: true,
                    ip: req.clientIp,
                    message: '200',
                    time: start - Date.now()
                });
                return reply.status(200).send(Response.generator(200, result));
            }
            Logger.info({
                controller: 'Brand',
                api: 'remove',
                isSuccess: true,
                ip: req.clientIp,
                message: '404',
                time: start - Date.now()
            });
            return reply.status(404).send(Response.generator(404));
        } catch (err) {
            Logger.error({
                controller: 'Brand',
                api: 'remove',
                isSuccess: false,
                ip: req.clientIp,
                message: '200',
                time: start - Date.now()
            });
            return reply.status(500).send(Response.generator(500, err.message));
        }
    }
}