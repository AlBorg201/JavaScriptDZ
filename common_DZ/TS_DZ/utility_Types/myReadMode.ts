type DeepReadonly<T> = {
    readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

interface User {
    name: string;
    details: {
        age: number;
        address: {
            city: string;
        };
    };
}

type ReadonlyUser = DeepReadonly<User>;

export const user: ReadonlyUser = {
    name: "Иван",
    details: {
        age: 35,
        address: {
            city: "Москва"
        }
    }
};

console.log("User:", user);