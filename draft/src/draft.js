draft.canvas={};
draft.context={};
draft.console={};
draft.font={
	'family':'Courier New',
	'size':10
};

draft.ids={
        'node':0,
        'line':0
}

draft.nodes=[];
draft.lines=[];


draft.canvas_clicked=false;
draft.over_port=false;

draft.dragging=[];//for nodes
draft.dragging_line={
	'to_node':-1,
	'to_port':-1,
	'from_node':-1,
	'from_port':-1
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

draft.mousedown=function(e){
	this.canvas_clicked=true;

	var p = this.mouse_position(e);
	this.console.innerHTML="x:"+p.x+" y:"+p.y;

	//check if we are over a node
	for(var n=0; n<this.nodes.length; n++){
        	nd = this.nodes[n];
		//if we are over the node + the margin we might be clicking a port, check that first
		if(p.x>nd.x-nd.margin && p.x<(nd.x+nd.w+nd.margin) && p.y>nd.y-nd.margin && p.y<(nd.y+nd.h+nd.margin) ){
			//check that we are a near a out port
			for(var op=0; op<nd.o; op++){
				var p1 = {x:p.x,y:p.y};
				var p2 = {x:nd.x+nd.p_o[op].x,y:nd.y+nd.p_o[op].y};
				var dist = this.distance( p1,p2  );
				if(dist<=nd.margin){
					this.dragging_line.from_node = nd.id;
					this.dragging_line.from_port = nd.p_o[op].id;
					this.over_port = true;
				}
			}
			for(var ip=0; ip<nd.i; ip++){
                                var p1 = {x:p.x,y:p.y};
                                var p2 = {x:nd.x+nd.p_i[ip].x,y:nd.y+nd.p_i[ip].y};
                                var dist = this.distance( p1,p2  );
                                if(dist<=nd.margin){
                                        this.dragging_line.to_node = nd.id;
                                        this.dragging_line.to_port = nd.p_i[ip].id;
                                        this.over_port = true;
                                }
                        }
			if(p.x>nd.x && p.x<(nd.x+nd.w) && p.y>nd.y && p.y<(nd.y+nd.h) && !this.over_port ){
                        	nd.start_drag(p.x,p.y);
                        	this.dragging.push(n);
                	}
		}
    	}	

}
draft.mouseup=function(e){
	this.canvas_clicked=false;
	this.console.innerHTML="";
	this.clear_dragging();
	this.over_port=false;
}
draft.mousemove=function(e){
	if(this.canvas_clicked){
		var p = this.mouse_position(e);
		this.console.innerHTML="x:"+p.x+" y:"+p.y;
		
		//drag any nodes in the dragging array
		for(var n=0; n<this.dragging.length;n++){
            		this.nodes[this.dragging[n]].drag(p.x,p.y);    
        	}

		 if(this.dragging.length>0){
            		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
            		for(var n=0; n<this.nodes.length;n++){
                		this.nodes[n].draw();
            		}
        	}
		//-------
	}
}

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
draft.clear_dragging=function(){
	while(this.dragging.length>0){
		this.dragging.pop();
	}
}
//---------------------

draft.add_node=function(label,x,y){
	label = label||"none";
	x = x||10;
	y = y||10;
	this.nodes.push(new this.node(this.ids.node,label,x,y) );
	this.ids.node+=1;
}
