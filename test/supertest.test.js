import chai from "chai";
import supertest from "supertest";
// import productModel from "../src/dao/models/products.model";
import {app} from "../src/app.js";
import {v4 as uuidv4} from 'uuid';

import {Faker, en, es } from "@faker-js/faker";



const expect = chai.expect;
const requester = supertest(app);

const customFaker =  new Faker({locale: [en],})

describe("Ecommerce API test - Coderhouse - Leonardo Burbano", ()=>{
    describe("Products module", ()=>{
        const { commerce, image, database, string, internet, person, phone, datatype, lorem } = customFaker;
        it("Get products", async function(){

            const result = await requester.get("/api/products?limit=10&page=1");
            
            const {statusCode,_body} = result;
            expect(statusCode).to.be.equal(200);
            expect(_body.status).to.be.equal("Success");

        })
        let productId = ""
        it("Add product", async function(){
            const productMock = {
                "title": commerce.productName(),
                "description": commerce.productDescription(),
                "price": parseFloat(commerce.price()),
                "thumbnail": [image.url()],
                "code": string.alphanumeric(10),
                "stock": parseInt(string.numeric(2)),
                "status": datatype.boolean(),
                "category": commerce.department()
            }

            const result = await requester.post("/api/products").send(productMock);
            
            const {statusCode,_body} = result;
            productId = _body.data._id
            expect(statusCode).to.be.equal(200);
            expect(_body.message).to.be.equal("Product created");

        })
        it("Delete product", async function(){
            const result = await requester.delete("/api/products/"+productId)
            const {statusCode,_body} = result;
            expect(statusCode).to.be.equal(200);
            expect(_body.message).to.be.equal("Product deleted");

        })
       
    })
    describe("Carts module", ()=>{
        const { commerce, image, database, string, internet, person, phone, datatype, lorem } = customFaker;
        it("Get carts", async function(){

            const result = await requester.get("/api/carts");
            
            const {statusCode,_body} = result;
            expect(statusCode).to.be.equal(200);
            expect(_body.status).to.be.equal("Success");

        })
        let cartId = ""
        it("Add cart", async function(){
            const cartMock = {
                products : []
            }

            const result = await requester.post("/api/carts").send(cartMock);
            
            const {statusCode,_body} = result;
            cartId = _body.data._id
            expect(statusCode).to.be.equal(200);
            expect(_body.message).to.be.equal("Cart added");

        })
        it("Delete cart", async function(){
            const result = await requester.delete("/api/carts/"+cartId)
            const {statusCode,_body} = result;
            expect(statusCode).to.be.equal(200);
            expect(_body.message).to.be.equal("Cart deleted");

        })
       
    })
    describe("Sessions module", ()=>{
        const { commerce, image, database, string, internet, person, phone, datatype, lorem } = customFaker;
        const user = {
            email : internet.email(),
            password: "12345678",
            first_name: person.firstName(),
            last_name: person.lastName(),
            rol: "user",
            age: parseInt(string.numeric(2))
        }

        //console.log(user)
        let userId = ""
        it("Register user", async function(){
            const result = await requester.post("/api/session/register").send(user);
            
            const {statusCode,_body} = result;
            expect(statusCode).to.be.equal(200);
            expect(_body.status).to.be.equal("Success");

        })
        it("Login user", async function(){
            const loginUser = {
                email : user.email,
                password: "12345678"
            }
            const result = await requester.post("/api/session/login").send(loginUser);
            
            const {statusCode,_body} = result;
            userId = _body.payload._id
            expect(statusCode).to.be.equal(200);
            expect(_body.status).to.be.equal("Success");

        })

        it("Delete user", async function(){
            const result = await requester.delete("/api/users/"+userId);
            
            const {statusCode,_body} = result;
            expect(statusCode).to.be.equal(200);
            //expect(_body.status).to.be.equal("Success");

        })
    }) 
    describe("Add product to cart - feature", ()=>{
        const { commerce, image, database, string, internet, person, phone, datatype, lorem } = customFaker;
        let productId = ""
        let cartId = ""

        it("Create product", async function(){
            const productMock = {
                "title": commerce.productName(),
                "description": commerce.productDescription(),
                "price": parseFloat(commerce.price()),
                "thumbnail": [image.url()],
                "code": string.alphanumeric(10),
                "stock": parseInt(string.numeric(2)),
                "status": datatype.boolean(),
                "category": commerce.department()
            }

            const result = await requester.post("/api/products").send(productMock);
            
            const {statusCode,_body} = result;
            productId = _body.data._id
            expect(statusCode).to.be.equal(200);
            expect(_body.message).to.be.equal("Product created");

        })
        it("Create cart", async function(){
            const cartMock = {
                products : []
            }

            const result = await requester.post("/api/carts").send(cartMock);
            
            const {statusCode,_body} = result;
            cartId = _body.data._id
            expect(statusCode).to.be.equal(200);
            expect(_body.message).to.be.equal("Cart added");

        })

        it("Add product to cart", async function(){
            const result = await requester.post("/api/carts/"+cartId+"/product/"+productId);
            
            const {statusCode,_body} = result;
            expect(statusCode).to.be.equal(200);
            expect(_body.message).to.be.equal("Product added to cart");

        })


        it("Delete product", async function(){
            const result = await requester.delete("/api/products/"+productId)
            const {statusCode,_body} = result;
            expect(statusCode).to.be.equal(200);
            expect(_body.message).to.be.equal("Product deleted");

        })

        it("Delete cart", async function(){
            const result = await requester.delete("/api/carts/"+cartId)
            const {statusCode,_body} = result;
            expect(statusCode).to.be.equal(200);
            expect(_body.message).to.be.equal("Cart deleted");

        })
       
    })
})