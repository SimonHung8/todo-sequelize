// require packages and modules
const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const router = require('./routes/index')
const usePassport = require('./config/passport')
const errorHandle = require('./middleware/errorHandle')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const PORT = process.env.PORT

// template engine
app.engine('hbs', engine({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}
))
usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})

// routes
app.use(router)
// error handle
app.use(errorHandle)

app.listen(PORT, (req, res) => console.log(`App is running on http://localhost:${PORT}`))