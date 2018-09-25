const colors = [
    "#ff2d00",
    "#df2700",
    "#bf2200",
    "#9f1c00",
    "#801600",
    "#601100",
    "#400b00",
    "#00df7b",
    "#00bf6a",
    "#009f58",
    "#008047",
    "#006035",
    "#004023",
    "#000eff",
    "#000cdf",
    "#000abf",
    "#00099f",
    "#000780",
    "#000560",
    "#000340",
    "#ff00f3",
    "#df00d5",
    "#bf00b6",
    "#9f0098",
    "#800079",
    "#60005b",
    "#40003d"
];
class Colors{
    constructor(){
        this.index = 0;
    }
    register(key){
        this[key] = colors[this.index++];
    }
    get(key){
        if(!this[key]){
            this.register(key);
        }
        return this[key];
    }
}
export default new Colors();
