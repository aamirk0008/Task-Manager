const Task = require('../model/task.model')


const createTask = async (req, res) => {
    try {
        const product = req.body
        //validation of title and dueDate
        if (!product.title || !product.dueDate) {
            return res.status(400).json({ message: 'Title and Due Date are required' })
        }
        const newTask = new Task(product)
        const savedTask = await newTask.save()
        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: savedTask
        })
    } catch (error) {
        console.error('Error creating task:', error)
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' })
    }
}


const getTasks = async (req, res) => {
    try {
        const {status, priority, sortBy = 'dueDate', order = 'asc'} = req.query

        let filter = {}
        if (status) {
            filter.status = status
        }
        if (priority) {
            filter.priority = priority
        }

        const sortOrder = order === 'desc' ? -1 : 1
        const sortOptions  = {[sortBy]: sortOrder}
        const tasks = await Task.find(filter).sort(sortOptions)
        res.status(200).json({
            success: true,
            message: 'Tasks retrieved successfully',
            data: tasks
        })
    } catch (error) {
        success: false,
        console.error('Error getting tasks:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}


const updateTask = async (req, res) => {
    try {
        const {title, description, priority, dueDate, status} = req.body
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                priority,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                status
            },
            {
                new: true,
                runValidators: true
            }
        )

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' })
        }

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: updatedTask
        })
    } catch (error) {
        
        console.error('Error updating task:', error)
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' })
    }
}

const updateStatus = async (req, res) => {
    try {
        const {status} = req.body
        if (!status || !['Pending', 'Completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value i.e Pending or Completed required' })
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        )

        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                 message: 'Task not found' })
        }

        res.status(200).json({
            success: true,
            message: 'Task status updated successfully',
            data: updatedTask
        })
    } catch (error) {
        
        console.error('Error updating task status:', error)
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' })
    }
}

const deleteTask = async (req, res) => {
    try {
        const id = req.params.id
        const deletedTask = await Task.findByIdAndDelete(id)
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' })
        }
        res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
            data: deletedTask
        })
    } catch (error) {
        success: false,
        console.error('Error deleting task:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

const taskSummary = async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments()
        const pendingTasks = await Task.countDocuments({status: 'Pending'})
        const completedTasks = await Task.countDocuments({status: 'Completed'})
        const highPriorityTasks = await Task.countDocuments({priority: 'High', status: 'Pending'})

        res.status(200).json({
            success: true,
            message: 'Task summary retrieved successfully',
            data: {
                total: totalTasks,
                pending: pendingTasks,
                completed: completedTasks,
                highPriority: highPriorityTasks
            }
        })
    } catch (error) {
        console.error('Error getting task summary:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        error: error.message
        })
    }
}


module.exports = {
    createTask,
    getTasks,
    updateTask,
    updateStatus,
    deleteTask,
    taskSummary
}