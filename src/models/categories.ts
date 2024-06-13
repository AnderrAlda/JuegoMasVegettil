import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title: String,
})


export default mongoose.models.Categories || mongoose.model("Categories",schema)