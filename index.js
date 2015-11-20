function init(){
	//draft.init();
	draft.layout_workspace("workspace");

	draft.init_nodes("node_menu");
	draft.set_canvas("canvas");
	draft.set_parameter_pane("parameters");
	draft.set_console("console");
	draft.set_script();//set a blank script
	draft.set_output_preview("output_preview");//this will also generate a terminal node


	

	//draft.add_node("none","node1");
	//draft.add_node("none","node2",100,100);
}

window.onload=function(){
    init();    
}
