draft.nodes.html.generic=function(){
	this.init();
	return this;
};

draft.nodes.html.generic.prototype=new draft.node_framework();
draft.nodes.html.generic.prototype.constructor=draft.node_framework;

draft.nodes.html.generic.prototype.init=function(){
	this.label="generic",
	this.inputs.tags=[
		"a",
		"abbr",
		"address",
		"area",
		"article",
		"aside",
		"audio",
		"b",
		"base",
		"bdi",
		"bdo",
		"blockquote",
		"body",
		"br",
		"button",
		"canvas",
		"caption",
		"cite",
		"code",
		"col",
		"colgroup",
		"datalist",
		"dd",
		"del",
		"details",
		"dfn",
		"dialog",
		"div",
		"dl",
		"dt",
		"em",
		"embed",
		"fieldset",
		"figcaption",
		"figure",
		"footer",
		"h1",
		"h2",
		"h3",
		"h4",
		"h5",
		"h6",
		"head",
		"header",
		"hgroup",
		"hr",
		"html",
		"i",
		"iframe",
		"img",
		"input",
		"ins",
		"kbd",
		"keygen",
		"label",
		"legend",
		"li",
		"link",
		"main",
		"map",
		"mark",
		"menu",
		"menuitem",
		"meta",
		"nav",
		"noscript",
		"object",
		"ol",
		"optgroup",
		"option",
		"output",
		"p",
		"param",
		"pre",
		"progress",
		"q",
		"rp",
		"rt",
		"ruby",
		"s",
		"samp",
		"script",
		"section",
		"select",
		"small",
		"source",
		"span",
		"strong",
		"style",
		"sub",
		"summary",
		"sup",
		"table",
		"tbody",
		"td",
		"textarea",
		"tfoot",
		"th",
		"thead",
		"time",
		"title",
		"tr",
		"track",
		"u",
		"ul",
		"var",
		"video",
		"wbr"
	];

	this.inputs.globalAttribute=[
		"none",
		"accesskey",
		"class",
		"contenteditable",
		"contextmenu",
		"data-*",
		"dir",
		"draggable",
		"dropzone",
		"hidden",
		"id",
		"lang",
		"spellcheck",
		"style",
		"tabindex",
		"title",
		"translate"
	];
	this.inputs.test={
		"a":"test a",
		"b":"test b"
	};
	this.inputs.testn=0;

	this.inputs.passthrough=1;

	this.inputs_values={
		"tags":"div",
		"globalAttribute":"none",
		"test":"b",
		"testn":1
	};

	//this.outputs.result={};

	//------typing, ports need to have a type association to keep things strict
	
	this.types={
		input:{
			"tags":"select",
			"globalAttribute":"select",
			"test":"select",
			"testn":"number",
			"passthrough":'none'
		},
		output:{
			"result":"dom"
		}
	};
	
	this.store_defaults();
}

///-----------RENDER

draft.nodes.html.generic.prototype.render=function(mode){
	//var output="******<br/>"+this.label+"<br/>";
	var output="";
	var _this=this;
	this.loop_inputs(
		function(key,value){
			if(key=="tags"){
				output = document.createElement(_this.inputs.tags[parseInt(value)]);

				//output += _this.inputs.tags[parseInt(value)]+"<br/>";
			}
			//output+=key+":"+value+"<br/>";
			//now just passthrough what is connected
			if(key=="passthrough"){
				if(typeof value === "string"){
					output.innerHTML=value;
				}else{
					output.appendChild(value);
				}
				//output += value;
			}
		}
	);
	return output;
}
