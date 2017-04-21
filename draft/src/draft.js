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
draft.node_menu={};//hold the node menu object
draft.editor_marquee={};//hold the marquee
//draft.sub_menu={};//this is to get the html element that we can use for submenu buttons

//----
//make local storage
//make I can test to see if I am connected to a database first... if not, then we can talk about local storage
//right now, at work i only have local storage for testing
draft.database={};//not even used yet
draft.file = {};//new draft.io();//a file io handler
//draft.localstorage=new rad.localstorage();

//----

draft.canvas_clicked=false;
draft.canvas_clicked_type=-1;//this will be the mouse type clicked
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
draft.dragging_marquee=false;
draft.selected=[];//to hold the selected nodes for processing.. need a seperate array since we can select in a variaty of ways
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
	this.panels = new rad.panels(id,layout,rad.closure(this,this.windowresized));//,rad.closure(this,this.windowresized)
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
	//console.log(draft.paramaters.childNodes[1]);
	this.resizecanvas();
	draft.scripts[draft.activescript].nodes[this.get_parameter_node_id()].refresh_parameters();
	//this.set_canvas(this.eids.canvas);
	//this.refresh();
}

//draft.set_console=function(id){}

draft.set_parameter_pane=function(id){
	//this.parameters = document.getElementById(id);
	this.parameters = this.panels.get_panel(id);
}
draft.get_parameter_node_id=function(){
	//get the id of the parameter panes node, if there is one
	var found = -1
	if(this.parameters!=undefined){
		if(this.parameters.childNodes[0]!=undefined){
			found = draft.parameters.childNodes[0].childNodes[0].id.split("_")[1];
		}
	}
	return found;
}
draft.set_font=function(size){
	this.font.size = size||this.font.size;
}
//---------------------------
//draft.set_output_preview=function(id){}
//---------------------------
draft.set_script=function(sid,src){
	//first thing, i need to clean out any objects if something was loaded before
	rad.objclear(this.scripts);
	//load the script, or make a blank one
	sid = sid||0;
	cleansrc = {nodes:{},lines:{},scripts:{}};
	this.scripts[sid] = new draft.script(sid,cleansrc);
	if(!rad.objhasprop(src)){//no script was sent in, so we just make a blank script
		//make a terminal node
		var cc_dimensions = this.output_preview.getBoundingClientRect();
		this.add_node("core","terminal",cc_dimensions.width/2,cc_dimensions.height/2);
	}else{//load the passes in script
		for(n in src.nodes){
			var new_node = this.add_node(src.nodes[n].category,src.nodes[n].class.label,src.nodes[n].x,src.nodes[n].y);//make the node
			//need to put the expected values into the nodes
			new_node.id=src.nodes[n].id;//set this to be the same value until we save the ids without the gaps
			//i should look at passing in the saved data, and make any extra ports
			new_node.set_values(src.nodes[n].class);//pass in the values to set
		}
		for(l in src.lines){
			var new_line = this.scripts[sid].add_line(src.lines[l].fnode,src.lines[l].fport,src.lines[l].tnode,src.lines[l].tport,src.lines[l].c);//
			new_line.connected(sid);//make the line connection succesful
		}
		this.scripts[sid].scale.scale=src.scale.scale;
		this.scripts[sid].scale.start=src.scale.start;

		this.render_preview();//do an initial render on load
	}
	this.refresh();//draws everything again
	this.scripts[0].nodes[0].start_drag(new rad.vector2());//automatically pop up the parameters
	this.scripts[0].nodes[0].selected=false;//turn off the selected attribute that start drag turns on
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
	this.editor_marquee = new draft.marquee("marquee");
	//this.sub_menu = document.getElementById("sub_menu");
	
	//this.set_output_preview("output_preview");
	this.output = new this.renderer();
	this.output_preview = this.panels.get_panel("output_preview");

	this.set_script();
}
draft.render_preview=function(){
	var terminal = draft.scripts[0].find_node("core","terminal");
	//we are rendering twice in here for some reason... maybe need to look at that
	var result = this.output.render(terminal,0);
	//now we can deal with the render
	console.log(result);
	this.output_preview.innerHTML="";//clear it out
	if(rad.isdomelement(result)){
		this.output_preview.appendChild(result);
	}else{//we assume its just a string
		this.output_preview.innerHTML = result;
	}
}
//--------------------------
draft.mousedown=function(e){

	this.canvas_clicked=true;

	var p = rad.relativemouseposition(e);

	//check if we are over a node
	
	if(rad.isleftclick(e)){
		draft.canvas_clicked_type=0;
		var overnode = false;
		var overport = false;

		for (var n in this.scripts[this.activescript].nodes){//loop all the nodes
	        nd = this.scripts[this.activescript].nodes[n];
			//if we are over the node + the margin we might be clicking a port, check that firsti
			if(nd.near(p)){
				//check for ports first
				//check that we are a near an out port
				var ndp = nd.over_port(p);
				if(ndp.io>-1){//we are over a port
					//check if this is an inport, and if something is connected
					if(ndp.io===1){//this is an input port.. we need to know if it has a connection
						if(ndp.used){//if the port is being used, we need to delete the line
							this.scripts[this.activescript].remove_line(ndp.line);
						}
					}
					this.dragging_line.reverse = (ndp.io===1);
					this.dragging_line.node = nd.id;
	        		this.dragging_line.port = ndp.port;
					this.add_line();
					overport = true;
				}else{
					//we are not over a port, lets see if we are over the node
					if(nd.over(p)){
						//we are over a node on mousedown
						this.dragging.push(n);
						this.unselect();
						nd.start_drag(p);
	                    this.selected.push(n);
	                    overnode=true;
						//if (!e) e = window.event;
						/*
						if(e.ctrlKey){
							//we should select all the downstream nodes
							var downstream = nd.downstream();
						}
						if(e.altKey){
							//we should get all the upstream nodes
							var upstream = nd.upstream();
						}
						*/
	                    //----
					}
				}
			}
	    }
	    //we are not over a node or a port
	    //here is where we can look at drawing a marquee if a modifier is down
	    if(!overnode && !overport){
	    	//console.log("LETS DRAW A MARQUEE");
	    	
			this.editor_marquee.start_drag(this.mouseposition);
			this.dragging_marquee=true;

			this.unselect();
			this.refresh();
	    }
	    //if we are over a node, wee need to update the drawing sense selected was updated
	    if(overnode){
	    	this.refresh();
	    }
	}else{
		if(rad.isrightclick(e)){
			draft.canvas_clicked_type=1;
			//drag all the nodes, this is a workspace translate
	    	rad.flusharray(this.dragging);//clean it out
	    	for (var n in this.scripts[this.activescript].nodes){
	    		this.scripts[this.activescript].nodes[n].set_offset(p);
	    		this.dragging.push(n);
	    	}
	    	//this.unselect();
	    	//this.refresh();

			
		}else{
			if(rad.ismiddleclick(e)){
				draft.canvas_clicked_type=2;
				draft.canvas_scale.start=p;
				draft.canvas_scale.scalling=true;
				this.scripts[this.activescript].start_scale();
				//draft.canvas_scale.scale_start=draft.canvas_scale.scale;
				
				for (var n in this.scripts[this.activescript].nodes){
		    		this.scripts[this.activescript].nodes[n].set_scale_offset(p);
		    		//this.dragging.push(n);
		    	}

				
			}
		}
	}
}
draft.mouseup=function(e){
	//console.log("MOUSE RELEASED");
	this.canvas_clicked=false;
	draft.canvas_clicked_type=-1;
	this.console.innerHTML="";
	rad.flusharray(this.dragging);
	this.over_port=false;

	var p = rad.relativemouseposition(e);//the mouse position

	//lets remove selected from node being dragged
	/*for(var n in this.selected){
		var nd = draft.scripts[draft.activescript].nodes[n];
		if(!nd.near(p)){
			//nd.selected=false;
		}
	}*/
	//if marquee was turned on, turn it off
	//console.log(draft.dragging_marquee);
	if(draft.dragging_marquee){
		draft.editor_marquee.remove();
		draft.dragging_marquee=false;
		//console.log("we should be trying to get rid of the marquee here");
	}

	//line dragging logic
	if(this.dragging_line.create){
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

				/*
					//we should select all the downstream nodes
					var downstream = nd.downstream();

					//we should get all the upstream nodes
					
				*/

				//also if valid, and polymorphic update the color
				//also, if this is a second connection from a port, delete the first one

				//which way are we dragging?
				var infinite_recursion = false;
				if(!this.dragging_line.reverse){
					//dragging forward
					infinite_recursion = nd.found_upstream(this.dragging_line.node,this.activescript);
					//check that the port that we are on is of the same color
					var fp = this.scripts[this.activescript].nodes[this.dragging_line.node].p_o[this.dragging_line.port];//the actual port
					//var fp = nd.p_i[];
					var dtmatch = fp.dt==ndp.dt || ndp.dt=='none';//data match

				}else{
					//dragging backwards
					infinite_recursion = nd.found_downstream();
				}
				var valid_reverse = (this.dragging_line.reverse && ndp.io===0 && !ndp.used && nd.id!=this.dragging_line.node);
				var valid_forward = (!this.dragging_line.reverse && ndp.io===1 && !ndp.used && nd.id!=this.dragging_line.node && dtmatch);
				//console.log(infinite_recursion);
				if( !infinite_recursion && (valid_reverse || valid_forward) ){//valid, set the remaining values
					var li = this.scripts[this.activescript].lines[this.dragging_line.id];
					li.connected(this.activescript,nd.id,ndp.port,valid_reverse);
					connected = (!connected)?true:connected;
					//i might need to set the class.input_values
				}
			}
		}
		if(!connected){
			this.scripts[this.activescript].remove_line(this.dragging_line.id);
		}else{
			//THIS OUTPUTS TO MY OUTPUT WINDOW
			this.render_preview();
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
}

draft.mousemove=function(e){
	var p = rad.relativemouseposition(e);
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
			//drag out the marquee
	    	if(this.dragging_marquee){
				this.editor_marquee.drag(this.mouseposition);
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
	    }
		//-------
	}
}
draft.unselect=function(){
	//unselect all the selected nodes
	for(n in this.selected){
		draft.scripts[draft.activescript].nodes[this.selected[n]].selected=false;
	}
	rad.flusharray(this.selected);
	//this.refresh();
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
	//draw contextual buttons ie make compound from selection node
	console.log( "LENGTH" + this.selected.length );
	if(this.selected.length>1 ){
		//only make the button is there are more than one nodes selected... we will make presets for single nodes later
		//console.log("LETS MAKE THE MAKE A COMPOUND BUTTON");
		//draw the make compound button
		
	}
}

draft.add_node=function(category,name,x,y,sid){
	category = category||"none";
	name = name||"none";
	x = x||10;
	y = y||10;
	sid = sid||this.activescript;
	return this.scripts[this.activescript].add_node(category,name,x,y,sid);
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
draft.keypressed=function(e){
	if(e.keyCode === rad.keycode["tab"]){
		e.preventDefault();
		//i might want to pass in different mouse position based on if it is going to overlap wrong
		this.node_menu.toggle(this.mouseposition);
	}
	
}

//this is a helper function that returns all the nodes in the active script
draft.get_active_nodes=function(){
	return this.scripts[this.activescript].nodes;
}
//helper function to get the node in the active script by ID
draft.get_active_node=function(n){
	return this.scripts[this.activescript].nodes[n];
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
