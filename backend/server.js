import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectdb from './config/connectDb.js'
import connectCloudinary from './config/connectCloudinary.js'
import studentRouter from './routes/studentRoute.js'
import teacherRouter from './routes/teacherRoute.js'




dotenv.config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
await connectdb()
await connectCloudinary()

app.use('/api/student', studentRouter)
app.use('/api/teacher', teacherRouter)
app.get("/", (req, res) => {
    res.send("hey sanamikiya")
})

app.listen(3000, () => {
    console.log("hii from server");
})

