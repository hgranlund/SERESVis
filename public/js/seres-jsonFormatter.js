function jsonFormatter(json_arg) {
    var json = json_arg,
        parentToChildMap;


    var filterSparqlJson = function(dataPropertyToFilter) {
        var filtered = {};
        for (var element in json) {
            if (json[element].data[dataPropertyToFilter]) {
                filtered[element] = json[element];
            }
        }
        return filtered;
    };

    var getParentToChildMap = function() {
        parentToChildMap = {};
        var parent;
        for (var child in json) {
            if (json[child].object.subClassOf) {
                parent = json[child].object.subClassOf;
                if (!(parent in parentToChildMap)) parentToChildMap[parent] = [];
                parentToChildMap[parent].push(child);
            }
            if (json[child].object.type) {
                parentToInduvidual = json[child].object.type;
                if (!(parentToInduvidual in parentToChildMap)) parentToChildMap[parentToInduvidual] = [];
                parentToChildMap[parentToInduvidual].push(child);
            }
        }
        return parentToChildMap;
    };

    var toGraphObject = function(expanded_nodes) {
        var links = [];
        var nodes = [];
        var node;
        expanded_nodes.map(function(subject) {
            nodes.push(createNode(subject, nodes.length));
        });
        for (var i = 0; i < nodes.length; i++) {
            links = links.concat(createLink(i, nodes));
        };

        return {
            'links': links,
            'nodes': nodes
        };
    };


    var populateElement = function(parent, parentsToChild, parentToInduviduals) {
        var elm = createNode(parent, 0);
        elm.name = parent;
        if (parent in parentToInduviduals) {
            elm.individuals = parentToInduviduals[parent].map(function(individual) {
                return {
                    'name': individual
                };
            });
        }
        if (parent in parentsToChild) {
            elm.children = [];
            parentsToChild[parent].map(function(child) {
                elm.children.push(populateElement(child, parentsToChild, parentToInduviduals));
            });
        }
        return elm;
    };

    var toTreeObject = function() {
        parentsToChild = {};
        childs = {};
        parentToInduviduals = {};
        treeJson = [];
        var parent;
        for (var child in json) {
            if (json[child].object.subClassOf) {
                parent = json[child].object.subClassOf;
                if (!(parent in parentsToChild)) parentsToChild[parent] = [];
                parentsToChild[parent].push(child);
                childs[child] = parent;
            }
            if (json[child].object.type !== "Class") {
                parentToInduvidual = json[child].object.type;
                if (!(parentToInduvidual in parentToInduviduals)) parentToInduviduals[parentToInduvidual] = [];
                parentToInduviduals[parentToInduvidual].push(child);
            }
        }
        for (var root in parentsToChild) {
            if (!(root in childs)) {
                treeJson.push(populateElement(root, parentsToChild, parentToInduviduals));
            }
        }
        return treeJson;
    };



    var createNode = function(subject, nodes_id) {
        var subject_obj = (json.hasOwnProperty(subject) ? json[subject] : {
            'data': {},
            'object': {}
        });
        if (json.hasOwnProperty(subject)) json[subject].id = nodes_id;
        subject = subject || "Unknown";
        var node = $.extend({}, subject_obj);
        node.size = 10;
        node.name = subject;
        node.id = nodes_id;
        node.isInduvidual = false;
        node.isExpanded = false;
        if (node.object.type) {
            if (node.object.type !== "Class") {
                if (node.object.type in parentToChildMap) {
                    node.isInduvidual = true;
                    node.size=5;
                }
            }
        }
        if (node.object.type === "Class") node.size = 30;
        return node;
    };

    var createLink = function(id, nodes) {
        var object,
            object_id,
            subject_id = id,
            links = [];
        var object_name = nodes[subject_id].object.subClassOf || nodes[subject_id].object.type || false;
        if (object_name && object_name !== "Class") {
            nodes.map(function(object) {
                if (object.name === object_name) {
                    links.push({
                        'source': nodes[subject_id],
                        'target': object
                    });
                };
            });
        };
        return links;
    };

    parentToChildMap = getParentToChildMap();

    return {
        'filterSparqlJson': filterSparqlJson,
        'toGraphObject': toGraphObject,
        'parentToChildMap': parentToChildMap,
        'toTreeObject': toTreeObject,
        'createNode': createNode,
        'createLink': createLink
    };
}