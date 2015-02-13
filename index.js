function init(){
	//draft.init();
	draft.init_nodes("node_menu");
	draft.set_canvas("canvas");
	draft.set_parameter_pane("parameters");
	draft.set_console("console");
	draft.set_script();//set a black script

	//draft.add_node("none","node1");
	//draft.add_node("none","node2",100,100);
}

window.onload=function(){
    init();    
}
