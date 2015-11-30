draft.node=function(id,category,name,x,y,scale,i,o){
	return this.init(id,category,name,x,y,scale,i,o);
}
draft.node.prototype.init=function(id,category,name,x,y,scale){
	this.id = id;
	this.class = this.attach_class(category,name);//attaches the send in node
	this.category = category||"empty";

	this.p = new rad.vector2(x,y);
	this.p_prescalled = new rad.vector2(x,y);//store values durring scalling calculations
	this.p_scalled = new rad.vector2();//store the mouse position value before scaling
	this.offset = new rad.vector2();//offset vector

	this.scl = scale || 1.0;

	this.w=0;
	this.h=0;

	//this.x = x||10;
	//this.y = y||10;

	//this.ox = 0;//offset values for dragging
	//this.oy = 0;

	this.margin = 6;

	this.label="";
	this.i = 0;//number of inports
	this.o = 0;//nuber of out ports

	this.p_o={};
	this.p_i={};
	this.pid = 0;//port ids

	this.set_dimensions();
	this.center= new rad.vector2(this.w/2.0,this.h/2.0);
	this.node_parameters = new draft.node_parameters();     
	this.draw();

	return this;
}
//--------------------------set up functions
draft.node.prototype.attach_class=function(category,name){
	var node_class = {};
	if(draft.nodes.hasOwnProperty(category)){
		if(draft.nodes[category].hasOwnProperty(name)){
			node_class = new draft.nodes[category][name];
		}
	}
	return node_class;
}
draft.node.prototype.set_values=function(values){
	//when loading in a file, we need to set the saves values
	//this.class.set_values=function(values);
	for(v in values){
		if (v!='label'){//dont need to set label value, thats the actual node name
			this.class.inputs_values[v]=values[v];
		}
	}
}
draft.node.prototype.set_dimensions=function(){
	//set label related shit
	this.label = this.class.label;
	var label_size = draft.context.measureText(this.label);
	this.w = (label_size.width+(this.margin*4))*(1.0/this.scl);//mult by inverse scale to get the right size
	//get the number of ports to set the height
	//out ports
	for (var op in this.class.outputs){
		if(this.class.outputs.hasOwnProperty(op)){
			var iporttype = this.class.types.output[op];
			//this.p_o[this.pid] = new draft.port(0,this.pid,this.w,(this.margin*3)*(this.o+1),this.margin,"#FBE17D");
			this.p_o[this.pid] = new draft.port(0,this.pid,op,this.w,(this.margin*3)*(this.o+1),this.margin,iporttype);
			this.pid+=1;
			this.o+=1;
		}
	}
	//in ports
	for (var ip in this.class.inputs){
		if(this.class.inputs.hasOwnProperty(ip) && ip != "passthrough"){
			var oporttype = this.class.types.input[ip];
			//console.log(porttype)
			//console.log( ip+":"+js.totype( this.class.inputs[ip] ) );
			//this.p_i[this.pid] = new draft.port(1,this.pid,0,(this.margin*3)*(this.i+1),this.margin,"#FBE17D");
			this.p_i[this.pid] = new draft.port(1,this.pid,ip,0,(this.margin*3)*(this.i+1),this.margin, oporttype );
			this.pid+=1;
			this.i+=1;
		}
	}
	//now do pass throughs, so that they are last
	var ptporttype = this.class.types.input.passthrough;
	for (var pt = 0; pt<this.class.inputs.passthrough; pt++){
		this.p_i[this.pid] = new draft.port(1,this.pid,"passthrough",0,(this.margin*3)*(this.i+1),this.margin, ptporttype );
		this.pid+=1;
		this.i+=1;
	}

	this.h = draft.font.size+(this.margin*2) + ((this.margin*3)*Math.max(this.i,this.o));
}
//-------------------------

draft.node.prototype.draw=function(){
	//there are double transforms happeneing somewhere
	//take scale into account
	//scale = scale || 1.0;//draft.canvas_scale.scale;
	
	/*var mousepos = this.p.add(this.offset);
	//var toorigin = new rad.vector2().sub(this.offset);
	var toorigin = new rad.vector2().sub(mousepos.sub(this.center.multscalar(scale)));
	var atorigin = this.p.add(toorigin);
	var scalledp = atorigin.multscalar(scale);

	this.p = scalledp.add(toorigin.neg());*/

	//draft.context.fillStyle = "#E82572";//,,,,,,//http://www.colourlovers.com/
	draft.context.fillStyle = "#93CEA4";//FBE17D,DA5757,D9D1A6,3F7A97,0C6E6D,E82572,//http://www.colourlovers.com/
    	//draft.context.fillRect(this.x,this.y,this.w,this.h);
    this.draw_shape();
	//draw the label
	draft.context.fillStyle = "#FFFFFF";
	draft.context.fillText(this.label,this.p.x+(this.margin*this.scl),this.p.y+(this.margin*this.scl)+(draft.font.size/2));
	//draft.context.fillText(this.label,this.p.x+this.margin,this.p.y+this.margin+(draft.font.size/2));
	//draw the ports
	for(var op in this.p_o){
		this.p_o[op].draw( new rad.vector2(this.p.x,this.p.y), this.scl );
		//this.p_o[op].draw( new rad.vector2(this.p.x,this.p.y) );	
	}
	for(var ip in this.p_i){
		if(this.category!="basic"){//basic nodes do not need inputs
        	this.p_i[ip].draw( new rad.vector2(this.p.x,this.p.y), this.scl );
        }
    }

    //this.debug_pos();
}
draft.node.prototype.scale=function(scale,start){
	//this just needs to determine the new position, scale is taken care of in the draw function
	this.scl = scale || 1.0;//draft.canvas_scale.scale;
	//called when scalling from draft main class
//this.center.multscalar(scale)
	var toorigin = new rad.vector2().sub(this.p_scalled);
	var atorigin = this.p_prescalled.add(toorigin);
	var scalledp = atorigin.multscalar(scale/start);

	this.p = scalledp.add(toorigin.neg());
	//this.p = atorigin.add(toorigin.neg());
	this.draw()
}
draft.node.prototype.start_drag=function(v){
	this.set_offset(v);//this.offset.set(v.x-this.p.x,v.y-this.p.y)
	//this.ox = x-this.p.x;
	//this.oy = y-this.p.y;
	//show parameters
	this.refresh_parameters();
	//this.node_parameters.show(this.id,this.class);
}
draft.node.prototype.refresh_parameters=function(){
	this.node_parameters.show(this.id,this.class);
}
//draft.node.prototype.stop_drag=function(){
	//console.log(this.id)
//	this.p.clone(this.p);
//}
draft.node.prototype.set_offset=function(v){
	//specifically if we want to move all nodes at once
	this.offset=v.sub(this.p);
}
draft.node.prototype.set_scale_offset=function(v){
	//specifically, for when we want to scale the nodes
	this.p_prescalled.clone(this.p);//store value
	this.p_scalled.clone(v);
}
draft.node.prototype.drag=function(v){
	//var v = new rad.vector2(x,y);
	this.p = v.sub(this.offset);
	//this.p.clone(this.p);
	//this.p.x = x-this.ox;
	//this.p.y = y-this.oy;
}
//--------------------
draft.node.prototype.draw_shape=function(){
	var r = this.margin*this.scl;//radius of rounder corners
	var seg = Math.ceil(r*0.3);
	var coff = r*2;
	var pivot = new rad.vector2(this.p.x+r,this.p.y+r);//{x:this.x+r,y:this.y+r};

	draft.context.beginPath();
	this.draw_rounded_corner(pivot,r,seg,2,true);
	pivot.x = pivot.x+(this.w*this.scl)-coff;
	this.draw_rounded_corner(pivot,r,seg,3);
	pivot.y = pivot.y+(this.h*this.scl)-coff;
	this.draw_rounded_corner(pivot,r,seg,0);
	pivot.x = this.p.x+r;
	this.draw_rounded_corner(pivot,r,seg,1);
	/*var r = this.margin;//radius of rounder corners
	var seg = Math.ceil(r*0.3);
	var coff = r*2;
	var pivot = new rad.vector2(this.p.x+r,this.p.y+r);//{x:this.x+r,y:this.y+r};

	draft.context.beginPath();
	this.draw_rounded_corner(pivot,r,seg,2,true);
	pivot.x = pivot.x+this.w-coff;
	this.draw_rounded_corner(pivot,r,seg,3);
	pivot.y = pivot.y+this.h-coff;
	this.draw_rounded_corner(pivot,r,seg,0);
	pivot.x = this.p.x+r;
	this.draw_rounded_corner(pivot,r,seg,1);*/

	draft.context.closePath();
	draft.context.fill();
}
draft.node.prototype.debug_pos=function(){
	draft.context.fillStyle = "#FF0000";
	draft.context.beginPath();

	draft.context.moveTo(this.p.x, this.p.y);
	draft.context.lineTo(this.p.x+2, this.p.y);
	draft.context.lineTo(this.p.x+2, this.p.y-2);
	draft.context.lineTo(this.p.x, this.p.y-2);
	draft.context.lineTo(this.p.x, this.p.y);

	draft.context.closePath();
	draft.context.fill();

	//scaled pos
	draft.context.fillStyle = "#00FF00";
	draft.context.beginPath();

	draft.context.moveTo(this.p_scalled.x, this.p_scalled.y);
	draft.context.lineTo(this.p_scalled.x+2, this.p_scalled.y);
	draft.context.lineTo(this.p_scalled.x+2, this.p_scalled.y-2);
	draft.context.lineTo(this.p_scalled.x, this.p_scalled.y-2);
	draft.context.lineTo(this.p_scalled.x, this.p_scalled.y);

	draft.context.closePath();
	draft.context.fill();
}
draft.node.prototype.draw_rounded_corner=function(position,radius,segments,corner,start){
	start=start||false;
    var c = 2*3.1415;
   	for (var i =0; i<=segments; i++){
        	var s = (((i+(segments*corner))/segments)/4);
        	var x = (Math.cos(s*c))*radius;
        	var y = (Math.sin(s*c))*radius;
        	if(i===0 && start){
        	    draft.context.moveTo(x+position.x, y+position.y);
        	}else{
        	    draft.context.lineTo(x+position.x,y+position.y);
        	}
    	}
}

//------
//first check that we are near a node before going any further
draft.node.prototype.near=function(p){
	return (p.x>this.p.x-(this.margin*this.scl) && p.x<(this.p.x+((this.w+this.margin)*this.scl)) && p.y>this.p.y-(this.margin*this.scl) && p.y<(this.p.y+(this.h+this.margin)*this.scl) );
}
draft.node.prototype.over=function(p){
	return (p.x>this.p.x && p.x<(this.p.x+(this.w*this.scl)) && p.y>this.p.y && p.y<(this.p.y+(this.h*this.scl)) );
}
//get port information
draft.node.prototype.port_position=function(id,io){
	//gets the relative port position
	var p = new rad.vector2();//{x:0,y:0};
	if(io>0){//in port
		p = this.p_i[id].p.multscalar(this.scl).add(this.p);
	}else{//out port
		p = this.p_o[id].p.multscalar(this.scl).add(this.p);
	}
	return p;
}
//----
draft.node.prototype.over_port=function(p){
	var ops = this.check_over_port(p,0);
	var ips = this.check_over_port(p,1);
	return (ops.port>-1)?ops:ips;
}
draft.node.prototype.check_over_port=function(p,pio){//position
    var out = {io:-1,port:-1,used:false,dt:'unknown'};
	var pa = (pio===0)?this.p_o:this.p_i;
    for(var po in pa){
            //var p1 = p;//new rad.vector2(p.x,p.y);///// THIS IS BECAUSE I AM NOT PASSING IN A RAD>VECTOR2//{x:p.x,y:p.y};
            var p2 = new rad.vector2(this.p.x+(pa[po].p.x*this.scl),this.p.y+(pa[po].p.y*this.scl));//{x:this.p.x+pa[po].p.x,y:this.p.y+pa[po].p.y};
            //var dist = draft.distance(p1,p2);//DRAFT BASED FUNCTION
            var dist = p.distance(p2);//DRAFT BASED FUNCTION
            if(dist<=this.margin*this.scl){
                    out.io = pio;
                    out.port = pa[po].id;
					out.used = pa[po].used;
					out.dt = pa[po].dt;
    	}
    }
  	return out;
}

//link to class.render
draft.node.prototype.render=function(){
	return this.class.render();
}
//-----check when connecting lines if we are going to make an infinte loop
/*draft.node.prototype.check_infinite_loop=function(nid){//the attempting to connect node, and the direction
	//we need to recursevly check that no nodes plug into given node
	var loop = false;
	for (var op in this.p_o){
		for(var l=0l l< this.p_o[op].line.length; l++){
				
		}
	}
	return loop;
}*/


////saving function
draft.node.prototype.sanitize=function(){
	var clean = {};
	clean.id = this.id;
	clean.label = this.label;
	clean.category = this.category;
	clean.x = this.p.x;
	clean.y = this.p.y;
	clean.i = this.i;//number of inports
	clean.o = this.o;//nuber of out ports

	clean.class = {};//attaches the send in node
	clean.class.label = this.class.label;
	for(p in this.class.inputs_values){
		if(rad.objfindprop(this.class.inputs_values_defaults,p)){//if we have set the defaults
			if(this.class.inputs_values[p]!=this.class.inputs_values_defaults[p]){//only save it if it has changed
				clean.class[p] = this.class.inputs_values[p]
			}
		}else{//no default set, lets just save it
			clean.class[p] = this.class.inputs_values[p];
		}
	}
	return clean;
}
