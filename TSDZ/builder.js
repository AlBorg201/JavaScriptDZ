"use strict";
class Transformer {
    constructor(power, primaryVoltage, secondaryVoltage) {
        this.power = power;
        this.primaryVoltage = primaryVoltage;
        this.secondaryVoltage = secondaryVoltage;
    }
    showInfo() {
        console.log(`powerTransformer: ${this.power}, primaryVoltage: ${this.primaryVoltage}, secondaryVoltage: ${this.secondaryVoltage}`);
    }
}
class TransformerBuilder {
    constructor() {
        this.power = "Unknown";
        this.primaryVoltage = "110 kV";
        this.secondaryVoltage = "10 kV";
    }
    setpower(power) {
        this.power = power;
        return this;
    }
    setprimaryVoltage(primaryVoltage) {
        this.primaryVoltage = primaryVoltage;
        return this;
    }
    setsecondaryVoltage(secondaryVoltage) {
        this.secondaryVoltage = secondaryVoltage;
        return this;
    }
    build() {
        return new Transformer(this.power, this.primaryVoltage, this.secondaryVoltage);
    }
}
const transformerBuilder = new TransformerBuilder();
const stationTransformer = transformerBuilder
    .setpower("250000 kVA")
    .setprimaryVoltage("220 kV")
    .setsecondaryVoltage("110 kV")
    .build();
stationTransformer.showInfo();
const substationtransformer = transformerBuilder
    .setpower("40000 kVA")
    .setprimaryVoltage("110 kV")
    .build();
substationtransformer.showInfo();
