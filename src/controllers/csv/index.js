// Packages
import { parseAsync } from 'json2csv';
import csvParser from 'csv-parser';
import fs from 'fs';

// Models
import ProductModel from './../../models/product/product';
import ListModel from './../../models/user/list';

// Helpers
import Response from './../../helpers/response';
import Logger from './../../helpers/logger';

const opts = {
    fields: [
        'name_fa',
        'name_en',
        'sub_name',
        'price',
        'discount',
        'stock',
        'sbon',
        'id',
        'skus_id',
    ]
};

// Consts
const CSV = 'csv';

/**
 * @description :: The Controller service
 * @class Controller
 * @example
 * var Ctrl = new Controller();
 */
export default class CsvController {
    /**
     * @description :: Create Document
     * @param {request} req 
     * @param {Reply} reply 
     */
    async create(req, reply) {
        try {
            const { userId, listName } = req.params;
            const list = await ListModel.findOne({ userId, name: listName });
            if (!list || !list.products || !list.products.length) {
                return reply.status(404).send(Response.generator(404));
            }
            const products = await ProductModel.find({ _id: { $in: list.products } });

            let jsonData = [];
            products.map(product =>
                product.skus.map(sku => {
                    jsonData.push({
                        'name_fa': product.titleFa,
                        'name_en': product.titleEn,
                        'sub_name': sku.name,
                        'price': sku.price,
                        'discount': sku.discount,
                        'stock': sku.stock,
                        'sbon': sku.sbon,
                        'id': product._id,
                        'skus_id': sku._id
                    });
                })
            );

            return reply
                .type('text/csv')
                .header('Content-Disposition', `attachment; filename=${list.name}.csv`)
                .send(
                    Buffer.from(
                        await parseAsync(jsonData, opts), 'utf8')
                );
        } catch (err) {
            Logger.error({
                controller: CSV,
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
    async update(req, reply) {
        try {
            let result = [];
            fs.createReadStream('./test.csv')
                .pipe(csvParser())
                .on('data', (data) => {
                    result.push(data);
                })
                .on('end', async () => {
                    for (let item of result) {
                        const check = await ProductModel.updateOne(
                            {
                                '_id': item.id,
                                'skus._id': item.skus_id
                            },
                            {
                                $set: {
                                    'skus.$.price': +item.price,
                                    'skus.$.sbon': +item.sbon,
                                    'skus.$.stock': +item.stock,
                                    'skus.$.discount': +item.discount,
                                }
                            }
                        );
                    }
                    reply.send(result);
                });
        } catch (err) {
            Logger.error({
                controller: CSV,
                api: 'update',
                isSuccess: false,
                message: err.message,
            });
            return reply.status(500).send(Response.generator(500, err.message));
        }
    }


    /**
     * @description :: Update With Json
     * @param {request} req 
     * @param {response} reply 
     */
    async updateJSON(req, reply) {
        try {
            const products = req.body.products;
            for (let item of products) {
                await ProductModel.updateOne(
                    {
                        '_id': item.id,
                        'skus._id': item.skus_id
                    },
                    {
                        $set: {
                            'skus.$.price': +item.price,
                            'skus.$.sbon': +item.sbon,
                            'skus.$.stock': +item.stock,
                            'skus.$.discount': +item.discount
                        }
                    }
                );
            }
            return reply.send(products);
        } catch (err) {
            Logger.error({
                controller: CSV,
                api: 'updateJSON',
                isSuccess: false,
                message: err.message,
            });
            return reply.status(500).send(Response.generator(500, err.message));
        }
    }
}