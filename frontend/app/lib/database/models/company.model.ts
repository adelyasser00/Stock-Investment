import mongoose, { model,models } from 'mongoose';
const { Schema } = mongoose;

const CompanySchema = new Schema({
    _id: {
    type: Schema.Types.ObjectId,
    auto: true, // Automatically generate an ObjectId for each document
  },
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
   description: String, // will be field for now
   photo: String,
   article: String,
   // stockClosingPrice: Number, //should be list of historical data
   ticker: String,
   posts: [{
      type:Schema.Types.ObjectId,
      ref:'Post'}],
   details: {
        Open: String,
        Volume: String,
        Market_Cap: String,
        Revenue: String,
        PE_Ratio: String,
        Dividend: String,
        Shares_outstanding: String,
    },
    History: {
        type: Map,
        of: String
    },

});
CompanySchema.index({ companyName: 'text', description: 'text', ticker: 'text' });

const Company = models?.Company || mongoose.model("Company", CompanySchema);

export default Company;
