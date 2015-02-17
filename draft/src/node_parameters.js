draft.node_parameters=function(){
	return this;
}
draft.node_parameters.prototype.show=function(id,node){
	var win = draft.parameters;//get the html element
	win.innerHTML="";
	var parms = document.createElement("DIV");
	var label = document.createElement("DIV");
	label.innerHTML="&nbsp;"+node.label+" ("+id+")";
	label.className="parameter_label";
	label.style.width=win.offsetWidth-4+"px";
	parms.appendChild(label);
	//parms.appendChild(document.createElement("BR"));

	for(var ip in node.inputs){
		if(node.inputs.hasOwnProperty(ip)){
			//console.log(this.to_type(this.class.inputs[ip]));
			switch(this.to_type(node.inputs[ip])){
				case "array":
					parms.appendChild(this.param_dropdown(id,ip,node.inputs[ip],node.inputs_values[ip],0));
					parms.appendChild(document.createElement("BR"));
					break;
				case "object":
					parms.appendChild(this.param_dropdown(id,ip,node.inputs[ip],node.inputs_values[ip],1));
					parms.appendChild(document.createElement("BR"));
					break;
				case "number":
					parms.appendChild(this.param_number(id,ip,node.inputs[ip]));
					//parms.appendChild(document.createElement("BR"));
					break;
				default:
					parms.innerHTML+='string';
					parms.appendChild(document.createElement("BR"));
			}
		}
	}
	win.appendChild(parms);
}
//-------------
draft.node_parameters.prototype.param_dropdown=function(id,parm,options,val,object){
	var dd_con = document.createElement("DIV");
	var dd_label = document.createElement("DIV");
	dd_label.innerHTML = "&nbsp;"+parm;
	dd_label.style.float = "left";
	dd_label.style.fontSize=draft.font.size;
	dd_label.style.maxWidth="60px";
	dd_con.style.clear="both";

	var dd = document.createElement("SELECT");
	dd.style.float = "right";
	dd.id = "dd_node_"+id+"_"+parm;
	var _this = this;
	dd.onchange=function(e){_this.dd_changed(this.id)};
	
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
	dd_con.appendChild(dd_label);
	dd_con.appendChild(dd);
	return dd_con;
}

draft.node_parameters.prototype.param_number=function(id,parm,value){
	var slider = document.createElement("DIV");
	slider.innerHTML=value;
	return slider;
}
//-------------
//get and set the values from the parameters
draft.node_parameters.prototype.dd_changed=function(nid){
	var sp = nid.split("_");
	var parm = sp[sp.length-1];
	var id = sp[sp.length-2];
	//alert(draft.scripts[draft.activescript].nodes[id]);
	draft.scripts[draft.activescript].nodes[id].class.inputs_values[parm]=document.getElementById(nid).value; 
}
//-------------
draft.node_parameters.prototype.to_type=function(obj){
	//http://stackoverflow.com/questions/7390426/better-way-to-get-type-of-a-javascript-variable
	return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}
