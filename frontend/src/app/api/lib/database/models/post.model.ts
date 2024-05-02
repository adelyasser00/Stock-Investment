import mongoose, { model,models } from 'mongoose';
const { Schema } = mongoose;

const PostSchema = new Schema({
	author:Schema.Types.ObjectId,
    content: String,
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 }
});

const Post = models?.Post || mongoose.model("Post", PostSchema);

export default Post;
