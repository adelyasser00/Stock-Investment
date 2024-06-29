import { Schema, model, models } from "mongoose";

// Define a subdocument schema for invested stocks
const InvestedStockSchema = new Schema({
    _id: {
    type: Schema.Types.ObjectId,
    auto: true, // Automatically generate an ObjectId for each document
  },
   investorClerkId:{
      type: String,
      required: true
   },
   companyClerkId: {
      type: String,
      required: true
   },
   numOfUnits: {
      type: Number,
      required: true
   },
   price: {
      type: Number,
      required: true
   },
    date: {
        type: Date,
        default: Date.now, // Set the default value to the current date
    },
    isSell: {
    type: Boolean,
        required: true, // Make this field required
}

});

const Stock = models?.Stock || model("Stock", InvestedStockSchema);

export default Stock;
