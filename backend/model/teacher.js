import mongoose from "mongoose";


const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"]
    },
    subjects: {
        type: [String],
        default: []
    },
    yearsofExperience: {
        type: Number,
        default: 0
    },
    experience: [
        {
            type: String
        }
    ],
    description: {
        type: String,
        maxlength: 300
    },
    teachupto: {
        type: String,
        required: true
    },
    qualification: {
        type: String
    },
    mode: {
        type: String,
        enum: ["Online", "Offline", "Hybrid"],
        default: "Offline"
    },
    feesPerHour: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    totalReview: {
        type: Number,
        default: 0
    },
    number: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    }, town: {
        type: String,
        required: true
    },
    area: {
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Teacher = mongoose.model("Teacher", teacherSchema)

export default Teacher