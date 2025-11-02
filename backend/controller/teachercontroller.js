import Teacher from "../model/teacher.js"
import { v2 as cloudinary } from 'cloudinary'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


const signup = async (req, res) => {
    try {
        const { name, email, password, gender,subjects,yearsofExperience,experience,description, teachupto,qualification,mode,feesPerHour, number, country, city,town,area } = req.body

        const image = req.file

        if (!image || !name || !email || !gender||!subjects||!password||!yearsofExperience ||experience|| !description || !qualification||!teachupto ||!feesPerHour|| !number || !country || !city||!town||!area) {
            return res.json({
                success: false,
                message: "Something is missing"
            })
        }

        const exemail = await Teacher.findOne({ email })
        if (exemail) {
            return res.json({
                success: false,
                message: "email Exists"
            })
        }

        const imageupoad = await cloudinary.uploader.upload(image.path)
        const hashpass = await bcrypt.hash(password, 10)

        const teachers = await Teacher.create({
            name, email, password: hashpass, image: imageupoad.secure_url, gender,subjects,yearsofExperience,experience,description, teachupto,qualification,mode,feesPerHour, number, country, city,town,area
        })

        await teachers.save()

        const token = jwt.sign({ _id: teachers._id }, process.env.JWT_SECRET)

        return res.json({ success: true, message: "Signup Successfull", token,teachers })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const teacher = await Teacher.findOne({ email })

        if (!teacher) {
            return res.json({
                success: false,
                message: "Email or pass is wrong"
            })
        }

        const match = await bcrypt.compare(password, teacher.password)
        if (!match) {
            return res.json({
                success: false,
                message: "Email or pass is wrong"
            })
        }
        const token = jwt.sign({ _id: teacher._id }, process.env.JWT_SECRET)
       
        return res.json({
            success: true,
            message: "login Successfull",
            token,
            teacher
            
        })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


const getteacherinfo = async (req, res) => {
    try {
        const {country}=req.body
        const teacher = await Teacher.find({country})

        if (teacher.length==0) {
            return res.json({
                success: false,
                message: "No teacher found"
            })
        }
        return res.json({
            success: true,
            teacher
        })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


const getAllteacher = async (req, res) => {
    try {
        const teacher = await Teacher.find({})

        if (teacher.length==0) {
            return res.json({
                success: false,
                message: "No teacher found"
            })
        }
        return res.json({
            success: true,
            teacher
        })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


const updateindo = async (req, res) => {
    try {
        const { token, name, gender,subjects,yearsofExperience,experience,description, teachupto,qualification,mode,feesPerHour, number, country, city,town,area  } = req.body

        const image = req.file

        if ( !token||!name || !gender||!subjects||!yearsofExperience ||experience|| !description || !qualification||!teachupto ||!feesPerHour|| !number || !country || !city||!town||!area) {
            return res.json({
                success: false,
                message: "Something is missing"
            })
        }

        const teacher = jwt.verify(token, process.env.JWT_SECRET)

        await Teacher.findByIdAndUpdate(teacher._id, { name, gender,subjects,yearsofExperience,experience,description, teachupto,qualification,mode,feesPerHour, number, country, city,town,area  })
        if (image) {
            const imagefile = await cloudinary.uploader.upload(image.path)
            await Teacher.findByIdAndUpdate(teacher._id, { image: imagefile.secure_url })
        }

        return res.json({
            success: true,
            message: "Updated Successfully"
        })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


const getoneTeacherInfo = async (req, res) => {
    try {
        const { id } = req.body

        if (!id) {
            return res.json({ success: false, message: "id is not sent" })
        }
        const teacher = await Teacher.findById(id)
        if (!teacher) {
            return res.json({ success: false, message: "Teacher not Found" })
        }
        return res.json({ success: true, message: "Teacher Fetched", teacher })

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


        const teacher=await Teacher.findById(id)

        if(!teacher){
            return res.json({success:false,message:"studnet not found"})
        }

        const match=await bcrypt.compare(password,teacher.password)
        if(!match){
            return res.json({success:false,message:"Passowrd is wrong"})
        }
    const hash=await bcrypt.hash(newpass,10);
        await Teacher.findByIdAndUpdate(id,{password:hash})

        return res.json({success:true,message:"Update Successfull"})
        
    }catch(error){
        return res.json({success:false,message:error.message})
    }
}




export { signup, login, getteacherinfo, updateindo, getoneTeacherInfo ,getAllteacher,changepass}