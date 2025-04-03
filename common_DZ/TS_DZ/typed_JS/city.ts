import * as readline from 'readline';

interface ReadlineInterface {
    on(event: 'line', listener: (input: string) => void): void;
    close(): void;
}

const readlineInterface: ReadlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

type Roads = { [city: string]: { [neighbor: string]: number } };
type Prices = { [city: string]: number };

function cheapestRoad(
    allCities: string[],
    allRoads: string[],
    start: string,
    finish: string
): number | 'undefined' {
    let roads: Roads = {};
    
    for (let i = 0; i < allCities.length; i++) {
        roads[allCities[i]] = {};
    }

    for (let i = 0; i < allRoads.length; i++) {
        const roadParts: string[] = allRoads[i].split(/[;=]/);
        const city1: string = roadParts[0];
        const city2: string = roadParts[1];
        const price: number = Number(roadParts[2]);
        roads[city1][city2] = price;
        roads[city2][city1] = price;
    }

    let cheapestPrices: Prices = {};
    let checkCities: Set<string> = new Set();

    for (let i = 0; i < allCities.length; i++) {
        if (allCities[i] === start) {
            cheapestPrices[allCities[i]] = 0;
        } else {
            cheapestPrices[allCities[i]] = Infinity;
        }
    }

    while (checkCities.size < allCities.length) {
        let smallestPrice: number = Infinity;
        let currentCity: string | null = null;

        for (let i = 0; i < allCities.length; i++) {
            const city: string = allCities[i];
            if (!checkCities.has(city) && cheapestPrices[city] < smallestPrice) {
                smallestPrice = cheapestPrices[city];
                currentCity = city;
            }
        }

        if (currentCity === null) {
            break;
        }

        checkCities.add(currentCity);

        const neighbors: { [neighbor: string]: number } = roads[currentCity];
        for (const neighbor in neighbors) {
            if (!checkCities.has(neighbor)) {
                const newPrice: number = cheapestPrices[currentCity] + neighbors[neighbor];
                if (newPrice < cheapestPrices[neighbor]) {
                    cheapestPrices[neighbor] = newPrice;
                }
            }
        }
    }

    return cheapestPrices[finish] === Infinity ? 'undefined' : cheapestPrices[finish];
}

function inputAndOutput(): void {
    console.log("Введите 10 городов через запятую:");

    let citiesList: string[] | null = null;
    let roadsList: string[] = [];

    readlineInterface.on('line', (input: string) => {
        if (citiesList === null) {
            citiesList = input.split(',').map(city => city.trim());
            if (citiesList.length !== 10) {
                console.log("Ошибка: нужно ровно 10 городов!");
                readlineInterface.close();
                return;
            }
            console.log("Введите маршруты в формате '<город1>;<город2>=<цена>'");
            console.log("Для завершения введите '<городA>;<городB>'");
        } else if (input.includes('=')) {
            roadsList.push(input);
        } else {
            const cities: string[] = input.split(';').map(city => city.trim());
            if (cities.length !== 2) {
                console.log("Ошибка: введите два города в формате '<городA>;<городB>'");
                readlineInterface.close();
                return;
            }

            const startCity: string = cities[0];
            const endCity: string = cities[1];

            if (citiesList === null) {
                console.log("Ошибка: список городов не инициализирован");
                readlineInterface.close();
                return;
            }

            const startFound: boolean = citiesList.includes(startCity);
            const endFound: boolean = citiesList.includes(endCity);

            if (!startFound || !endFound) {
                console.log("Ошибка: один из городов не найден в списке!");
                readlineInterface.close();
                return;
            }

            const result: number | 'undefined' = cheapestRoad(citiesList, roadsList, startCity, endCity);
            console.log("Минимальная стоимость пути: " + result);
            readlineInterface.close();
        }
    });
}

inputAndOutput();