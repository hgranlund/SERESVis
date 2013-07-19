function Graph(el, json) {
    'use strict';
    this.width = 1250;
    this.height = 900;
    this.root = {};
    this.init(el);
    this.compute(json);
}

Graph.prototype = {

    init: function (el) {
        var self = this;
        self.util = window.seres.utilities;
        self.el = el;
        self.nodeId = {};

        self.force = d3.layout.force()
            .size([self.width, self.height])
            .friction(0.9)
            .linkDistance(function (d) {
                var dist = d.source.size / 2;
                if (d.source.isExpanded) {
                    dist *= 2;
                }
                return dist;
            })
            .charge(function (d) {
                if (d.isIndividual) {
                    return -200;
                }
                if (d === self.root) {
                    return -5000;
                } else {
                    return -5000;
                }
            })
            .on('tick', tick)
            .gravity(0.06)
            .start();


        self.svg = d3.select(el).append('svg')
            .attr('width', self.width)
            .attr('class', 'svg')
            .attr('height', self.height);


        self.nodes = self.force.nodes();
        self.links = self.force.links();
        self.node = self.svg.selectAll('.node');
        self.link = self.svg.selectAll('.link');

        function tick(e) {
            if (e.alpha > 0.05) {
                self.updateNodeAndLinkPositions();
                self.updatePositions(e.alpha);
            } else {
                self.center(self.root);
                self.force.alpha(0);
            }
        }
    },

    update: function () {
        var self = this;
        self.force.nodes(self.nodes)
            .links(self.links)
            .start();

        self.link = self.link.data(self.force.links());
        self.node = self.node.data(self.force.nodes());
        self.link.exit().remove();
        self.node.exit().remove();
        self.link.enter().append('svg:path')
            .style('stroke', 'lightgrey')
            .style('stroke-width', 4)
            .style('opacity', 0.5)
            .attr('class', 'link')
            .attr('drawOrder', '2')
            .attr('id', function (d) {
                return ('link-' + self.util.toLegalHtmlName(d.source.id) + '-' + self.util.toLegalHtmlName(d.target.id));
            });

        self.node.enter().append('g')
            .attr('class', 'node');

        self.circle = self.node.append('circle')
            .on('click', fireClick)
            .call(self.force.drag)
            .attr('drawOrder', '1')
            .on('mouseover', fireMouseOver)
            .on('mouseout', fireMouseOut)
            .style('fill', function (d) {
                return d.color;
            })
            .attr('id', function (d) {
                return self.util.toLegalHtmlName(d.id);
            })
            .attr('r', function (d) {
                return d.size;
            })
            .style('stroke-width', 6)
            .style('stroke', function (d) {
                return d.stroke;
            });

        self.node.append('title')
            .text(function (d) {
                if (d.isIndividual) {
                    return 'uuid: ' + d.data['xmi.uuid'];
                }
                return d.name;
            });

        self.node.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .text(function (d) {
                if (d.isIndividual) {
                    return '';
                }
                return d.name;
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
    },

    click: function (id) {
        var self = this;
        var d = self.util.getNode(id, self.nodes) || self.formatter.createNode(id, self.nodes.length);
        if (d && !d.isExpanded) {
            if (d.isIndividual) {
                self.clickIndividual(d);
            } else {
                self.clickClass(d);
            }
        };
    },

    clickClass: function (d) {
        var self = this;
        self.makeRoot(d);
        self.nodes = [];
        self.links = [];
        self.update();
        d.index = 0;
        self.util.addNodeToNodes(d, self.nodes);
        self.expandNode(d);
        self.update();
    },

    clickIndividual: function (d) {
        var self = this,
            subClassOfId = self.util.getPropertyValue('type', d.object);
        if (!subClassOfId) {
            return;
        }
        if (self.root.id === subClassOfId) {
            self.expandNode(d);
        } else {
            var node = self.util.getNode(subClassOfId, self.nodes);
            self.collapseNode(self.root);
            self.update();
            self.makeRoot(node);
            self.expandNode(node);
            self.expandNode(d);
        }
        self.update();
    },


    compute: function (json) {
        var self = this;
        self.formatter = jsonFormatter(json);
        self.parentToChildMap = self.formatter.parentToChildMap;
        self.makeRoot(self.formatter.createNode('Seres', self.nodes.length));
        self.links = [];
        self.nodes = [self.root];
        self.root.x = self.width / 2;
        self.root.y = self.height / 2;
        self.root.color = self.util.getColor(self.root);
        self.root.stroke = self.util.getColor(self.root);
        self.force.nodes(self.nodes);
        self.force.links(self.links);
        self.expandNode(self.root);
        self.update();
    },

    collide: function (node, alpha) {
        var self = this,
            r = node.radius + 16,
            nx1 = node.x - r,
            nx2 = node.x + r,
            ny1 = node.y - r,
            ny2 = node.y + r;

        return function (quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== node)) {
                var x = node.x - quad.point.x,
                    y = node.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = (quad.point.size || 1) * 2;
                if (l < r) {
                    l = (l - r) / l * alpha;
                    node.x -= x *= l;
                    node.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        };
    },

    handleCollisions: function () {
        var q = d3.geom.quadtree(this.nodes),
            i = 0,
            len = this.nodes.length;

        while (++i < len) {
            q.visit(this.collide(this.nodes[i], 10));
        }
    },

    updateNodeAndLinkPositions: function (duration) {
        duration = duration || 0;
        this.link.transition().duration(duration).attr('d', function (d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return 'M' + d.source.x + ',' + d.source.y + 'A' + dr + ',' + dr + ' 0 0,1 ' + d.target.x + ',' + d.target.y;
        });

        this.node.transition().duration(duration).attr('transform', function (d) {
            // d.x = Math.max(d.size, Math.min(self.width - d.size, d.x));
            // d.y = Math.max(d.size, Math.min(self.height - d.size, d.y));
            return 'translate(' + d.x + ',' + d.y + ')';
        });
    },


    expandNode: function (d) {
        var n,
            self = this,
            deltaX = d.x + 75,
            deltaY = d.y + 75;
        d.color = self.util.getColor(d);
        var nodeIdToUpdate = [];

        function add(n) {
            n.x = deltaX;
            n.y = deltaY;
            n.color = d.color.brighter();
            n.stroke = d.color;
            if (self.util.addNodeToNodes(n, self.nodes)) {
                nodeIdToUpdate.push(n.index);
                if (d.isIndividual) {
                    self.expandClassToIndividual(n);
                }
            }
        }
        var nodesToAdd = d.parents.concat(d.children);
        nodesToAdd.map(function (link) {
            add(self.formatter.createNode(link.nodeId, self.nodes.length));
        });
        nodeIdToUpdate.map(function (index) {
            self.links = self.links.concat(self.formatter.createLink(index, self.nodes));
        });

        self.updateNodeAndLinkPositions(0);
        self.force.stop();
        for (var i = 0; i < d.children.length; ++i) {
            self.handleCollisions();
            self.force.tick();
        }
        self.updateNodeAndLinkPositions();
        self.force.start();
        d.isExpanded = true;
    },

    expandClassToIndividual: function (d) {
        var self = this,
            parentClass = self.util.getPropertyValue('type', d.object);
        if (parentClass && !self.util.getNode(parentClass, self.nodes)) {
            var n = self.formatter.createNode(parentClass, self.nodes.length);
            n.x = d.x;
            n.y = d.y;
            n.color = self.util.getColor(n);
            n.stroke = self.util.getColor(n);
            var parent = self.util.getPropertyValue('subClassOf', n.object);
            if (parent) {
                n.stroke = self.util.getColor((self.formatter.createNode(parent, 0)));
            }
            if (self.util.addNodeToNodes(n, self.nodes)) {
                d.color = n.color.brighter();
                self.formatter.createLink(n.index, self.nodes);
                self.links.push({
                    source: d.index,
                    target: n.index,
                    name: 'subClassOf'
                });
            }
        }

    },


    collapseNode: function (d) {
        var n,
            self = this,
            node,
            children = d.children;
        if (d.children.length === 0 && d.parents.length === 0) {
            return;
        }
        var indexesToRemove = [];
        getIndexesOfExpandedChildren(d);
        self.removeIndexesFromGraph(indexesToRemove);
        d.color = d.stroke.brighter() || self.util.getColor(d);
        d.isExpanded = false;

        function getIndexesOfExpandedChildren(d) {
            var tailRec = [];
            for (var j = 0; j < self.nodes.length; j++) {
                node = self.nodes[j];
                if (util.getNodeInRelatedList(node.id, d.parents)) {
                    if (!node.isExpanded) {
                        indexesToRemove.push(node.index);
                        if (node.isExpanded && d.parents.length !== 0) {
                            node.isExpanded = false;
                            tailRec.push(node);
                        }
                    }
                }
                if (util.getNodeInRelatedList(node.id, d.children)) {
                    indexesToRemove.push(node.index);
                    if (node.isExpanded && d.children.length !== 0) {
                        node.isExpanded = false;
                        tailRec.push(node);
                    }
                }
            };
            tailRec.map(function (node) {
                getIndexesOfExpandedChildren(node);
            });
        };
    },

    removeIndexesFromGraph: function (indexesToRemove) {
        var self = this,
            indexUpdate = {};
        indexesToRemove.sort(function (a, b) {
            return a - b;
        });
        var indexesToRemove_ = indexesToRemove.slice(0);
        var newIndex = self.nodes.length - 1;
        var indexRemove = indexesToRemove_.pop();
        for (var i = self.nodes.length - 1; i >= 0; i--) {
            if (indexRemove === i) {
                indexRemove = indexesToRemove_.pop();
            } else {
                indexUpdate[i] = newIndex;
            }
            newIndex--;
        }
        self.nodes = self.nodes.filter(function (elem, index) {
            if (index in indexUpdate) {
                elem.index = indexUpdate[elem.index];
                return true;
            }
        });

        self.links = self.links.filter(function (l) {
            if (l.target.index in indexUpdate) {
                if (l.source.index in indexUpdate) {
                    l.target.index = indexUpdate[l.target.index];
                    l.source.index = indexUpdate[l.source.index];
                    return true;
                }
            }
            return false;
        });
    },


    updatePositions: function (alpha) {
        var self = this;
        var k = 0.05 * alpha;
        self.nodes.map(function (d, i) {
            self.cluster(10 * alpha * alpha)(d);
        });
    },

    cluster: function (alpha) {
        var self = this;
        var nameToNodeMap = {};

        self.nodes.map(function (d) {
            nameToNodeMap[d.name] = d;
        });
        return function (d) {
            var parent = d.object.subClassOf;
            var node = nameToNodeMap[parent],
                h,
                ballR,
                delatX,
                deltaY;

            if (node == d || typeof (node) === 'undefined') return;

            deltaX = d.x - node.x;
            deltaY = d.y - node.y;
            h = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            ballR = d.size + node.size * 2;
            ballR = (d.isExpanded ? ballR * 2 : ballR);
            if (h != ballR) {
                h = (h - ballR) / h * alpha;
                d.x -= deltaX *= h;
                d.y -= deltaY *= h;
                node.x += deltaX;
                node.y += deltaY;
            }
        };
    },

    makeRoot: function (d) {
        if (this.root === d) {
            return;
        }
        this.root.fixed = false;
        this.root = d;
        d.fixed = true;
    },

    center: function (nodeToCenter) {
        var deltaX = this.width / 2 - nodeToCenter.x,
            deltaY = this.height / 2 - nodeToCenter.y,
            self = this;


        self.nodes.map(function (d) {
            d.x += deltaX;
            d.y += deltaY;
        });
        self.update();
        self.force.stop();
        self.updateNodeAndLinkPositions(400);
        self.force.start();

    },


    mouseOver: function (id) {
        var self = this;
        var className = self.util.toLegalHtmlName(id);
        var node = self.util.getNode(id, self.nodes);
        node.children.map(function (link) {
            d3.select(self.el).selectAll('#link-' + self.util.toLegalHtmlName(link.nodeId) + '-' + className)
                .style('stroke-width', 6)
                .style('stroke', function (d) {
                    return d.target.color.darker();
                });
        });
        node.parents.map(function (link) {
            d3.select(self.el).selectAll('#link-' + className + '-' + self.util.toLegalHtmlName(link.nodeId))
                .style('stroke-width', 6)
                .style('stroke', function (d) {
                    return d.source.color.darker();
                });

        });

        d3.select(self.el).selectAll('#' + className)
            .style('stroke-width', 6)
            .style('stroke', 'red');

    },

    mouseOut: function (id) {
        var self = this;
        var className = self.util.toLegalHtmlName(id);
        var node = self.util.getNode(id, self.nodes);
        node.children.map(function (link) {
            d3.select(self.el).selectAll('#link-' + self.util.toLegalHtmlName(link.nodeId) + '-' + className)
                .style('stroke-width', 4)
                .style('stroke', 'lightgrey');
        });
        node.parents.map(function (link) {
            d3.select(self.el).selectAll('#link-' + className + '-' + self.util.toLegalHtmlName(link.nodeId))
                .style('stroke-width', 4)
                .style('stroke', 'lightgrey');
        });

        d3.select(self.el).selectAll('#' + className)
            .style('stroke-width', 6)
            .style('stroke', function (d) {
                return d.stroke;
            });
    }
};

Graph.fn = Graph.prototype;
