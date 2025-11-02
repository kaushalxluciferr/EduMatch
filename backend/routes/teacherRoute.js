import express from "express"
import upload from "../config/multer.js"
import { changepass, getAllteacher, getteacherinfo, login, signup, updateindo } from "../controller/teachercontroller.js"
import studentAuth from "../middleware/studentauth.js"
import teacherAuth from "../middleware/teacherauth.js"
const teacherRouter = express.Router()


teacherRouter.post("/signup", upload.single("image"), signup)
teacherRouter.post("/login", login)
teacherRouter.post('/getteacherbycountry', studentAuth, getteacherinfo)
teacherRouter.post('/updateinfo', upload.single('image'), teacherAuth, updateindo)
teacherRouter.post('/getallteacher',studentAuth,getAllteacher)
teacherRouter.post('/changepass',teacherAuth,changepass)
export default teacherRouter