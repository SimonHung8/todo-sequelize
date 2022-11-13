const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const router = express.Router()
const db = require('../../models')
const User = db.User

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        console.log('user already exists')
        return res.render('register', { name, email, password, confirmPassword })
      }
      return bcrypt.genSalt(5)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({ name, email, password: hash }).catch(next))
        .then(() => res.redirect('/'))
        .catch(next)
    })
})

module.exports = router