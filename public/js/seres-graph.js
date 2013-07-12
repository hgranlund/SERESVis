function Graph(el, json, expand_node) {
    this.formatter;
    this.width = 1400;
    this.height = 960;
    this.root = {};
    this.nodes;
    this.links;
    this.force;
    this.svg;
    this.auto_id = 0;
    this.updateNodeAndLinkPositions;
    this.parentToChildMap;
    this.init(el);
    this.nodeId;
    this.compute(json, expand_node);
}
// console.log(d.name +" : " + d.isExpanded);
// .alpha(0)
// console.log("LOG:", "this");
// 
Graph.prototype = {

    init: function(el) {
        var self = this;
        self.utilities = window.seres.utilities;
        self.el = el;
        self.nodeId = {};


        self.force = d3.layout.force()
            .size([self.width, self.height])
            .friction(0.9)
            .linkDistance(function(d) {
            var dist = d.source.size / 2;
            if (d.source.isExpanded) dist *= 2;
            // console.log(d.source.name + "--" + d.target.name + " : " + dist);
            return dist;
        })
            .charge(function(d) {
            if (d.isIndividual) return -200;
            if (d === self.root) return -5000;
            return -5000;
        })
            .on("tick", tick)
            .gravity(0)
            .start();


        self.svg = d3.select(el).append("svg")
            .attr("width", self.width)
            .attr("class", "svg")
            .attr("height", self.height);


        self.nodes = self.force.nodes();
        self.links = self.force.links();
        self.node = self.svg.selectAll(".node");
        self.link = self.svg.selectAll(".link");

        function tick(e) {
            // console.log("LOG:", e.alpha);
            if (e.alpha > 0.05) {
                self.updateNodeAndLinkPositions();
                self.updatePositions(e.alpha);
            } else {
                self.center(self.root);
                self.force.alpha(0);
            }
        }
    },


    update: function() {
        var self = this;
        self.force.nodes(self.nodes)
            .links(self.links)
            .start();


        self.link = self.link.data(self.force.links());
        self.node = self.node.data(self.force.nodes());
        self.link.exit().remove();
        self.node.exit().remove();
        self.link.enter().insert("svg:path")
            .attr("stroke-width", 0.3)
            .attr('class', "link");

        self.node.enter().insert("g")
            .attr("class", "node")
            .on('click', fireClick)
            .call(self.force.drag)
            .on("mouseover", fireMouseOver)
            .on("mouseout", fireMouseOut);

        self.circle = self.node.insert("circle")
            .style("fill", function(d) {
            return d.color;
        })
            .attr("id", function(d) {
            return d.name;
        })
            .attr("r", function(d) {
            return d.size;
        })
            .style("fill", function(d) {
            return self.utilities.getColor.toString();
        })
            .style("stroke-width", 10)
            .style("stroke", function(d) {
            return d.stroke;
        });

        self.node.insert("title")
            .text(function(d) {
            return d.name;
        });

        self.node.insert("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .text(function(d) {
            return d.name;
        });

        function fireClick(d) {
            window.seres.controller.fireClick(d);
        }

        function fireMouseOver(d) {
            window.seres.controller.fireMouseOver(d);
        }

        function fireMouseOut(d) {
            window.seres.controller.fireMouseOut(d);
        }
    },

    click: function(id) {
        var self = this;
        var d = self.getNode(id);
        // console.log("LOG:", d.name, "--", d);
        if (d.isInduvidual) {
            return;
        }
        if (!d.isExpanded && d.children) {
            self.expand_node(d);
            self.root.fixed = false;
            self.update();
        } else if (d.isExpanded) {
            self.collapse_node(d);
            self.update();
        } else {
            self.center(d);
        }
        self.make_root(d);
    },

    compute: function(json) {
        var self = this;
        self.formatter = jsonFormatter(json);
        self.parentToChildMap = self.formatter.parentToChildMap;
        self.make_root(self.formatter.createNode('Seres', self.nodes.length));
        self.links = [];
        self.nodes = [self.root];
        self.root.x = self.width / 2;
        self.root.y = self.height / 2;
        self.root.color = self.utilities.getColor(self.root);
        self.root.stroke = self.utilities.getColor(self.root);
        self.force.nodes(self.nodes);
        self.force.links(self.links);
        self.expand_node(self.root);
        self.update();
    },

    // getColor: function(d) {
    //     var self = this;
    //     var color_num = d.name.split('').length + d.children.length;
    //     color_num = color_num*123;
    //     color_num = color_num%21;

    //     return this.color[color_num];
    // },

    collide: function(node, alpha) {
        var self = this,
            r = node.radius + 16,
            nx1 = node.x - r,
            nx2 = node.x + r,
            ny1 = node.y - r,
            ny2 = node.y + r;

        return function(quad, x1, y1, x2, y2) {
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

    handleCollisions: function() {
        var q = d3.geom.quadtree(this.nodes),
            i = 0,
            len = this.nodes.length;

        while (++i < len) {
            q.visit(this.collide(this.nodes[i], 10));
        }
    },

    updateNodeAndLinkPositions: function(duration) {
        duration = duration || 0;
        this.link.transition().duration(duration).attr("d", function(d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        });

        this.node.transition().duration(duration).attr("transform", function(d) {
            // d.x = Math.max(d.size, Math.min(self.width - d.size, d.x));
            // d.y = Math.max(d.size, Math.min(self.height - d.size, d.y));
            return "translate(" + d.x + "," + d.y + ")";
        });
    },


    expand_node: function(d) {
        var n,
            self = this,
            deltaX = d.x + 75,
            deltaY = d.y + 75;
        d.color = self.utilities.getColor(d);
        var node_id_to_update = [];
        d.children.map(function(subject) {
            n = self.formatter.createNode(subject, self.nodes.length);
            n.x = deltaX;
            n.y = deltaY;
            n.color = d.color.brighter();
            n.stroke = d.color;
            self.nodes.push(n);
            node_id_to_update.push(n.index);
        });
        node_id_to_update.map(function(index) {
            self.links = self.links.concat(self.formatter.createLink(index, self.nodes));
        });

        self.updateNodeAndLinkPositions(0);
        self.force.stop();
        for (var i = 0; i < d.children.length * 10; ++i) {
            self.handleCollisions();
            self.force.tick();
        }
        self.updateNodeAndLinkPositions(100);
        self.force.start();

        d.isExpanded = true;
    },


    collapse_node: function(d) {
        // var n,
        //     self = this,
        //     children = d.children;

        // self.nodes.filter(function(node) {
        //     return node.id in children;
        // });

        // self.links.filter(function(l) {
        //     if (l.target.name in self.parentToChildMap) {
        //         if (l.source.name in self.parentToChildMap) {
        //             return true;
        //         };
        //     }
        //     return false;
        // })

        // self.force.stop();
        // self.updateNodeAndLinkPositions(0);
        // for (var i = 0; i < d.children.length * 10; ++i)
        //     self.handleCollisions();
        // self.force.tick();
        // self.updateNodeAndLinkPositions(100);
        // self.force.start();

        // d.isExpanded = false;
    },

    updatePositions: function(alpha) {
        var self = this;
        var k = 0.05 * alpha;
        self.nodes.map(function(d, i) {
            self.cluster(10 * alpha * alpha)(d);
        });
    },

    cluster: function(alpha) {
        var self = this;
        var nameToNodeMap = {};

        self.nodes.map(function(d) {
            nameToNodeMap[d.name] = d;
        });
        return function(d) {
            var parent = d.object.subClassOf;
            var node = nameToNodeMap[parent],
                h,
                ballR,
                deltaX,
                deltaY;

            if (node == d || typeof(node) === 'undefined') return;

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

    make_root: function(d) {
        if (this.root === d) {
            return;
        }
        this.root.fixed = false;
        this.root = d;
        d.fixed = true;
    },

    center: function(node_to_center) {
        var deltaX = this.width / 2 - node_to_center.x,
            deltaY = this.height / 2 - node_to_center.y,
            self = this;


        self.nodes.map(function(d) {
            d.x += deltaX;
            d.y += deltaY;
        });
        self.update();
        self.force.stop();
        self.updateNodeAndLinkPositions(400);
        self.force.start();

    },

    updateLinks: function() {
        var self = this,
            links = [];
        self.nodes.map(function() {
            if (node.isExpanded) {
                node.children.map(function(child) {
                    links.push({
                        'source': node,
                        'target': self.nodes[self.nodeId[child]],
                        'value': objectProperty
                    });
                });
            }
        });
    },

    getNode: function(id) {
        var self = this;
        var nodes = self.nodes.filter(function(d) {
            return d.id === id;
        });
        return nodes[0] || false;
    },

    // nodeExist: function(d) {
    //     return (getNode(id)) {

    //     };
    // },

    highlight: function(id) {
        var self = this,
            d = self.getNode(id);
        if (d.isInduvidual) {
            return;
        }
        d3.select(self.el).selectAll('#' + d.name)
            .style("stroke-width", 10)
            .style("stroke", "red");
    },

    downlight: function(id) {
        var self = this,
            d = self.getNode(id);
        d3.select(self.el).selectAll('#' + d.name)
            .style("stroke-width", 10)
            .style("stroke", function(d) {
            return d.stroke;
        });
    }
};

Graph.fn = Graph.prototype;