type Partial<T> = {
    [K in keyof T]?: T[K];
};

interface User {
    name: string;
    age: number;
}

type PartialUser = Partial<User>;

export const user_1: PartialUser = { name: "Иван" };
export const user_2: PartialUser = { age: 35 };
export const user_3: PartialUser = { name: "Сергей", age: 40 };
export const user_4: PartialUser = {};

console.log("User_1:", user_1);
console.log("User_2:", user_2);
console.log("User_3:", user_3);
console.log("User_4:", user_4);