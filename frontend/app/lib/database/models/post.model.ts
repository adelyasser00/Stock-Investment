import mongoose, { model,models } from 'mongoose';
const { Schema } = mongoose;

const PostSchema = new Schema({
     _id: {
    type: Schema.Types.ObjectId,
    auto: true, // Automatically generate an ObjectId for each document
  },
	author:Schema.Types.ObjectId,
    content: String,
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    title:String,
    image:String
});

const Post = models?.Post || mongoose.model("Post", PostSchema);

export default Post;
