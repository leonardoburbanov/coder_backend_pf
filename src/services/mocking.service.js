import { generateProducts } from '../utils.js';

class MockingService {
    getProducts() {
        let products = generateProducts();
        return products;
    }
  }
  
  export default new MockingService();