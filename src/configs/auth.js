export default {
  /**
   * @description [product service]
   */
  '/api/v1/product/get': {
    method: 'GET',
    isAuth: false,
    name: 'product-get'
  },
  '/api/v1/product/get/:id': {
    method: 'GET',
    isAuth: false,
    name: 'product-get-one'
  },
  '/api/v1/product/create': {
    method: 'POST',
    isAuth: true,
    name: 'product-create'
  },
  '/api/v1/product/update/:id': {
    method: 'PUT',
    isAuth: true,
    name: 'product-update'
  },
  '/api/v1/product/remove/:id': {
    method: 'DELETE',
    isAuth: true,
    name: 'product-delete'
  },

  // Comment
  '/api/v1/product/comment/get': {
    method: 'GET',
    isAuth: true,
    name: 'comment-get'
  },
  '/api/v1/product/comment/get/public': {
    method: 'GET',
    isAuth: false,
    name: 'comment-get-public'
  },
  '/api/v1/product/comment/get/:id': {
    method: 'GET',
    isAuth: false,
    name: 'comment-get-one'
  },
  '/api/v1/product/comment/create': {
    method: 'POST',
    isAuth: true,
    name: 'comment-create'
  },
  '/api/v1/product/comment/update/:id': {
    method: 'PUT',
    isAuth: true,
    name: 'comment-update'
  },
  '/api/v1/product/comment/delete/:id': {
    method: 'DELETE',
    isAuth: true,
    name: 'comment-delete'
  },

  // Category
  '/api/v1/product/category/get': {
    method: 'GET',
    isAuth: false,
    name: 'category-get'
  },
  '/api/v1/product/category/get/:id': {
    method: 'GET',
    isAuth: false,
    name: 'category-get-one'
  },
  '/api/v1/product/category/create': {
    method: 'POST',
    isAuth: true,
    name: 'category-create'
  },
  '/api/v1/product/category/update/:id': {
    method: 'PUT',
    isAuth: true,
    name: 'category-update'
  },
  '/api/v1/product/category/delete/:id': {
    method: 'DELETE',
    isAuth: true,
    name: 'category-delete'
  },


  // Brand
  '/api/v1/product/brand/get': {
    method: 'GET',
    isAuth: false,
    name: 'category-get'
  },
  '/api/v1/product/brand/get/:id': {
    method: 'GET',
    isAuth: false,
    name: 'category-get-one'
  },
  '/api/v1/product/brand/create': {
    method: 'POST',
    isAuth: true,
    name: 'category-create'
  },
  '/api/v1/product/brand/update/:id': {
    method: 'PUT',
    isAuth: true,
    name: 'category-update'
  },
  '/api/v1/product/brand/delete/:id': {
    method: 'DELETE',
    isAuth: true,
    name: 'category-delete'
  },

  // Offer
  '/api/v1/product/offer/get': {
    method: 'GET',
    isAuth: true,
    name: 'offer-get'
  },
  '/api/v1/product/offer/get/:code': {
    method: 'GET',
    isAuth: true,
    name: 'offer-get-one'
  },

  '/api/v1/product/offer/get/one/:id': {
    method: 'GET',
    isAuth: true,
    name: 'offer-get-one-dashboard'
  },
  '/api/v1/product/offer/create': {
    method: 'POST',
    isAuth: true,
    name: 'offer-create'
  },
  '/api/v1/product/offer/update/:id': {
    method: 'PUT',
    isAuth: true,
    name: 'offer-update'
  },

  /**
   * @discription [option service]
   */
  '/api/v1/option/create': {
    method: 'POST',
    isAuth: true,
    name: 'superadmin-option-create'
  },
  '/api/v1/option/get': {
    method: 'GET',
    isAuth: false,
    name: 'superadmin-option-find'
  },
  '/api/v1/option/get/:id': {
    method: 'GET',
    isAuth: false,
    name: 'superadmin-option-findOne'
  },
  '/api/v1/option/update/:id': {
    method: 'PUT',
    isAuth: true,
    name: 'superadmin-option-update'
  },
  '/api/v1/option/delete/:id': {
    method: 'DELETE',
    isAuth: true,
    name: 'superadmin-option-delete'
  },

  /**
   * @description [user services]
   */
  '/api/v1/user/code/send': {
    method: 'POST',
    isAuth: false,
    name: 'user-code-send'
  },
  '/api/v1/user/code/check': {
    method: 'POST',
    isAuth: false,
    name: 'user-code-verify'
  },
  '/api/v1/user/token/refresh': {
    method: 'POST',
    isAuth: false,
    name: 'user-token-refresh'
  },
  '/api/v1/user/register': {
    method: 'POST',
    isAuth: false,
    name: 'user-register'
  },
  '/api/v1/user/login': {
    method: 'POST',
    isAuth: false,
    name: 'user-login'
  },
  '/api/v1/user/': {
    method: 'get',
    isAuth: true,
    name: 'user-membership'
  },
  '/api/v1/user/:id': {
    method: 'get',
    isAuth: true,
    name: 'user-id'
  },
  '/api/v1/user/profile/telegram': {
    method: 'PUT',
    isAuth: true,
    name: 'user-profile-update-telegram'
  },
  '/api/v1/user/profile/:id': {
    method: 'PUT',
    isAuth: true,
    name: 'user-profile-update'
  },
  '/api/v1/user/profile/location': {
    method: 'PUT',
    isAuth: true,
    name: 'user-profile-update'
  },
  '/api/v1/user/superadmin/update/:id': {
    method: 'PUT',
    isAuth: true,
    name: 'superadmin-profile-update'
  },
  '/api/v1/user/superadmin/user/get/:id': {
    method: 'GET',
    isAuth: true,
    name: 'superadmin-get-one-user'
  },
  '/api/v1/user/superadmin/update/bio/:id': {
    method: 'PUT',
    isAuth: true,
    name: 'superadmin-bio-update'
  },
  '/api/v1/user/superadmin/remove/:id': {
    method: 'DELETE',
    isAuth: true,
    name: 'user-remove'
  },

  // wallet
  '/api/v1/user/wallet/create': {
    method: 'POST',
    isAuth: true,
    name: 'wallet-create'
  },
  '/api/v1/user/wallet/update': {
    method: 'PUT',
    isAuth: true,
    name: 'wallet-update'
  },
  '/api/v1/user/wallet/get': {
    method: 'GET',
    isAuth: true,
    name: 'wallet-get'
  },


  // list
  '/api/v1/user/list/create': {
    method: 'POST',
    isAuth: true,
    name: 'list-create'
  },
  '/api/v1/user/list/update/:id': {
    method: 'PUT',
    isAuth: true,
    name: 'list-update'
  },
  '/api/v1/user/list/get': {
    method: 'GET',
    isAuth: true,
    name: 'list-get'
  },
  '/api/v1/user/list/get/:id': {
    method: 'GET',
    isAuth: true,
    name: 'list-getOne'
  },
  '/api/v1/user/list/remove/:id': {
    method: 'DELETE',
    isAuth: true,
    name: 'list-delete'
  },

  // order
  '/api/v1/user/order/get': {
    method: 'GET',
    isAuth: true,
    name: 'order-get'
  },
  '/api/v1/user/order/superadmin/get': {
    method: 'GET',
    isAuth: true,
    name: 'order-superadmin-get'
  },
  '/api/v1/user/order/create': {
    method: 'POST',
    isAuth: true,
    name: 'order-create'
  },
  '/order/cancel/:orderId': {
    method: 'PUT',
    isAuth: true,
    name: 'order-cancel'
  },
  /** CEO */
  // meta
  '/api/v1/seo/meta/find': {
    method: 'GET',
    isAuth: false,
    name: 'meta-get-page'
  },
  '/api/v1/seo/meta/find/:id': {
    method: 'GET',
    isAuth: false,
    name: 'meta-get-id'
  },
  '/api/v1/seo/meta/superadmin/find': {
    method: 'GET',
    isAuth: true,
    name: 'meta-superadmin-get'
  },
  '/api/v1/seo/meta/create': {
    method: 'POST',
    isAuth: true,
    name: 'meta-create'
  },
  '/api/v1/seo/meta/update/:id': {
    method: 'POST',
    isAuth: true,
    name: 'meta-update'
  },
  '/api/v1/seo/meta/remove/:id': {
    method: 'POST',
    isAuth: true,
    name: 'meta-remove'
  },

  // redirect
  '/api/v1/seo/redirect/find': {
    method: 'GET',
    isAuth: false,
    name: 'redirect-get'
  },
  '/api/v1/seo/redirect/find/:id': {
    method: 'GET',
    isAuth: false,
    name: 'redirect-get-id'
  },
  '/api/v1/seo/redirect/create': {
    method: 'POST',
    isAuth: true,
    name: 'redirect-create'
  },
  '/api/v1/seo/redirect/update/:id': {
    method: 'POST',
    isAuth: true,
    name: 'redirect-update'
  },
  '/api/v1/seo/redirect/remove/:id': {
    method: 'POST',
    isAuth: true,
    name: 'redirect-remove'
  },
};
