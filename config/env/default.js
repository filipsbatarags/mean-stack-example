'use strict';

module.exports = {
  app: {
    title: 'Latvijas Rokmūzikas Asociācija',
    description: 'LRMA mērķis ir radīt, uzturēt un popularizēt ilgtspējīgu un starptautiski atzītu kultūras vidi Latvijā, popularizējot Latvijas rokmūziku.',
    keywords: 'roks, rokmūzika, lrma, latvijas rokmūzikas asociācija, latvian rock music association, riga rock radio, rigarockradio, jānis bukums, bukums, rock, rock music, latvia, latvian rock, latvia rock',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID
  },
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  templateEngine: 'swig',
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'bananasareagreatsourceofpotassium',
  // sessionKey is set to the generic sessionId key used by PHP applications
  // for obsecurity reasons
  sessionKey: 'sessionId',
  sessionCollection: 'sessions',
  // Lusca config
  csrf: {
    csrf: false,
    csp: { /* Content Security Policy object */},
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    xssProtection: true
  },
  logo: 'https://www.lrma.lv/modules/core/client/img/brand/lrma.png',
  favicon: 'modules/core/client/img/brand/favicon.ico',
  uploads: {
    profileUpload: {
      dest: './modules/users/client/img/profile/uploads/', // Profile upload destination path
      limits: {
        fileSize: 50 * 1024 * 1024 // Max file size in bytes (1 MB)
      }
    }
  }
};
