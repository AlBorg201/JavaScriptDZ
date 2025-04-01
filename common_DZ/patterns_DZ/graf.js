// Флойд Уоршелл
function findShortestPaths(graph) {
    let size = graph.length;
    let distances = [];

    for (let i = 0; i < size; i++) {
        distances[i] = [];
        for (let j = 0; j < size; j++) {
            distances[i][j] = graph[i][j];
        }
    }

    for (let k = 0; k < size; k++) {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (distances[i][k] + distances[k][j] < distances[i][j]) {
                    distances[i][j] = distances[i][k] + distances[k][j];
                }
            }
        }
    }

    return distances;
}

let INF = 9999999;
let graph = [
    [58, 66, INF, 102124],
    [INF, 0, 3, INF],
    [INF, INF, 0, 1],
    [3, INF, INF, 0]
];

let result = findShortestPaths(graph);
console.log("Кратчайшие расстояния:");
for (let i = 0; i < result.length; i++) {
    console.log(result[i]);
}