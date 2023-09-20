import path from 'path'
import express from 'express';
import session from 'express-session';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import passport from 'passport';

import __dirname from './utils.js';
import viewRouter from "./router/views.routes.js";
import sessionRouter from './router/sessions.routes.js';
import productRouter from './router/products.routes.js';
import usersRouter from './router/users.routes.js';

import mockingRouter from './router/mocking.routes.js';

import cartRouter from './router/carts.routes.js';
import initializePassport from './config/passport.config.js';
import { config } from "./config/config.js";

import {Server} from "socket.io";
import chatService from "./services/chat.service.js"

import { errorHandler } from "./middlewares/errohandler.middleware.js";

import { addLogger } from "./logger/logger.js";
import { swaggerSpecs } from "./config/docConfig.js";
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';

const PORT = config.server.port;
const MONGO = config.mongo.url;
const SECRET = config.session.secret;

const app = express();
app.use(express.static(__dirname+'/public'));
app.use(cors());

const sessionMiddleware = session({
    store: new MongoStore({
        mongoUrl: MONGO,
        ttl:3600
    }),
    secret:SECRET,
    resave:false,
    saveUninitialized:false
})

app.use(sessionMiddleware)

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

const connection = mongoose.connect(MONGO);
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');

app.use(errorHandler);
app.use(addLogger);

const server = app.listen(PORT, ()=>{
    console.log('Servidor funcionando en el puerto: ' + PORT);
})

const socketServer = new Server(server);
server.on('error', error => console.log(`Error in server ${error}`));
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

socketServer.use(wrap(sessionMiddleware));

socketServer.use((socket, next) => {
    const session = socket.request.session;
    console.log(session)
    if (session && session.user.rol == "user") {
      next();
    } else {
        console.log("unauthorized")
      next(new Error("unauthorized"));
    }
  });

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use("/", viewRouter);
app.use('/api/session', sessionRouter);
app.use('/mockingproducts', mockingRouter);
app.use('/api/users', usersRouter);
app.use('/api/docs', swaggerUi.serve,swaggerUi.setup(swaggerSpecs));

export {app};

socketServer.on("connection",async(socketConnected)=>{
    console.log(`Nuevo cliente conectado ${socketConnected.id}`);
    const messages = await chatService.getMessages();
    socketServer.emit("msgHistory", messages);

    //capturamos un evento del socket del cliente
    socketConnected.on("message",async(data)=>{
        //recibimos el msg del cliente y lo guardamos en el servidor con el id del socket.
        await chatService.addMessage(data);
        const messages = await chatService.getMessages();
        // messages.push({socketId: socketConnected.id, message: data});
        //Enviamos todos los mensajes a todos los clientes
        socketServer.emit("msgHistory", messages);
    });
});