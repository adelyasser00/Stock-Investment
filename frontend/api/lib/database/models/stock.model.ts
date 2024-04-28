import { Schema, model, models } from "mongoose";

// Define a subdocument schema for invested stocks
const InvestedStockSchema = new Schema({
   investor:{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   stockId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true
   },
   numberOfStocks: {
      type: Number,
      required: true
   },
   priceOfBuying: {
      type: Number,
      required: true
   }
});

const Stock = models?.Stock || model("Stock", InvestedStockSchema);

export default Stock;
