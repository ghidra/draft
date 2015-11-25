draft.line=function(id,from_node,from_port,to_node,to_port,c){
        return this.init(id,from_node,from_port,to_node,to_port,c);
}
draft.line.prototype.init=function(id,from_node,from_port,to_node,to_port,c){
	this.id = id;
  	this.fnode = from_node||0;
	this.fport = from_port||0;
	this.tnode = to_node||0;
	this.tport = to_port||0;
  	this.c = c||"#FF0000";
  	//console.log(from_node+":"+from_port+":"+to_node+":"+to_port)
  	return this;
}

//-------

draft.line.prototype.draw=function(p1,p2){
	var dist = Math.abs(p1.x-p2.x)/2;
	var pa = {x:p1.x+dist,y:p1.y};
	var pb = {x:p2.x-dist,y:p2.y};
	//console.log(dist);
	draft.context.beginPath();
  	draft.context.moveTo(p1.x,p1.y);
  	draft.context.bezierCurveTo(pa.x,pa.y,pb.x,pb.y,p2.x,p2.y);
  	draft.context.lineWidth = 2;

  	// line color
  	draft.context.strokeStyle = this.c;
  	draft.context.stroke();
}

//just for creating and being dragged out
//most of this might need to be taken care of in draft.js, since I am referencing it here
draft.line.prototype.drag=function(p,r){//p is the mouse position being passed in,np is the node port position, r is a reverse drag
	//get info from draft object based on parametersl
	if(r){
		var newp = draft.scripts[draft.activescript].nodes[this.tnode].port_position(this.tport,1);
		this.draw(p,newp);
	}else{
		var newp = draft.scripts[draft.activescript].nodes[this.fnode].port_position(this.fport,0);
		this.draw(newp,p);
	}
}

//for saving
draft.line.prototype.sanitize=function(){
	var clean={};
	clean.id = this.id;
  	clean.fnode = this.fnode;
	clean.fport = this.fport;
	clean.tnode = this.tnode;
	clean.tport = this.tport;
  	clean.c = this.c;
  	return clean;
}