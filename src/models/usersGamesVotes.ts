import mongoose from "mongoose";

const schema = new mongoose.Schema({
    userId: String,
    gameId: String,
 
})


export default mongoose.models.UsersGamesVotes || mongoose.model("UsersGamesVotes",schema)