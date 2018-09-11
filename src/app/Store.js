class Store{
    constructor(){
        this.data=[];
        this.event=[];
    }
    contains(item){
        return this.data.filter((element)=>{return Object.keys(element)[0] == Object.keys(item)[0] || item}).length == 1;
    }
    add(item){
        if(this.contains(item)){
            this.get(Object.keys(item)[0])[Object.keys(item)[0]] = item[Object.keys(item)[0]];
        }else{
            this.data.push(item);
        }
       this.event.filter((element)=>{return Object.keys(element)[0] == Object.keys(item)[0]})
                  .forEach((element)=>{element[Object.keys(element)[0]](item)});
    }
    get(key){
        if(this.contains(key)){
            return this.data.filter((element)=>{return Object.keys(element)[0] == key})[0];
        }else {
            return null;
        }
    }
    addEvent(item){
        this.event.push(item);
    }
}

const UserStore = new Store();
Object.freeze(UserStore);
export default UserStore;
