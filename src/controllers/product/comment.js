
// Models
import CommentModel from "./../../models/product/comment";

// Helper
import MongoHelper from "./../../helpers/mongo";
import Response from "./../../helpers/response";
import Logger from "./../../helpers/logger";

// Consts
const COMMENT = 'comment';

/**
 * @description :: The Controller service
 *
 * @class Controller
 * @example
 * var Ctrl = new Controller();
 */
export default class Comment {

    /**
     * @description :: Get Documents
     * @param {request} req 
     * @param {Reply} reply 
     */
    async findPublic(req, reply) {
        const start = Date.now();
        try {
            const { where, options } = MongoHelper.initialMongoQuery(req.query, COMMENT);
            const result = await CommentModel.paginate({ ...where, status: 1 }, options);
            Logger.info({
                controller: 'Comment',
                api: 'find',
                isSuccess: true,
                ip: req.clientIp,
                message: '200',
                time: Date.now() - start
            });
            return reply.send(Response.generator(200, result));
        } catch (err) {
            Logger.error({
                controller: 'Comment',
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
     * @description :: Get Documents
     * @param {request} req 
     * @param {Reply} reply 
     */
    async find(req, reply) {
        const start = Date.now();
        try {
            const { where, options } = MongoHelper.initialMongoQuery(req.query, COMMENT);
            if (req.user.type === 0) {
                Object.assign(where, { userId: req.user._id });
            }
            const result = await CommentModel.paginate(where, options);
            Logger.info({
                controller: 'Comment',
                api: 'find',
                isSuccess: true,
                ip: req.clientIp,
                message: '200',
                time: Date.now() - start
            });
            return reply.send(Response.generator(200, result));
        } catch (err) {
            Logger.error({
                controller: 'Comment',
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
            const { where, options } = MongoHelper.initialMongoQuery(req.query, COMMENT);
            const result = await CommentModel.paginate({ ...where, _id: req.params.id }, options);
            Logger.info({
                controller: 'Comment',
                api: 'findOne',
                isSuccess: true,
                ip: req.clientIp,
                message: '200',
                time: Date.now() - start
            });
            return reply.send(Response.generator(200, result));
        } catch (err) {
            Logger.error({
                controller: 'Comment',
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
            const result = await CommentModel.create({ ...req.body, userId: req.user._id });
            Logger.info({
                controller: 'Comment',
                api: 'create',
                isSuccess: true,
                ip: req.clientIp,
                message: '200',
                time: Date.now() - start
            });
            return reply.status(200).send(Response.generator(200, result));
        } catch (err) {
            Logger.error({
                controller: 'Comment',
                api: 'create',
                isSuccess: false,
                ip: req.clientIp,
                message: err.message,
                time: Date.now() - start
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
            const result = await CommentModel.findOneAndUpdate({
                _id: req.params.id,
                // minishop: req.user.minishop
            },
                req.body,
                { new: true }
            );
            Logger.info({
                controller: 'Comment',
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
            Logger.info({
                controller: 'Comment',
                api: 'update',
                isSuccess: false,
                ip: req.clientIp,
                message: err.message,
                time: Date.now() - start
            });
            return reply.status(500).send(err);
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
            const { id } = req.params;
            const result = await CommentModel.findOneAndDelete({ id });
            Logger.info({
                controller: 'Comment',
                api: 'remove',
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
                controller: 'Comment',
                api: 'remove',
                isSuccess: false,
                ip: req.clientIp,
                message: err.message,
                time: Date.now() - start
            });
            return reply.status(500).send(Response.generator(500, err.message));
        }
    }
}