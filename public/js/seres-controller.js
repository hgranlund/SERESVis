function Controller (tree, graph) {
	var self=this;
	self.tree = tree;
	self.graph =graph;
};

Controller.prototype = {
	
	fireClick : function  (d) {
		var self = this;
		self.tree.click(d.id);
		self.graph.click(d.id);
	}
}
