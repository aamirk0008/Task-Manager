const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()

const app = express()



app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://task-manager-nine-blue-18.vercel.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



app.use(express.json())
app.use(express.urlencoded({ extended: true }));


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

const taskRoutes = require('./view/task.view')

app.get('/', (req, res ) => {
    res.send('Hello from the Task Manager Server!')
})

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Task Manager API is running',
        timestamp: new Date().toISOString()
    })
})

app.use('/api', taskRoutes)

app.use((err, req, res, next) => {
    console.error('Error:', err.stack)
    res.status(500).json({ 
        success: false,
        message: 'Something went wrong!',
        error: err.message 
    })
})






const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})