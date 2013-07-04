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
    .linkDistance(80)
        .charge(-300)
        .on("tick", tick)
        .friction(.5)
        // .gravity(0)
        .start();


    var svg = d3.select("#graph-container").append("svg")
        .attr("width", width)
        .attr("height", height);



    var nodes = force.nodes(),
        links = force.links(),
        node = svg.selectAll(".node"),
        link = svg.selectAll(".link");



    function tick() {
        node.attr("cx", function(d) {
            return d.x = Math.max(d.size, Math.min(width - d.size, d.x));
        })
            .attr("cy", function(d) {
            return d.y = Math.max(d.size, Math.min(height - d.size, d.y));
        });
        link.attr("x1", function(d) {
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
        };
        make_root(d);
        //seres.utilities.zoom();
    };

    function expand_node(d) {
        d.isExpanded = true;
        parentToChildMap[d.name].map(function(subject) {
            nodes.push(formatter.createNode(subject, nodes.length));
        });

        parentToChildMap[d.name].map(function(subject) {
            links = links.concat(formatter.createLink(subject, nodes));
        });
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