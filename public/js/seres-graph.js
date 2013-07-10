function Graph(el, json) {
    this.formatter;
    this.utilities = window.seres.utilities;
    this.width = 1400;
    this.height = 960;
    this.root = {};
    this.parentToChildMap;
    this.nodes;
    this.links;
    this.force;
    this.svg;
    this.updateNodeAndLinkPositions;
    this.parentToChildMap;
    this.init(el);
    this.compute(json);
}
// console.log(d.name +" : " + d.isExpanded);
// .alpha(0)
// console.log("LOG:", "this");
// console.log(d.source + "--" + d.target + " : " + d.target.size);
// 
Graph.prototype = {


    init: function(el) {
        var self = this;
        self.color = d3.scale.category20b();
        self.force = d3.layout.force()
            .size([self.width, self.height])
            .linkStrength(1)
            .friction(.5)
            .linkDistance(function(d) {
            return (d.target.isExpanded ? 20 : 10);
        })
            .charge(function(d) {
            return (d.isExpanded ? -5000 : -1000);
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
                self.updatePositions(e.alpha)
                self.updateNodeAndLinkPositions();
            } else {
                self.center(self.root);
                self.force.alpha(0);
            };
        };

    },


    compute: function(json) {
        var self = this;
        self.formatter = jsonFormatter(json);
        self.parentToChildMap = self.formatter.parentToChildMap;
        self.force.nodes([self.createNode('Seres', 0)]);
        self.nodes = self.force.nodes();
        self.make_root(self.nodes[0]);
        self.expand_node(self.nodes[0]);
        self.update();
    },


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
        }
    },

    handleCollisions: function() {
        var q = d3.geom.quadtree(this.nodes),
            i = 0,
            len = this.nodes.length;

        while (++i < len) {
            q.visit(this.collide(this.nodes[i], 20));
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
            // d.x = Math.max(d.size, Math.min(this.height - d.size, d.x));
            // d.y = Math.max(d.size, Math.min(this.height - d.size, d.y));
            return "translate(" + d.x + "," + d.y + ")";
        });
    },

    update: function() {
        var self = this;
        self.link = self.link.data(self.links);

        self.link.enter().append("svg:path")
            .attr("stroke-width", .3)
            .attr('class', "link");

        self.node = self.node.data(self.nodes);
        self.node.enter().append("svg:circle")
            .attr("class", "node")
            .attr("id", function(d) {
            return d.name;
        })
            .attr("r", function(d) {
            return d.size;
        })
            .on('click', click)
            .call(self.force.drag)
            .style("fill", function(d){
                return d.color;
            })
            .on("mouseover", seres.utilities.highlight)
            .on("mouseout", seres.utilities.downlight);

        self.node.append("title")
            .text(function(d) {
            return d.name;
        });

        self.node.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
        // .style("display", "none")
        .text(function(d) {
            return self.text;
        });
        self.force.start();



        function click(d) {
            console.log("LOG:", d.name, "--", d);
            if (!d.isExpanded && d.hasOwnProperty('children')) {
                self.expand_node(d);
                self.root.fixed = false;
                self.update();
            } else {
                self.center(d);
            }
            self.make_root(d);
        };
    },

    // getColor: function(d) {

    //     return self.color(color_num);
    // },

    expand_node: function(d) {
        var n,
            self = this,
            deltaX = d.x - self.width / 2 + 75,
            deltaY = d.y - self.height / 2 + 75;
        d.color = d3.rgb(self.color());
        d.children.map(function(subject) {
            n = self.createNode(subject, self.nodes.length);
            n.x = deltaX;
            n.y = deltaY;
            n.color = d.color.brighter();
            self.nodes.push(n);
        });
        d.children.map(function(subject) {
            self.links = self.links.concat(self.formatter.createLink(subject, self.nodes));
        });

        self.force.stop();
        self.updateNodeAndLinkPositions(0);
        for (var i = 0; i < d.children.length * 10; ++i)
            self.handleCollisions();
        self.force.tick();
        self.updateNodeAndLinkPositions(100);
        self.force.start();

        d.isExpanded = true;
    },

    collapse_node: function(d) {
        var n,
            self = this,
            deltaX = d.x - self.width / 2 + 75,
            deltaY = d.y - self.height / 2 + 75;
        d.children.map(function(subject) {
            n = self.createNode(subject, self.nodes.length);
            n.x = deltaX;
            n.y = deltaY;
            self.nodes.push(n);
        });
        d.children.map(function(subject) {
            self.links = self.links.concat(self.formatter.createLink(subject, self.nodes));
        });

        self.force.stop();
        self.updateNodeAndLinkPositions(0);
        for (var i = 0; i < d.children.length * 10; ++i)
            self.handleCollisions();
        self.force.tick();
        self.updateNodeAndLinkPositions(100);
        self.force.start();

        d.isExpanded = true;
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
            var parent = d.subClassOf;
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

    center: function(d) {
        var deltaX = this.width / 2 - d.x,
            deltaY = this.height / 2 - d.y,
            self = this;
        self.nodes.map(function(d) {
            d.x += deltaX;
            d.y += deltaY;
        });
        self.force.stop()
        self.updateNodeAndLinkPositions(500);
        self.force.start();
    },

    createNode: function(subject, id) {
        var self = this;
        var node = self.formatter.createNode(subject, id);
        node.children = [];
        if (self.formatter.parentToChildMap.hasOwnProperty(subject)) {
            node.children = self.formatter.parentToChildMap[subject];
        }
        // if (self.formatter.parentToChildMap.hasOwnProperty(subject)) {
        //     node.children = self.formatter.parentToChildMap[subject];
        // }
        return node;
    }
};

Graph.fn = Graph.prototype;