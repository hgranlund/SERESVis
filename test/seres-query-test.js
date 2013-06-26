var query = window.seres.query;
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
        fakeData = testValues.fusekiJsonNotTriple;
        var ajax = spyOn($, "ajax").andReturn(fakeData);
    });

    it('should be defined', function() {
        expect(query.getJsonFromUrl).toBeDefined();
    });

    it('should return empty if url is empty', function() {
        expect($.isEmptyObject(query.getJsonFromUrl(""))).toBeTruthy();

    });

    it("should make an AJAX request to the correct URL", function() {
        query.getJsonFromUrl(url);
        expect($.ajax.mostRecentCall.args[0]["url"]).toEqual(url);
    });

    it("should return json", function() {
        expect(query.getJsonFromUrl(url)).toEqual(jasmine.any(Object));
    });

});

describe("the sparqlQueryParser", function() {
    it('should be defined', function() {
        expect(query.sparqlQueryParser).toBeDefined();
    });


    it("should return null if where if empty ", function() {
        expect(query.sparqlQueryParser("")).toBe(null);
    });

    it("should return a string", function() {
        expect(query.sparqlQueryParser("select * where {?a ?b ?c")).toEqual(jasmine.any(String));
    });

    it("should return a valid http url (start with http|https);", function() {
        var url = query.sparqlQueryParser("select * where {?t ?r ?e");
        url.trim();
        expect(url).toMatch("^(http:*|https:*)");
    });

});

describe('parseSelectJson', function() {
    var fusekiJson = testValues.fusekiJson;
    var fusekiJson2 = testValues.fusekiJson2;

    it('should be defined', function() {
        expect(query.parseSelectJson).toBeDefined();
    });

    it("should return json", function() {
        expect(query.parseSelectJson(fusekiJson)).toEqual(jasmine.any(Object));
    });

    xit("should have the right format", function() {
        var parsedJson = query.parseSelectJson(fusekiJson);
        expect(parsedJson.nodes).toBeDefined();
        expect(parsedJson.links).toBeDefined();
    });

    it("should contains right values for a triple", function() {
        var parsedJson = query.parseSelectJson(fusekiJson);
        var parsedJson2 = query.parseSelectJson(fusekiJson2);
        var aSubject = 'Begrepsmodell';
        var aObjectProperty = "type";
        var aValue = "Class";
        var aSubject2 = "seres.begrep.Begrepsrelasjon_29d78925e6a6f2b7:7df3bfdc:0000013dee0f5474:802d";
        var aObjectProperty2 = "begrepsmodell";
        var aValue2 = "seres.begrep.Begrepsmodell_29d78925e6a6f2b7:7df3bfdc:0000013dee0f5474:802e";
        var aSubject21 = "seres.begrep.Begrepsrelasjon_29d78925e6a6f2b7:7df3bfdc:0000013dee0f5474:802d";
        var aDataProperty21 = "gyldigTil";
        var aValue21 = "1900-01-01 00:00:00.000";
        expect(parsedJson[aSubject].object[aObjectProperty]).toEqual(aValue);
        expect(parsedJson2[aSubject2].object[aObjectProperty2]).toEqual(aValue2);
        expect(parsedJson2[aSubject21].data[aDataProperty21]).toEqual(aValue21);
    });

    it('should only accept triples', function() {
        var fusekiJsonNotTriple = testValues.fusekiJsonNotTriple;
        expect(function() {
            query.parseSelectJson(fusekiJsonNotTriple);
        }).toThrow(new Error("Should contain tripels"));
    });
});

describe('parseGraphJson', function() {
    var graphJson = testValues.subClassOfJsonGraph;

    it('should be defined', function() {
        expect(query.parseGraphJson).toBeDefined();
    });

    it("should return json", function() {
        expect(query.parseGraphJson(graphJson)).toEqual(jasmine.any(Object));
    });

    xit("should have the right format", function() {
        var parsedJson = query.parseGraphJson(graphJson);
        expect(parsedJson.nodes).toBeDefined();
        expect(parsedJson.links).toBeDefined();
    });

    it("should contains right values for a triple", function() {
        var parsedJson = query.parseGraphJson(graphJson);
        var aSubject = 'Stukturnivå';
        var aObjectProperty = "subClassOf";
        var aValue = "Nivå";
        expect(parsedJson[aSubject].object[aObjectProperty]).toEqual(aValue);
    });

});

describe('getElementNameFromUri', function() {
    var testUrl = "http://computas.seres.begrep#seres.begrep.Begrepsmodell_29d78925e6a6f2b7:7df3bfdc:0000013dee0f5474:802e";
    var testName;
    beforeEach(function() {});

    it("should return a string", function() {
        testName = query.getElementNameFromUri(testUrl);
        expect(testName).toEqual(jasmine.any(String));
    });

    it("should handle wrong argument", function() {
        testName = query.getElementNameFromUri(null);
        expect(testName).toEqual("Unknown");
        testName = query.getElementNameFromUri("");
        expect(testName).toEqual("Unknown");
    });

    it("should return the right name", function() {
        var name = "seres.begrep.Begrepsmodell_29d78925e6a6f2b7:7df3bfdc:0000013dee0f5474:802e";
        testName = query.getElementNameFromUri(testUrl);
        expect(testName).toEqual(name);
    });
});

xdescribe('execute', function() {
    it("should  ", function() {
        query.execute('select * where {?a ?b ?c}');
    });
});