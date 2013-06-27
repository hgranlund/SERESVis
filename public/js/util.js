window.seres.util = function() {
    'use strict';
    var urlStart = "http://localhost:3030/ds/query?query=";
    var urlEnd = "&output=json&stylesheet=%2Fxml-to-html.xsl";
    // var urlEnd = "&output=xml&stylesheet=%2Fxml-to-html.xsl&force-accept=text%2Fplain";

    var util = {
        vertion:"0.0.1"
    };

    util.getJsonFromUrl = function(url) {
        if (url === "" | url === null) {
            return null;
        }
        var data = $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
        return data;
    };

    util.sparqlQueryParser = function(query) {
        if (query === "" | query === null) {
            return null;
        }
        return urlStart+query+urlEnd;
    };

    util.getElementNameFromUri = function(url){
        if (url === "" | url === null | (typeof url) != "string"  ){
            return "Unknown";
        }
        var url_split =url.split('#');
        return url_split[url_split.lenght-1];
    };

    util.parseFusekiJson = function (fusekiJson) {
        if (fusekiJson === null | typeof(fusekiJson.results) === 'undefined') {
            return {};
        }
        var vars = fusekiJson.head.vars;
        if (vars.length < 3) throw new Error("Should contain triplejson");
        var elements = {};
        fusekiJson.results.bindings.map(function(triple) {
            elements[triple[vars[0]].value] = {'objects':{}, 'data':{}};
        });
        fusekiJson.results.bindings.map(function(triple) {
            if (elements[triple[vars[2]]]) {
                elements[triple[vars[0]].value].objects[triple[vars[1]].value]=triple[vars[2]].value;
            }
            else{
                elements[triple[vars[0]].value].data[triple[vars[1]].value]=triple[vars[2]].value;
            }
        });
        return elements;
    };
    return util;
}();