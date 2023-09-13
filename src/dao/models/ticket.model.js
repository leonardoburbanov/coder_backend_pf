import mongoose from "mongoose";


const collection = 'Ticket';

const schema = new mongoose.Schema({
   code: String,
   purchase_datetime: {
      type: Date,
      default: Date.now()
   },
   amount: Number,
   purchaser: String,
   products:{
      type: [
          {
              product: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref:"products"
              },
              quantity: Number
          }
      ],
      default: []
  }
});
const TicketModel = mongoose.model(collection, schema);

export default TicketModel;