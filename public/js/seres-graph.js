function Graph(el, json) {
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
                var dist = d.source.size;
                if (d.source.isIndividual) {
                    dist *= 4;
                } else if (d.source.isProperty) {
                    dist *= 4;
                } else {
                    dist *= 2;
                }
                dist += d.source.size;
                return dist;
            })
            .charge(function (d) {
                if (d.isIndividual) {
                    return -1000;
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
        self.pathText = self.svg.selectAll('.pathText');

        function tick(e) {
            if (e.alpha > 0.9) {
                return;
            } else if (e.alpha > 0.05) {
                self.updateNodeAndLinkPositions();
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
        self.node = self.node.data(self.force.nodes(), function (d) {
            return d.id;
        });
        self.pathText = self.pathText.data(self.force.links());


        self.link.exit().transition().duration(200).attr('d', function (d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return 'M' + self.root.x + ',' + self.root.y + 'A' + dr + ',' + dr + ' 0 0,1 ' + self.root.x + ',' + self.root.y;
        }).remove();

        self.node.exit().transition().duration(300).attr('transform', function (d) {
            return 'translate(' + self.root.x + ',' + self.root.y + ')';
        }).remove();

        self.pathText.exit().remove();

        self.link.enter().append('svg:path')
            .style('stroke', 'lightgrey')
            .style('stroke-width', 4)
            .style('opacity', 0.5)
            .attr('class', 'link')
            .attr('id', function (d) {
                return ('path-' + self.util.toLegalHtmlName(d.source.id) + '-' + self.util.toLegalHtmlName(d.target.id));
            })
            .on('mouseover', fireMouseOverLink)
            .on('mouseout', fireMouseOutLink);

        self.pathText.enter()
            .append("g")
            .attr("class", "pathText")
            .attr("id", function (d) {
                return ('pathText-' + self.util.toLegalHtmlName(d.source.id) + '-' + self.util.toLegalHtmlName(d.target.id));
            })
            .style('opacity', 0.7)
            .style("visibility", 'hidden')
            .style("fill", 'black')
            .on('mouseover', function (d) {
                d3.select(this)
                    .attr("visibility", 'visible');
            })
            .on('mouseout', function (d) {
                d3.select(this)
                    .attr("visibility", 'hidden');
            });

        self.pathText.append("text")
            .style("font-size", "14px")
            .append("textPath")
            .attr("offset", 30)
            .attr("startOffset", function (d) {
                return d.source.size + 15;
            })
            .attr("xlink:href", function (d) {
                return ('#path-' + self.util.toLegalHtmlName(d.source.id) + '-' + self.util.toLegalHtmlName(d.target.id));
            })
            .text(function (d) {
                return d.name;
            });

        self.node.enter().append('g')
            .call(self.force.drag)
            .on('click', fireClick)
            .on('mouseover', fireMouseOver)
            .on('mouseout', fireMouseOut)
            .attr('class', 'node');

        self.circle = self.node.append('circle')
            .on('click', fireClick)
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
        this.link.attr('d', function (d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return 'M' + d.source.px + ',' + d.source.py + 'A' + dr + ',' + dr + ' 0 0,1 ' + d.target.px + ',' + d.target.py;
        });

        this.node.attr('transform', function (d) {
            return 'translate(' + d.px + ',' + d.py + ')';
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

        function fireMouseOverLink(d) {
            window.seres.eventController.fireMouseOverLink(d);
        }

        function fireMouseOutLink(d) {
            window.seres.eventController.fireMouseOutLink(d);
        }
    },

    click: function (id) {
        var self = this;
        var d = self.util.getNode(id, self.nodes);
        if (!d) {
            d = self.formatter.createNode(id, self.nodes.length);
            d.x = d.px = self.width / 2;
            d.y = d.py = self.height / 2;
        }
        if (d && !d.isExpanded) {
            if (d.isIndividual) {
                self.clickIndividual(d);
            } else {
                self.clickClass(d);
            }
        }
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
        self.root.color = self.util.getColor(self.root, self.nodes);
        self.root.stroke = self.root.color;
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
            q.visit(this.collide(this.nodes[i], 30));
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
            return 'translate(' + d.x + ',' + d.y + ')';
        });
    },


    expandNode: function (d) {
        var n,
            node,
            parent,
            self = this,
            deltaX,
            nodeIdToUpdate,
            deltaY;

        d.stroke = self.util.getStroke(d, self.nodes);
        if (d.isIndividual) {
            d.color = d.stroke;
        } else {
            d.color = self.util.getColor(d, self.nodes);
        }
        deltaX = d.px;
        deltaY = d.py;

        nodeIdToUpdate = [];

        function add(n) {
            n.x = n.px = deltaX;
            n.y = n.py = deltaY;
            if (self.util.addNodeToNodes(n, self.nodes)) {
                nodeIdToUpdate.push(n.index);
                if (d.isIndividual) {
                    self.expandClassToIndividual(n);
                }
            }
        }
        d.children.map(function (link) {
            node = self.formatter.createNode(link.nodeId, self.nodes.length);
            node.color = self.util.getColor(node, self.nodes);
            node.stroke = self.util.getStroke(node, self.nodes);
            add(node);
        });
        d.parents.map(function (link) {
            node = self.formatter.createNode(link.nodeId, self.nodes.length);
            parent = self.util.getParent(node, self.formatter) || node;
            node.color = self.util.getColor(node, self.nodes);
            node.stroke = self.util.getStroke(node, self.nodes);
            add(node);
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
        self.updateNodeAndLinkPositions(200);
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
            n.color = self.util.getColor(n, self.nodes);
            n.stroke = self.util.getColor(n, self.nodes);
            var parent = self.util.getPropertyValue('subClassOf', n.object);
            if (parent) {
                n.stroke = self.util.getColor(self.formatter.createNode(parent, 0), self.nodes);
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
        d.color = d.stroke.brighter() || self.util.getColor(d, self.nodes);
        d.isExpanded = false;

        function getIndexesOfExpandedChildren(d) {
            var tailRec = [];
            for (var j = 0; j < self.nodes.length; j++) {
                node = self.nodes[j];
                if (util.getLinkWithNodeId(node.id, d.parents)) {
                    if (!node.isExpanded) {
                        indexesToRemove.push(node.index);
                        if (node.isExpanded && d.parents.length !== 0) {
                            node.isExpanded = false;
                            tailRec.push(node);
                        }
                    }
                }
                if (util.getLinkWithNodeId(node.id, d.children)) {
                    indexesToRemove.push(node.index);
                    if (node.isExpanded && d.children.length !== 0) {
                        node.isExpanded = false;
                        tailRec.push(node);
                    }
                }
            }
            tailRec.map(function (node) {
                getIndexesOfExpandedChildren(node);
            });
        }
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
            self = this,
            h,
            ballR;

        h = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        ballR = nodeToCenter.size;
        if (h > ballR) {

            self.nodes.map(function (d) {
                d.x += deltaX;
                d.y += deltaY;
            });
            self.update();
            self.force.stop();
            self.updateNodeAndLinkPositions(400);
            self.force.start();
        }
    },

    mouseOverLink: function (d) {
        var self = this;
        var sourceClass = self.util.toLegalHtmlName(d.source.id);
        var targetClass = self.util.toLegalHtmlName(d.target.id);
        var linkId = sourceClass + '-' + targetClass;
        d3.select(self.el).selectAll('#path-' + linkId)
            .style('stroke-width', 6)
            .style('stroke', function (d) {
                return d.target.color.darker();
            });
        d3.select(self.el).selectAll('#pathText-' + linkId)
            .style('visibility', 'visible');

        self._focusNode('#' + targetClass);
        self._focusNode('#' + sourceClass);


    },

    mouseOutLink: function (d) {
        var self = this;
        var sourceClass = self.util.toLegalHtmlName(d.source.id);
        var targetClass = self.util.toLegalHtmlName(d.target.id);
        var linkId = sourceClass + '-' + targetClass;
        d3.select(self.el).selectAll('#path-' + linkId)
            .style('stroke-width', 4)
            .style('stroke', 'lightgrey');
        d3.select(self.el).selectAll('#pathText-' + linkId)
            .style('visibility', 'hidden');

        self._unFocusNode('#' + targetClass);
        self._unFocusNode('#' + sourceClass);
    },


    mouseOver: function (id) {
        var self = this;
        var className = self.util.toLegalHtmlName(id);
        var node = self.util.getNode(id, self.nodes);
        if (node) {
            node.children.map(function (link) {
                d3.select(self.el).selectAll('#path-' + self.util.toLegalHtmlName(link.nodeId) + '-' + className)
                    .style('stroke-width', 6)
                    .style('stroke', function (d) {
                        return d.target.color.darker();
                    });
                d3.select(self.el).selectAll('#pathText-' + self.util.toLegalHtmlName(link.nodeId) + '-' + className)
                    .style('visibility', 'visible');
            });
            node.parents.map(function (link) {
                d3.select(self.el).selectAll('#path-' + className + '-' + self.util.toLegalHtmlName(link.nodeId))
                    .style('stroke-width', 6)
                    .style('stroke', function (d) {
                        return d.source.color.darker();
                    });
                d3.select(self.el).selectAll('#pathText-' + className + '-' + self.util.toLegalHtmlName(link.nodeId))
                    .style('visibility', 'visible');

            });

            self._focusNode('#' + className);
        }
    },

    mouseOut: function (id) {
        var self = this;
        var className = self.util.toLegalHtmlName(id);
        var node = self.util.getNode(id, self.nodes);
        if (node) {
            node.children.map(function (link) {
                d3.select(self.el).selectAll('#path-' + self.util.toLegalHtmlName(link.nodeId) + '-' + className)
                    .style('stroke-width', 4)
                    .style('stroke', 'lightgrey');

                d3.select(self.el).selectAll('#pathText-' + self.util.toLegalHtmlName(link.nodeId) + '-' + className)
                    .style('visibility', 'hidden');
            });

            node.parents.map(function (link) {
                d3.select(self.el).selectAll('#path-' + className + '-' + self.util.toLegalHtmlName(link.nodeId))
                    .style('stroke-width', 4)
                    .style('stroke', 'lightgrey');
                d3.select(self.el).selectAll('#pathText-' + className + '-' + self.util.toLegalHtmlName(link.nodeId))
                    .style('visibility', 'hidden');
            });

            self._unFocusNode('#' + className);
        }
    },

    _focusNode: function (id) {
        var self = this;
        d3.select(self.el).selectAll(id)
            .style('stroke-width', 6)
            .style('stroke', function (d) {
                return d.stroke.darker();
            });
    },

    _unFocusNode: function (id) {
        var self = this;
        d3.select(self.el).selectAll(id)
            .style('stroke-width', 6)
            .style('stroke', function (d) {
                return d.stroke;
            });
    }

};

Graph.fn = Graph.prototype;
