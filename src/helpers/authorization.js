// package
import { AccessControl } from 'role-acl';

// Consts 
const AC = new AccessControl();

class Authorization {
  constructor() {
  }

  verifyToken(data) {
    return data;
  }

  verifyRole(address, userType) {

  }

  defineRoles() {

    AC.grant('deleted');

    AC.grant('user')
      .execute('comment-create').on('POST')
      .execute('comment-get').on('GET')
      .execute('superadmin-option-find').on('GET')
      .execute('superadmin-option-findOne').on('GET')
      .execute('user-token-refresh').on('POST')
      .execute('user-membership').on('GET')
      .execute('user-id').on('GET')
      .execute('user-profile-update').on('PUT')
      .execute('user-remove').on('delete')
      .execute('order-create').on('POST')
      .execute('order-get').on('GET')
      .execute('offer-get-one').on('GET')
      .execute('wallet-get').on('GET')
      .execute('order-cancel').on('PUT');

    AC.grant('wholesale')
      .extend('user');

    AC.grant('affiliate')
      .extend('user')
      .execute('comment-update').on('PUT')
      .execute('wallet-create').on('POST')
      .execute('wallet-update').on('PUT');


    AC.grant('vip')
      .extend('affiliate')
      .execute('product-create').on('POST')
      .execute('product-update').on('PUT')
      .execute('product-delete').on('DELETE')
      .execute('superadmin-option-create').on('POST')
      .execute('superadmin-option-update').on('PUT')
      .execute('superadmin-option-delete').on('DELETE')
      .execute('offer-create').on('POST')
      .execute('offer-update').on('PUT')
      .execute('offer-get').on('GET')
      .execute('offer-get-one-dashboard').on('GET')
      .execute('user-profile-update-telegram').on('PUT')
      .execute('list-get').on('GET')
      .execute('list-getOne').on('GET')
      .execute('list-create').on('POST')
      .execute('list-update').on('PUT')
      .execute('list-delete').on('DELETE');



    AC.grant('superadmin')
      .extend('vip')
      .execute('comment-update').on('PUT')
      .execute('comment-DELETE').on('DELETE')
      .execute('category-create').on('POST')
      .execute('category-update').on('PUT')
      .execute('category-delete').on('DELETE')
      .execute('order-superadmin-get').on('GET')
      .execute('superadmin-get-one-user').on('GET')
      .execute('superadmin-profile-update').on('PUT')
      .execute('superadmin-bio-update').on('PUT')
      .execute('redirect-create').on('POST')
      .execute('redirect-update').on('PUT')
      .execute('redirect-remove').on('DELETE')
      .execute('meta-create').on('POST')
      .execute('meta-remove').on('DELETE')
      .execute('meta-update').on('PUT')
      .execute('meta-superadmin-get').on('GET');

    return AC;
  }
}

export default Authorization;