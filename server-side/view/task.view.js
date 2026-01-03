const express = require('express')
const { createTask, getTasks, updateTask, deleteTask, updateStatus, taskSummary } = require('../controller/task.controller')
const router = express.Router()


router.get('/alltasks', getTasks)

router.post('/createTask', createTask)

router.put('/updateTask/:id', updateTask)

router.patch('/updateStatus/:id', updateStatus)

router.delete('/deleteTask/:id', deleteTask)

router.get('/taskSummary', taskSummary)

module.exports = router