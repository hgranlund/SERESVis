'use strict';
var util = window.seres.util;

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
    var fusekiJson = {};
    var parsedJson = 
    beforeEach(function() {
        fusekiJson = $.getJSON("testFiles/fusekiJson.json", function(json) {});
        parsedJson = util.parseFusekiJson(fusekiJson);
    });

    it('should be defined', function() {
        expect(util.parseFusekiJson).toBeDefined();
    });

    it("should return json", function() {
        expect(util.parseFusekiJson(fusekiJson)).toEqual(jasmine.any(Object));
    });

    it("should have the right format", function() {
      expect(parsedJson.nodes).toBeDefined();
      expect(parsedJson.links).toBeDefined();
    });

    xit("should contains right values", function() {
        var aSubject = fusekiJson.results.bindings[0][0].value;
      expect(parsedJson.nodes).toBeDefined();
    });

});

describe('getElementNameFromUri', function() {
    var 
    beforeEach(function() {
      
    });
})

xdescribe("sparqlQuery function", function() {
    it("shuold return a json", function() {
        expect(util.sparqlQuery(select, where, groupBy, orderBy) instanceof Object);
        expect(util.sparqlQuery(select, where, groupBy, orderBy) instanceof Object);
    });
});