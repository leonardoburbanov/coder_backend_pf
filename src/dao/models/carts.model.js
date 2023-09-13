import mongoose from 'mongoose';

const collection = 'carts';
/*
		"products": []
*/
const schema = new mongoose.Schema({
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
})

schema.pre('find', function(){
    this.populate("products.product");
})

const cartModel = mongoose.model(collection,schema);
export default cartModel;