window.seres.query = function() {
    'use strict';
    // var urlEnd = "&output=xml&stylesheet=%2Fxml-to-html.xsl&force-accept=text%2Fplain";

    var query = {
        vertion: "0.0.1"
    };
    //util
    //
    query.endsWith = function(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };
    // end util

    query.getJsonFromUrl = function(url) {
        var data = {};
        if (url === "" | url === null) {
            return data;
        }
        $.ajax({

            dataType: "json",
            url: url,
            async: false,
            success: function(fusekiJson) {
                data = fusekiJson;
            },
            error: function(e) {
                new Error('Error connecting to endpoint');
            }
        });

        return data;
    };

    query.sparqlQueryParser = function(queryString, host, output, stylesheet) {
        if (queryString === "" | queryString === null) return null;
        if (typeof(host) === 'undefined') host = "http://localhost:3030/ds/";
        if (typeof(output) === 'undefined') output = "json";
        if (typeof(stylesheet) === 'undefined') stylesheet = "%2Fxml-to-html.xsl";
        if (!query.endsWith(host, '/')) host += '/';
        var url = [host, 'query?query=', queryString, '&output=', output, '&stylesheet=', stylesheet];
        return url.join('');
    };

    query.getElementNameFromUri = function(url) {
        if (url === "" | url === null | (typeof url) != "string") {
            return "Unknown";
        }
        var url_split = url.split('#');
        if (url_split.length < 2) return url;
        return url_split[url_split.length - 1];
    };

    query.parseSelectJson = function(fusekiJson) {
        var elements = {};
        if (fusekiJson === null | typeof(fusekiJson.results) === 'undefined') {
            return elements;
        }
        var vars = fusekiJson.head.vars;
        if (vars.length < 3) throw new Error("Should contain tripels");

        function getValue(index, triple) {
            return query.getElementNameFromUri(triple[vars[index]].value);
        }

        fusekiJson.results.bindings.map(function(triple) {
            elements[getValue(0, triple)] = {
                'object': {},
                'data': {}
            };
        });
        fusekiJson.results.bindings.map(function(triple) {
            if (triple[vars[2]].type === 'uri') {
                elements[getValue(0, triple)].object[getValue(1, triple)] = getValue(2, triple);
            } else {
                elements[getValue(0, triple)].data[getValue(1, triple)] = getValue(2, triple);
            }
        });
        return elements;
    };

    query.parseGraphJson = function(json) {
        var elements = {};
        var subject, predicat, objectValue;
        if (json === null | $.isEmptyObject(json)) {
            return elements;
        }

        function getValue(index, key) {
            return query.getElementNameFromUri(value);
        }

        for (var key1 in json) {
            elements[query.getElementNameFromUri(key1)] = {
                'object': {},
                'data': {}
            };
        }
        for (var key2 in json) {
            subject = query.getElementNameFromUri(key2);
            for (var value in json[key2]) {
                predicat = query.getElementNameFromUri(value);
                objectValue = query.getElementNameFromUri(json[key2][value][0].value);
                if (json[key2][value][0].type === "uri") {
                    elements[subject].object[predicat] = objectValue;
                } else {
                    elements[subject].data[predicat] = objectValue;
                }
            }
            return elements;
        }
    };
    query.execute = function(queryString, host, output, stylesheet) {
        if (queryString === null | queryString === "") return ;
        var json = query.getJsonFromUrl(query.sparqlQueryParser(queryString, host));
        if (queryString.toLowerCase().match("\bselect\b")) {
            return query.parseSelectJson(json);
        }
        return query.parseGraphJson(json);
    };
    return query;
}();