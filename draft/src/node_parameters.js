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
	this.dimensions();//re figure out the dimensions
	var win = draft.parameters;//get the main html element
	win.innerHTML="";
	var parms = document.createElement("DIV");
	var label = document.createElement("DIV");
	label.innerHTML="&nbsp;"+node.label+" ("+id+")";
	label.id = "parmnode_"+id;//put the node name on there to get later
	label.className="parameter_label";
	label.style.width=(this.width-(this.margin*2))+"px";

	//parms.style.width = "100%";
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
						"style":{
							"width":this.width,
							"margin":this.margin,
							"fontSize":draft.font.size
						},
						"style_dropdown":{
							"width":this.width_input
						},
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
						"style":{
							"width":this.width_input,
							"margin":this.margin,
							"fontSize":draft.font.size,
						},
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
						"style":{
							"width":this.width,
							"margin":this.margin,
							"fontSize":draft.font.size,
						},
						"style_textbox":{
							"width":this.width_input
						},
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

	//we could add in per node parameters here, that come from the class data
	//console.log(node);
	//console.log(rad.objhasfunction(node,"paramaters"));
	if(rad.objhasfunction(node,"parameters")){//if the node has the function to make a paramater
		var extra = node.parameters(id,this.width,this.width_input,this.width_label,this.margin);
		if( rad.isdomelement( extra ) ){//we expect it to be a dom element
			parms.appendChild(extra);
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