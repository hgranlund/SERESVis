window.seres.visualGraph = function(query, d3) {

    var filterSparqlJson = function(json, dataPropertyToFilter) {
        var filtered = {};
        for (var element in json) {
            if (json[element].data[dataPropertyToFilter]) {
                filtered[element] = json[element];
            }
        }
        return filtered;
    };

    var getParentToChildMap = function(json) {
        parentToChildMap = {};
        parentToInduvidualsMap = {};
        var parent;
        for (var child in json) {
            if (json[child].object.subClassOf) {
                parent = json[child].object.subClassOf;
                if (!(parent in parentToChildMap)) parentToChildMap[parent] = [];
                parentToChildMap[parent].push(child);
                childs[child] = parent;
            }
            if (json[child].object.type) {
                parentToInduvidual = json[child].object.type;
                if (!(parentToInduvidual in parentToInduvidualsMap)) parentToInduvidualsMap[parentToInduvidual] = [];
                parentToInduvidualsMap[parentToInduvidual].push(child);
            }
        }
        return {
            'parentToChildMap': parentToChildMap,
            'parentToInduvidualsMap': parentToInduvidualsMap
        };
    };


    var toGraphObject = function(json, expanded_nodes) {
        var links = [];
        var nodes = [];
        var node;
        expanded_nodes.map(function(subject) {
            nodes.push(createNode(json, subject, nodes.length));
        });

        expanded_nodes.map(function(subject) {
            links = links.concat(createLink(json, subject, nodes));
        });

        return {
            'links': links,
            'nodes': nodes
        };
    };

    var createNode = function(json, subject, nodes_id) {
        var subject_obj = (json.hasOwnProperty(subject) ? json[subject] : {
            'data': {},
            'object': {}
        });
        var node = $.extend({}, subject_obj.data, subject_obj.object);
        node.size = 10;
        node.name = subject;
        node.id = nodes_id;
        json[subject].id = nodes_id;
        if (node.type === "Class") node.size = 20;
        return node;
    };

    var createLink = function(json, subject, nodes) {
        var object,
            object_id,
            subject_id = json[subject].id,
            links = [];
        for (var objectProperty in json[subject].object) {
            object = json[subject].object[objectProperty];
            if (json.hasOwnProperty(object)) {
                object_id = json[object].id;
                if (nodes[object_id] && nodes[object_id].name === object) {
                    links.push({
                        'source': nodes[subject_id],
                        'target': nodes[object_id],
                        'value': objectProperty
                    });
                };

            };
        }
        return links;
    }

    var width = 960,
        height = 960,
        json,
        root = {},
        graph_orig,
        graphObject,
        parentToChildMap,
        expanded_nodes = [];

    var fill = d3.scale.category20();

    var force = d3.layout.force()
        .size([width, height])
        .linkDistance(100)
        .charge(-600)
        .on("tick", tick);


    var svg = d3.select("#graph-container").append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("rect")
        .attr("width", width)
        .attr("height", height);

    var nodes = force.nodes(),
        links = force.links(),
        node = svg.selectAll(".node"),
        link = svg.selectAll(".link");


    var startGraph = function(json_arg, graph) {
        json = json_arg;
        graph_orig = graph;
        getParentToChildMap = getParentToChildMap(json).parentToChildMap;
        force.nodes([createNode(json, 'Seres', 0)]);
        json['Seres'].id = nodes.length;
        nodes = force.nodes();
        make_root(nodes[0]);
        click(nodes[0]);
        update();
    };


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


    }

    function update() {
        link = link.data(links);

        link.enter().insert("line", ".node")
            .attr("class", "link");

        node = node.data(nodes);

        node.enter().insert("circle", ".cursor")
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

        force.start();
    }

    function click(d) {
        if (expanded_nodes.indexOf(d) === -1) {
            expand_node(d);
            expanded_nodes.push(d);
            update();
        };
    };

    function expand_node(d) {
        parentToChildMap[d.name].map(function(subject) {
            nodes.push(createNode(json, subject, nodes.length));
        });

        parentToChildMap[d.name].map(function(subject) {
            links = links.concat(createLink(json, subject, nodes));
        });
    }

    function make_root(node) {
        if (root === node) {
            return;
        };
        root.fixed = false;
        root = node;
        node.fixed = true;
        node.x = width / 2;
        node.y = height / 2;
    }

    return {
        'toGraphObject': toGraphObject,
        'filterSparqlJson': filterSparqlJson,
        'startGraph': startGraph
    };



}(window.seres.query, window.d3);