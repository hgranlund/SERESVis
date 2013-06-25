var util = window.seres.util;
var testValues = window.seres.testValues;
// var testValues =window.seres.testValues;
describe("A suite", function() {
    it("contains spec with an expectation", function() {
        expect(true).toBe(true);
    });
});

describe('getJsonFromUrl', function() {
    var url = "http://localhost:3030/ds/query?query=select+*+where+%7B%3Fd+%3Ff+%3Fg%7D&output=json&stylesheet=%2Fxml-to-html.xsl";
    var fakeData;

    beforeEach(function() {
        fakeData = $.getJSON("testFiles/fusekiJson.json", function(json) {});
        spyOn($, "ajax").andReturn(fakeData);
    });

    it('should be defined', function() {
        expect(util.getJsonFromUrl).toBeDefined();
    });

    it('should return null if url is empty', function() {
        expect(util.getJsonFromUrl("")).toBe(null);
    });

    it("should make an AJAX request to the correct URL", function() {
        util.getJsonFromUrl(url);
        expect($.ajax.mostRecentCall.args[0]["url"]).toEqual(url);
    });

    it("should return json", function() {
        expect(util.getJsonFromUrl(url)).toEqual(jasmine.any(Object));
    });

    it("should return json object returned from server", function() {
        expect(util.getJsonFromUrl(url)).toEqual(fakeData);
    });
});


describe("the sparqlQueryParser", function() {
    it('should be defined', function() {
        expect(util.sparqlQueryParser).toBeDefined();
    });


    it("should return null if where if empty ", function() {
        expect(util.sparqlQueryParser("")).toBe(null);
    });

    it("should return a string", function() {
        expect(util.sparqlQueryParser("select * where {?a ?b ?c")).toEqual(jasmine.any(String));
    });

    it("should return a valid http url (start with http|https);", function() {
        var url = util.sparqlQueryParser("select * where {?t ?r ?e");
        url.trim();
        expect(url).toMatch("^(http:*|https:*)");
    });

});

describe('parseFusekiJson', function() {
    var fusekiJson = testValues.fusekiJson;

    it('should be defined', function() {
        expect(util.parseFusekiJson).toBeDefined();
    });

    it("should return json", function() {
        expect(util.parseFusekiJson(fusekiJson)).toEqual(jasmine.any(Object));
    });

    xit("should have the right format", function() {
        var parsedJson = util.parseFusekiJson(fusekiJson);
        expect(parsedJson.nodes).toBeDefined();
        expect(parsedJson.links).toBeDefined();
    });

    it("should contains right values for a triple", function() {
        var parsedJson = util.parseFusekiJson(fusekiJson);
        var aSubject = 'http://www.semanticweb.org/shgx/ontologies/2013/5/untitled-ontology-2#Begrepsmodell';
        var aDataProperty = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
        var aValue = "http://www.w3.org/2002/07/owl#Class";
        expect(parsedJson[aSubject].data[aDataProperty]).toEqual(aValue);
    });

    it('should only accept triples', function() {
        var fusekiJsonNotTriple = testValues.fusekiJsonNotTriple;
        expect(function(){util.parseFusekiJson(fusekiJsonNotTriple);}).toThrow(new Error("Should contain tripels"));
    });
});

xdescribe('getElementNameFromUri', function() {
    var testUrl = "http://computas.seres.begrep#seres.begrep.Begrepsmodell_29d78925e6a6f2b7:7df3bfdc:0000013dee0f5474:802e";
    var testName;
    beforeEach(function() {});

    it("should return a string", function() {
        testName = util.getElementNameFromUri(testUrl);
        expect(testName).toEqual(jasmine.any(String));
    });

    it("should handle wrong argument", function() {
        testName = util.getElementNameFromUri(null);
        expect(testName).toEqual("Unknown");
        testName = util.getElementNameFromUri("");
        expect(testName).toEqual("Unknown");
    });

    it("should return the right name", function() {
        var name = "seres.begrep.Begrepsmodell_29d78925e6a6f2b7:7df3bfdc:0000013dee0f5474:802e";
        testName = util.getElementNameFromUri(testUrl);
        expect(testName).toEqual(name);
    });
});

xdescribe("sparqlQuery function", function() {
    it("shuold return a json", function() {
        expect(util.sparqlQuery(select, where, groupBy, orderBy) instanceof Object);
        expect(util.sparqlQuery(select, where, groupBy, orderBy) instanceof Object);
    });
});