draft={};

draft.panels={};//this holds the rad.panels
draft.output={};//this is the rendere, that needs to be set after everything loads

draft.canvas={};
draft.context={};//the 2d context
draft.parameters={};//hold the parameter pane
draft.output_preview={};//hold the windows that the terminal will output to
draft.console={};//hold the console log window

draft.colors={};//object to hold color types

draft.eids={
	"canvas":"",
	"parameters":"",
	"console":""
}

draft.font={
	'family':'Courier New',
	'size':10
};

draft.scripts={};
draft.activescript=0;

draft.nodes={};//this will hold all the loaded node objects that are available
draft.nodes.compound={};//this will be my default compound object
draft.node_menu={};

//----
//make local storage
//make I can test to see if I am connected to a database first... if not, then we can talk about local storage
//right now, at work i only have local storage for testing
draft.database={};//not even used yet
draft.file = {};//new draft.io();//a file io handler
//draft.localstorage=new rad.localstorage();
//console.log(draft.localstorage);

//----

draft.canvas_clicked=false;
draft.canvas_scale={
	'scalling':false,
	//'scale':1.0,
	//'scale_start':1.0,
	'min':0.5,
	'max':2.5,
	'start':new rad.vector2(),
	'speed':0.005
}
//draft.canvas_pos=new rad.vector2();

draft.dragging=[];//for nodes
draft.dragging_line={
	'create':false,
	'id':-1,
	'reverse':false,
	'node':-1,
	'port':-1
};
draft.mouseposition={};//i need to save this from the canvas

//TEST

draft.layout_workspace=function(id){
	var layout = {
		'split':0,
		'size':80,
		'partitions':{
			'container_main':{
				'split':1,
				'size':20,
				'partitions':{
					'parameters':{},
					'container_workspace':{
						'split':1,
						'partitions':{
							'canvas':{},
							'output_preview':{}
						}
					}
				}
			},
			'console':{}
		}
	};
	this.panels = new rad.panels(id,layout,rad.closure(this,this.resizecanvas));//,rad.closure(this,this.windowresized)
}

//draft.init_nodes=function(layer){}

draft.set_canvas=function(id){
	//this.canvas = document.getElementById("partition_"+id);
	this.eids.canvas = id;//store the id for windowreize

	var canvas_container = this.panels.get_panel(id);
	//var cc_dimensions = canvas_container.getBoundingClientRect();
	this.canvas = document.createElement("canvas");
	this.canvas.id=id;
	this.canvas.className="noselect";
	this.canvas.style.display="block";
	//this.canvas.width=cc_dimensions.width;
	//this.canvas.height=cc_dimensions.height;

	this.resizecanvas();

	canvas_container.appendChild(this.canvas);

	//console.log(this.canvas);
	this.context = this.canvas.getContext("2d");
	this.context.font = this.font.size+"px "+this.font.family;
	this.canvas.ondragstart=function(){return false;};//stop trying to drag
	this.canvas.oncontextmenu=function(){return false;};//stop trying to get a menu in this part

	this.canvas.onmousedown = function(e){draft.mousedown(e);};
	this.canvas.onmouseup =function(e){draft.mouseup(e);};
	this.canvas.onmousemove = function(e){draft.mousemove(e);};

	this.canvas.tabIndex = 1000;//this forces the canvas to get the keyboard events
	this.canvas.onkeydown = function(e){draft.keypressed(e);};
}
//caled at build and on window resize
draft.resizecanvas=function(){
	var canvas_container = this.panels.get_panel(this.eids.canvas);
	var cc_dimensions = canvas_container.getBoundingClientRect();
	this.canvas.width=cc_dimensions.width;
	this.canvas.height=cc_dimensions.height;
	if(this.canvas.onkeydown!=undefined){
		this.refresh();
	}
}
draft.windowresized=function(){
	//this is a backup function in case I have to rebuild the entire thing
	//right now, I am not going to.. it all depends on if
	//in rad.panels.windowresized, if I call this.draw() which redraws everything 
	//and erases everything inside in the process
	this.set_canvas(this.eids.canvas);
	this.refresh();
}

//draft.set_console=function(id){}

draft.set_parameter_pane=function(id){
	//this.parameters = document.getElementById(id);
	this.parameters = this.panels.get_panel(id);
}
draft.set_font=function(size){
	this.font.size = size||this.font.size;
}
//---------------------------
//draft.set_output_preview=function(id){}
//---------------------------
draft.set_script=function(id,src){
	//first thing, i need to clean out any objects if something was loaded before
	rad.objclear(this.scripts);
	//load the script, or make a blank one
	id = id||0;
	cleansrc = {nodes:{},lines:{},scripts:{}};
	this.scripts[id] = new draft.script(id,cleansrc);
	if(!rad.objhasprop(src)){//no script was sent in, so we just make a blank script
		//make a terminal node
		var cc_dimensions = this.output_preview.getBoundingClientRect();
		this.add_node("core","terminal",cc_dimensions.width/2,cc_dimensions.height/2);
	}else{//load the passes in script
		for(n in src.nodes){
			var new_node = this.add_node(src.nodes[n].category,src.nodes[n].class.label,src.nodes[n].x,src.nodes[n].y);//make the node
			//need to put the expected values into the nodes
			new_node.id=src.nodes[n].id;//set this to be the same value until we save the ids without the gaps
			new_node.set_values(src.nodes[n].class);//pass in the values to set
			//console.log(new_node);
		}
		for(l in src.lines){
			this.scripts[id].add_line(src.lines[l].fnode,src.lines[l].fport,src.lines[l].tnode,src.lines[l].tport,src.lines[l].c);//
			this.scripts[id].nodes[src.lines[l].tnode].p_i[src.lines[l].tport].c = src.lines[l].c;//color the connected to port
		}
		this.scripts[id].scale.scale=src.scale.scale;
		this.scripts[id].scale.start=src.scale.start;

		this.render_preview();//do an initial render on load
	}
	this.refresh();//draws everything again
	this.scripts[0].nodes[0].start_drag(new rad.vector2());//automatically pop up the parameters
}

/// THE MAIN INIT FUNCTION CALLED ON LOAD
draft.init=function(){
	//lets set up the draft.io
	this.file = new this.io();

	this.layout_workspace("workspace");
	this.node_menu = new draft.node_browser("node_menu");//this.init_nodes("node_menu");
	this.set_canvas("canvas");
	this.parameters = this.panels.get_panel("parameters");//this.set_parameter_pane("parameters");
	this.console = this.panels.get_panel("console");//this.set_console("console");
	
	//this.set_output_preview("output_preview");
	this.output = new this.renderer();
	this.output_preview = this.panels.get_panel("output_preview");

	this.set_script();
}
draft.render_preview=function(){
	var terminal = draft.scripts[0].find_node("core","terminal");
	this.output_preview.innerHTML = this.output.render(terminal,0);
}
//--------------------------
draft.mousedown=function(e){
	//alert(rad.isrightclick());
	this.canvas_clicked=true;

	var p = this.mouse_position(e);
	this.console.innerHTML="x:"+p.x+" y:"+p.y;

	//check if we are over a node
	
	if(rad.isleftclick(e)){
		//for(var n=0; n<this.nodes.length; n++){
		//drag all vars
		var overnode = false;
		var overport = false;

		for (var n in this.scripts[this.activescript].nodes){
			//dragall.push(n);
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
					overport = true;
				}else{
					//we are not over a port, lets see if we are over the node
					if(nd.over(p)){
						//nd.start_drag(p.x,p.y);
						nd.start_drag(p);
	                    this.dragging.push(n);
	                    overnode=true;
					}
				}
			}
	    }
	    if(!overnode && !overport){
	    	//drag all the nodes, this is a workspace translate
	    	rad.flusharray(this.dragging);//clean it out
	    	for (var n in this.scripts[this.activescript].nodes){
	    		this.scripts[this.activescript].nodes[n].set_offset(p);
	    		this.dragging.push(n);
	    	}
	    }
	}else{
		if(rad.isrightclick(e)){
			draft.canvas_scale.start=p;
			draft.canvas_scale.scalling=true;
			this.scripts[this.activescript].start_scale();
			//draft.canvas_scale.scale_start=draft.canvas_scale.scale;
			
			for (var n in this.scripts[this.activescript].nodes){
	    		this.scripts[this.activescript].nodes[n].set_scale_offset(p);
	    		//this.dragging.push(n);
	    	}
			//set the offset on all the nodes

			//lets scale the workspace
			//console.log("rightclicked")
		}

	}

}
draft.mouseup=function(e){
	this.canvas_clicked=false;
	this.console.innerHTML="";
	rad.flusharray(this.dragging);
	this.over_port=false;


	//line dragging logic
	if(this.dragging_line.create){
		var p = this.mouse_position(e);
		var connected = false;
		//find out if we released on a valid port
		for (var n in this.scripts[this.activescript].nodes){//loop the nodes
			var nd = this.scripts[this.activescript].nodes[n];
      		//if we are over the node + the margin we might be clicking a port, check that firsti
      		if(nd.near(p)){
				var ndp = nd.over_port(p);
				//okay we are over a port, we need to check that it is a valid release point
				//for forward to be valid, the port TO must be either the same type or polymorphic
				//for reverse to be valid, same rules apply above.
				//I need to also check for infinite recursion, plugging into a node that plugs into itself at some point
				//also if valid, and polymorphic update the color
				//also, if this is a second connection from a port, delete the first one

				//which way are we dragging?
				if(!this.dragging_line.reverse){
					//dragging forward
					//check that the port that we are on is of the same color
					var fp = this.scripts[this.activescript].nodes[this.dragging_line.node].p_o[this.dragging_line.port];//the actual port
					//var fp = nd.p_i[];
					var dtmatch = fp.dt==ndp.dt || ndp.dt=='none';//data match
					//console.log("from data type:"+fp.dt);
					//console.log("to data type:"+ndp.dt);
				}
				var valid_reverse = (this.dragging_line.reverse && ndp.io===0 && !ndp.used && nd.id!=this.dragging_line.node);
				var valid_forward = (!this.dragging_line.reverse && ndp.io===1 && !ndp.used && nd.id!=this.dragging_line.node && dtmatch);
				if(valid_reverse || valid_forward){//valid, set the remaining values
					var li = this.scripts[this.activescript].lines[this.dragging_line.id];
					if(valid_reverse){
						li.fnode = nd.id;
						li.fport = ndp.port;
						nd.p_o[ndp.port].line = li.id;
						this.scripts[this.activescript].nodes[this.dragging_line.node].p_i[this.dragging_line.port].line=li.id;
						//nd.p_o[ndp.port].line.push(li.id);
						//this.scripts[this.activescript].nodes[this.dragging_line.node].p_i[this.dragging_line.port].line[0]=li.id;
					}
					if(valid_forward){
						li.tnode = nd.id;
						li.tport = ndp.port;
						nd.p_i[ndp.port].line = li.id;
						this.scripts[this.activescript].nodes[this.dragging_line.node].p_o[this.dragging_line.port].line = li.id;
						//nd.p_i[ndp.port].line[0] = li.id;
						//this.scripts[this.activescript].nodes[this.dragging_line.node].p_o[this.dragging_line.port].line.push(li.id);
						if(ndp.dt=='none'){
							nd.p_i[ndp.port].c = fp.c;
						}
					}
					li.used = true;
					connected = (!connected)?true:connected;
				}
			}
		}
		if(!connected){
			//console.log("not valid");
			this.scripts[this.activescript].remove_line(this.dragging_line.id);
			//this.refresh();
		}else{
			//THIS OUTPUTS TO MY OUTPUT WINDOW
			//we made a connection
			//console.log('connected, refresh render');
			//var terminal = draft.scripts[0].find_node("core","terminal");//returns the first one found, with no id sent
			//console.log(terminal);
			this.render_preview();
			//this.output_preview.innerHTML = this.output.render(terminal,0);//zero is the script id.. for later when I need to get compound data//terminal.class.render();
		}
		this.dragging_line.id=-1;
		this.dragging_line.create=false;
		this.dragging_line.node=-1;
    	this.dragging_line.port=-1;
    	this.refresh();
	}
	//reset the rightclick scale
	if(draft.canvas_scale.scalling){
		draft.canvas_scale.scalling=false;
	}
	//draw all the nodes again
	//for(var n in this.scripts[this.activescript].nodes){
	//	this.scripts[this.activescript].nodes[n].draw(draft.canvas_scale.scale);
		//this.scripts[this.activescript].nodes[n].stop_drag();
	//}
}

draft.mousemove=function(e){
	var p = this.mouse_position(e);
	this.console.innerHTML="x:"+p.x+" y:"+p.y;
	this.mouseposition = p;
	if(this.canvas_clicked){

		if(draft.canvas_scale.scalling){
			//lets scale the scene
			//i need to first get the scale based on drag
			var dragdir = draft.canvas_scale.start.sub(p);
			var newscale = dragdir.dot(new rad.vector2(-0.5,-0.5))*draft.canvas_scale.speed;
			this.scripts[this.activescript].scale.scale=rad.clamp(this.scripts[this.activescript].scale.start+newscale,draft.canvas_scale.min, draft.canvas_scale.max);
			//draft.canvas_scale.scale=rad.clamp(draft.canvas_scale.scale_start+newscale,draft.canvas_scale.min, draft.canvas_scale.max);
			
			//this.console.innerHTML+="</br>scale:"+draft.canvas_scale.scale;

			//this.context.font = this.font.size*draft.canvas_scale.scale+"px "+this.font.family;
			this.context.font = this.font.size*this.scripts[this.activescript].scale.scale+"px "+this.font.family;

			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

			var scr = this.scripts[this.activescript];

			for(var n in scr.nodes){
	  			scr.nodes[n].scale(scr.scale.scale,scr.scale.start);
	  		}
	  		//draw the connections too
	  		for (var l in scr.lines){
	  			var p1 = scr.nodes[scr.lines[l].fnode].port_position(scr.lines[l].fport,0);
				var p2 = scr.nodes[scr.lines[l].tnode].port_position(scr.lines[l].tport,1);
				scr.lines[l].draw(p1,p2);
	  		}
			//get the length and the dot to determine which and where

		}else{
			//lets release everything
			this.console.innerHTML="x:"+p.x+" y:"+p.y;

			//if we have created a new line
			if(this.dragging_line.create){
				this.scripts[this.activescript].lines[this.dragging_line.id].drag(p,this.dragging_line.reverse);
			}

			//drag any nodes in the dragging array
			for(var n=0; n<this.dragging.length;n++){
	    		//this.scripts[this.activescript].nodes[this.dragging[n]].drag(p.x,p.y);
	    		this.scripts[this.activescript].nodes[this.dragging[n]].drag(p);
	    	}

			if(this.dragging.length>0 || this.dragging_line.create){
				//duplicate of refersh with specific code because of draggin line
	    		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
				var scr = this.scripts[this.activescript];
				//draw the lines again
				for (var l in scr.lines){
					//this first one is our lewly created line
					if(l==this.dragging_line.id){//use == instead of === because tpyes might be different
						scr.lines[l].drag(p,this.dragging_line.reverse);
					}else{
						var p1 = scr.nodes[scr.lines[l].fnode].port_position(scr.lines[l].fport,0);
						var p2 = scr.nodes[scr.lines[l].tnode].port_position(scr.lines[l].tport,1);
						scr.lines[l].draw(p1,p2);
					}
				}
				//draw the nodes again
	  			for(var n in scr.nodes){
	  				scr.nodes[n].draw(draft.canvas_scale.scale);
	  			}
	    	}
	    }
		//-------
	}
}
//--
draft.refresh=function(){
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	var scr = this.scripts[this.activescript];
	//draw the lines again
	for (var l in scr.lines){
		var p1 = scr.nodes[scr.lines[l].fnode].port_position(scr.lines[l].fport,0);
		var p2 = scr.nodes[scr.lines[l].tnode].port_position(scr.lines[l].tport,1);
		scr.lines[l].draw(p1,p2);
	}
	//draw the nodes again
	for(var n in scr.nodes){
		scr.nodes[n].draw(draft.canvas_scale.scale);
	}
}

//---
draft.mouse_position=function(e){//this needs to be removed eventually
	return rad.relativemouseposition(e);
}
/*draft.distance=function(p1,p2){
	var x = p1.x-p2.x;
	var y = p1.y-p2.y;
	return Math.sqrt( (x*x)+(y*y) );
}*/
//---------------------

draft.add_node=function(category,name,x,y){
	category = category||"none";
	name = name||"none";
	x = x||10;
	y = y||10;
	return this.scripts[this.activescript].add_node(category,name,x,y);
}

//-------------------
//
draft.add_line=function(){
	this.dragging_line.create = true;
	this.dragging_line.id = this.scripts[this.activescript].ids.line;
	if(this.dragging_line.reverse){
		//the color
		var c = this.scripts[this.activescript].nodes[this.dragging_line.node].p_i[this.dragging_line.port].c;
		this.scripts[this.activescript].add_line(-1,-1,this.dragging_line.node,this.dragging_line.port,c)
	}else{
		var c = this.scripts[this.activescript].nodes[this.dragging_line.node].p_o[this.dragging_line.port].c;
		this.scripts[this.activescript].add_line(this.dragging_line.node,this.dragging_line.port,-1,-1,c);
	}
}
//-----------------
draft.keycodes={"tab":9};
draft.keypressed=function(e){
	if(e.keyCode === this.keycodes["tab"]){
		e.preventDefault();
		//i might want to pass in different mouse position based on if it is going to overlap wrong
		this.node_menu.toggle(this.mouseposition);
	}
	
}


//------
//colors
draft.colors_error='DA5757';//reddish
draft.colors.node={
	'css':'#D9D1A6',//beige
	'html':'#93CEA4',//greenish
	'js':'#3F7A97',//navy
	'glsl':'#222222',
	'none':'#ff0000'
};
draft.colors.port={
	'dom':'#00aa00',
	'bool':'#0C6E6D',//dark green blue
	'select':'#E82572',
	'array':'#E82572',//hot pink
	'object':'#486774',
	'float':'#4F7C6B',
	'int':'#83834B',
	'number':'#4F7C6B',
	'vector2':'#',
	'vector3':'#',
	'vector4':'#',
	'matrix3':'#',
	'matrix4':'#',
	'string':'#FBE17D',//yellow
	'path':'#',
	'novel':'#',
	'passthrough':'#F67421',
	'none':'#000000'//none is a polymorphic type expectation
}
