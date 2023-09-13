import { GetPublicUserDto } from "../dao/dto/users.dto.js";

export class UsersRepository{
    async getPublicUser(user){
        const userDto = new GetPublicUserDto(user)
        return userDto;
    }
}