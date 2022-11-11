// require packages and modules
const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const router = require('./routes/index')
const errorHandle = require('./middleware/errorHandle')

const app = express()
const PORT = 3000

// template engine
app.engine('hbs', engine({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// routes
app.use(router)
// error handle
app.use(errorHandle)

app.listen(PORT, (req, res) => console.log(`App is running on http://localhost:${PORT}`))