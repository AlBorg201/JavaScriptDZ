class Transformer {
    power: string;
    primaryVoltage: string;
    secondaryVoltage: string;

    constructor(power: string, primaryVoltage: string, secondaryVoltage: string) {
        this.power = power;
        this.primaryVoltage = primaryVoltage;
        this.secondaryVoltage = secondaryVoltage;
    }

    showInfo(): void {
        console.log(`powerTransformer: ${this.power}, primaryVoltage: ${this.primaryVoltage}, secondaryVoltage: ${this.secondaryVoltage}`);
    }
}

class TransformerBuilder {
    private power: string = "Unknown";
    private primaryVoltage: string = "110 kV";
    private secondaryVoltage: string = "10 kV";

    setpower(power: string): TransformerBuilder {
        this.power = power;
        return this;
    }

    setprimaryVoltage(primaryVoltage: string): TransformerBuilder {
        this.primaryVoltage = primaryVoltage;
        return this;
    }

    setsecondaryVoltage(secondaryVoltage: string): TransformerBuilder {
        this.secondaryVoltage = secondaryVoltage;
        return this;
    }

    build(): Transformer {
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