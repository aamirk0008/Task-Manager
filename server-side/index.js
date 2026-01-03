const express = require('express')

const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

app.use(cors())

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'https://task-manager-nine-blue-18.vercel.app',
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.log('Blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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