import chatModel from "./models/chat.model.js";

class ChatDaoMemory {
    async addMessage(object){
        try {
            const data = await chatModel.create(object);
            const response = JSON.parse(JSON.stringify(data));
            return response;
        } catch (error) {
            throw new Error(`Error al guardar: ${error}`);
        }
    };

    async getMessages(){
        try {
            const data = await chatModel.find();
            const response = JSON.parse(JSON.stringify(data));
            return response;
        } catch (error) {
            throw new Error(`Error get all ${error}`);
        }
    };
}

export default new ChatDaoMemory(); 