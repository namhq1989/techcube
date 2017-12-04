export default {
  // Db
  db: 'mongodb://localhost/imed-dev',
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
  secret: 'TM7?K^P!AJmod&4C.qx@gE',

  // Mailer
  mailer: {
    from: 'Techcube <support@techcube.com>',
    report: 'Tech Cube',
    transportMethod: 'SMTP',
    service: 'Gmail',
    auth: {
      user: 'shinaekwon2n@gmail.com',
      pass: '646341aZ?QP'
    }
  }
}
