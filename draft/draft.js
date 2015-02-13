draft={};
draft.includes={
	lib:[
		"js",
		"draft",
		"script",
		"node_parameters",
		"node",
		"port",
		"line",
		"node_framework",
		"node_browser"
	],
	include:function(src){
		document.write('<script type="text/javascript" language="javascript" src="'+src+'"></script>');
	},
	complete_links:function(path,links){
		for(var i=0;i<links.length;i++){
			links[i]="draft/src/"+path+links[i]+".js";
		}
	},
	load_libraries:function(program){
		

		this.complete_links("",this.lib);
		for(var i in this.lib){
			this.include(this.lib[i]);
		}
		//load the nodes
		this.include("draft/nodes/include_nodes.js");
		//i need a way to intiailize these files too
		this.include(program);
	}
};
draft.includes.load_libraries('index.js');
