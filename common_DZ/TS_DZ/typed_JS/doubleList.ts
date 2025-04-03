class Node_ts {
    thing: number;
    next: Node_ts | null;
    previous: Node_ts | null;

    constructor(thing: number) {
        this.thing = thing;
        this.next = null;
        this.previous = null;
    }
}

class DoubleList {
    first: Node_ts | null;
    last: Node_ts | null;
    size: number;

    constructor() {
        this.first = null;
        this.last = null;
        this.size = 0;
    }

    addToEnd(thing: number): void {
        let newBox = new Node_ts(thing);
        
        if (this.first === null) {
            this.first = newBox;
            this.last = newBox;
        } else {
            if (this.last !== null) {
                newBox.previous = this.last;
                this.last.next = newBox;
            }
            this.last = newBox;
        }
        this.size = this.size + 1;
    }

    addToStart(thing: number): void {
        let newBox = new Node_ts(thing);
        
        if (this.first === null) {
            this.first = newBox;
            this.last = newBox;
        } else {
            newBox.next = this.first;
            this.first.previous = newBox;
            this.first = newBox;
        }
        this.size = this.size + 1;
    }

    find(thing: number): Node_ts | null {
        let currentBox: Node_ts | null = this.first;
        
        while (currentBox !== null) {
            if (currentBox.thing === thing) {
                return currentBox;
            }
            currentBox = currentBox.next;
        }
        return null;
    }

    delete(thing: number): boolean {
        let box: Node_ts | null = this.find(thing);
        
        if (box === null) {
            return false;
        }
        
        if (this.size === 1) {
            this.first = null;
            this.last = null;
        } else if (box === this.first) {
            this.first = box.next;
            if (this.first !== null) {
                this.first.previous = null;
            }
        } else if (box === this.last) {
            this.last = box.previous;
            if (this.last !== null) {
                this.last.next = null;
            }
        } else {
            if (box.previous !== null && box.next !== null) {
                box.previous.next = box.next;
                box.next.previous = box.previous;
            }
        }
        
        this.size = this.size - 1;
        return true;
    }

    change(oldThing: number, newThing: number): boolean {
        let box: Node_ts | null = this.find(oldThing);
        
        if (box === null) {
            return false;
        }
        
        box.thing = newThing;
        return true;
    }

    length(): number {
        return this.size;
    }

    show(): string {
        let allThings: number[] = [];
        let currentBox: Node_ts | null = this.first;
        
        while (currentBox !== null) {
            allThings.push(currentBox.thing);
            currentBox = currentBox.next;
        }
        
        return allThings.join(" <-> ");
    }
}

let list = new DoubleList();

list.addToStart(1);
list.addToStart(0);
list.addToEnd(15);
list.addToEnd(20);
list.addToEnd(5);

let found: Node_ts | null = list.find(15);
if (found !== null) {
    console.log(found.thing);
}

list.change(20, 18);
console.log(list.show());
console.log(list.length());

list.delete(5);
console.log(list.show());
console.log(list.length());