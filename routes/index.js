const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const users = require('./modules/users')
const todos = require('./modules/todos')
const authenticate = require('../middleware/auth')
const undefinedRoute = require('./modules/undefinedRoute')

router.use('/users', users)
router.use('/todos', authenticate, todos)
router.use('/', authenticate, home)
router.use('/', undefinedRoute)

module.exports = router