draft.port=function(type,id,label,x,y,r,c){
        return this.init(type,id,label,x,y,r,c);
}
draft.port.prototype.init=function(type,id,label,x,y,r,c){
	this.type = type||0;//in or our
	this.id = id;
	this.label = label;
	//x y position is relative to the node
	this.p=new rad.vector2(x,y);
    //this.x = x||0;
    //this.y = y||0;
	this.r = r||6;//radius
	//this.c = c||"#FF0000";
	this.dt = c||"none";//datatype
	this.c = draft.colors.port[c];//data type, for color
	this.used = false;
	this.line = -1;//the connected line id

	this.lines = [];///extra lines for outports
	
	return this;	
}
draft.port.prototype.set_position=function(x,y){
	this.p.x = x;
	this.p.y = y;
}
draft.port.prototype.reset=function(){
	//this is called when a line is removed from an input port
	this.c = draft.colors.port[this.dt];//data type, for color
	this.used = false;
	this.line = -1;//the connected line id
	rad.flusharray(this.lines);
}
draft.port.prototype.remove_line=function(line_id){
	rad.removefromarray(this.lines,line_id);
	if(this.lines.length>0){
		this.line = this.lines[this.lines.length-1];
	}else{
		this.line = -1;
		this.used=false;
		//this.c=draft.colors.port[this.dt];
	}
}
//----
draft.port.prototype.draw=function(offset,scale){
	scale = scale || 1.0;//draft.canvas_scale.scale;
	var newpos = this.p.multscalar(scale).add(offset);
    draft.context.beginPath();
    draft.context.arc(newpos.x,newpos.y,this.r*scale,0,2*3.1415,false);
    //draft.context.arc(this.p.x+offset.x,this.p.y+offset.y,this.r*scale,0,2*3.1415,false);
    draft.context.fillStyle=this.c;
    draft.context.fill();
}


