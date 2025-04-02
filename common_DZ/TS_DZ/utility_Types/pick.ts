type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

interface User {
    name: string;
    age: number;
    email: string;
}

type PickedUser = Pick<User, "name" | "email">;

export const user: PickedUser = { name: "Иван", email: "Ivan@email.ru" };

console.log("User:", user);