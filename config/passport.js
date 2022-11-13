const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy(
    {
      usernameField: 'email', passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } })
        if (!user) return done(null, false, req.flash('warning_msg', '這個email還沒有註冊過喔'))
        const isMatched = await bcrypt.compare(password, user.password)
        if (!isMatched) return done(null, false, req.flash('warning_msg', '錯誤的帳號或密碼'))
        return done(null, user)
      } catch (err) {
        return done(err)
      }
    }
  ))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id)
      return done(null, user.toJSON())
    } catch (err) {
      return done(err)
    }
  })
}