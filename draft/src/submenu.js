draft.submenu=function(layer){
	return this.init(layer);
}

draft.submenu.prototype=new draft.drawing();
draft.submenu.prototype.constructor=draft.drawing;

draft.submenu.prototype.init=function(layer){
	console.log("we have made a sub_menu object")
	//I want to get the dimensions of the canvas, So I can place this thing in the bottom corner
	var canvas_size = rad.domsize(draft.canvas);
	//console.log("w:"+canvas_size.x+" h:"+canvas_size.y);

	draft.drawing.prototype.init.call(this,0+this.margin,canvas_size.y-this.margin-this.h);//super incase i need this shit
	
}

draft.submenu.prototype.draw=function(){

	draft.context.fillStyle = "#93CEA4";//FBE17D,DA5757,D9D1A6,3F7A97,0C6E6D,E82572,//http://www.colourlovers.com/
	draft.context.strokeStyle= "#FFBB00";
	draft.context.lineWidth=2;

    this.draw_shape();
}