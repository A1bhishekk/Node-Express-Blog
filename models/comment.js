import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, "Please enter the content"],
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    blogId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
    }
},
    { timestamps: true })

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;