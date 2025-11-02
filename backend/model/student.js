import mongoose from "mongoose";


const studentSchema = new mongoose.Schema({
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
    classLevel: {
        type: String,
        required: true
    },
    subjects: {
        type: [String],
        default: []
    },
    mode: {
        type: String,
        enum: ["Online", "Offline", "Hybrid"],
        default: "Offline"
    },
    number: {
        type: String,
        required: true
    },
    town: {
        type: String,
        required: true
    },
    landmark: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    Area: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Student = mongoose.model("student", studentSchema)

export default Student