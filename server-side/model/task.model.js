const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
            maxLength: [200, 'Task title cannot exceed 200 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxLength: [1000, 'Task description cannot exceed 1000 characters'],
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium',
        },
        dueDate: {
            type: Date,
            required: [true, 'Due date is required'],
        },
        status: {
            type: String,
            enum: ['Pending', 'Completed'],
            default: 'Pending'
        }
    },
    {
        timestamps: true
    }
)

taskSchema.index({status: 1, dueDate: 1})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task