window.seres.visualGraph = function(query, d3, utilities) {

    var formatter;

    var startGraph = function(json) {
        formatter = jsonFormatter(json);
        parentToChildMap = formatter.getParentToChildMap().parentToChildMap;
        force.nodes([formatter.createNode('Seres', 0)]);
        nodes = force.nodes();
        make_root(nodes[0]);
        click(nodes[0]);
        update();
    };

    var width = 960,
        height = 960,
        root = {},
        graph_orig,
        graphObject,
        parentToChildMap,
        expanded_nodes = [];


    var fill = d3.scale.category20();

    var force = d3.layout.force()
        .size([width, height])
    // .alpha(0)
    .linkStrength(1)
        .linkDistance(function(d, i) {
        return (d.target.isExpanded ? 200 : 5);
    })
        .charge(function(d) {
        return (d.isExpanded ? -400 : -200);
    })
        .on("tick", tick)
    // .friction(0)
    .gravity(0)
        .start();


    var svg = d3.select("#graph-container").append("svg")
        .attr("width", width)
        .attr("height", height);



    var nodes = force.nodes(),
        links = force.links(),
        node = svg.selectAll(".node"),
        link = svg.selectAll(".link");



    function tick(e) {
        root.x = width / 2;
        root.y = height / 2;

        var k = 0.05 * e.alpha;

        nodes.map(function(d, i) {
            cluster(10 * e.alpha * e.alpha)(d);
            d.x += (root.x - d.x) * k;
            d.y += (root.y - d.y) * k;


            // body...
        });

        console.log(e.alpha);
        link
            .attr("x1", function(d) {
            return d.source.x;
        })
            .attr("y1", function(d) {
            return d.source.y;
        })
            .attr("x2", function(d) {
            return d.target.x;
        })
            .attr("y2", function(d) {
            return d.target.y;
        });

        node.attr("cx", function(d) {
            return d.x = Math.max(d.size, Math.min(height - d.size, d.x));
        });
        node.attr("cy", function(d) {
            return d.y = Math.max(d.size, Math.min(height - d.size, d.y));
        });

        // node.attr("transform", function(d) {
        //     return "translate(" + d.x + "," + d.y + ")";
        // });
        // node.attr("cx", function(d) {
        //     return d.x = Math.max(d.size, Math.min(width - d.size, d.x));
        // })
        //     .attr("cy", function(d) {
        //     return d.y = Math.max(d.size, Math.min(height - d.size, d.y));
        // });

    };



    function update() {
        link = link.data(links);

        link.enter().insert("line")
            .attr("stroke-width", .3)
            .attr('class', "link");


        node = node.data(nodes);

        node.enter().insert("circle")
            .attr("class", "node")
            .attr("r", function(d) {
            return d.size;
        })
            .on('click', click)
            .attr("cx", function(d) {
            return d.x;
        })
            .attr("cy", function(d) {
            return d.y;
        })
            .call(force.drag);


        node.append("title")
            .text(function(d) {
            return d.name;
        });

        force.start();
    }

    function click(d) {
        if (!d.isExpanded && parentToChildMap.hasOwnProperty(d.name)) {
            expand_node(d);
            update();
        }
        make_root(d);
        //seres.utilities.zoom();
    }

    function expand_node(d) {
        d.isExpanded = true;
        parentToChildMap[d.name].map(function(subject) {
            nodes.push(formatter.createNode(subject, nodes.length));
        });

        parentToChildMap[d.name].map(function(subject) {
            links = links.concat(formatter.createLink(subject, nodes));
        });
    }


    // Move d to be adjacent to the cluster node.

    function cluster(alpha) {
        var nameToNodeMap = {};

        nodes.map(function(d) {
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
    }

    function make_root(node) {
        if (root === node) {
            return;
        }
        root.fixed = false;
        root = node;
        node.fixed = true;
        node.x = width / 2;
        node.y = height / 2;
    }

    return {
        'startGraph': startGraph
    };



}(window.seres.query, window.d3);