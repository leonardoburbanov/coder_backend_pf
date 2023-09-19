import { Router } from "express";
import productModel from "../dao/models/products.model.js";
import cartModel from "../dao/models/carts.model.js";
import userModel from '../dao/models/User.model.js';
import cartsService from "../services/carts.service.js";
import productsService from "../services/products.service.js";


const router = Router();


const adminAcces = (req,res,next) =>{
    //console.log(req.session.user.rol);
    if(req.session.user.rol !== 'admin'){
        //console.log('Solo se admite rol Admin');
        return res.redirect('/');
    } 
    next();
}


const publicAcces = (req,res,next) =>{
    if(req.session.user) return res.redirect('/profile');
    next();
}

const privateAcces = (req,res,next)=>{
    if(!req.session.user) return res.redirect('/');
    next();
}

// privateAcces, adminAcces
router.get('/admin/users', privateAcces, adminAcces, async (req,res)=>{
    const users = await userModel.find().lean();
    const user = req.session.user;

     res.render('users', {
        users, user
    }) 
})


router.get('/register', publicAcces, (req,res)=>{
    res.render('register')
})

router.get('/', publicAcces, (req,res)=>{
    res.render('login')
})

router.get('/profile', privateAcces ,(req,res)=>{
    res.render('profile',{
        user: req.session.user
    })
})


router.get("/products", async (req,res)=>{

    const {page = 1} = req.query;

    const {docs, hasPrevPage, hasNextPage, nextPage, prevPage ,totalPages  } = await productModel.paginate({},{limit:4, page, lean:true })
    const products = docs;
    if(page <= totalPages && page >0 && docs.length > 0){
        res.render('products', {
            products,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            user: req.session.user
        })
    }else{
        res.status(400).send({error:'Page not exists'})
    }
    

})

router.get("/products/:idproduct", async (req,res)=>{

    const idProduct = req.params.idproduct

    const product = await productModel.find({"_id":idProduct})
    //const carts = await cartModel.find()
    res.render('product_detail', {
        product:product[0].toJSON(),
        cartId: req.session.cart._id
        // Inactive current carts
        // carts: carts.map(cart => cart.toJSON())


    })

})

router.get("/carts/:idcart", async (req,res)=>{

    const idCart = req.params.idcart

    const carts = await cartModel.find({"_id":idCart}).populate('products.product')
    const products = carts[0].products;
    const subTotalCart = calculateTotalValue(products)
    const shipping = 5
    const totalCart = subTotalCart + shipping
    
    res.render('carts', {
        idCart,
        products: products.map(product => product.toJSON()),
        subTotalCart: subTotalCart,
        shipping: shipping,
        totalCart: totalCart
    })

})

router.get("/carts/:idcart/pre-ticket", async (req,res)=>{
    const cartId = req.params.idcart;
    const cart = await cartsService.getCartById(cartId);
    let ticketProducts = [];
    let rejectedProducts = [];
    if(cart){
        if(!cart.products.length){
            return res.send("Please, add your products before to generate the purchase")
        }
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
    } else {
        res.send("Cart doesn't exist")
    }
    const subTotalCart = calculateTotalValue(ticketProducts)
    const shipping = 5
    const totalCart = subTotalCart + shipping
    
    res.render('cartConfirmation', {
        cartId,
        products: ticketProducts.map(product => product.toJSON()),
        subTotalCart: subTotalCart,
        shipping: shipping,
        totalCart: totalCart
    })

})



router.get("/chat",(req,res)=>{
    res.render("chat");
});


router.get("/loggerTest", (req,res)=>{
    req.logger.debug("Level debug");
    req.logger.http("Level http");
    req.logger.info("Level info");
    req.logger.warn("Level warn");
    req.logger.error("Level error");
    req.logger.fatal("Level fatal");
    res.json({"test":"Logger levels"})
  });


router.get("/forgot-password",(req,res)=>{
    res.render("forgotPassword");
});

router.get("/reset-password",(req,res)=>{
    const token = req.query.token;
    res.render("resetPassword",{token});
});


export default router;

function calculateTotalValue(products) {
    let totalValue = 0;
  
    for (const productItem of products) {
      const { product, quantity } = productItem;
      const { price } = product;
      
      // Calculate the product subtotal and add it to the totalValue
      const productSubtotal = price * quantity;
      totalValue += productSubtotal;
    }
  
    return totalValue;
}