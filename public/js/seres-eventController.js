function EventController(tree, graph, sidebar) {
    var self = this;
    self.tree = tree;
    self.graph = graph;
    self.sidebar = sidebar;
}

EventController.prototype = {

    fireClick: function (d) {
        var self = this;
        self.sidebar.hide(d);
        self.tree.click(d.id);
        self.graph.click(d.id);
    },

    fireMouseOver: function (d) {
        var self = this;
        self.sidebar.show(d);
        self.tree.mouseOver(d.id);
        self.graph.mouseOver(d.id);
    },

    fireMouseOut: function (d) {
        var self = this;
        self.tree.mouseOut(d.id);
        self.graph.mouseOut(d.id);
    },
};

EventController.fn = EventController.prototype;
