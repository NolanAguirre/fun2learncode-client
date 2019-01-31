import EventEmitter from 'events'

class EventSystem extends EventEmitter{
    constructor(){
        super()
        this.recentValues = new Map();
    }
    emit(event, value){
        this.recentValues.set(event, value);
        super.emit(event, value)
    }
}


export default new EventSystem()
