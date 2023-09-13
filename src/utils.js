import {fileURLToPath} from 'url';
import { dirname } from 'path';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import {Faker, en, es } from "@faker-js/faker";
import { config } from "./config/config.js";
import multer from "multer";
import path from "path";

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validatePassword = (password, user) => bcrypt.compareSync(password, user.password);


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const customFaker = new Faker({
    //Por Ej. el idioma
    locale: [en],
})

const { commerce, image, database, string, internet, person, phone, datatype, lorem } = customFaker;

const generateProduct = () => {
    return {
        _id: database.mongodbObjectId(),
        title: commerce.productName(),
        description: commerce.productDescription(),
        price: parseFloat(commerce.price()),
        thumbnail:[image.url()],
        code: string.alphanumeric(10),
        stock: parseInt(string.numeric(2)),
        status: datatype.boolean(),
        category: commerce.department(),
    }
}

export const generateProducts = () => {    
    const productsNumber = 50
    let products = [];
    for (let i = 0; i < productsNumber; i++) {
        const product = generateProduct();
        products.push(product);
    }
    return products 
}

export const generateEmailToken = (email, expireTime)=>{
    const token = jwt.sign({email},config.gmail.emailToken, {expiresIn:expireTime})
    return token
}

export const verifyEmailToken = (token) =>{
    try {
        const info = jwt.verify(token,config.gmail.emailToken);
        return info.email;
    } catch (error) {
        return null
    }
}

export default __dirname;


const validFields = (body) => {
    const {name, email, password} = body;
    if(!name || !email || !password){
        return false;
    }else{
        return true;
    }
};

//filtro para validar los campos de cargar la imagen
const multerFilterProfile = (req,file,cb)=>{
    const isValid = validFields(req.body);
    if(isValid){
        cb(null,true)
    }else{
        cb(null,false)
    }
}

const profileStorage = multer.diskStorage({
    //donde guardo los archivos
    destination: function(req,file,cb) {
      cb(null,path.join(__dirname,"/multer/users/images"))  
    },
    //el nombre del archivo que estamos guardando
    filename: function (req,file,cb) {
        console.log("file---------------",file)
        cb(null,`${req.body.email}-perfil-${file.originalname}`)
    }
})
//Creamos el uploader de multer
export const uploaderProfile = multer({storage:profileStorage })

//Configuracion para guardar documentos de los usuarios

const documentStorage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,path.join(__dirname,"/multer/users/documents"));
    },
    filename: function(req,file,cb) {
        console.log("req.body")
        console.log(req.user.email)
        console.log("req.body")
        cb(null,`${req.user.email}-document-${file.originalname}`);
    }
})

//creamos el uploader
export const uploaderDocument = multer({storage:documentStorage});

//configuracion para guardar imagenes de productos
const productStorage= multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,path.join(__dirname,"/multer/products/images"));
    },
    filename: function(req,file,cb) {
        cb(null,`${req.params.idProduct}-image-${file.originalname}`);
    }
})

export const uploaderProduct = multer({storage:productStorage})