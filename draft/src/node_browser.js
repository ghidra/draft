draft.node_browser=function(layer){
	return this.init(layer);
}

draft.node_browser.prototype.init=function(layer){
	this.menu = {};
	this.menu_html = "<div id=\"node_main_menu\"><div class=\"node_main_menu_label\">TAB Menu</div>";
	this.menu_categories_html = {};


	this.canvas = document.getElementById(layer);
	this.canvas.style.visibility="hidden";
	this.canvas.style.position = "absolute";
	this.canvas.style.color = 0x0;

	this.visible=false;

	for (var category in draft.nodes){
		if(draft.nodes.hasOwnProperty(category)){
			
			this.menu[category]={};//set the category
			//set the main html parts
			this.menu_html+="<a id=\"node_main_menu_\""+category+" class=\"node_main_menu_category\">"+category+"</a>";
			//make a category html element
			this.menu_categories_html[category]="<div id=\"node_sub_menu_\""+category+" class=\"node_sub_menu_category\">";

			for (var n in draft.nodes[category]){
				if(draft.nodes[category].hasOwnProperty(n)){
					this.menu[category][n] = n;
					//set the secondary html parts
					this.menu_categories_html[category]
				}
			}
			this.menu_categories_html[category]+="</div>"
		}
	}

	this.menu_html+="</div>"

	this.canvas.innerHTML = this.menu_html;

	return this;
}

draft.node_browser.prototype.toggle=function(p){
	if(this.visible){
		this.canvas.style.visibility="hidden";
		this.visible=false;
	}else{
		this.canvas.style.visibility="";
		this.canvas.style.left = p.x;
		this.canvas.style.top = p.y;
		this.visible=true;
	}
}