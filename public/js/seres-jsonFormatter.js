function jsonFormatter(json_arg) {
    var json = json_arg;


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


    var toGraphObject = function(expanded_nodes) {
        var links = [];
        var nodes = [];
        var node;
        expanded_nodes.map(function(subject) {
            nodes.push(createNode(subject, nodes.length));
        });

        expanded_nodes.map(function(subject) {
            links = links.concat(createLink(subject, nodes));
        });

        return {
            'links': links,
            'nodes': nodes
        };
    };


    var populateElement = function(parent, parentsToChild, parentToInduviduals) {
        var elm = {};
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
        // delete parentsToChild[parent];
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
            if (json[child].object.type) {
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
        subject= subject || "Unknown";
        var node = $.extend({}, subject_obj.object, subject_obj.data);
        node.size = 10;
        node.name = subject;
        node.id = nodes_id;
        node.isExpanded = false;
        if (node.type === "Class") node.size = 20;
        return node;
    };

    var createLink = function(subject, nodes) {
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
                }

            }
        }
        return links;
    };

    return {
        'filterSparqlJson': filterSparqlJson,
        'toGraphObject': toGraphObject,
        'getParentToChildMap': getParentToChildMap,
        'toTreeObject': toTreeObject,
        'createNode': createNode,
        'createLink': createLink
    };
}