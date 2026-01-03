const express = require('express')
const { createTask, getTasks, updateTask, deleteTask } = require('../controller/task.controller')
const router = express.Router()


router.get('/alltasks', getTasks)

router.post('/createTask', createTask)

router.put('/updateTask/:id', updateTask)

router.delete('/deleteTask/:id', deleteTask)

module.exports = router