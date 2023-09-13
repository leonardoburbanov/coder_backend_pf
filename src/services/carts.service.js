import cartsDaoMemory from "../dao/carts.dao.js";

class CartsService {
    deleteProductInCart(id_cart,id_product) {
        return cartsDaoMemory.deleteProductInCart(id_cart,id_product);
    }
    addProductInCart(id_cart,id_product, userEmail, userRol) {
        return cartsDaoMemory.addProductInCart(id_cart,id_product, userEmail, userRol);
    }
    updateProductInCart(id_cart, id_product, quantity) {
        return cartsDaoMemory.updateProductInCart(id_cart, id_product, quantity);
    }
    getCarts() {
        return cartsDaoMemory.getCarts();
    }
    addCart(cart) {
        return cartsDaoMemory.addCart(cart);
    }
    getCartById(id_cart) {
        return cartsDaoMemory.getCartById(id_cart);
    }
    updateCart(id_cart,newProducts){
        return cartsDaoMemory.updateCart(id_cart,newProducts);
    }
    deleteCart(id_cart){
        return cartsDaoMemory.deleteCart(id_cart);
    }

}

export default new CartsService();