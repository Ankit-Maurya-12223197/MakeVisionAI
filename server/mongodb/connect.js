import mongoose from "mongoose";

const connectDB = (url) => {
    mongoose.set('strictQuery', true); // for searching

    mongoose.connect(url)
        .then(()=>console.log("MongoDB connected"))
        .catch((err)=> console.log("Failed in connection: ",err.message))
}

export default connectDB;