import usersModel from "./models/User.model.js";

class UsersDaoMemory {


    getUsers = async () =>{
        let users = await usersModel.find().select('email first_name last_name rol last_connection');
        return users
    }

     deleteInactiveUsers = async () => {
        try {
          const currentTime = new Date();
          const days = 2 * 24 * 60 * 60 * 1000
          //const days = 30 * 60 * 1000
          const timeAgo = new Date(currentTime - days); // 2 days ago
      
          const result = await usersModel.deleteMany({
            $and: [
              { $or: [
                { last_connection: { $lt: timeAgo } },
                { last_connection: { $exists: false } },
              ]},
              { rol: { $ne: "admin" } }
            ]
          });
      
          console.log(`${result.deletedCount} users deleted.`);
          return result

        } catch (error) {
            throw new Error('Error deleting inactive users.');
        }
      }

    updateUserRol = async(uid_user)=>{
        let user_found = await usersModel.find({_id:uid_user})
        let new_rol = "premium"
        if(user_found[0].rol=="premium"){
            new_rol = 'user'
        }
        let newUser = {
            rol : new_rol
        }
        if(user_found && user_found[0].rol !='admin'){
            if(new_rol=="premium"&&user_found[0].status != "completo"){
                throw new Error('User still have not all documents')
                return;
            }
            let result = await usersModel.updateOne({_id:uid_user},{$set:newUser})
            let new_user_found = await usersModel.find({_id:uid_user})
            return new_user_found;   
        }else{
            throw new Error('Error in update operation. User not found or incorrect rol.')
        }
    }
    getUserById = async(uid_user)=>{
        let user_found = await usersModel.find({_id:uid_user})
        if(user_found){
            return user_found[0];   
        }else{
            throw new Error('Error in search operation. User not found.')
            return;
        }
    }

    deleteUserById = async(uid_user)=>{
        let user_found = await usersModel.find({_id:uid_user})
        if(user_found){
            await usersModel.deleteOne({_id:uid_user})
            return user_found;   
        }else{
            throw new Error('Error in search operation. User not found.')
            return;
        }
        
    }
    updateUserLastConnectionByEmail = async (userEmail) => {
        try {
            const currentTimestamp = new Date();
            await usersModel.updateOne({ email: userEmail }, { $set: { last_connection: currentTimestamp } });
            const updatedUser = await usersModel.findOne({ email: userEmail });
            return updatedUser;
        } catch (error) {
            throw new Error('Error in update operation. User not found or unable to update last_connection.');
        }
    }
    findByIdAndUpdate = async (uidUser,user) => {
        //try {
            console.log("uidUser",uidUser)
            console.log("user",user)
            let updatedUser = await usersModel.findByIdAndUpdate(uidUser,user);
            return updatedUser;
        /*} catch (error) {
            throw new Error('Error in update operation.');
        }*/
    }
}
export default new UsersDaoMemory();