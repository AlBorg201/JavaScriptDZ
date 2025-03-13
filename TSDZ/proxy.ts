interface Database {
    getData(): string;
}

class RealDatabase implements Database {
    getData(): string {
        return "Sensitive data from the real database";
    }
}

class DatabaseProxy implements Database {
    private realDatabase: RealDatabase;
    private isAuthenticated: boolean;

    constructor(isAuthenticated: boolean) {
        this.realDatabase = new RealDatabase();
        this.isAuthenticated = isAuthenticated;
    }

    getData(): string {
        if (this.isAuthenticated) {
            return this.realDatabase.getData();
        } else {
            return "Invalid access tokken";
        }
    }
}

const proxyAuthenticated = new DatabaseProxy(true);
console.log(proxyAuthenticated.getData());

const proxyNotAuthenticated = new DatabaseProxy(false);
console.log(proxyNotAuthenticated.getData());