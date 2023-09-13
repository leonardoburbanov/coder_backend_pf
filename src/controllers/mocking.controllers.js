import mockingService from "../services/mocking.service.js";

class MockingController {
    getProducts = async (req, res) => {
    try{
        let response = await mockingService.getProducts();
        res.send(response)
    }catch(error){
      res.status(400).send({error:error.message});
    }
    }
}
export default MockingController;