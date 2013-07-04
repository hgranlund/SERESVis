window.seres.visualTree = function(query, d3, utilities) {


    var w = 960,
        h = 5300,
        i = 0,
        legendheight = 100,
        legendwidth = 400,
        barHeight = 20,
        barWidth = w * .3,
        duration = 400,
        formatter,
        root;

    var legends = [{
            "color": "#3c3c3c",
            "text": "Superklasser"
        }, {
            "color": "#c2bcbc",
            "text": "Subklasser"
        }, {
            "color": "#ffffff",
            "text": "Subsubklasser"
        }
    ]

    var tree = d3.layout.tree()
        .size([h, 100]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) {
        return [d.y, d.x];
    });

    var vis = d3.select("#indented_tree").append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")
        .attr("transform", "translate(20,30)");

    var svg = d3.select("#legends")
        .append("svg")
        .attr("width", legendwidth)
        .attr("height", legendheight);

    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("height", 30)
        .attr("width", 30)
        .attr('transform', 'translate(-20,50)');

    legend.selectAll('rect')
        .data(legends)
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

    legend.selectAll('text')
        .data(legends)
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


    // var keys = Object.keys(json);
    // var keydata = [];
    // for (i = 0; i < keys.length; i++) {
    //     keydata[i] = json[keys[i]].data;
    // }

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

        root.children.forEach(click);
        d3.select("#expand-all").classed("active", true);
    });


    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }

    function color(d) {
        return d._children ? "#3c3c3c" : d.children ? "#c2bcbc" : "#ffffff";
    }

    function toggle(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
    }

    function toggleAll(d) {
        if (d.children) {
            d.children.forEach(toggleAll);
            toggle(d);
        }
    }

    var startTree = function(json) {
        formatter = jsonFormatter(json);
        root = formatter.toTreeObject()[0];
        root.x0 = 0;
        root.y0 = 0;
        update(root);
    };
    var update = function(source) {
        var nodes = tree.nodes(root);

        // Compute the "layout".
        nodes.forEach(function(n, i) {
            n.x = i * barHeight;
        });

        // Update the nodes…
        var node = vis.selectAll("g.node")
            .data(nodes, function(d) {
            return d.id || (d.id = ++i);
        });

        var nodeEnter = node.enter().append("svg:g")
            .attr("class", "node")
            .attr("transform", function(d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
            .style("opacity", 1e-6);

        // Enter any new nodes at the parent's previous position.
        nodeEnter.append("svg:rect")
            .attr("y", -barHeight / 2)
            .attr("height", barHeight)
            .attr("width", barWidth)
            .style("fill", color)
            .on("click", click)
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
            .duration(duration)
            .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
        })
            .style("opacity", 1);

        node.transition()
            .duration(duration)
            .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
        })
            .style("opacity", 1)
            .select("rect")
            .style("fill", color);

        // Transition exiting nodes to the parent's new position.
        node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
            return "translate(" + source.y + "," + source.x + ")";
        })
            .style("opacity", 1e-6)
            .remove();

        // Update the links…
        var link = vis.selectAll("path.link")
            .data(tree.links(nodes), function(d) {
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
            return diagonal({
                source: o,
                target: o
            });
        })
            .transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
            var o = {
                x: source.x,
                y: source.y
            };
            return diagonal({
                source: o,
                target: o
            });
        })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    };

    return {
        'update': update,
        'startTree': startTree
    };
}(window.seres.query, window.d3, window.seres.utilities);