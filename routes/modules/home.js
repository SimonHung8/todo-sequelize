const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo
const User = db.User

router.get('/', async (req, res, next) => {
  try {
    const UserID = req.user.id
    const todos = await Todo.findAll({
      raw: true,
      nest: true,
      where: { UserID}
    })
    return res.render('index', { todos })
  } catch (err) {
    next(err)
  }
})

module.exports = router