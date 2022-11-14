const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo
const { todoValidator } = require('../../middleware/validator')
const { validationResult } = require('express-validator')

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', todoValidator, async (req, res, next) => {
  try {
    const errors = validationResult(req)
    const name = req.body.name
    const UserId = req.user.id
    if (!errors.isEmpty()) {
      req.flash('warning_msg', errors.errors[0].msg)
      return res.redirect('/todos/new')
    }
    await Todo.create({ name, UserId })
    res.redirect('/')
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const UserId = req.user.id
    const todo = await Todo.findOne({ where: { id, UserId } })
    return res.render('detail', { todo: todo.toJSON() })
  } catch (err) {
    next(err)
  }
})

router.get('/:id/edit', async (req, res, next) => {
  try {
    const id = req.params.id
    const UserId = req.user.id
    const todo = await Todo.findOne({ where: { id, UserId } })
    return res.render('edit', { todo: todo.toJSON() })
  } catch (err) {
    next(err)
  }
})

router.put('/:id', todoValidator, async (req, res, next) => {
  try {
    const errors = validationResult(req)
    const { name, isDone } = req.body
    const id = req.params.id
    const UserId = req.user.id
    if (!errors.isEmpty()) {
      req.flash('warning_msg', errors.errors[0].msg)
      return res.redirect(`/todos/${id}/edit`)
    }
    await Todo.update({ name, isDone: isDone === 'on' }, { where: { id, UserId } })
    return res.redirect(`/todos/${id}`)
  } catch (err) {
    next(err)
  }
})

module.exports = router