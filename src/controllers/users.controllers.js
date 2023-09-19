import usersService from "../services/users.service.js";


class UsersController {
    deleteInactiveUsers = async (req, res) => {
        try {
            let deletedUsersCount = await usersService.deleteInactiveUsers()
            res.send({deletedUsersCount})
        }catch(error){
            res.status(400).send({error:error.message});
        }
    }
    getUsers = async (req, res) => {
        try {
            let users = await usersService.getUsers()
            res.send({users})
        }catch(error){
            res.status(400).send({error:error.message});
        }
    }
    updateUserRol = async (req, res) => {
        const uidUser = req.params.uidUser;
        try {
            let userModified = await usersService.updateUserRol(uidUser)
            res.send({userModified})
        }catch(error){
            res.status(400).send({error:error.message});
        }
    }
    deleteUser = async (req, res) => {
        const uidUser = req.params.uidUser;
        try {
            let userDeleted = await usersService.deleteUserById(uidUser)
            res.send({userDeleted})
        }catch(error){
            res.status(400).send({error:error.message});
        }
    }

    static updateUserDocument = async (req,res) =>{
        try {
            const userId = req.params.uid
            const user = await usersService.getUserById(userId);
            const identificacion = req.files['identificacion']?.[0] || null;
            const domicilio = req.files['domicilio']?.[0] || null;
            const estadoDeCuenta = req.files['estadoDeCuenta']?.[0] || null;
            const docs = [];
            if(identificacion){
                docs.push({name:"identificacion", reference:identificacion.filename})
            }
            if(domicilio){
                docs.push({name:"domicilio", reference:domicilio.filename})
            }
            if(estadoDeCuenta){
                docs.push({name:"estadoDeCuenta", reference:estadoDeCuenta.filename})
            }
            if(docs.length ===3){
                user.status = "completo"
            }else{
                user.status = "incompleto"
            }
            user.documents = docs;
            console.log(docs)
            console.log("user")
            console.log(user)
            const userUpdate = await usersService.findByIdAndUpdate(user._id,user)

            res.json({status:"success", message:"Documentos actualizados"})

        } catch (error) {
            console.log(error.message);
            res.json({status:"error", message: "Hubo un error en la carga de los archivos."})
        }
    }
}
export default UsersController;