export const adminMiddleware = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
    } else {
      res.sendStatus(403);
    }
  };
  

export const userMiddleware = (req, res, next) => {
if (req.isAuthenticated() && req.user.role === 'user') {
    return next();
} else {
    res.sendStatus(403);
}
};


export const premiumMiddleware = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'premium') {
      return next();
  } else {
      res.sendStatus(403);
  }
  };


export const checkAuthenticated = ( req,res,next ) =>{
    if(req.user){
        next();
    }else{
        return res.json({status:"error", message:"Necesita estar autenticado"});
    }
}