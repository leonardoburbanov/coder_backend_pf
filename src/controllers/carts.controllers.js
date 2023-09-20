import { response, request } from "express";
import cartsService from "../services/carts.service.js";
import productsService from "../services/products.service.js";
import {v4 as uuidv4} from 'uuid';
import TicketModel from "../dao/models/ticket.model.js";
import { sendMessage } from "../messages/sms/twilio.js"
import { ticketConfirmation } from '../messages/email/nodemailer.js';


class Cart {
    constructor(products = []) {
      this.products = products;
    }
  }


class CartsController {
  getCarts = async (req, res) => {
    let limit;
    let carts = await cartsService.getCarts()
    if(req.query.limit){
        limit = req.query.limit
        carts = carts.slice(0,limit)
    }
    res.send({
        status: 'Success',
        data: carts 
    })
  };
  addCart = async (req, res) => {
    const {products} = req.body;
    try {
        let cart = new Cart(products);
        let carts = await cartsService.addCart(cart);
        res.send({
            data: carts,
            message: "Cart added"
        });
    }catch(error){
        res.status(400).send({error:error.message});
    }
  }

  getCartById = async (req, res) => {
    const idcart = req.params.idcart;

    let cart = await cartsService.getCartById(idcart)
    let products = cart.products
    let response;
    if(!cart){
        response = {
            error:"cart not found."
        }
        res.status(400).send(response)
    }else{
        res.send({products})
    }
  }
  addProductInCart= async (req, res) => {
    const idcart = req.params.idcart;
    const idproduct = req.params.idproduct;

    let userEmail = "";
    let userRol = "";
    try{
        userEmail = req.user.email;
        userRol = req.user.rol;
    }catch(error){
        userEmail = "leofr7nco@gmail.com";
        userRol = "admin"
    }
    

    try {
        let cart = await cartsService.addProductInCart(idcart,idproduct, userEmail, userRol)
        res.send({cartUpdated: cart, message : "Product added to cart"})
    }catch(error){
        res.status(400).send({error:error.message})
    }
  }
  updateProductInCart = async (req, res) => {
    const idcart = req.params.idcart;
    const idproduct = req.params.idproduct;
    const quantity = req.body.quantity;
    try {
        let carts = await cartsService.updateProductInCart(idcart,idproduct,quantity)
        res.send(carts)
    }catch(error){
        res.status(400).send({error:error.message})
    }
  }
  deleteProductInCart = async (req, res) => {
    const idcart = req.params.idcart;
    const idproduct = req.params.idproduct;
    try {
        let carts = await cartsService.deleteProductInCart(idcart,idproduct)
        res.send(carts)
    }catch(error){
        res.status(400).send({error:error.message})
    }
    }
    deleteCart = async (req, res) => {
        const idcart = req.params.idcart;
        try {
            let cartDeleted = await cartsService.deleteCart(idcart)
            res.send({data: cartDeleted, message: "Cart deleted"})
        }catch(error){
            res.status(400).send({error:error.message});
        }
    
    }
    updateCart = async (req, res) => {
        const idcart = req.params.idcart;
        const newProducts = req.body;
        try {
            let carts = await cartsService.updateCart(idcart,newProducts)
            res.send({carts})
        }catch(error){
            res.status(400).send({error:error.message});
        }
    
    } 
    purchaseCart = async (req, res) => {
        try {
            const cartId = req.params.idcart;
            const email = req.session.user.email;
            console.log('email',email);
            const cart = await cartsService.getCartById(cartId);
            if(cart){
                if(!cart.products.length){
                    return res.send("Please, add your products before to generate the purchase")
                }
                const ticketProducts = [];
                const rejectedProducts = [];
                for(let i=0; i<cart.products.length;i++){
                    const cartProduct = cart.products[i];
                    const productDB = await productsService.getProductById(cartProduct.product._id);
                    if(cartProduct.quantity<=productDB.stock){
                        await cartsService.deleteProductInCart(cartId,cartProduct.product._id.toString())
                        ticketProducts.push(cartProduct);
                    } else {
                        rejectedProducts.push(cartProduct);
                    }
                }

                // Revisar esto, condición qué pasa si la cart aún tiene productos. Probablemente la guardo en el usuario
                const cartDeleted = await cartsService.deleteFullCart(cartId);
                const newTicket = {
                    code:uuidv4(),
                    purchase_datetime: new Date(),
                    amount:500,
                    purchaser:email,
                    products: ticketProducts
                }
                const ticketCreated = await TicketModel.create(newTicket);
                //await sendMessage(`The ticket with your purchase ${newTicket.code} was successfully created at ${newTicket.purchase_datetime}!`)
                let messageTicketConfirmation = `The ticket with your purchase ${newTicket.code} was successfully created at ${newTicket.purchase_datetime}!`
                await ticketConfirmation(email,messageTicketConfirmation)
                
                res.send(ticketCreated)
            } else {
                res.send("Cart doesn't exist")
            }
        } catch (error) {
            res.send(error.message)
        }
    } 
}

export default CartsController;