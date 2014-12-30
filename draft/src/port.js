draft.port=function(type,id,x,y,r,c){
        return this.init(type,id,x,y,r,c);
}
draft.port.prototype.init=function(type,id,x,y,r,c){
	this.type = type||1;
	this.id = id||-1;
	//x y position is relative to the node
        this.x = x||0;
        this.y = y||0;
	this.r = r||6;
	this.c = c||"#FF0000";
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


