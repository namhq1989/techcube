export default {
  // Db
  db: 'mongodb://localhost/techcube-dev',
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
