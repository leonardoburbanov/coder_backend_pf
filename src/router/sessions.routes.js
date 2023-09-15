import { Router } from 'express';
//import userModel from '../models/User.model.js';
//import { createHash, validatePassword } from '../utils.js';
import passport from 'passport';
import usersService from '../services/users.service.js';
import { registerConfirmation } from '../messages/email/nodemailer.js';
import {sendRecoveryPass} from "../messages/email/nodemailer.js"
import UserModel from "../dao/models/User.model.js";
import { createHash, validatePassword, generateEmailToken, verifyEmailToken, uploaderProfile } from "../utils.js";
import cartsService from '../services/carts.service.js';


const router = Router();

router.post('/register', uploaderProfile.single('profile'),passport.authenticate('register', { failureRedirect:'/failregister'} ),async (req, res) =>{
    let to_email = req.user.email
    let result = await registerConfirmation(to_email)
    req.logger.debug('Email result: ',result)
    res.redirect("/");
})

router.get('/failregister', async (req,res)=>{
    req.logger.debug('Fallo en el registro');
    res.send({error: 'Error en el registro'})
})

router.post('/login', passport.authenticate('login',{failureRedirect:'/api/session/faillogin'}), async (req,res)=>{
    if(!req.user) return res.status(400).send({status:"error", error: 'Invalid credentials'});
    req.session.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        email: req.user.email,
        age: req.user.age,
        rol: req.user.rol
    }
    req.session.cart = await cartsService.addCart({
        product : []
    })
    await usersService.updateUserLastConnectionByEmail(req.user.email)
    res.send({status:"Success", payload:req.user, message:"Primer logueo!!"})
})

router.get('/faillogin', async (req,res)=>{

    req.logger.debug('Fallo en el ingreso');
    res.send({error: 'Error en el ingreso'})

})


router.get('/current', async function(req, res) {
    // Check if the user is authenticated
    if (req.isAuthenticated()) {
      // User is logged in, return the current user
      let publicUser = await usersService.getPublicUser(req.user)
      res.json({ user: publicUser });
    } else {
      // User is not logged in
      res.status(401).json({ message: 'Unauthorized' });
    }
  });
  
router.get('/github', passport.authenticate('github', {scope:['user:email']}), async (req,res)=>{
})

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}), async (req,res)=>{

    req.session.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        email: req.user.email,
        age: req.user.age,
        rol: req.user.rol,
        githubProfile: req.user.githubProfile
    }
    req.logger.debug('UserGithub',req.user)
    res.redirect('/')

})


router.get('/logout', async (req,res)=>{
    await usersService.updateUserLastConnectionByEmail(req.session.email)
    req.session.destroy(err =>{
        if(err) return res.status(500).send({status:"error", error:"No pudo cerrar sesion"})
        res.redirect('/');
    })
})


router.post("/forgot-password",async (req,res)=>{
    //try {
        const { email } = req.body;
        //verifico si existe
        const user = await UserModel.findOne({email:email})
        //console.log(user)
        if(!user){
            //console.log("Llega aquí")
            return res.send(`<div>Error, <a href="/forgot-password">Try again please!</a></div>`)
        }
        const token = generateEmailToken(email,1*60*60);
        await sendRecoveryPass(email,token);
        res.send("The email was sended, comeback  <a href='/login'>to login</a>")
    /*} catch (error) {
        return res.send(`<div>Error, <a href="/forgot-password">Try again please!!</a></div>`)

    }*/
});

router.post("/reset-password", async (req,res)=>{
    try {
           const token = req.query.token;
           const {email,newPassword}=req.body;
           //validamos el token
           const validEmail = verifyEmailToken(token) 
           if(!validEmail){
            return res.send(`The link is not valid already, please generate a new one: <a href="/forgot-password">New link</a>.`)
           }
           const user = await UserModel.findOne({email:email});
           if(!user){
            return res.send("The user is not registered.")
           }
           if(validatePassword(newPassword,user)){
            return res.send("You can't use the same password.")
           }
           const userData = {
            ...user._doc,
            password:createHash(newPassword)
           };
           const userUpdate = await UserModel.findOneAndUpdate({email:email},userData);
           res.render("login",{message:"Updated password!"})

    } catch (error) {
        res.send(error.message)
    }
});



export default router;