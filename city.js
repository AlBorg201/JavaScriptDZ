const readline = require('readline');
const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function cheapestRoad(allCities, allRoads, start, finish) {
    let roads = {};
    
    for (let i = 0; i < allCities.length; i++) {
        roads[allCities[i]] = {};
    }

    for (let i = 0; i < allRoads.length; i++) {
        let roadParts = allRoads[i].split(/[;=]/);
        let city1 = roadParts[0];
        let city2 = roadParts[1];
        let price = Number(roadParts[2]);
        roads[city1][city2] = price;
        roads[city2][city1] = price;
    }

    let cheapestPrices = {};
    let checkCities = new Set();

    for (let i = 0; i < allCities.length; i++) {
        if (allCities[i] === start) {
            cheapestPrices[allCities[i]] = 0;
        } else {
            cheapestPrices[allCities[i]] = Infinity;
        }
    }

    while (checkCities.size < allCities.length) {
        let smallestPrice = Infinity;
        let currentCity = null;

        for (let i = 0; i < allCities.length; i++) {
            let city = allCities[i];
            if (!checkCities.has(city) && cheapestPrices[city] < smallestPrice) {
                smallestPrice = cheapestPrices[city];
                currentCity = city;
            }
        }

        if (currentCity === null) {
            break;
        }

        checkCities.add(currentCity);

        for (let neighbor in roads[currentCity]) {
            if (!checkCities.has(neighbor)) {
                let newPrice = cheapestPrices[currentCity] + roads[currentCity][neighbor];
                if (newPrice < cheapestPrices[neighbor]) {
                    cheapestPrices[neighbor] = newPrice;
                }
            }
        }
    }

    if (cheapestPrices[finish] === Infinity) {
        return 'undefined';
    } else {
        return cheapestPrices[finish];
    }
}

function inputAndOutput() {
    console.log("Введите 10 городов через запятую:");

    let citiesList = null;
    let roadsList = [];

    readlineInterface.on('line', function(input) {
        if (citiesList === null) {
            citiesList = input.split(',');
            for (let i = 0; i < citiesList.length; i++) {
                citiesList[i] = citiesList[i].trim();
            }
            if (citiesList.length !== 10) {
                console.log("Ошибка: нужно ровно 10 городов!");
                readlineInterface.close();
                return;
            }
            console.log("Введите маршруты в формате '<город1>;<город2>=<цена>'");
            console.log("Для завершения введите '<городA>;<городB>'");
        }
        else if (input.includes('=')) {
            roadsList.push(input);
        }

        else {
            let cities = input.split(';');
            let startCity = cities[0].trim();
            let endCity = cities[1].trim();

            let startFound = false;
            let endFound = false;
            for (let i = 0; i < citiesList.length; i++) {
                if (citiesList[i] === startCity) startFound = true;
                if (citiesList[i] === endCity) endFound = true;
            }

            if (!startFound || !endFound) {
                console.log("Ошибка: один из городов не найден в списке!");
                readlineInterface.close();
                return;
            }

            let result = cheapestRoad(citiesList, roadsList, startCity, endCity);
            console.log("Минимальная стоимость пути: " + result);
            readlineInterface.close();
        }
    });
}

inputAndOutput();