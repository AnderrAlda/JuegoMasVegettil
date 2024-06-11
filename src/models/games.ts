import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title: String,
    image: String,
    votes:Number
})


export default mongoose.models.Games || mongoose.model("Games",schema)