export default {
  // Db
  db: 'mongodb://localhost/techcube',
  dbOptions: {
    db: { native_parser: true },
    server: {
      auto_reconnect: true,
      socketOptions: {
        keepAlive: 1,
        connectTimeoutMS: 300000,
        socketTimeoutMS: 300000
      }
    }
  },

  // Port
  port: 3000,

  // Secret for token
  secret: 'du_Aw#AD{aC}tDF!h9=7Rg',

  // Mailer
  mailer: {
    from: 'iMED <marketing@imed.com.vn>',
    report: 'iMED',
    transportMethod: 'SMTP',
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  }
}
