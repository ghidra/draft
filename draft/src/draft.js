draft.canvas={};
draft.context={};
draft.console={};
draft.font={
	'family':'Courier New',
	'size':10
};

draft.scripts={};
draft.activescript=0;


draft.canvas_clicked=false;
draft.dragging=[];//for nodes
draft.dragging_line={
	'create':false,
	'id':-1,
	'reverse':false,
	'node':-1,
	'port':-1
};

draft.set_canvas=function(id){
	this.canvas = document.getElementById(id);
	this.context = this.canvas.getContext("2d");
	this.context.font = this.font.size+"px "+this.font.family;
	this.canvas.ondragstart=function(){return false};//stop trying to drag

	this.canvas.onmousedown = function(e){draft.mousedown(e);};
	this.canvas.onmouseup =function(e){draft.mouseup(e);};
	this.canvas.onmousemove = function(e){draft.mousemove(e)};
}
draft.set_console=function(id){
	this.console = document.getElementById(id);
}
draft.set_font=function(size){
	this.font.size = size||this.font.size;
}
//---------------------------
draft.set_script=function(id,scr){
	id = id||0;
	if(!js.objhasprop(scr)){
		scr = {nodes:{},lines:{},scripts:{}};
	}
	this.scripts[id] = new draft.script(id,scr);
}
//--------------------------
draft.mousedown=function(e){
	this.canvas_clicked=true;

	var p = this.mouse_position(e);
	this.console.innerHTML="x:"+p.x+" y:"+p.y;

	//check if we are over a node
	//for(var n=0; n<this.nodes.length; n++){
	for (var n in this.scripts[this.activescript].nodes){
        	nd = this.scripts[this.activescript].nodes[n];
		//if we are over the node + the margin we might be clicking a port, check that firsti
		if(nd.near(p)){
			//check for ports first
			//check that we are a near an out port
			var ndp = nd.over_port(p);
			if(ndp.io>-1){//we are over a port
				this.dragging_line.reverse = (ndp.io===1);
				this.dragging_line.node = nd.id;
                                this.dragging_line.port = ndp.port;
				this.add_line();
			}else{//we are not over a port, lets see if we are over the node
				if(nd.over(p)){
					nd.start_drag(p.x,p.y);
                                	this.dragging.push(n);
				}
			}
		}
    	}	

}
draft.mouseup=function(e){
	this.canvas_clicked=false;
	this.console.innerHTML="";
	js.flusharray(this.dragging);
	this.over_port=false;

	this.dragging_line.id=-1;
	this.dragging_line.create=false;
	this.dragging_line.node=-1;
        this.dragging_line.port=-1;
}
draft.mousemove=function(e){
	if(this.canvas_clicked){
		var p = this.mouse_position(e);
		this.console.innerHTML="x:"+p.x+" y:"+p.y;

		//if we have created a new line
		if(this.dragging_line.create){
			this.scripts[this.activescript].lines[this.dragging_line.id].drag(p,this.dragging_line.reverse);
		}
		
		//drag any nodes in the dragging array
		for(var n=0; n<this.dragging.length;n++){
            		this.scripts[this.activescript].nodes[this.dragging[n]].drag(p.x,p.y);    
        	}

		 if(this.dragging.length>0 || this.dragging_line.create){
            		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			//if we have created a new line
			if(this.dragging_line.create){
				this.scripts[this.activescript].lines[this.dragging_line.id].drag(p,this.dragging_line.reverse);
			}
			//draw the nodes again
            		for(var n in this.scripts[this.activescript].nodes){
                		this.scripts[this.activescript].nodes[n].draw();
            		}
        	}
		//-------
	}
}
//--

//---
draft.mouse_position=function(e){
	var xp = 0;
    	var yp = 0;

	var xo = e.clientX;
	var yo = e.clientY;
      
	var target = e.currentTarget;

    	while (target) {
        	xp += (target.offsetLeft - target.scrollLeft + target.clientLeft);
        	yp += (target.offsetTop - target.scrollTop + target.clientTop);
        	target = target.offsetParent;
   	}
	
	return {x: xo-xp, y: yo-yp};
	
}
draft.distance=function(p1,p2){
	var x = p1.x-p2.x;
	var y = p1.y-p2.y;
	return Math.sqrt( (x*x)+(y*y) );
}
//---------------------

draft.add_node=function(label,x,y){
	label = label||"none";
	x = x||10;
	y = y||10;
	this.scripts[this.activescript].add_node(label,x,y);
}

//-------------------
//
draft.add_line=function(){
	this.dragging_line.create = true;
	this.dragging_line.id = this.scripts[this.activescript].ids.line;
	if(this.dragging_line.reverse){
		this.scripts[this.activescript].add_line(-1,-1,this.dragging_line.node,this.dragging_line.port)
	}else{
		this.scripts[this.activescript].add_line(this.dragging_line.node,this.dragging_line.port,-1,-1);
	} 
}
//-----------------


