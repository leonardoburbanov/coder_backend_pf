import { UsersRepository } from "../repository/users.repository.js";
import usersDaoMemory from "../dao/users.dao.js";

class UsersService {
  async getUsers() {
    return usersDaoMemory.getUsers();
  }
  async getPublicUser(user) {
    let usersRepository = new UsersRepository()
    return usersRepository.getPublicUser(user);
  }
  async updateUserRol(uidUser){
    return usersDaoMemory.updateUserRol(uidUser);
  }
  async getUserById(uidUser){
    return usersDaoMemory.getUserById(uidUser);
  }
  async deleteUserById(uidUser){
    return usersDaoMemory.deleteUserById(uidUser);
  }
  async updateUserLastConnectionByEmail(userEmail){
    return usersDaoMemory.updateUserLastConnectionByEmail(userEmail);
  }
  async findByIdAndUpdate(uidUser,user){
    return usersDaoMemory.findByIdAndUpdate(uidUser,user);
  }
  async deleteInactiveUsers(){
    return usersDaoMemory.deleteInactiveUsers();
  }
}
const usersService = new UsersService()
export default usersService;
