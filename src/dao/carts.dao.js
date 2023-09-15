import productsDaoMemory from "./products.dao.js";
import cartModel from "./models/carts.model.js";
import userModel from '../dao/models/User.model.js'

class CartsDaoMemory {
  deleteProductInCart = async (id_cart, id_product) => {
    let cart_found = await cartModel.find({_id:id_cart})
    if(!cart_found[0]){
        throw Error('Cart not exists.');
        return;
    }else{
        let productsInCart = cart_found[0].products;
        const productIndex = productsInCart.findIndex(product => product.product._id == id_product)
        if(productIndex !== -1){
            productsInCart.splice(productIndex,1)
        }else{
            throw Error('Product does not exists in Cart.');
        }
        await cartModel.updateOne({_id:id_cart},{$set:{products:productsInCart}});
        let cart = await cartModel.find({_id:id_cart});
        return cart
        }
  }
  addProductInCart = async (id_cart, id_product, userEmail, userRol) => {
      const productExists = await productsDaoMemory.getProductById(id_product)
      if(!productExists){
          throw Error('Product not exists.');
      }else{
        let cart_found = await cartModel.find({_id:id_cart})
        if(!cart_found[0]){
            throw Error('Cart not exists.');
            return;
        }else{
            if((userRol == 'premium' & userEmail != productExists.owner) | userRol == 'user' | userRol == 'admin'){
                let productsInCart = cart_found[0].products;
                const productIndex = productsInCart.findIndex(product => product.product._id == id_product)
                if(productIndex !== -1){
                    productsInCart[productIndex].quantity = productsInCart[productIndex].quantity + 1
                }else{
                    let product = {
                        product: id_product,
                        quantity : 1
                    }
                    productsInCart.push(product)
                }
                await cartModel.updateOne({_id:id_cart},{$set:{products:productsInCart}});
                let cart = await cartModel.find({_id:id_cart});
                return cart
            }else{
                throw Error('Not allowed to execute this operation.');
            }
        }            
      }
      
  }

  updateProductInCart = async (id_cart, id_product, quantity) => {
      const productExists = await productsDaoMemory.getProductById(id_product)
      if(!productExists){
          throw Error('Product not exists.');
      }else{
      let cart_found = await cartModel.find({_id:id_cart})
      if(!cart_found[0]){
          throw Error('Cart not exists.');
          return;
      }else{
          let productsInCart = cart_found[0].products;
          const productIndex = productsInCart.findIndex(product => product.product._id == id_product)
          if(productIndex !== -1){
              productsInCart[productIndex].quantity = quantity
          }else{
              throw Error('Product does not exist in the cart')
          }
          await cartModel.updateOne({_id:id_cart},{$set:{products:productsInCart}});
          let carts = this.getCarts();
          return carts
          }
      }
      
  }
  getCarts = async () =>{
      const carts = await cartModel.find();
      return carts
  }
  addCart = async (cart) => {
    let cartAdded = await cartModel.create(cart);
    //console.log(cartAdded)
    return cartAdded
  }
  getCartById = async(id_cart)=>{
      let cart_found = await cartModel.find({_id:id_cart}).populate('products.product')
      if(cart_found[0]){
          return cart_found[0]
      }else{
          return;
      }
  }
  updateCart = async(id_cart,newProducts)=>{
      let carts = await this.getCarts();
      let cart_found = await cartModel.find({_id:id_cart})
      if(cart_found){
          let result = await cartModel.updateOne({_id:id_cart},{$set:{products:newProducts}})
          carts = this.getCarts();
          return carts;   
      }else{
          return 'Error in update operation. cart not found.'
      }
  }

  deleteCart = async(id_cart)=>{
      let cart_found = await cartModel.find({_id:id_cart})
      if(cart_found.length!=0){
          let productsInCart = []
          await cartModel.updateOne({_id:id_cart},{$set:{products:productsInCart}});
          let cartDeleted = cart_found
          return cartDeleted
      }else{
          throw new Error('Error in delete operation. Cart not found.')
      }
  }
  deleteFullCart = async(id_cart)=>{
    let cart_found = await cartModel.find({_id:id_cart})
    if(cart_found.length!=0){
        await cartModel.deleteOne({_id:id_cart});
        let cartDeleted = cart_found
        return cartDeleted
    }else{
        throw new Error('Error in delete operation. Cart not found.')
    }
}
}

export default new CartsDaoMemory();