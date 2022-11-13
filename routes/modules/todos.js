const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo

router.get('/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findByPk(req.params.id)
    return res.render('detail', { todo: todo.toJSON() })
  } catch (err) {
    next(err)
  }
  const id = req.params.id
  Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(next)
})

module.exports = router