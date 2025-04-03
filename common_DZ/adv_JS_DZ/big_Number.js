const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
    function calculateFactorial(n) {
        return new Promise((resolve, reject) => {
            const worker = new Worker(__filename, { workerData: n });
            
            worker.on('message', (number) => {
                resolve(number);
                worker.terminate();
            });
            
            worker.on('error', (error) => {
                reject(error);
                worker.terminate();
            });
        });
    }

    async function run() {
        console.log('Вычисление...');

        const number = await calculateFactorial(99999);
        console.log('Число:', number.slice(0, 20) + '...');
        console.log('Длина числа:', number.length);
    }

    run();

} else {
    const n = require('worker_threads').workerData;
    let number = BigInt(1);
    for (let i = 2n; i <= BigInt(n); i++) {
        number *= i;
    }
    parentPort.postMessage(number.toString());
}