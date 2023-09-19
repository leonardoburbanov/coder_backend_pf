import productsService from "../services/products.service.js";
import { CustomError } from "../services/errors/customError.service.js";
import { EError } from "../enums/EError.js";
import { generateProductErrorInfo } from "../services/errors/productErrorInfo.error.js";
import userModel from "../dao/models/User.model.js";
import productModel from "../dao/models/products.model.js";
import { productDeleteConfirmation } from '../messages/email/nodemailer.js';

class Product {
    constructor(title, description, price, thumbnail = null, code, stock, status = true, category, owner = 'admin') {
      if (!title || !description || !price || !code || !stock) {
        throw new Error('All main fields required: title, description, price, code, stock');
      }
      this.title = title;
      this.description = description;
      this.price = price;
      this.thumbnail = thumbnail;
      this.code = code;
      this.stock = stock;
      this.status = status;
      this.category = category;
      this.owner = owner;
    }
  }


class ProductsController {
  getProducts = async (req, res) => {
    try {
      let limit;
      let result;
      let page;
      let sort;
      let query;
      if(req.query.limit){
          limit = parseInt(req.query.limit)
      }else{
          limit = 10
      }
      if(req.query.page){
          page = parseInt(req.query.page)
      }else{
          page=1
      }
      if(req.query.query){
          query=JSON.parse(req.query.query)
          if(query.status!=null || query.category!=null || query.stock!=null){
              query = query
          }else{
              throw new Error("The query is not correct")
          }
      }else{
          query={}
      }
      if(req.query.sort){
          sort = req.query.sort
          if(sort=='asc'){
              sort = 'price'
          }else if(sort=='desc'){
              sort = '-price'
          }
      }else{
          sort = null
      }

      let params = {
          limit: limit,
          input_page: page,
          query: query,
          sort: sort
      }
      result = await productsService.getProducts(params)
      let products = result.docs;
      let nextLink=null;
      let prevLink=null;
      let host = req.headers.host;
      if(result.hasPrevPage==true){
          prevLink= 'http://'+host+'/api/products?page='+result.prevPage
      }
      if(result.hasNextPage==true){
          nextLink= 'http://'+host+'/api/products?page='+result.nextPage
      }

      res.send({
          status: 'Success',
          code:200,
          payload: products,
          totalPages: result.totalPages,
          prevPage: result.prevPage,
          nextPage: result.nextPage,
          page: result.page,
          hasPrevPage: result.hasPrevPage,
          hasNextPage: result.hasNextPage,
          prevLink: prevLink,
          nextLink: nextLink
      })
      }catch(error){
          res.status(400).send({error:error.message});
      }
  };
  getProductById = async (req, res) => {
    try{
      const idProduct = req.params.idProduct;
      let product = await productsService.getProductById(idProduct)
      let response;
      if(!product){
          response = {
              error:"Product not found."
          }
      }else{
          response = {product}
      }
      res.send(response)
    }catch(error){
      res.status(400).send({error:error.message});
    }
  }

  addProduct = async (req, res) => {
    const {title, description, price, thumbnail, code, stock, status , category, owner} = req.body;
    const user = await userModel.findOne({email: owner})
    if(!user){
        res.status(400).send({error:error.message});
    }
    
    try {
        
        if(owner){
            if(user.rol=='premium' || user.rol=='admin'){
                let product = new Product(title, description, price, thumbnail, code, stock, status , category, owner);
                let new_product = await productsService.addProduct(product);
                res.send({
                    data:new_product,
                    message:"Product created"
                });
            }else{
                res.status(400).send({error:'Now allowed to execute this operation'});
            }
        }
        else{
            let product = new Product(title, description, price, thumbnail, code, stock, status , category);
                let new_product = await productsService.addProduct(product);
                res.send({
                    data:new_product,
                    message:"Product created"
                });
        }
    }catch(error){
        await CustomError.createError({
            name: "Product create error",
            cause: generateProductErrorInfo(req.body),
            message: "Product create error",
            errorCode: EError.INVALID_JSON
        });
        res.status(400).send({error:error.message});
        }
    }
    updateProduct= async (req, res) => {
        const idProduct = req.params.idProduct;
        const productUpdate = req.body;
        try {
            let products = await productsService.updateProduct(idProduct,productUpdate)
            res.send({products})
        }catch(error){
            req.logguer.error(error.message);
            res.status(400).send({error:error.message});
        }
    }
    deleteProduct= async (req, res) => {
        const idProduct = req.params.idProduct;
        let ownerEmail = ""
        let userRole = ""
        try{
            ownerEmail = req.session.user.email;
            userRole = req.session.user.rol;
        }catch(error){
            ownerEmail = "leofr7nco@gmail.com"
            userRole = "admin";
        }  
        
        try {
            let product_deleted = await productsService.deleteProduct(idProduct, ownerEmail, userRole)
            
            const user = await userModel.findOne({email: product_deleted[0].owner})
            if(user.rol == "premium"){
                await productDeleteConfirmation(product_deleted[0].owner)
            }
            res.send({data: product_deleted, message: "Product deleted"})
        }catch(error){
            res.status(400).send({error:error.message});
        }
    }
    getProductById = async (req, res) => {
        const idProduct = req.params.idProduct;
        let product = await productsService.getProductById(idProduct)
        let response;
        if(!product){
            response = {
                error:"Product not found."
            }
        }else{
            response = {product}
        }
        res.send(response)
    }

    static updateProductImage = async (req, res) => {
        const idProduct = req.params.idProduct;
        console.log(req.files)
        let productImage = req.files['productImage']?.[0] || null;
        let product = await productsService.getProductById(idProduct)
        const thumbnails = [];
        if(productImage){
            thumbnails.push({name: product.title, reference: productImage.filename})
        }
        product.thumbnail = thumbnails;
        const productUpdate = await productModel.findByIdAndUpdate(idProduct,product)
        res.json({status:"success", message:"Product image updated"})
    }
}

export default ProductsController;