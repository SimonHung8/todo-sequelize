const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const router = express.Router()
const { validationResult } = require('express-validator')
const { registerValidator } = require('../../middleware/validator')
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

router.post('/register', registerValidator, async (req, res, next) => {
  try {
    const errors = validationResult(req)
    const { name, email, password, confirmPassword } = req.body
    if (!errors.isEmpty()) {
      return res.render('register', { errorMsg: errors.errors, name, email, password, confirmPassword })
    }
    const salt = await bcrypt.genSalt(5)
    const hash = await bcrypt.hash(password, salt)
    const user = await User.create({ name, email, password: hash })
    req.logIn(user, () => res.redirect('/'))
  } catch (err) {
    next(err)
  }
})

router.get('/logout', (req, res) => {
  req.logOut(() => {
    req.flash('success_msg', '你已經登出')
    res.redirect('/users/login')
  })
})

module.exports = router