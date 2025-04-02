type MyOmit<T, K extends keyof T> = {
    [P in keyof T as P extends K ? never : P]: T[P];
};

interface User {
    name: string;
    age: number;
    email: string;
}

type OmittedUser = MyOmit<User, "name">;

export const user: OmittedUser = { age: 35, email: "Ivan@email.ru" };

console.log("User:", user);