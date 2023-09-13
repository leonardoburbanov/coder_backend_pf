import chatDaoMemory from "../dao/chat.dao.js";

class chatService {
  addMessage(object) {
    return chatDaoMemory.addMessage(object);
  }

  getMessages() {
    return chatDaoMemory.getMessages();
  }
}

export default new chatService();
