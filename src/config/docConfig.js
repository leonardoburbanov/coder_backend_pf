import __dirname from "../utils.js";
import swaggerJsDoc from "swagger-jsdoc";
import path from "path";

//console.log(`${path.join(__dirname,"../src/docs/**/*.yaml")}`)
const swaggerOptions = {
        definition:{
            openapi:"3.0.1",
            info:{
                title:"API documentation for Coderhouse Ecommerce",
                version:"1.0.0",
                description:"Definition of endpoints: products and carts | 51185 - Leonardo Burbano"
            }
        },
        apis:[`${path.join(__dirname,"../src/docs/**/*.yaml")}`] //Configuration files
};

//Create a variable to interpret the options
export const swaggerSpecs = swaggerJsDoc(swaggerOptions);