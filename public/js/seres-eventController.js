function EventController(tree, graph, sidebar) {
    var self = this;
    self.tree = tree;
    self.graph = graph;
    self.sidebar = sidebar;
    self.sidebar.show(graph.root);
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

    fireMouseOverLink: function (d) {
        var self = this;
        self.sidebar.show(d);
        self.graph.mouseOverLink(d);
    },

    fireMouseOutLink: function (d) {
        var self = this;
        self.graph.mouseOutLink(d);
    },

    toggleNode: function (id) {
        var self = this;
        self.tree.expandNode(id);
    },

    showInfo: function (d) {
        self.sidebar.show(d);
    }
};

EventController.fn = EventController.prototype;
