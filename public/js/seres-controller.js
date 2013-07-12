function Controller(tree, graph) {
    var self = this;
    self.tree = tree;
    self.graph = graph;
}

Controller.prototype = {

    fireClick: function(d) {
        var self = this;
        self.tree.click(d.id);
        self.graph.click(d.id);
    },

    fireMouseOver: function(d) {
        var self = this;
        self.tree.highlight (d.id);
        self.graph.highlight(d.id);
    },

    fireMouseOut: function(d) {
        var self = this;
        self.tree.downlight(d.id);
        self.graph.downlight(d.id);
    }
};

Controller.fn = Controller.prototype;