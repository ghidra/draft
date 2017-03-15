draft.marquee=function(layer){
	return this.init(layer);
}

draft.marquee.prototype.init=function(layer){
	this.visible=false;
	var _this = this;

	//set the passed in layer to hang this all on
	this.canvas = document.getElementById(layer);
	this.canvas.style.visibility="hidden";
	this.canvas.style.position = "absolute";
	this.canvas.style.color = 0x0;
	this.canvas.style.border = "thin dotted #000000";

	this.canvas.style.top=0;
	this.canvas.style.left=0;

	this.corner=rad.vector2();

	rad.bind(this.canvas,"mousemove",rad.closure(this,this.mouseover) );//this allows us to update position if the mouse if over this since the graph cant send event if it is
	rad.bind(this.canvas,"mouseup",rad.closure(this,this.mouseup) );

	return this;
}
//need to figure out a way to do negatives... basically have to offset the position and change width height
draft.marquee.prototype.start_drag=function(p){
	var main_menu = draft.canvas;
	this.canvas.style.visibility="";
	this.canvas.style.left = p.x+main_menu.offsetLeft;
	this.canvas.style.top = p.y+main_menu.offsetTop;
	this.canvas.style.width=0;
	this.canvas.style.height=0;
	this.visible=true;

	//set the size
	this.corner=rad.vector2(p.x,p.y);
}
draft.marquee.prototype.mouseover=function(e){
	var p = rad.relativemouseposition(e);
	this.canvas.style.width = p.x-2;
	this.canvas.style.height = p.y-2;
}
draft.marquee.prototype.mouseup=function(){
	this.remove();
	draft.dragging_marquee=false;//this sets the global draft varibale that tells us if marquee is dragging
}
draft.marquee.prototype.drag=function(p){
	//now set the width of the later
	this.canvas.style.width = p.x-this.corner.x-2;
	this.canvas.style.height = p.y-this.corner.y-2;
}
draft.marquee.prototype.remove=function(){
	//rad.unbind(this.canvas,"mousemove",rad.closure(this,this.over) );
	this.canvas.style.visibility="hidden";
	this.visible=false;
}

draft.marquee.prototype.test=function(){
	alert("something");
}
