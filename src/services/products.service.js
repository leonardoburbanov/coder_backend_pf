import productsDaoMemory from "../dao/products.dao.js";

class ProductsService {
  getProducts(params) {
    return productsDaoMemory.getProducts(params);
  }

  addProduct(product) {
    return productsDaoMemory.addProduct(product);
  }
  getProductById(idProduct){
    return productsDaoMemory.getProductById(idProduct);
  }
  updateProduct(idProduct,newProduct){
    return productsDaoMemory.updateProduct(idProduct,newProduct);
  }
  deleteProduct(idProduct, owner, userRole){
    return productsDaoMemory.deleteProduct(idProduct, owner, userRole);
  }
}

export default new ProductsService();
