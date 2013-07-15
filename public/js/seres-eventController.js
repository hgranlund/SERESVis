function EventController(tree, graph) {
    var self = this;
    self.tree = tree;
    self.graph = graph;
}

EventController.prototype = {

    fireClick: function(d) {
        var self = this;
        self.tree.click(d.class);
        self.graph.click(d.class);
    },

    fireMouseOver: function(d) {
        var self = this;
        self.tree.mouseOver (d.class);
        self.graph.mouseOver(d.class);
    },

    fireMouseOut: function(d) {
        var self = this;
        self.tree.mouseOut(d.class);
        self.graph.mouseOut(d.class);
    }
};

EventController.fn = EventController.prototype;
