//i have to use this, since I dont have a way to automatically read in nodes
draft.nodes.basic={};
draft.nodes.core={};
draft.nodes.html={};
draft.nodes.css={};
draft.nodes.js={};

draft.include_nodes={
	lib:[
		"basic/string",
		"core/terminal",
		"html/generic"
	],
	include:function(src){
		document.write('<script type="text/javascript" language="javascript" src="'+src+'"></script>');
	},
	complete_links:function(path,links){
		for(var i=0;i<links.length;i++){
			links[i]="draft/nodes/"+path+links[i]+".js";
		}
	},
	load_libraries:function(){
		this.complete_links("",this.lib);
		for(var i in this.lib){
			this.include(this.lib[i]);
		}
	}
}
draft.include_nodes.load_libraries();