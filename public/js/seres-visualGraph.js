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

    var width = 1400,
        height = 960,
        root = {},
        graph_orig,
        graphObject,
        parentToChildMap,
        expanded_nodes = [];


    var fill = d3.scale.category20();

    var force = d3.layout.force()
        .size([width, height])
        .linkStrength(1)
    // .friction(0)
    // .alpha(0)
    .linkDistance(function(d) {
        // console.log("LOG:", "this");
        console.log(d.source + "--" + d.target + " : " + d.target.size);
        return (d.target.isExpanded ? 20 : 10);
    })
        .charge(function(d) {
        // console.log(d.name +" : " + d.isExpanded);
        return (d.isExpanded ? -500 : -50);
    })
        .on("tick", tick)
        .gravity(0)
        .start();


    var svg = d3.select("#graph-container").append("svg")
        .attr("width", width)
        .attr("class", "svg")
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

        });
        updateNodeAndLinkPositions();
        // console.log(e.alpha);


    }

    function updateNodeAndLinkPositions(duration) {
        duration = duration || 0;
        link.transition().duration(duration).attr("d", function(d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);

            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        });
        node.transition().duration(duration).attr("transform", function(d) {
            d.x = Math.max(d.size, Math.min(height - d.size, d.x));
            d.y = Math.max(d.size, Math.min(height - d.size, d.y));
            return "translate(" + d.x + "," + d.y + ")";
        });
    }



    function update() {
        link = link.data(links);

        link.enter().insert("svg:path")
            .attr("stroke-width", .3)
            .attr('class', "link");


        node = node.data(nodes);

        node.enter().insert("svg:circle")
            .attr("class", "node")
            .attr("r", function(d) {
            return d.size;
        })
            .on('click', click)
            .call(force.drag);


        node.append("title")
            .text(function(d) {
            return d.name;
        });


        node.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
        // .style("display", "none")
        .text(function(d) {
            return self.text;
        });
        force.start();
    }

    function click(d) {
        if (!d.isExpanded && parentToChildMap.hasOwnProperty(d.name)) {
            expand_node(d);
            update();
        }
        make_root(d);
    }

    function expand_node(d) {
        var n;

        deltaX = d.x - width / 2 + 75;
        deltaY = d.y - height / 2 + 75;
        parentToChildMap[d.name].map(function(subject) {
            n = formatter.createNode(subject, nodes.length);
            n.x = deltaX;
            n.y = deltaY;
            nodes.push(n);
        });
        parentToChildMap[d.name].map(function(subject) {
            links = links.concat(formatter.createLink(subject, nodes));
        });

        force.start();
        for (var i = 0; i < parentToChildMap[d.name].length * 10; ++i) force.tick();
        updateNodeAndLinkPositions(100);
        force.stop();

        d.isExpanded = true;
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