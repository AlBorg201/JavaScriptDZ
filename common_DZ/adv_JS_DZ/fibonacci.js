async function* fibonacci(number) {
    let a = 0;
    let b = 1;
    
    for (let i = 0; i < number; i++) {
        await new Promise(resolve => setTimeout(resolve));
        yield a;
        [a, b] = [b, a + b];
    }
}

async function run() {
    const number = fibonacci(8);
    for await (const num of number) {
        console.log(num);
    }
}

run();