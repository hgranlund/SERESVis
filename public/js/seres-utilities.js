window.seres.utilities = function (d3) {

    var color = [d3.rgb("#1f77b4"), d3.rgb("#aec7e8"), d3.rgb("#ff7f0e"), d3.rgb("#ffbb78"), d3.rgb("#2ca02c"), d3.rgb("#98df8a"), d3.rgb("#d62728"), d3.rgb("#ff9896"), d3.rgb("#9467bd"), d3.rgb("#c5b0d5"), d3.rgb("#8c564b"), d3.rgb("#c49c94"), d3.rgb("#e377c2"), d3.rgb("#f7b6d2"), d3.rgb("#7f7f7f"), d3.rgb("#c7c7c7"), d3.rgb("#bcbd22"), d3.rgb("#dbdb8d"), d3.rgb("#17becf"), d3.rgb("#9edae5")];

    var getColor = function (d) {
        var children = d.children || d.individuals || [];
        var colorNum = d.name.split('').length + children.length;
        colorNum = colorNum * 123;
        colorNum = colorNum % 21;
        return color[colorNum];
    };

    var toLegalClassName = function (className) {
        className = className || '';
        className = className.toString().replace(/[!\"#$%&_'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '-');
        return className.toLowerCase();
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

    return {
        getColor: getColor,
        toLegalClassName: toLegalClassName,
        getPropertyValue: getPropertyValue,
        addNodeToNodes: addNodeToNodes,
        getNode: getNode
    };


}(window.d3);
