window.seres.utilities = function (d3) {

    var color = d3.scale.category20();

    var _color = function (number) {
        return d3.rgb(color(number));
    };

    var _getColor = function (d) {
        var colorNum = d.name.split('').length * 2,
            parent,
            name = d.name;

        parent = getPropertyValue('subClassOf', d.object) || getPropertyValue('type', d.object);
        if (parent) {
            name += parent;
        }
        for (var i = 0; i < name.length; i++) {
            colorNum += name.charCodeAt(i);
        }
        colorNum += 14;
        colorNum = colorNum % 20;
        return _color(colorNum);
    };

    var getColor = function (d, parent) {
        if (d.isIndividual || d.isProperty) {
            if (parent) {
                return _getColor(parent);
            } else {
                return _getColor(d);
            }
            return _getColor(d);
        } else {
            return _getColor(d);
        }
    };

    var getStroke = function (d, parent) {
        return _getColor(parent);
    };

    var getParentColor = function (d, formatter) {
        var parentId = getPropertyValue('subClassOf', d.object);
        if (parentId) {
            var parentNode = formatter.createNode(parentId, 0);
            return _getColor(parentNode);
        } else {
            return getColor(d);
        }
    };

    var getParent = function (d, formatter) {
        var parentId = getPropertyValue('subClassOf', d.object) || getPropertyValue('type', d.object);
        if (parentId && !d.isClass) {
            return formatter.createNode(parentId, 0);
        } else {
            return null;
        }
    };

    var toLegalHtmlName = function (className) {
        className = className || '';
        className = className.toString().replace(/[!\'#$%&_'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '-');
        return className;
    };

    var getPropertyValue = function (name, object) {
        if (typeof (object) === 'undefined') {
            return null;
        } else if (object.hasOwnProperty(name)) {
            return object[name];
        } else {
            return null;
        }
    };

    var addNodeToNodes = function (node, nodes) {
        var equalNode = getNode(node.id, nodes);
        if (!equalNode) {
            nodes.push(node);
            return true;
        }
        return false;
    };

    var getNode = function (id, nodes) {
        if (!id) {
            return;
        }
        var equalNodes = nodes.filter(function (d) {
            return d.id === id;
        });
        return equalNodes[0] || false;
    };

    var getLinkWithNodeId = function (id, relList) {
        for (var i = 0; i < relList.length; i++) {
            if (relList[i].nodeId === id) {
                return relList[i];
            }
        }
        return false;
    };

    var getLinkWithName = function (name, relList) {
        for (var i = 0; i < relList.length; i++) {
            if (relList[i].link === name) {
                return relList[i];
            }
        }
        return false;
    };


    var isEmpty = function (obj) {

        if (obj == null) {
            return true;
        }
        if (obj.length && obj.length > 0) {
            return false;
        }
        if (obj.length === 0) {
            return true;
        }
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }
        return true;
    }


    return {
        getColor: getColor,
        getStroke: getStroke,
        toLegalHtmlName: toLegalHtmlName,
        getPropertyValue: getPropertyValue,
        addNodeToNodes: addNodeToNodes,
        getNode: getNode,
        getParentColor: getParentColor,
        getLinkWithNodeId: getLinkWithNodeId,
        isEmpty: isEmpty,
        getParent: getParent

    };


}(window.d3);
