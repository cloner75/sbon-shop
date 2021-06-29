
// Models
import CategoryModel from "./../../models/product/category";

// Helper
import MongoHelper from "./../../helpers/mongo";
import Response from "./../../helpers/response";
import Logger from "./../../helpers/logger";

// Const
const CATEGORY = 'category';

/**
 * @description :: The Controller service
 *
 * @class Controller
 * @example
 * var Ctrl = new Controller();
 */
export default class Category {

    /**
     * @description :: Get Documents
     * @param {request} req 
     * @param {Reply} reply 
     */
    async find(req, reply) {
        const start = Date.now();
        try {
            const { where, options } = MongoHelper.initialMongoQuery(req.query, CATEGORY);
            const result = await CategoryModel.paginate(where, options);
            Logger.info({
                controller: 'Category',
                api: 'find',
                isSuccess: true,
                ip: req.clientIp,
                message: '200',
                time: Date.now() - start
            });
            return reply.send(Response.generator(200, result));
        } catch (err) {
            Logger.error({
                controller: 'Category',
                api: 'find',
                isSuccess: false,
                ip: req.clientIp,
                message: err.message,
                time: Date.now() - start
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
            const { where, options } = MongoHelper.initialMongoQuery(req.query, CATEGORY);
            const result = await CategoryModel.paginate({ ...where, _id: req.params.id }, options);
            Logger.info({
                controller: 'Category',
                api: 'findOne',
                isSuccess: true,
                ip: req.clientIp,
                message: '200',
                time: Date.now() - start
            });
            return reply.send(Response.generator(200, result));
        } catch (err) {
            Logger.error({
                controller: 'Category',
                api: 'findOne',
                isSuccess: false,
                ip: req.clientIp,
                message: err.message,
                time: Date.now() - start
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
            const result = await CategoryModel.create({ ...req.body, ownerId: req.user._id });
            Logger.info({
                controller: 'Category',
                api: 'findOne',
                isSuccess: true,
                ip: req.clientIp,
                message: '200',
                time: Date.now() - start
            });
            return reply.status(200).send(Response.generator(200, result));
        } catch (err) {
            Logger.error({
                controller: 'Category',
                api: 'create',
                isSuccess: false,
                ip: req.clientIp,
                message: err.message,
                time: Date.now() - start
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
            const { sub, name, image, banner } = req.body;
            const _id = req.params.id;
            const data = {
                name,
                sub,
                image,
                banner,
                ownerId: req.user._id
            };
            const result = await CategoryModel.findOneAndUpdate({ _id }, data, { new: true });
            Logger.info({
                controller: 'Category',
                api: 'update',
                isSuccess: true,
                ip: req.clientIp,
                message: '200',
                time: Date.now() - start
            });
            return result ?
                reply.status(200).send(Response.generator(200, result)) :
                reply.status(404).send(Response.generator(404));
        } catch (err) {
            Logger.error({
                controller: 'Category',
                api: 'update',
                isSuccess: false,
                ip: req.clientIp,
                message: err.message,
                time: Date.now() - start
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
            const result = await CategoryModel.findOneAndDelete({ _id: req.params.id });
            if (result) {
                Logger.info({
                    controller: 'Category',
                    api: 'remove',
                    isSuccess: true,
                    ip: req.clientIp,
                    message: '200',
                    time: Date.now() - start
                });
                return reply.status(200).send(Response.generator(200, result));
            }
            Logger.info({
                controller: 'Category',
                api: 'remove',
                isSuccess: true,
                ip: req.clientIp,
                message: '404',
                time: Date.now() - start
            });
            return reply.status(404).send(Response.generator(404));
        } catch (err) {
            Logger.error({
                controller: 'Category',
                api: 'remove',
                isSuccess: false,
                ip: req.clientIp,
                message: '200',
                time: Date.now() - start
            });
            return reply.status(500).send(Response.generator(500, err.message));
        }
    }
}