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
	this.canvas.style.width = mp.x-2;
	this.canvas.style.height = mp.y-2;
	
	this.bottomcorner = new rad.vector2(mp.x-2,mp.y-2);
}
draft.marquee.prototype.mouseup=function(){
	this.remove();
	draft.dragging_marquee=false;//this sets the global draft varibale that tells us if marquee is dragging
}
draft.marquee.prototype.drag=function(mp){
	//now set the width of the later
	this.canvas.style.width = mp.x-this.corner.x-2;
	this.canvas.style.height = mp.y-this.corner.y-2;

	this.bottomcorner = new rad.vector2( mp.x-this.corner.x-2, mp.y-this.corner.y-2 );
}
draft.marquee.prototype.remove=function(){
	//rad.unbind(this.canvas,"mousemove",rad.closure(this,this.over) );
	this.canvas.style.visibility="hidden";
	this.visible=false;

	//add nodes inside the marquee to the selection
	//loop the nodes...
	//deal with the node
	for (var n in draft.get_active_nodes() ){//loop all the nodes
		var nd = draft.get_active_node(n);
		//get the node dimensions
		//check x
		var xa = (nd.p.x>this.p.x && nd.p.x<this.bottomcorner.x);
		var xb = (nd.bottomcorner.x>this.p.x && nd.bottomcorner.x<this.bottomcorner.x);
		var ya = (nd.p.y>this.p.y && nd.p.y<this.bottomcorner.y);
		var yb = (nd.bottomcorner.y>this.p.y && nd.bottomcorner.y<this.bottomcorner.y);

		console.log("xa:"+nd.p.x+" my p:"+this.p.x+" bottom corner:"+this.bottomcorner.x)
		console.log("RESULTS"+xa+":"+xb+":"+ya+":"+yb);
		if (xa || xb || ya || yb) {
			nd.selected=true;	
		}
		
		
		draft.selected.push(n);
	}
	draft.refresh();
}

draft.marquee.prototype.test=function(){
	alert("something");
}
