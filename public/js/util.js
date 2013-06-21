'use strict';

window.seres.util = function() {
    var urlStart = "http://localhost:3030/ds/query?query=";
    var urlEnd = "&output=json&stylesheet=%2Fxml-to-html.xsl";

    var util = {
        vertion:"0.0.1"
    }

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

    util.parseFusekiJson = function (fusekiJson) {
        return {'nodes':{},'links':{}};
    };


    return util;
}();