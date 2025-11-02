import { v2 as cloudinary } from 'cloudinary'
import Student from '../model/student.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'



const signup = async (req, res) => {
    try {
        const { name, email, password, gender, classLevel, mode, number, town, city, country } = req.body
        let subjects = []
        if (req.body.subjects) {
            if (typeof req.body.subjects === 'string' && req.body.subjects.startsWith('[')) {
                try {
                    subjects = JSON.parse(req.body.subjects);
                } catch (e) {
                    subjects = [req.body.subjects];
                }
            }
            else if (Array.isArray(req.body.subjects)) {
                subjects = req.body.subjects;
            }
            else if (typeof req.body.subjects === 'string') {
                subjects = req.body.subjects.split(',').map(s => s.trim());
            }
        }
        else if (req.body['subjects[]']) {
            subjects = Array.isArray(req.body['subjects[]']) 
                ? req.body['subjects[]'] 
                : [req.body['subjects[]']];
        }

        const imageFile = req.file

        if (!imageFile || !name || !gender || !email || !password || !classLevel || !number || !town || !city || !country) {
            return res.json({
                success: false,
                message: "All required fields must be filled"
            })
        }

        if (subjects.length === 0) {
            return res.json({
                success: false,
                message: "At least one subject is required"
            })
        }

        const exemail = await Student.findOne({ email })

        if (exemail) {
            return res.json({
                success: false,
                message: "Email already exists"
            });
        }

        const imageupload = await cloudinary.uploader.upload(imageFile.path)
        const hashpass = await bcrypt.hash(password, 10)

        const students = await Student.create({
            name, 
            email, 
            password: hashpass, 
            image: imageupload.secure_url, 
            town, 
            classLevel, 
            number, 
            city, 
            gender, 
            subjects,
            mode: mode || 'Offline',
            landmark: req.body.landmark || '', 
            country, 
            Area: req.body.area || '' 
        })
        
        const token = jwt.sign({ _id: students._id }, process.env.JWT_SECRET);
        return res.json({
            success: true,
            message: "Account created successfully",
            token,
            students
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const students = await Student.findOne({ email })

        if (!students) {
            return res.json({
                success: false,
                message: "Email or pass is wrong"
            })
        }

        const match = await bcrypt.compare(password, students.password)
        if (!match) {
            return res.json({
                success: false,
                message: "Email or pass is wrong"
            })
        }

        const token = jwt.sign({ _id: students._id }, process.env.JWT_SECRET)

        return res.json({
            success: true,
            token,
            students
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

const getstudnets = async (req, res) => {
    try {
        
        const students = await Student.find({})
        if (students.length == 0) {
            return res.json({
                success: false,
                message: 'no studnets found'
            })
        }
        return res.json({
            success: true,
            students
        })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

const getallstudnets = async (req, res) => {
    try {
        const {country}=req.body
        if(!country){
            return res.json({
                success:false,message:"country is Required"
            })
        }
        const students = await Student.find({country})
        if (students.length == 0) {
            return res.json({
                success: false,
                message: 'no studnets found'
            })
        }
        return res.json({
            success: true,
            students
        })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

const getonestudnet = async (req, res) => {
    try {
        const { id } = req.body
        const student = await Student.findById(id )
        if (!student) {
            return res.json({ success: false, message: "studnet not found" })
        }
        return res.json({
            success: true, message: "fetched successfully", student
        })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

const updateinfo = async (req, res) => {
    try {
        const { token, name,  gender, classLevel, subjects, mode, number, town, city, landmark, country, area  } = req.body
        const image = req.file
        if (!token || !name || !gender ||  !subjects || !mode ||  !landmark || !classLevel || !country || !area || !number || !town || !city) {
            return res.json({
                success: false,
                message: "Something is missing"
            })
        }
        const student = jwt.verify(token, process.env.JWT_SECRET)

        await Student.findByIdAndUpdate(student._id, { name,town, classLevel, number, city, gender, subjects, mode, landmark, country, area})

        if (image) {
            const imagefile = await cloudinary.uploader.upload(image.path)
            await Student.findByIdAndUpdate(student._id, { image:imagefile.secure_url })
        }
        return res.json({
            success: true,
            message: "Update Successfully"
        })


    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

const changepass=async(req,res)=>{
    try{
        const {password,newpass,id}=req.body
        if(!password ||!newpass ||!id){
            return res.json({success:false,message:"somefield is missing"})
        }


        const student=await Student.findById(id)

        if(!student){
            return res.json({success:false,message:"studnet not found"})
        }

        const match=await bcrypt.compare(password,student.password)
        if(!match){
            return res.json({success:false,message:"Passowrd is wrong"})
        }
    const hash=await bcrypt.hash(newpass,10);
        await Student.findByIdAndUpdate(id,{password:hash})

        return res.json({success:true,message:"Update Successfull"})

    }catch(error){
        return res.json({success:false,message:error.message})
    }
}
export { signup, login, getallstudnets, updateinfo, getonestudnet ,getstudnets,changepass}