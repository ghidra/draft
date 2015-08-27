draft.node_parameters=function(){
	return this.init();
}
draft.node_parameters.prototype.init=function(){
	this.width;
	this.width_label;
	this.width_input;
	this.margin = 2;
	this.dimensions();
	//console.log(this.width+":"+this.width_label+":"+this.width_input);
	return this;
}
draft.node_parameters.prototype.show=function(id,node){
	var win = draft.parameters;//get the main html element
	win.innerHTML="";
	var parms = document.createElement("DIV");
	var label = document.createElement("DIV");
	label.innerHTML="&nbsp;"+node.label+" ("+id+")";
	label.className="parameter_label";
	label.style.width=(this.width-(this.margin*2))+"px";
	parms.appendChild(label);
	//parms.appendChild(document.createElement("BR"));

	for(var ip in node.inputs){
		if(node.inputs.hasOwnProperty(ip) && ip != 'passthrough'){
			//console.log( ip+":"+js.totype(node.inputs[ip]) );
			switch(rad.totype(node.inputs[ip])){
				case "array":
				case "object":
					var dd = new rad.dropdown({
						"id":id,
						"label":ip,
						"options":node.inputs[ip],
						"value":node.inputs_values[ip],
						"width":this.width_input,
						"width_label":this.width_label,
						"margin":this.margin,
						"fontsize":draft.font.size,
						"callback":function(arg){
							draft.scripts[draft.activescript].nodes[arg.id].class.inputs_values[arg.label]=document.getElementById("dd_"+arg.id+"_"+arg.label).value;
						}
							
					});
					parms.appendChild(dd.getelement());
					//parms.appendChild(new draft.node_parameters.dropdown(id,ip,node.inputs[ip],node.inputs_values[ip],0,[this.width,this.width_label,this.width_input,this.margin]));
					break;
				//case "object":
				//	parms.appendChild(new draft.node_parameters.dropdown(id,ip,node.inputs[ip],node.inputs_values[ip],1,[this.width,this.width_label,this.width_input,this.margin]));
				//	break;
				case "number":
					var sl = new rad.slider({
						"id":id,
						"label":ip,
						"value":node.inputs_values[ip],
						"width":this.width_input,
						"width_label":this.width_label,
						"width_input":40,
						"margin":this.margin,
						"fontsize":draft.font.size,
						"callback":function(arg){
							draft.scripts[draft.activescript].nodes[arg.id].class.inputs_values[arg.label]=arg.value;
						}
							
					});
					parms.appendChild(sl.getelement());
					//parms.appendChild(new draft.node_parameters.slider(id,ip,node.inputs_values[ip],[this.width,this.width_label,this.width_input,this.margin]));
					break;
				default:
					var tb = new rad.textbox({
						"id":id,
						"label":ip,
						"value":node.inputs_values[ip],
						"width":this.width_input,
						"width_label":this.width_label,
						"margin":this.margin,
						"fontsize":draft.font.size,
						"callback":function(arg){
							console.log( document.getElementById("tb_"+arg.id+"_"+arg.label).value );
							draft.scripts[draft.activescript].nodes[arg.id].class.inputs_values[arg.label]=document.getElementById("tb_"+arg.id+"_"+arg.label).value;
							//draft.scripts[draft.activescript].nodes[arg.id].class.inputs_values[arg.label]=arg.value;
						}
							
					});
					parms.appendChild(tb.getelement());
					//console.log("a string");
					//parms.appendChild(new draft.node_parameters.string(id,ip,node.inputs_values[ip],[this.width,this.width_label,this.width_input,this.margin]));
					//parms.innerHTML+='string';
					//parms.appendChild(document.createElement("BR"));
			}
		}
	}
	win.appendChild(parms);
}
draft.node_parameters.prototype.dimensions=function(){
	var win = draft.parameters;//get the main html element
	this.width = win.offsetWidth;
	this.width_label = Math.round(this.width*0.40);
	this.width_input = this.width-this.width_label;
}

//-------------
//-------------


//-----------------------
//dropwdown
/*draft.node_parameters.dropdown=function(id,parm,options,val,object,dime){
	return this.init(id,parm,options,val,object,dime);
}
draft.node_parameters.dropdown.prototype.init=function(id,parm,options,val,object,dime){
	this.id = id;
	this.parm = parm;
	this.options = options;
	this.val = val;
	this.is_object = object;

	this.element = document.createElement("DIV");
	var dd_label = document.createElement("DIV");
	dd_label.className="subparm_label";
	dd_label.innerHTML = "&nbsp;"+parm;
	dd_label.style.fontSize=draft.font.size;
	dd_label.style.maxWidth = dime[1]+"px";
	dd_label.style.margin = dime[3]+"px";
	this.element.style.clear="both";

	var dd = document.createElement("SELECT");
	//dd.style.float = "right";
	dd.style.width=dime[2]+"px";
	//console.log(this.width_input+"px");
	dd.id = "dd_node_"+id+"_"+parm;
	var _this = this;
	dd.onchange=function(e){_this.changed()};
	
	for (var option in options){
		var opt = document.createElement("OPTION");
		var opt_string = (object)?option:options[option];
		opt.value = opt_string;
		if(opt_string===val){
			opt.selected = true;
		}
		opt.innerHTML = options[option];
		dd.appendChild(opt);
	}
	this.element.appendChild(dd_label);
	this.element.appendChild(dd);
	return this.element;
}
draft.node_parameters.dropdown.prototype.changed=function(){
	draft.scripts[draft.activescript].nodes[this.id].class.inputs_values[this.parm]=document.getElementById("dd_node_"+this.id+"_"+this.parm).value; 
}*/
//--------------------
//string
/*draft.node_parameters.string=function(id,parm,value,dime){
	return this.init(id,parm,value,dime);
}
draft.node_parameters.string.prototype.init=function(id,parm,val,dime){
	this.id = id;
	this.parm = parm;
	this.val = val;

	this.element = document.createElement("DIV");
	var s_label = document.createElement("DIV");
	s_label.className="subparm_label";
	s_label.innerHTML = "&nbsp;"+parm;
	s_label.style.fontSize=draft.font.size;
	s_label.style.maxWidth = dime[1]+"px";
	s_label.style.margin = dime[3]+"px";
	this.element.style.clear="both";

	var s = document.createElement("INPUT");
	s.type = "text";
	s.value=val;
	//dd.style.float = "right";
	s.style.width=dime[2]+"px";
	//console.log(this.width_input+"px");
	s.id = "s_node_"+id+"_"+parm;
	var _this = this;
	s.onchange=function(e){_this.changed()};

	this.element.appendChild(s_label);
	this.element.appendChild(s);
	//alert(this.element);
	return this.element;
}
draft.node_parameters.string.prototype.changed=function(){
	console.log( document.getElementById("s_node_"+this.id+"_"+this.parm).value );
	draft.scripts[draft.activescript].nodes[this.id].class.inputs_values[this.parm]=document.getElementById("s_node_"+this.id+"_"+this.parm).value; 
}*/
//--------------------
//slider
/*draft.node_parameters.slider=function(id,parm,value,dime){
	return this.init(id,parm,value,dime);
}
draft.node_parameters.slider.prototype.init=function(id,parm,val,dime){
	this.id = id;
	this.parm = parm;
	this.val = val;
	this.keep=false;
	this.width_in = 40;//with of the input box
	this.width_max = (dime[2]-this.width_in-(dime[3]*3));

	this.element = document.createElement("DIV");
	var s_label = document.createElement("DIV");
	var s_con = document.createElement("DIV");
	this.bg = document.createElement("DIV");
	this.fg = document.createElement("DIV");
	this.input = document.createElement("INPUT");

	this.element.style.clear="both";

	s_label.className="subparm_label";
	s_label.innerHTML = "&nbsp;"+parm;
	s_label.style.maxWidth = dime[1]+"px";
	s_label.style.margin = dime[3]+"px";
	s_label.style.fontSize=draft.font.size;

	s_con.style.float="right";

	this.bg.className="sliderBG";
	this.fg.className="sliderFG";
	this.input.className="sliderIN";
	this.input.style.width = this.width_in;
	this.input.type="text";
	this.input.value=val;

	this.bg.style.width=(dime[2]-this.width_in-(dime[3]*2))+"px";
	this.bg.style.marginTop=dime[3]+"px";
	this.bg.style.marginRight=dime[3]+"px";

	this.fg.style.width=(Math.round(this.width_max/2))+"px";//for debug
	this.fg.style.maxWidth = this.width_max+"px"
	//dd.id = "dd_node_"+id+"_"+parm;

	this.bg.appendChild(this.fg);
	s_con.appendChild(this.bg);
	this.element.appendChild(s_label);
	this.element.appendChild(this.input);
	this.element.appendChild(s_con);

	var _this = this;
	this.bg.onmousedown=function(e){_this.mousedown(e)};
	this.input.onchange=function(e){_this.input_changed(e)};
	//js.bind(s_bg,'mousedown',js.closure(this,this.mousedown));//add the function to start dragging
	//js.bind(s_input,'change',js.closure(this,this.input_changed));

	return this.element;
}
draft.node_parameters.slider.prototype.mousedown=function(e){
	if(!this.keep){
		this.val = this.input.value;
		this.keep=true;
	}
	this.update(e);
	var _this = this;
	this.tmp_updater = function(e){_this.update(e)};//js.closure(this,this.update);
	this.tmp_release = function(e){_this.release(e)};//js.closure(this,this.release);
	js.dragevent(this.tmp_updater,this.tmp_release);
}
draft.node_parameters.slider.prototype.input_changed=function(e){
	var new_value = parseFloat(this.input.value);
	if ( isNaN(new_value) ){
		v.value=this.val;
	}else{
		var bounds = this.bounds(new_value);
		this.fg.style.width = (this.width_max/2)+"px";
		//now set the nodes value
		this.val = new_value;
		draft.scripts[draft.activescript].nodes[this.id].class.inputs_values[this.parm]=this.val;
	}
}
draft.node_parameters.slider.prototype.update=function(e){
	var c = js.mouseposition(e);
	var p = js.position(this.bg);
	var s = js.size(this.bg);

	var mouse_offset = c.x-p.x;

	var new_position = js.clamp(mouse_offset,1,this.width_max);//i need to know the width to go to
	var bounds = this.bounds(this.val);
	var new_val = js.remap(new_position,1,this.width_max,bounds.min,bounds.max);
	//console.log(bounds.min+":"+bounds.max);
	this.fg.style.width = new_position;
	this.input.value = new_val.toFixed(2);
}
draft.node_parameters.slider.prototype.release=function(e){
	js.removedragevent(this.tmp_updater,this.tmp_release);
	//now i need to set the value on the node
	this.val = parseFloat(this.input.value);
	draft.scripts[draft.activescript].nodes[this.id].class.inputs_values[this.parm]=this.val; 
}
draft.node_parameters.slider.prototype.bounds=function(val){
	val = parseFloat(val);	
	var span = (val==0)? 10 : val;
	var v = Math.abs(span);

	return {min:val-v, max:val+v};
}*/