export class GetPublicUserDto{
    constructor(userDB){
        this.first_name = userDB.first_name;
        this.last_name = userDB.last_name;
        this.email = userDB.email;
        this.age = userDB.age;
        this.cart = userDB.cart;
    }
}