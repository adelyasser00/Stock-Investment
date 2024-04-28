import mongoose, { model,models } from 'mongoose';
const { Schema } = mongoose;

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
   posts: [{
      type:Schema.Types.ObjectId,
      ref:'Post'}]
});

const Company = models?.Company || mongoose.model("Company", CompanySchema);

export default Company;
