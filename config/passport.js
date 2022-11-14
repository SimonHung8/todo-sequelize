const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const { UniqueConstraintError } = require('sequelize')
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

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { email, name } = profile._json
        const user = await User.findOne({ where: { email } })
        if (user) return done(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        const salt = await bcrypt.genSalt(5)
        const hash = await bcrypt.hash(randomPassword, salt)
        await User.create({ email, name, password: hash })
        return done(null, user)
      } catch (err) {
        done(err)
      }
    }
  ));

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