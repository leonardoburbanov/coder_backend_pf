import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const CORREO_ADMIN = process.env.CORREO_ADMIN;
const PASSWORD_ADMIN = process.env.PASSWORD_ADMIN;
const SECRET = process.env.SECRET;
const PERSISTENCE = process.env.PERSISTENCE
export const config = {
    server: {
        port: PORT,
        persistence: PERSISTENCE
    },
    mongo: {
        url: MONGO_URL
    },
    auth: {
        account: CORREO_ADMIN,
        pass: PASSWORD_ADMIN
    },
    session: {
        secret: SECRET
    },    
    gmail:{
        emailToken:process.env.ADMIN_PASS,
        adminAccount: process.env.ADMIN_EMAIL,
        adminPass: process.env.ADMIN_PASS
    },
    business:{
        ecommerceName: process.env.ECOMMERCE_NAME
    }
}