/*
  Test config
*/

module.exports = {
  // Db
  db: 'mongodb://localhost/zodyapp-test',

  // Port
  port: 5006,

  // Facebook
  facebook: {
    clientID: '909146105775411',
    clientSecret: '6af098c0aa695822f5740f8ab9c37eb5',
    callbackURL: 'http://localhost:3000/api/auth/facebook/callback'
  },

  // Mailer
  mailer: {
    from: 'Nam Huynh <shinaekwon2n@gmail.com>',
    report: 'namhq.1989@gmail.com',
    transportMethod: 'SMTP',
    service: 'Gmail',
    auth: {
      user: 'shinaekwon2n@gmail.com',
      pass: '646341aZ?QP'
    }
  },

  // S3
  S3: {
    // host: 'https://zody-test.s3.amazonaws.com/',
    host: 'https://zodyapp-test.s3.amazonaws.com/',
    bucket: 'zodyapp-test'
  },

  // Secret for user token
  secret: 'DC2da?q!45#{fc}65|d(!5'
};
