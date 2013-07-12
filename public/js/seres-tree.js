function Tree(el, json) {
    var self = this;
    self.legends = [{
            "color": "#3c3c3c",
            "text": "Superklasser"
        }, {
            "color": "#c2bcbc",
            "text": "Subklasser"
        }, {
            "color": "#ffffff",
            "text": "Subsubklasser"
        }
    ];

    self.w = 960;
    self.h = 5300;
    self.i = 0;
    self.legendheight = 100;
    self.legendwidth = 400;
    self.barHeight = 20;
    self.barWidth = self.w * .3;
    self.duration = 400;
    self.formatter;
    self.nodes;
    self.root;

    self.init(el);
    self.compute(json);

}

Tree.prototype = {


    init: function(el) {
        var self = this;
        self.tree = d3.layout.tree()
            .size([self.h, 100]);

        self.diagonal = d3.svg.diagonal()
            .projection(function(d) {
            return [d.y, d.x];
        });

        self.vis = d3.select(el).append("svg:svg")
            .attr("width", self.w)
            .attr("height", self.h)
            .append("svg:g")
            .attr("transform", "translate(20,30)");

        self.svg = d3.select("#legends")
            .append("svg")
            .attr("width", self.legendwidth)
            .attr("height", self.legendheight);

        self.legend = self.svg.append("g")
            .attr("class", "legend")
            .attr("height", 30)
            .attr("width", 30)
            .attr('transform', 'translate(-20,50)');

        self.legend.selectAll('rect')
            .data(self.legends)
            .enter()
            .append("rect")
            .attr("x", function(d, i) {
            return i * 125 + 50;
        })
            .attr("y", 10)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", function(d) {
            var color = d.color;
            return color;
        });

        self.legend.selectAll('text')
            .data(self.legends)
            .enter()
            .append("text")
            .attr("x", function(d, i) {
            return i * 125 + 65;
        })
            .attr("y", 20)
            .text(function(d) {
            var text = d.text;
            return text;
        });


        d3.select("#expand-all").on("click", function() {
            function expand(d) {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d.children.forEach(expand);
                    d._children = null;
                }
            }

            self.root.children.forEach(click);
            d3.select("#expand-all").classed("active", true);
        });


    },

    compute: function(json) {
        var self = this;
        self.formatter = jsonFormatter(json);
        self.root = self.formatter.toTreeObject()[0];
        self.root.x0 = 0;
        self.root.y0 = 0;
        self.nodes = self.root;
        self.resetTree();
        self.update(self.root);
    },



    update: function(source) {
        var self = this;
        self.nodes = self.tree.nodes(self.root);

        // Compute the "layout".
        self.nodes.forEach(function(n, i) {
            n.x = i * self.barHeight;
        });

        // Update the nodes…
        var node = self.vis.selectAll("g.node")
            .data(self.nodes, function(d) {
            return d.id || (d.id = ++self.i);
        });

        var nodeEnter = node.enter().append("svg:g")
            .attr("class", "node")
            .attr("transform", function(d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
            .style("opacity", 1e-6);

        // Enter any new nodes at the parent's previous position.
        nodeEnter.append("svg:rect")
            .attr("y", -self.barHeight / 2)
            .attr("height", self.barHeight)
            .attr("id", function(d) {
            return d.name;
        })
            .attr("width", self.barWidth)
            .style("fill", self.color)
            .on("click", fireClick)
            .attr("class", "rectElement")
            .on("mouseover", seres.utilities.highlight)
            .on("mouseout", seres.utilities.downlight);

        nodeEnter.append("svg:text")
            .attr("dy", 3.5)
            .attr("dx", 5.5)
            .text(function(d) {
            return d.name;
        });

        // Transition nodes to their new position.
        nodeEnter.transition()
            .duration(self.duration)
            .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
        })
            .style("opacity", 1);

        node.transition()
            .duration(self.duration)
            .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
        })
            .style("opacity", 1)
            .select("rect")
            .style("fill", self.color);

        // Transition exiting nodes to the parent's new position.
        node.exit().transition()
            .duration(self.duration)
            .attr("transform", function(d) {
            return "translate(" + source.y + "," + source.x + ")";
        })
            .style("opacity", 1e-6)
            .remove();

        // Update the links…
        var link = self.vis.selectAll("path.link")
            .data(self.tree.links(self.nodes), function(d) {
            return d.target.id;
        });

        // Enter any new links at the parent's previous position.
        link.enter().insert("svg:path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
            var o = {
                x: source.x0,
                y: source.y0
            };
            return self.diagonal({
                source: o,
                target: o
            });
        })
            .transition()
            .duration(self.duration)
            .attr("d", self.diagonal);

        // Transition links to their new position.
        link.transition()
            .duration(self.duration)
            .attr("d", self.diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(self.duration)
            .attr("d", function(d) {
            var o = {
                x: source.x,
                y: source.y
            };
            return self.diagonal({
                source: o,
                target: o
            });
        })
            .remove();

        // Stash the old positions for transition.
        self.nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });

        function fireClick(d) {
            window.seres.controller.fireClick(d);
        }
    },


    click: function(id) {
        var self = this;
        var d = self.getNode(id);
        self.toggle(d);
        self.update(d);
    },

    color: function(d) {
        return d._children ? "#3c3c3c" : d.children ? "#c2bcbc" : "#ffffff";
    },

    toggle: function(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
    },

    toggleAll: function(d) {
        if (d.children) {
            d.children.forEach(toggleAll);
            toggle(d);
        }
    },

    resetTree: function() {
        var self = this;
        self.mapNodes(function(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            }
        });
        self.toggle(self.root);
    },

    mapNodes: function(callback) {
        var self = this;

        function mapL(d) {
            if (d.children) {
                d.children.map(mapL);
                callback(d);
            }
        };
        mapL((self.root));
    },
    getNode: function(id) {
        var self = this;
        var nodes = self.nodes.filter(function(d) {
            return d.id === id;
        });
        return nodes[0];
    }
};

Tree.fn = Tree.prototype;