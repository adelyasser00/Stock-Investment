import mongoose from 'mongoose';
const { Schema } = mongoose;

const PostSchema = new Schema({
 content: String,
 upvotes: { type: Number, default: 0 },
 downvotes: { type: Number, default: 0 }
});

const CompanySchema = new Schema({
   companyName: {
      type: String,
      required: true, 
      unique: true
   },
   clerkId: { 
      type: String,
      required: true, 
      unique: true 
   },
   email: { 
      type: String,
      required: true,
      unique: true 
   },
   investorStatistics: {
      totalPosts: Number,
      totalFollowers: Number
   },
   userFollowers: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
   }],
   description: String,
   photo: String,
   article: String,
   stockClosingPrice: Number, //should be list of historical data
   ticker: String,
   posts: [PostSchema]
});

const Company = models?.Company || mongoose.model("Company", CompanySchema);

export default Company;
