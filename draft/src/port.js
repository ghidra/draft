draft.port=function(type,id,x,y,r,c){
        return this.init(type,id,x,y,r,c);
}
draft.port.prototype.init=function(type,id,x,y,r,c){
	this.type = type||1;//in or our
	this.id = id;
	//x y position is relative to the node
    this.x = x||0;
    this.y = y||0;
	this.r = r||6;//radius
	//this.c = c||"#FF0000";
	this.dt = c||"none";//datatype
	this.c = draft.colors_port[c];//data type, for color
	this.used = false;
	this.line = [];//the connected line id
	return this;	
}
draft.port.prototype.set_position=function(x,y){
	this.x = x;
	this.y = y;
}
//----
draft.port.prototype.draw=function(offset){
        draft.context.beginPath();
        draft.context.arc(this.x+offset.x,this.y+offset.y,this.r,0,2*3.1415,false);
        draft.context.fillStyle=this.c;
        draft.context.fill();
}


