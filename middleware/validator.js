const { body } = require('express-validator')
const db = require('../models')
const User = db.User

module.exports = {
  registerValidator: [
    body('name').not().isEmpty().withMessage('請輸入使用者名稱'),
    body('email').isEmail().withMessage('請輸入有效Email')
      .bail().custom(async email => {
        try {
          const user = await User.findOne({ where: { email } })
          if (user) throw ('這個email已經註冊過了')
          return true
        } catch (err) {
          if (err === '這個email已經註冊過了') throw new Error(err)
          throw new Error('資料庫好像出錯了... 請過一會再使用')
        }
      }),
    body('password').not().isEmpty().withMessage('請輸入密碼')
      .bail().custom(password => {
        if (/\s/.test(password)) throw new Error('密碼請勿輸入空白')
        return true
      }),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('請輸入相同密碼')
      return true
    })
  ],
  todoValidator: [
    body('name').not().isEmpty().withMessage('請輸入待辦事項')
  ]
}