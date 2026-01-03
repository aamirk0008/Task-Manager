const express = require('express')

const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

app.use(cors())

dotenv.config()

const taskRoutes = require('./view/task.view')

app.use(express.json())



app.get('/', (req, res ) => {
    res.send('Hello from the Task Manager Server!')
})

app.use('/api', taskRoutes)

const mongoURI = process.env.SECRET_KEY

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI)
        console.log('Task Manager Database connected successfully')
    } catch (error) {
        console.error('Database connection error:', error)
        process.exit(1)
    }
}

connectDB()








const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})