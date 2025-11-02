import express from "express"
import upload from "../config/multer.js"
import { changepass, getallstudnets, getonestudnet, getstudnets, login, signup, updateinfo } from "../controller/studnetcontroller.js"
import teacherAuth from "../middleware/teacherauth.js"
import studentAuth from "../middleware/studentauth.js"
const studentRouter = express.Router()


studentRouter.post("/signup", upload.single("image"), signup)
studentRouter.post('/login', login)
studentRouter.post('/update', upload.single("/upload"), studentAuth, updateinfo)  //studnet to upfate their profile
studentRouter.post('/getinfo', teacherAuth, getallstudnets)  //for teacher to access the studnet data
studentRouter.post('/getoneinfo', teacherAuth, getonestudnet)  // for teacher to access one studnets data
studentRouter.post('/getAllstudent',teacherAuth,getstudnets)
studentRouter.post('/changepass',studentAuth,changepass)



export default studentRouter
