import passport from 'passport';
import local from 'passport-local';
import userService from '../dao/models/User.model.js';
import { createHash, validatePassword } from '../utils.js';
import GitHubStrategy from 'passport-github2';
import { config } from "./config.js";

const adminUser = {
    _id: config.auth.pass,
    first_name: 'Admin',
    last_name: 'Coderhouse',
    email: config.auth.account,
    password: config.auth.pass,
    age: '7',
    rol: 'admin'
  };

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use('register', new LocalStrategy(
        {passReqToCallback:true, usernameField:'email'}, 
        async (req, username, password, done) =>{
            const { first_name, last_name, email, rol, age } = req.body;
            /*try {*/
                //Here goes the auth strategy
                if(username==adminUser.username){
                    req.logger.debug('El usuario ya existe')
                    return done(null,false);
                }else{
                    const exist = await userService.findOne({email:username});
                    if(exist){
                        req.logger.debug('El usuario ya existe')
                        return done(null,false);
                    }
                    const user = {
                        first_name, last_name, email, rol, age, password: createHash(password)
                    };
                    req.logger.debug(user)
                    const result = await userService.create(user);
                    return done(null, result);
                }
            /*} catch (error) {
                return done("Error al registrar el usuario: " + error);
            }*/
        }
    ));
    passport.serializeUser((user,done)=>{
        done(null, user._id)
    });
    passport.deserializeUser( async (id, done)=>{
        let user = {}
        if(id=='adminCod3r123'){
            user = adminUser
        }else{
            user = await userService.findById(id);
        }
        
        done(null, user)
    });
    passport.use('login', new LocalStrategy({usernameField:'email'}, async (username, password, done)=>{

        try {
           // Here goes the login strategy
            if(username === adminUser.email && password === adminUser.password){
                
                let user = adminUser
                return done(null,user);
            }else{
                const user = await userService.findOne({email:username})
                if(!user){
                    return done(null, false);
                }
                
                const isValidPassword = validatePassword(password,user);
                if(!isValidPassword) return done(null, false);
        
                return done(null,user);
            }

        } catch (error) {
            
            return done("Error al intentar ingresar: " + error);
            
        }

    }))
    passport.use('github', new GitHubStrategy({
        clientID:'Iv1.c3d846a7465b093f',
        clientSecret:'dba3ff193eb159462efd187de50cdcca17d44d7c',
        callbackURL: 'http://localhost:8080/api/session/githubcallback'

    }, async (accessToken, refreshToken,profile,done)=>{
        try {
            
            req.logger.debug(profile); //vemos toda la info que viene del profile
            let user = await userService.findOne({email: profile._json.email})
            if(!user){

                const email = profile._json.email == null ?  profile._json.username : null;

                const newUser = {
                        first_name: profile._json.name,
                        last_name:'',
                        email: email,
                        age: 18,
                        password: '',
                        rol: 'user',
                        githubProfile: JSON.stringify(profile._json,null,3)
                }
                const result = await userService.create(newUser);
                req.logger.debug('User registered',result)
                done(null,result)
            }else{
                //ya existe
                done(null, user)
            }

        } catch (error) {
            return done(null,error)
        }
    }))



}

export default initializePassport;