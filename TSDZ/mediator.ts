interface ChatMediator {
    sendMessage(message: string, user: User): void;
}

class User {
    username: string;
    mediator: ChatMediator;

    constructor(username: string, mediator: ChatMediator) {
        this.username = username;
        this.mediator = mediator;
    }

    send(message: string): void {
        this.mediator.sendMessage(message, this);
    }

    receive(message: string): void {
        console.log(`${this.username} received: ${message}`);
    }
}

class Chat implements ChatMediator {
    private users: User[] = [];

    addUser(user: User): void {
        this.users.push(user);
    }

    sendMessage(message: string, sender: User): void {
        for (const user of this.users) {
            if (user !== sender) {
                user.receive(`${sender.username}: ${message}`);
            }
        }
    }
}

const chat = new Chat();

const ivan = new User("Иван", chat);
const andrey = new User("Андрей", chat);
const alexey = new User("Алексей", chat);

chat.addUser(ivan);
chat.addUser(andrey);
chat.addUser(alexey);

ivan.send("Всем привет!"); 

andrey.send("Привет, давно не виделись!");