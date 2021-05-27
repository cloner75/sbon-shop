// Packages

// Models
import OptionModel from './../../models/option';

// Helpers
import MongoHelper from './../../helpers/mongo';
import Response from './../../helpers/response';
import Logger from './../../helpers/logger';


// Consts
const OPTION = 'option';

/**
 * @description :: The Controller service
 *
 * @class Controller
 * @example
 * var Ctrl = new Controller();
 */
export default class OptionController {
    /**
     * @description :: Create Document
     * @param {request} req 
     * @param {Reply} reply 
     */
    async create(req, reply) {
        try {
            const createOption = await OptionModel.create({
                userId: req.user._id,
                ...req.body
            });
            Logger.info({
                controller: 'Option',
                api: 'create',
                isSuccess: true,
                message: '201',
            });
            return reply.status(201).send(Response.generator(201, createOption));
        } catch (err) {
            Logger.error({
                controller: 'Option',
                api: 'create',
                isSuccess: false,
                message: err.message,
            });
            return reply.status(500).send(Response.generator(500, err.message));
        }
    }

    /**
    * @description :: Get One Document
    * @param {request} req 
    * @param {Reply} reply 
    */
    async find(req, reply) {
        try {
            const { where, options } = MongoHelper.initialMongoQuery(req.query, OPTION);
            const result = await OptionModel.paginate(where, options);
            Logger.info({
                controller: 'Option',
                api: 'find',
                isSuccess: true,
                message: '200',
            });
            return reply.status(200).send(Response.generator(200, result.docs));
        } catch (err) {
            Logger.error({
                controller: 'Option',
                api: 'find',
                isSuccess: false,
                message: err.message,
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
        try {
            const { where, options } = MongoHelper.initialMongoQuery(req.query, OPTION);
            const result = await OptionModel.paginate({
                _id: req.params.id,
                ...where
            }, options);

            Logger.info({
                controller: 'Option',
                api: 'findOne',
                isSuccess: true,
                message: '200',
            });
            return result.docs[0] ?
                reply.status(200).send(Response.generator(200, result.docs[0])) :
                reply.status(404).send(Response.generator(404));
        } catch (err) {
            Logger.error({
                controller: 'Option',
                api: 'findOne',
                isSuccess: false,
                message: err.message,
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
        try {
            const update = await OptionModel.findOneAndUpdate(
                {
                    _id: req.params.id
                },
                { ...req.body, userId: req.user._id },
                {
                    new: true,
                }
            );

            Logger.info({
                controller: 'Option',
                api: 'update',
                isSuccess: true,
                message: '200',
            });
            return update ? reply.send(Response.generator(200, update)) :
                reply.status(404).send(Response.generator(404));
        } catch (err) {
            Logger.info({
                controller: 'Option',
                api: 'update',
                isSuccess: false,
                message: err.message,
            });
            return reply.status(500).send(Response.generator(500, err.message));
        }
    }

    /**
     * @description :: Delete Documents
     * @param {request} req 
     * @param {Reply} reply 
     */
    async remove(req, reply) {
        try {
            const remove = await OptionModel.deleteOne(
                { _id: req.params.id },
            );

            Logger.info({
                controller: 'Option',
                api: 'remove',
                isSuccess: true,
                message: '200',
            });
            return remove.n ?
                reply.send(Response.generator(200)) :
                reply.status(404).send(Response.generator(404));
        } catch (err) {
            Logger.info({
                controller: 'Option',
                api: 'remove',
                isSuccess: false,
                message: err.message,
            });
            return reply.status(500).send(Response.generator(500, err.message));
        }
    }
}