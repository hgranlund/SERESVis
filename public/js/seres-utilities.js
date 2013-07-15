window.seres.utilities = function(d3) {

    var color = [d3.rgb("#1f77b4"), d3.rgb("#aec7e8"), d3.rgb("#ff7f0e"), d3.rgb("#ffbb78"), d3.rgb("#2ca02c"), d3.rgb("#98df8a"), d3.rgb("#d62728"), d3.rgb("#ff9896"), d3.rgb("#9467bd"), d3.rgb("#c5b0d5"), d3.rgb("#8c564b"), d3.rgb("#c49c94"), d3.rgb("#e377c2"), d3.rgb("#f7b6d2"), d3.rgb("#7f7f7f"), d3.rgb("#c7c7c7"), d3.rgb("#bcbd22"), d3.rgb("#dbdb8d"), d3.rgb("#17becf"), d3.rgb("#9edae5")];

    var getColor = function(d) {
        var color_num = d.name.split('').length + d.children.length;
        color_num = color_num * 123;
        color_num = color_num % 21;
        return color[color_num];
    };

    var toLegalClassName = function(className) {
        return className.replace(/[^a-z0-9]/g, function(s) {
            var c = s.charCodeAt(0);
            if (c == 32) return '-';
            if (c >= 65 && c <= 90) return '_' + s.toLowerCase();
            return '__' + ('000' + c.toString(16)).slice(-4);
        });
    };

    return {
        'getColor': getColor,
        'toLegalClassName': toLegalClassName
    };

}(window.d3);
