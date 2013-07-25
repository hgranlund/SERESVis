function Tree(el, json) {
    var self = this;
    self.screenWidth = window.screen.width;
    self.screenHeigth = window.screen.heigth;
    self.el = el;
    self.w = 960;
    self.h = 5300;
    self.i = 0;
    self.pathHeigth = 60;
    self.pathWidth = self.w * 0.18;
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


        self.diagonal = d3.svg.line().interpolate('step-before')
            .x(function (d) {
                return d.x + 1;
            })
            .y(function (d) {
                return d.y;
            });


        self.path = d3.select(el).append('svg:svg')
            .attr("width", self.screenWidth)
            .attr("height", self.pathHeigth)
            .append("svg:g")
            .attr("transform", 'translate(20,0)');


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
        self.root.color = self.util.getColor(self.root, self.nodes);
        self.text = '';
        self.nodes = self.tree.nodes(self.root);
        self.pathFromRoot = [self.root];
        self.focusedNode = self.root;
        self.mapNodes(function (d) {
            if (d.children.length === 0) {
                d.children = null;
            }
        });
        self.inFocus = self.root;
        self.resetTree();
        self.update(self.root);
    },



    update: function (source) {
        var self = this;
        self.nodes = self.tree.nodes(self.root);
        self.pathFromRoot = self.util.pathFromRoot(self.inFocus, self.nodes);

        self.nodes.forEach(function (n, i) {
            n.x = i * self.barHeight * 1.2;
        });

        self.pathFromRoot.forEach(function (n, i) {
            n.px0 = i * self.pathWidth * 1.1;
        });
        var path = self.path.selectAll('g.pathFromRoot')
            .data(self.pathFromRoot, function (d) {
                return d.id;
            });


        self.pathEnter = path.enter().append('svg:g')
            .style('opacity', 1e-6)
            .attr('class', 'pathFromRoot');


        self.pathEnter.append('svg:polygon')
            .attr('fill', function (d) {
                return d.color;
            })
            .attr("opacity", 0.7)
            .attr('points', function (d) {
                var points = [];
                points.push("0,0 ");
                points.push(self.pathWidth, ',0 ');
                points.push(self.pathWidth * 1.2, ',', (self.pathHeigth / 2));
                points.push(self.pathWidth, ',', self.pathHeigth);
                points.push(' 0,', self.pathHeigth);
                if (d.px0 !== 0) {
                    points.push(self.pathWidth * 0.2, ',', (self.pathHeigth / 2));
                }
                return points.join(' ');
            });


        self.pathEnter.append('svg:text')
            .attr('dy', self.pathHeigth * 0.6)
            .attr('dx', function (d) {
                if (d.px0 !== 0) {
                    return self.pathWidth * 0.25;
                } else {
                    return self.pathWidth * 0.15;
                }
            })
            .attr("fill", "white")
            .text(function (d) {
                return d.name;
            });

        path.transition()
            .duration(self.duration)
            .attr('transform', function (d) {
                return 'translate(' + d.px0 + ',' + 0 + ')';
            })
            .style('opacity', 1)
            .style('fill', function (d) {
                return d.color;
            });

        path.exit().transition()
            .attr('transform', function (d) {
                return 'translate(' + d.y - self.pathWidth + ',' + 0 + ')';
            })
            .style('opacity', 1e-6)
            .remove();


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
            .attr('id', function (d) {
                return 'text-' + d.id;
            })
            .style('text-anchor', 'start')
            .style('font-size', '24px')
            .style('pointer-events', 'all')
            .style('cursor', 'pointer')
            .on('click', click)
            .text(self._getIcon);

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
            .style('fill', function (d) {
                return d.color;
            });

        node.exit().transition()
            .duration(self.duration)
            .attr('transform', function (d) {
                return 'translate(' + source.y + ',' + source.x + ')';
            })
            .style('opacity', 1e-6)
            .remove();

        var link = self.vis.selectAll('path.link')
            .data(self.tree.links(self.nodes), function (d) {
                return d.target.id;
            });

        link.enter().append('svg:path', 'g')
            .attr('class', 'link')
            .style('stroke-width', 4)
            .attr('d', function (d) {
                return self.diagonal([{
                    y: source.x0,
                    x: source.y0
                }, {
                    y: source.x0,
                    x: source.y0
                }]);
            })
            .transition()
            .duration(self.duration)
            .attr('d', function (d) {
                return self.diagonal([{
                    y: (d.source.x + (self.barHeight / 2)),
                    x: d.source.y
                }, {
                    y: d.target.x,
                    x: d.target.y
                }]);
            });

        link.transition()
            .duration(self.duration)
            .attr('d', function (d) {
                return self.diagonal([{
                    y: (d.source.x + (self.barHeight / 2)),
                    x: d.source.y
                }, {
                    y: d.target.x,
                    x: d.target.y
                }]);
            });

        link.exit().transition()
            .duration(self.duration)
            .attr('d', function (d) {
                return self.diagonal([{
                    y: source.x,
                    x: source.y
                }, {
                    y: source.x,
                    x: source.y
                }]);
            })
            .remove();

        self.nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });

        self._focusNode(self.inFocus.id);


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
            var path,
                parent,
                childInFocus = false;
            if (d.children) {
                self.mapNodes(d, function (node) {
                    if (node.id === self.inFocus.id) {
                        childInFocus = true;
                    }
                });
                if (childInFocus) {
                    parent = self.util.getPropertyValue('subClassOf', d.object);
                    if (parent) {
                        self._setFocus(self.util.getNode(parent, self.nodes));
                    } else {
                        self._setFocus(d);
                    };
                    self.toggle(d);
                    fireClick(self.inFocus);
                } else {
                    self.toggle(d);
                    self.update(d);
                }
            } else {
                self.toggle(d);
                self.update(d);
            }
        }
    },


    click: function (id) {
        var self = this;
        var d = self.util.getNode(id, self.nodes);
        if (d) {
            self._setFocus(d);
            if (d._children) {
                self.toggle(d);
            }
            self.update(d);
        }
    },

    _setFocus: function (node) {
        var self = this;
        self._unFocusNode(self.inFocus.id);
        self.inFocus = node;
        self._focusNode(self.inFocus.id);
    },

    toggle: function (d) {
        var self = this,
            id = '#text-' + d.id;
        if (d.children) {
            self.collapseNode(d);
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
            d.color = self.util.getColor(d, self.nodes);
            d.children.map(function (node) {
                node.color = self.util.getColor(node, self.nodes);
            });
        }
        d3.select(this.el).select(id).text(self._getIcon);
    },

    _getIcon: function (d) {
        if (d.individuals) {
            return '•';
        } else if (d._children) {
            return '+';
        } else if (d.children) {
            return '-';
        } else {
            return '';
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

    expandNode: function (id) {
        var self = this,
            d,
            path;
        path = self.util.pathFromRootWithFormatter(id, self.formatter);
        for (var i = 0; i < path.length; i++) {
            var node = self.util.getNode(path[i], self.nodes);
            if (node._children) {
                self.toggle(node);
                self.update(node);
            };
        };
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
        self._focusNode(id);

    },

    mouseOut: function (id) {
        var self = this;
        if (self.inFocus.id !== id) {
            self._unFocusNode(id);
        }
    },

    _focusNode: function (id) {
        var self = this;
        id = self.util.toLegalHtmlName(id);
        self.vis.selectAll('#' + id)
            .style('stroke-width', 3)
            .style('stroke', function (d) {
                return d.color.darker();
            });
    },

    _unFocusNode: function (id) {
        var self = this;
        id = self.util.toLegalHtmlName(id);
        self.vis.selectAll('#' + id)
            .style('stroke-width', 0);
    }

};

Tree.fn = Tree.prototype;
