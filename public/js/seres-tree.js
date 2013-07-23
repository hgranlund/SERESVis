function Tree(el, json) {
    var self = this;

    self.w = 960;
    self.h = 5300;
    self.i = 0;
    self.barHeight = 20;
    self.barWidth = self.w * 0.3;
    self.duration = 400;

    self.init(el);
    self.compute(json);

}

Tree.prototype = {


    init: function (el) {
        var self = this;
        self.util = window.seres.utilities;
        self.l = el;
        self.tree = d3.layout.tree()
            .size([self.h, 100]);

        self.diagonal = d3.svg.diagonal()
            .projection(function (d) {
            return [d.y, d.x];
        });

        self.vis = d3.select(el).append('svg:svg')
            .attr("width", self.w)
            .attr("height", self.h)
            .append("svg:g")
            .attr("transform", 'translate(20,30)');


    },

    compute: function (json) {
        var self = this;
        self.formatter = jsonFormatter(json);
        self.root = self.formatter.toTreeObject()[0];
        self.root.x0 = 0;
        self.root.y0 = 0;
        self.root.color = self.util.getColor(self.root);
        self.text = '';
        self.nodes = self.root;
        self.focusedNode = self.root;
        self.mapNodes(function (d) {
            if (d.children.length === 0) {
                d.children = null;
            }
        });
        self.resetTree();
        self.update(self.root);
    },



    update: function (source) {
        var self = this;
        self.nodes = self.tree.nodes(self.root);

        // Compute the 'layout'.
        self.nodes.forEach(function (n, i) {
            n.x = i * self.barHeight;
        });

        // Update the nodes…
        var node = self.vis.selectAll('g.node')
            .data(self.nodes, function (d) {
            return d.id || (d.id = ++self.i);
        });

        self.nodeEnter = node.enter().append('svg:g')
            .attr('class', 'node')
            .attr('transform', function (d) {
            return 'translate(' + source.y0 + ',' + source.x0 + ')';
        })
            .style('opacity', 1e-6);

        // Enter any new nodes at the parent's previous position.
        self.nodeEnter.append('svg:rect')
            .attr('y', -self.barHeight / 2)
            .attr('height', self.barHeight)
            .attr('id', function (d) {
            return self.util.toLegalHtmlName(d.id);
        })
            .attr('width', self.barWidth)
            .style('fill', self.color)
            .on('click', fireClick)
            .attr('class', 'rectElement')
            .on('mouseover', fireMouseOver)
            .on('mouseout', fireMouseOut);

        self.nodeEnter.append('svg:text')
            .attr('dy', 3.5)
            .attr('dx', 5.5)
            .text(function (d) {
            return d.name;
        });

        self.nodeEnter.append('svg:text')
            .attr('dy', '.35em')
            .attr('dx', '11em')
            .style('text-anchor', 'start')
            .style('font-size', '24px')
            .style('pointer-events', 'all')
            .style('cursor', 'pointer')
            .on('click', click)
            .text(function (d) {
            if (d._children || d.individuals) {
                return '+';
            } else if (d.children) {
                return '-';
            } else {
                return;
            }
        });

        // Transition nodes to their new position.
        self.nodeEnter.transition()
            .duration(self.duration)
            .attr('transform', function (d) {
            return 'translate(' + d.y + ',' + d.x + ')';
        })
            .style('opacity', 1);

        node.transition()
            .duration(self.duration)
            .attr('transform', function (d) {
            return 'translate(' + d.y + ',' + d.x + ')';
        })
            .style('opacity', 1)
            .select('rect')
            .attr('rx', '10')
            .style('fill', function (d) {
            return d.color;
        });

        // Transition exiting nodes to the parent's new position.
        node.exit().transition()
            .duration(self.duration)
            .attr('transform', function (d) {
            return 'translate(' + source.y + ',' + source.x + ')';
        })
            .style('opacity', 1e-6)
            .remove();

        // Update the links…
        var link = self.vis.selectAll('path.link')
            .data(self.tree.links(self.nodes), function (d) {
            return d.target.id;
        });

        // Enter any new links at the parent's previous position.
        link.enter().append('svg:path', 'g')
            .attr('class', 'link')
            .attr('d', function (d) {
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
            .attr('d', self.diagonal);

        // Transition links to their new position.
        link.transition()
            .duration(self.duration)
            .attr('d', self.diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(self.duration)
            .attr('d', function (d) {
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
        self.nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });

        function fireClick(d) {
            window.seres.eventController.fireClick(d);
        }

        function fireMouseOver(d) {
            window.seres.eventController.fireMouseOver(d);
        }

        function fireMouseOut(d) {
            window.seres.eventController.fireMouseOut(d);
        }

        function click(d) {
            self.toggle(d);
            d3.select(this).text(function (d) {
                //TODO: add icon for individuals
                if (d._children || d.individuals) {
                    return '+';
                } else if (d.children) {
                    return '-';
                } else {
                    return;
                }
            });
            self.update(d);
        }
    },


    click: function (id) {
        var self = this;
        var d = self.util.getNode(id, self.nodes);
        self.focusedNode = d;
        if (d._children) {
            self.toggle(d);
        }
        self.update(d);
    },


    toggle: function (d) {
        var self = this;
        if (d.children) {
            self.collapseNode(d);
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
            d.color = self.util.getColor(d);
            d.children.map(function (node) {
                node.color = self.util.getColor(node);
            });
        }
    },

    toggleAll: function (d) {
        if (d.children) {
            d.children.forEach(toggleAll);
            toggle(d);
        }
    },

    resetTree: function () {
        var self = this;
        self.collapseNode(self.root);
        self.toggle(self.root);
    },

    collapseNode: function (d) {
        var self = this;
        self.mapNodes(d, function (d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            }
        });
    },


    mapNodes: function (d, callback) {
        function mapL(d) {
            if (d.children) {
                d.children.map(mapL);
                callback(d);
            }
        }
        mapL(d);
    },


    mouseOver: function (id) {
        var self = this;
        var className = self.util.toLegalHtmlName(id);
        self.vis.selectAll('#' + className)
            .style('stroke-width', 5)
            .style('stroke', 'red');
    },

    mouseOut: function (id) {
        var self = this;
        var className = self.util.toLegalHtmlName(id);
        self.vis.selectAll('#' + className)
            .style('stroke-width', 1.5)
            .style('stroke', function (d) {
            return d.stroke;
        });
    }

};

Tree.fn = Tree.prototype;