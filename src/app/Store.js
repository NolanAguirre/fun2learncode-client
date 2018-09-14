import EventEmitter from 'events';
class Store extends EventEmitter {
    constructor() {
        super();
        this.data = {};
    }
    set(key, value) {
        this.data[key] = value;
        this.emit(key, value);
    }
    get(key) {
        return this.data[key]
    }
}

export default Store;
