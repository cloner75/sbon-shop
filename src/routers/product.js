// Controllers
import ProductController from '../controllers/product/product';
import CategoryController from '../controllers/product/category';
import CommentController from '../controllers/product/comment';
import BrandController from '../controllers/product/brand';
import OfferController from '../controllers/product/offer';

// import requestIp from 'request-ip';



// Controller
const Product = new ProductController();
const Comment = new CommentController();
const Category = new CategoryController();
const Brand = new BrandController();
const Offer = new OfferController();

// Midds
import middle from './../middlewares/product';

// Hookes
import Hooks from './../helpers/hooks';

// Routes
export default (fastify, _opts, done) => {
    fastify.addHook('onRequest', Hooks.authorization);
    
    // Product
    fastify.get('/get', middle.pro.find, Product.find);
    fastify.get('/search', middle.pro.search, Product.search);
    fastify.get('/get/:id', middle.pro.findOne, Product.findOne);
    fastify.post('/create', middle.pro.create, Product.create);
    fastify.put('/update/:id', middle.pro.update, Product.update);
    fastify.delete('/remove/:id', middle.pro.delete, Product.remove);

    // Comment
    fastify.get('/comment/get', middle.com.find, Comment.find);
    fastify.get('/comment/get/public', middle.com.find, Comment.findPublic);
    fastify.post('/comment/create', middle.com.create, Comment.create);
    fastify.get('/comment/get/:id', middle.com.findOne, Comment.findOne);
    fastify.put('/comment/update/:id', middle.com.update, Comment.update);
    fastify.delete('/comment/remove/:id', middle.com.delete, Comment.remove);

    // Category
    fastify.get('/category/get', middle.cat.find, Category.find);
    fastify.post('/category/create', middle.cat.create, Category.create);
    fastify.get('/category/get/:id', middle.cat.findOne, Category.findOne);
    fastify.put('/category/update/:id', middle.cat.update, Category.update);
    fastify.delete('/category/remove/:id', middle.cat.delete, Category.remove);


    // Brand
    fastify.get('/brand/get', middle.brand.find, Brand.find);
    fastify.post('/brand/create', middle.brand.create, Brand.create);
    fastify.get('/brand/get/:id', middle.brand.findOne, Brand.findOne);
    fastify.put('/brand/update/:id', middle.brand.update, Brand.update);
    fastify.delete('/brand/remove/:id', middle.brand.delete, Brand.remove);

    // Offer
    fastify.get('/offer/get', middle.offer.find, Offer.find);
    fastify.post('/offer/create', middle.offer.create, Offer.create);
    fastify.get('/offer/get/one/:id', middle.offer.findOneDashboard, Offer.findOneDashboard);
    fastify.get('/offer/get/:code', middle.offer.findOne, Offer.findOne);
    fastify.put('/offer/update/:id', middle.offer.update, Offer.update);

    done();
};
