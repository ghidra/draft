draft.node_parameters=function(){
	return this;
}
draft.node_parameters.prototype.show=function(node){
	var win = draft.parameters;//get the html element
	win.innerHTML="";
	var parms = document.createElement("DIV");
	var label = document.createElement("DIV");
	label.innerHTML=node.label;
	parms.appendChild(label);
	//parms.appendChild(document.createElement("BR"));

	for(var ip in node.inputs){
		if(node.inputs.hasOwnProperty(ip)){
			//console.log(this.to_type(this.class.inputs[ip]));
			switch(this.to_type(node.inputs[ip])){
				case "array":
					parms.appendChild(this.param_dropdown_array(node.inputs[ip]));
					parms.appendChild(document.createElement("BR"));
					break;
				case "object":
					parms.appendChild(this.param_dropdown_object(node.inputs[ip]));
					parms.appendChild(document.createElement("BR"));
					break;
				case "number":
					parms.appendChild(this.param_number(node.inputs[ip]));
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
draft.node_parameters.prototype.param_dropdown_array=function(options){
	var dd = document.createElement("SELECT");
	for (var option in options){
		var opt = document.createElement("OPTION");
		opt.value = options[option];
		opt.innerHTML = options[option];
		dd.appendChild(opt);
	}
	return dd;
}
draft.node_parameters.prototype.param_dropdown_object=function(options){
	var dd = document.createElement("SELECT");
	for (var option in options){
		var opt = document.createElement("OPTION");
		opt.value = option;
		opt.innerHTML = options[option];
		dd.appendChild(opt);
	}
	return dd;
}
draft.node_parameters.prototype.param_number=function(value){
	var slider = document.createElement("DIV");
	slider.innerHTML=value;
	return slider;
}
//-------------
draft.node_parameters.prototype.to_type=function(obj){
	//http://stackoverflow.com/questions/7390426/better-way-to-get-type-of-a-javascript-variable
	return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}
