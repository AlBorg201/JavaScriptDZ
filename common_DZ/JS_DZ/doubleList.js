class Node {
    constructor(thing) {
        this.thing = thing;
        this.next = null;
        this.previous = null;
    }
}

class DoubleList {
    constructor() {
        this.first = null;
        this.last = null;
        this.size = 0;
    }

    addToEnd(thing) {
        let newBox = new Node(thing);
        
        if (this.first == null) {
            this.first = newBox;
            this.last = newBox;
        } else {
            newBox.previous = this.last;
            this.last.next = newBox;
            this.last = newBox;
        }
        this.size = this.size + 1;
    }

    addToStart(thing) {
        let newBox = new Node(thing);
        
        if (this.first == null) {
            this.first = newBox;
            this.last = newBox;
        } else {
            newBox.next = this.first; 
            this.first.previous = newBox;
            this.first = newBox;
        }
        this.size = this.size + 1;
    }

    find(thing) {
        let currentBox = this.first;
        
        while (currentBox != null) {
            if (currentBox.thing == thing) {
                return currentBox;
            }
            currentBox = currentBox.next;
        }
        return null;
    }

    delete(thing) {
        let box = this.find(thing);
        
        if (box == null) {
            return false;
        }
        
        if (this.size == 1) {
            this.first = null;
            this.last = null;
        }
        else if (box == this.first) {
            this.first = box.next;
            this.first.previous = null;
        }
        else if (box == this.last) {
            this.last = box.previous;
            this.last.next = null;
        }
        else {
            box.previous.next = box.next;
            box.next.previous = box.previous;
        }
        
        this.size = this.size - 1;
        return true;
    }

    change(oldThing, newThing) {
        let box = this.find(oldThing);
        
        if (box == null) {
            return false;
        }
        
        box.thing = newThing;
        return true;
    }

    length() {
        return this.size;
    }

    show() {
        let allThings = [];
        let currentBox = this.first;
        
        while (currentBox != null) {
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


let found = list.find(15);
console.log(found.thing);

list.change(20, 18);
console.log(list.show());
console.log(list.length());

list.delete(5);
console.log(list.show());
console.log(list.length());