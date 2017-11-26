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
