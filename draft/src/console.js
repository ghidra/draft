draft.console=function(layer){
	return this.init(layer);
}

draft.console.prototype.init=function(layer){
	var _this = this;

	//set the passed in layer to hang this all on
	this.canvas = document.getElementById(layer);

	this.constant_container = document.createElement("DIV");
	this.constant_container.id = "constant_console_list";

	this.entry_container = document.createElement("DIV");
	this.entry_container.id = "entry_console_list";

	this.canvas.appendChild(this.constant_container);
	this.canvas.appendChild(this.entry_container);

	//the main container
	/*var output_container = document.createElement("DIV");
	output_container.id = "output_console_list";

	//the label
	var menu_label = document.createElement("DIV");
	menu_label.innerHTML = "TAB Menu";
	menu_label.className="node_main_menu_label";

	output_container.appendChild(menu_label);

	for (var category in draft.nodes){
		if(draft.nodes.hasOwnProperty(category) && category!="compound"){
			//i am hidding the compounds group for now
			
			this.menu[category]={};//set the category

			//set the main menu parts
			var menu_item = document.createElement("A");
			menu_item.id = "node_main_menu_"+category;
			menu_item.className="node_menu_label";
			
			menu_item.onmouseover=function(e){_this.show_sub_menu(e,this.id);};
			menu_item.innerHTML=category;
			output_container.appendChild(menu_item);

			//make a category container element
			var sub_menu_container = document.createElement("DIV");
			sub_menu_container.id = "node_sub_menu_"+category;
			sub_menu_container.className = "node_menu_list";
			sub_menu_container.style.position = "absolute";
			sub_menu_container.style.visibility = "hidden";

			//now add to the sub container
			for (var n in draft.nodes[category]){
				if(draft.nodes[category].hasOwnProperty(n)){
					this.menu[category][n] = n;
					//set the secondary html parts
					var sub_menu_item = document.createElement("A");
					sub_menu_item.id = "node_sub_menu_"+category+"_"+n;
					sub_menu_item.className = "node_menu_label";
					sub_menu_item.onmousedown=function(e){_this.create_node(e,this.id)};
					sub_menu_item.innerHTML=n;

					sub_menu_container.appendChild(sub_menu_item);
				}
			}
			//
			this.menu_categories[category]=sub_menu_container;
			this.canvas.appendChild(sub_menu_container);
		}
	}

	this.canvas.appendChild(output_container);
*/
	return this;
}

draft.console.prototype.entry=function(s){
	//make a basic scrolling output
}
draft.console.prototype.new_constant=function(id,s){
	var entry = document.createElement("DIV");
	entry.id = "entry_console_id_"+id;
	entry.innerHTML = s;

	this.constant_container.appendChild(entry);
	//make a new constant output thing, like mouse position
}
draft.console.prototype.set_constant=function(id,s){
	//update a constant one
	var entry = document.getElementById("entry_console_id_"+id);
	if(entry!=null){
		entry.innerHTML = s;
	}
}
draft.console.prototype.fade=function(id,s){
	//make a fading console output
}