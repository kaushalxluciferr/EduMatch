import mongoose from "mongoose";


const connectdb = async () => {
    mongoose.connection.on("connected", () => {
        console.log("love from mongoDb");
    })
    await mongoose.connect(`${process.env.MONGODB_URL}`)
}

export default connectdb