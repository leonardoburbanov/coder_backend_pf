import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";

const collection = 'products';

/*
		"title": "product 1",
		"description": "product 1",
		"price": 51.88,
		"thumbnail": [],
		"code": "1",
		"stock": 35,
		"status": false,
		"category": "test",
		"id": 1

*/


const schema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    thumbnail:{
        type:Array,
        require:false
    },
    code:{
        type:String,
        require:true
    },
    stock:{
        type:Number,
        require:true
    },
    status:{
        type:Boolean,
        require:false
    },
    category:{
        type:String,
        require:true
    },
    owner:{
        type:String,
        require:true,
        default: 'admin'
    }
})

schema.plugin(mongoosePaginate)

const productModel = mongoose.model(collection,schema);
export default productModel;