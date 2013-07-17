function EventController(tree, graph) {
    var self = this;
    self.tree = tree;
    self.graph = graph;
}

EventController.prototype = {

    fireClick: function (d) {
        var self = this;
        self.tree.click(d.id);
        self.graph.click(d.id);
    },

    fireMouseOver: function (d) {
        var self = this;
        self.tree.mouseOver(d.id);
        self.graph.mouseOver(d.id);
    },

    fireMouseOut: function (d) {
        var self = this;
        self.tree.mouseOut(d.id);
        self.graph.mouseOut(d.id);
    }
};

EventController.fn = EventController.prototype;