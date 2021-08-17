export default {
  domain: process.env.NODE_ENV === 'production' ? '.sbon.ir' : 'localhost',
  path: '/',
  signed: false,
  secure: false,
  httpOnly: true
}