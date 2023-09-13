import {options} from "../config/config.js";

const persistence = options.server.persistence;

let contactsDao;

switch (persistence) {
    case "mongo":
        const {connectDB} = await import("../config/dbConnection.js");
        connectDB();
        const {UsersMongo} = await import("./managers/mongo/users.mongo.js")
        usersDao = new UsersMongo();
    break;
    
    case "memory":
        const {UsersMemory} = await import("./managers/memory/users.memory.js")
        usersDao = new UsersMemory()
    break;

    case "sql":
        
        break;
}



export {usersDao}