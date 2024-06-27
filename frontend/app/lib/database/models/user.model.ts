import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
   _id: {
    type: Schema.Types.ObjectId,
    auto: true, // Automatically generate an ObjectId for each document
  },
 clerkId: {
    type: String,
    required: true,
    unique: true,
 },
 email: {
    type: String,
    required: true,
    unique: true,
 },
 username: {
    type: String,
    required: true,
    unique: true,
 },
 photo: {
    type: String,
 },
 firstName: {
    type: String,
 },
 lastName: {
    type: String,
 },
 planId: {
    type: Number,
    default: 1,
 },
 creditBalance: {
    type: Number,
    default: 10,
 },
 watchlist: [{
    type: String,
    ref: 'Company'
 }],
 savedlist: [{
    type:Schema.Types.ObjectId,
    ref:'Post'
 }],
 followedCompanies: [{
    type: String,
    ref: 'Company'
 }],
 investedStocks: [{
   type:Schema.Types.ObjectId,
   ref:'Stock'
}],
 preferences: [{
    type: String
 }],
    // for registered companies
 companyClerkId:[{
    type: String,
    ref:'CompanyClerkId',
    unique:true
}]
});

const User = models?.User || model("User", UserSchema);

export default User;
