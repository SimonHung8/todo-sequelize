const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('project TODO SEQUELIZE init')
})

module.exports = router