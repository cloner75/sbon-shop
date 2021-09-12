export default {
  errors: {
    0: 'Undefined error from server.',
    1: 'Please send all required data.',
    2: 'Type of data that you sent is not in correct type.',
    3: 'Something went wrong in server, we will check it as soon as possible.',
    4: 'Not found.',
    5: 'Unauthorized.',
    6: 'Content-Type must be application/json.',
    7: 'API-KEY is not in correct format.',
    8: 'Duplicate key error for unique variable.',
    9: 'Not found route.',
    10: 'Field Is Empty.',
    11: 'Should Have A Minimum Length Of {#limit}.',
    12: 'Should Have A Maximum Length Of {#limit}.',
    13: 'Should Have Following This Pattern.',
    14: 'Forbidden Access',
    15: 'Bad Request',
  },
  status: {
    200: {
      success: true,
      message: 'OK',
    },
    201: {
      message: 'Created',
      success: true
    },
    202: {
      message: 'Accepted',
      success: true,
    },
    203: {
      message: 'Non- authoritative Information',
      success: true

    },
    204: {
      message: 'No Content',
      success: true
    },
    205: {
      message: 'Reset Content',
      success: true

    },
    206: {
      message: 'Partial Content',
      success: true

    },
    207: {
      message: 'Multi - Status',
      success: true
    },
    208: {
      message: 'Already Reported',
      success: true
    },
    226: {
      message: 'IM Used',
      success: true
    },

    400: {
      success: false,
      message: 'Bad Request'
    },
    401: {
      success: false,
      message: 'Unauthorized'
    },
    402: {
      success: false,
      message: ' Payment Required'
    },
    403: {
      success: false,
      message: 'Forbidden'
    },
    404: {
      success: false,
      message: 'Not Found'
    },
    405: {
      success: false,
      message: 'Method Not Allowed'
    },
    406: {
      success: false,
      message: 'Not Acceptable'
    },
    407: {
      success: false,
      message: 'Proxy Authentication Required'
    },
    408: {
      success: false,
      message: 'Request Timeout'
    },
    409: {
      success: false,
      message: 'Conflict'
    },
    410: {
      success: false,
      message: 'Gone'
    },
    411: {
      success: false,
      message: 'Length Required'
    },
    412: {
      success: false,
      message: 'Precondition Failed'
    },
    413: {
      success: false,
      message: 'Payload Too Large'
    },
    414: {
      success: false,
      message: 'Request- URI Too Long'
    },
    415: {
      success: false,
      message: ' Unsupported Media Type'
    },
    416: {
      success: false,
      message: 'Requested Range Not Satisfiable'
    },
    417: {
      success: false,
      message: 'Expectation Failed'
    },
    418: {
      success: false,
      message: "I'm a teapot"
    },
    421: {
      success: false,
      message: 'Misdirected Request'
    },
    422: {
      success: false,
      message: ' Unprocessable Entity'
    },
    423: {
      success: false,
      message: 'Locked'
    },
    424: {
      success: false,
      message: 'Failed Dependency'
    },
    426: {
      success: false,
      message: 'Upgrade Required'
    },
    428: {
      success: false,
      message: 'Precondition Required'
    },
    429: {
      success: false,
      message: 'Too Many Requests'
    },
    431: {
      success: false,
      message: 'Request Header Fields Too Large'
    },
    444: {
      success: false,
      message: 'Connection Closed Without Response'
    },
    451: {
      success: false,
      message: 'Unavailable For Legal Reasons'
    },
    499: {
      success: false,
      message: 'Client Closed Request'
    },
    500: {
      success: false,
      message: 'Internal Server Error'
    },
    501: {
      success: false,
      message: 'Not Implemented'
    },
    502: {
      success: false,
      message: 'Bad Gateway'
    },
    503: {
      success: false,
      message: 'Service Unavailable'
    },
    504: {
      success: false,
      message: 'Gateway Timeout'
    },
    505: {
      success: false,
      message: 'HTTP Version Not Supported'
    },
    506: {
      success: false,
      message: 'Variant Also Negotiates'
    },
    507: {
      success: false,
      message: 'Insufficient Storage'
    },
    508: {
      success: false,
      message: 'Loop Detected'
    },
    510: {
      success: false,
      message: 'Not Extended'
    },
    511: {
      success: false,
      message: 'Network Authentication Required'
    },
    599: {
      success: false,
      message: 'Network Connect Timeout Error'
    },
  },
  defaultFields: {
    // product services
    product: [
      '_id',
      'isFake',
      'priority',
      'referenceId',
      'keyWords',
      'brandId',
      'categoriesId',
      'titleFa',
      'titleEn',
      'description',
      'body',
      'slug',
      'isShow',
      'type',
      'status',
      'images',
      'attributes',
      'skus',
      'shortid',
      'createdAt',
      'updatedAt'
    ],
    comment: [
      '_id',
      'userId',
      'referId',
      'productId',
      'skuId',
      'ratings',
      'offer',
      'addvantages',
      'disAddvantages',
      'message',
      'status',
      'createdAt',
      'updatedAt'
    ],
    category: [
      '_id',
      'name',
      'sub',
      'slug',
      'image',
      'banner',
      'description',
    ],
    brand: [
      '_id',
      'name',
      'slug',
      'icon',
    ],
    offer: [
      '_id',
      'code',
      'title',
      'expirationTime',
      'amount',
      'type',
      'status'
    ],
    installment: [
      '_id',
      'categoryId',
      'createdAt',
      'updatedAt',
      'plans',
      'ownerId'
    ],
    // option services
    option: [
      '_id',
      'userId',
      'key',
      'value',
      'updatedAt',
      'createdAt',
    ],

    // user services
    order: [],
    user: [
      '_id',
      'phone',
      'status',
      'type',
      'email',
      'username',
      'name',
      'family',
      'avatar',
      'nationalCode',
      'locations',
      'telegram',
      'bio'
    ],
    wallet: [
      'amount',
      '_id',
      'userId',
      'logs',
      'logs.action',
      'logs.toId',
      'logs.createdAt',
      'updatedAt',
      'createdAt',
    ],
    list: [
      '_id',
      'userId',
      'name',
      'products',
      'updatedAt',
      'createdAt',
    ],

    // ceo
    meta: ['_id', 'createdAt', 'updatedAt', 'page', 'metas'],
    redirect: ['_id', 'createdAt', 'updatedAt', 'page', 'target', 'code'],

    // minishop Services
    template: [
      '_id',
      'profileId',
      'logo',
      'title',
      'url',
      'header',
      'body',
      'footer',
      'createdAt',
      'updatedAt'
    ]
  },

  // for user service
  bcrypt: {
    saltRound: 10
  },
  // telegram
  telegramMessageTypes: {
    text: { action: 'typing', method: 'sendMessage', caption: 'متن', chatType: 1 },
    sticker: { action: 'typing', method: 'sendSticker', caption: 'استیکر', chatType: 1 },
    photo: { action: 'upload_photo', method: 'sendPhoto', caption: 'عکس', chatType: 2 },
    video: { action: 'upload_video', method: 'sendVideo', caption: 'تصویر', chatType: 3 },
    audio: { action: 'upload_audio', method: 'sendAudio', caption: 'صوت', chatType: 3 },
    general: { action: 'upload_document', method: 'sendMediaGroup', caption: 'چند رسانه ای', chatType: 3 },
    document: { action: 'upload_document', method: 'sendDocument', caption: 'سند', chatType: 3 },
    voice: { action: 'find_audio', method: 'sendVoice', caption: 'صدا', chatType: 3 },
    animation: { action: 'find_video', method: 'sendAnimation', caption: 'انیمیشن', chatType: 3 },
    location: { action: 'find_location', method: 'sendLocation', caption: 'مکان', chatType: 1 }
  },
}