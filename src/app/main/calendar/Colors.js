const colors = [
    {
        regular:"#FF0000",
        hover: "#BF0000",
    },{
        regular:"#FF00CC",
        hover: "#BF0099",
    },{
        regular:"#7100FF",
        hover: "#5500BF",
    },{
        regular:"#0021FF",
        hover: "#0019BF",
    },{
        regular:"#00B0FF",
        hover: "#0084BF",
    },{
        regular:"#00FF7E",
        hover: "#00BF5F",
    },{
        regular:"#FF7700",
        hover: "#BF5900",
    }
];
class Colors{
    constructor(){
        this.index = 0;
    }
    register(key){
        this[key] = colors[this.index++%colors.length];
    }
    get(key){
        if(!this[key]){
            this.register(key);
        }
        return this[key];
    }
}
export default new Colors();
