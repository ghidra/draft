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

	this.p = new rad.vector2();
	this.bottomcorner = new rad.vector2();
	this.corner = new rad.vector2();

	rad.bind(this.canvas,"mousemove",rad.closure(this,this.mouseover) );//this allows us to update position if the mouse if over this since the graph cant send event if it is
	rad.bind(this.canvas,"mouseup",rad.closure(this,this.mouseup) );

	return this;
}
//need to figure out a way to do negatives... basically have to offset the position and change width height
draft.marquee.prototype.start_drag=function(mp){
	var main_menu = draft.canvas;
	this.canvas.style.visibility="";
	this.canvas.style.left = mp.x+main_menu.offsetLeft;
	this.canvas.style.top = mp.y+main_menu.offsetTop;
	this.canvas.style.width=0;
	this.canvas.style.height=0;
	this.visible=true;

	//set the size
	this.p = new rad.vector2(mp.x,mp.y);
	this.bottomcorner = new rad.vector2(this.p.x,this.p.y);

	this.corner = new rad.vector2(mp.x,mp.y);///this is for calculating the width and height during drag
}
draft.marquee.prototype.mouseover=function(e){
	var mp = rad.relativemouseposition(e);

	var w = mp.x-2;
	var h = mp.y-2;

	this.canvas.style.width = mp.x-2;
	this.canvas.style.height = mp.y-2;
	
	this.set_bottomcorner(w,h);
	//this.bottomcorner = new rad.vector2(mp.x-2,mp.y-2);
}
draft.marquee.prototype.mouseup=function(){
	this.remove();
	draft.dragging_marquee=false;//this sets the global draft varibale that tells us if marquee is dragging
}
draft.marquee.prototype.drag=function(mp){
	//now set the width of the later
	var w = mp.x-this.corner.x-2;
	var h = mp.y-this.corner.y-2;
	
	this.canvas.style.width = w;
	this.canvas.style.height = h;

	this.set_bottomcorner(w,h);

	//this.bottomcorner = new rad.vector2( mp.x-this.corner.x-2, mp.y-this.corner.y-2 );
}
draft.marquee.prototype.remove=function(){
	//rad.unbind(this.canvas,"mousemove",rad.closure(this,this.over) );
	this.canvas.style.visibility="hidden";
	this.visible=false;

	//THIS IS WHERE WE ADD NODES IN THAT ARE INSIDE THE MARQUEE
	//we should get the scaled offest relative position of the marquee to the graph
	var cpos = rad.domposition(draft.canvas) ;
	var cscl = draft.scripts[draft.activescript].scale.scale ;

	var offpos = this.p.sub(cpos);
	var offcorner = this.bottomcorner.sub(cpos);
	
	//console.log("canvas x:"+cpos.x+" y:"+cpos.y);
	console.log("-------------");
	console.log("MARQUEE DATA");
	console.log( "x:"+this.p.x+"\ny:"+this.p.y+"\nbottom corner x:"+this.bottomcorner.x+"\nbottom corner y:"+this.bottomcorner.y );

	console.log("GRAPH DATA");
	console.log("scale:"+cscl);
	//loop the nodes...
	//deal with the node
	for (var n in draft.get_active_nodes() ){//loop all the nodes
		var nd = draft.get_active_node(n);
		//get the node dimensions
		//check x
		var xa = (nd.p.x>this.p.x && nd.p.x<this.bottomcorner.x);//x top corner
		var ya = (nd.p.y>this.p.y && nd.p.y<this.bottomcorner.y);//y top corner
		
		var xb = (nd.bottomcorner.x>this.p.x && nd.bottomcorner.x<this.bottomcorner.x);//x bottom corner
		var yb = (nd.bottomcorner.y>this.p.y && nd.bottomcorner.y<this.bottomcorner.y);//y bottom corner
		
		var xc = (nd.bottomcorner.x>this.p.x && nd.bottomcorner.x<this.bottomcorner.x);//x top right
		var yc = (nd.p.y>this.p.y && nd.p.y<this.bottomcorner.y);//y top right
		
		var xd = (nd.p.x>this.p.x && nd.p.x<this.bottomcorner.x);//x bottom left
		var yd = (nd.bottomcorner.y>this.p.y && nd.bottomcorner.y<this.bottomcorner.y);//y bottom left

		console.log("NODE DATA");
		console.log("xa:"+nd.p.x+"\nya:"+nd.p.y)
		console.log("RESULTS"+ (xa&&ya) +":"+ (xb&&yb) +":"+ (xc&&yc) +":"+ (xd&&yd) );
		
		//if ( (xa && ya) || (xb && yb) || (xc && yc) || (xd && yd) ) {
		if ( (xb && yb) ) {
			nd.selected=true;	
		}
		
		
		draft.selected.push(n);
	}
	draft.refresh();
}
draft.marquee.prototype.set_bottomcorner=function(w,h){
	//helper function to get the correct corner position
	this.bottomcorner = new rad.vector2( w+this.corner.x, h+this.corner.y );
}
draft.marquee.prototype.test=function(){
	alert("something");
}
