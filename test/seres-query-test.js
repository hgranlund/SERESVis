var query = window.seres.query;
var testValues = window.seres.testValues;

describe('A suite test', function () {
    it('true should be true', function () {
        expect(true).toBe(true);
    });
});

describe('queryEndpoint', function () {
    var host = 'http://localhost:3030/ds/query?';
    var queryString = 'select where {?a ?b ?c}';
    var output = 'json';
    var stylesheet = '2Fxml-to-html.xsl';
    var url = 'http://localhost:3030/ds/query?query=select+*+where+%7B%3Fd+%3Ff+%3Fg%7D&output=json&stylesheet=%2Fxml-to-html.xsl';

    beforeEach(function () {
        var ajax = spyOn($, 'ajax');
    });

    it('should be defined', function () {
        expect(query.queryEndpoint).toBeDefined();
    });

    it('should return empty if url is empty', function () {
        expect($.isEmptyObject(query.queryEndpoint(''))).toBeTruthy();

    });

    it('should make an AJAX request to the correct URL', function () {
        query.queryEndpoint(queryString, host, output, stylesheet);
        expect($.ajax.mostRecentCall.args[0]['url']).toEqual(host);
        expect($.ajax.mostRecentCall.args[0]['data']['query']).toEqual(queryString);
    });

    it('should make an AJAX request to the correct URL with just qyeryString as agrument', function () {
        query.queryEndpoint(queryString);
        expect($.ajax.mostRecentCall.args[0]['url']).toEqual(host);
        expect($.ajax.mostRecentCall.args[0]['data']['query']).toEqual(queryString);
    });

    it('should return json', function () {
        expect(query.queryEndpoint(queryString, host, output, stylesheet)).toEqual(jasmine.any(Object));
    });

});


describe('parseSelectJson', function () {
    var fusekiJson = testValues.fusekiJson;
    var fusekiJson2 = testValues.fusekiJson2;

    it('should be defined', function () {
        expect(query.parseSelectJson).toBeDefined();
    });

    it('should return json', function () {
        expect(query.parseSelectJson(fusekiJson)).toEqual(jasmine.any(Object));
    });

    xit('should have the right format', function () {
        var parsedJson = query.parseSelectJson(fusekiJson);
        expect(parsedJson.nodes).toBeDefined();
        expect(parsedJson.links).toBeDefined();
    });

    it('should contains right values for a triple', function () {
        var parsedJson = query.parseSelectJson(fusekiJson);
        var parsedJson2 = query.parseSelectJson(fusekiJson2);
        var aSubject = 'Begrepsmodell';
        var aObjectProperty = 'type';
        var aValue = 'Class';
        var aSubject2 = 'seres.begrep.Begrepsrelasjon_29d78925e6a6f2b7:7df3bfdc:0000013dee0f5474:802d';
        var aObjectProperty2 = 'begrepsmodell';
        var aValue2 = 'seres.begrep.Begrepsmodell_29d78925e6a6f2b7:7df3bfdc:0000013dee0f5474:802e';
        var aSubject21 = 'seres.begrep.Begrepsrelasjon_29d78925e6a6f2b7:7df3bfdc:0000013dee0f5474:802d';
        var aDataProperty21 = 'gyldigTil';
        var aValue21 = '1900-01-01 00:00:00.000';
        expect(parsedJson[aSubject].object[aObjectProperty]).toEqual(aValue);
        expect(parsedJson2[aSubject2].object[aObjectProperty2]).toEqual(aValue2);
        expect(parsedJson2[aSubject21].data[aDataProperty21]).toEqual(aValue21);
    });

    it('should only accept triples', function () {
        var fusekiJsonNotTriple = testValues.fusekiJsonNotTriple;
        expect(function () {
            query.parseSelectJson(fusekiJsonNotTriple);
        }).toThrow(new Error('Should contain tripels'));
    });
});

describe('parseGraphJson', function () {
    var graphJson = testValues.subClassOfJsonGraph;

    it('should be defined', function () {
        expect(query.parseGraphJson).toBeDefined();
    });

    it('should return json', function () {
        expect(query.parseGraphJson(graphJson)).toEqual(jasmine.any(Object));
    });

    xit('should have the right format', function () {
        var parsedJson = query.parseGraphJson(graphJson);
        expect(parsedJson.nodes).toBeDefined();
        expect(parsedJson.links).toBeDefined();
    });

    it('should contains right values for a triple', function () {
        var parsedJson = query.parseGraphJson(graphJson);
        var aSubject = 'Stukturnivå';
        var aObjectProperty = 'subClassOf';
        var aValue = 'Nivå';
        var aSubject2 = 'Implementasjonselement';
        var aPredicat2 = 'subClassOf';
        var aObject2 = 'SERESelement';
        expect(parsedJson[aSubject].object[aObjectProperty]).toEqual(aValue);
        expect(parsedJson[aSubject2].object[aPredicat2]).toEqual(aObject2);
        expect(parsedJson['tekst'].data['teste']).toEqual('testverdi');
    });

});

describe('getElementNameFromUri', function () {
    var testUrl = 'http://computas.seres.begrep#seres.begrep.Begrepsmodell_29d78925e6a6f2b7:7df3bfdc:0000013dee0f5474:802e';
    var testName;
    beforeEach(function () {});

    it('should return a string', function () {
        testName = query.getElementNameFromUri(testUrl);
        expect(testName).toEqual(jasmine.any(String));
    });

    it('should handle wrong argument', function () {
        testName = query.getElementNameFromUri(null);
        expect(testName).toEqual('Unknown');
        testName = query.getElementNameFromUri('');
        expect(testName).toEqual('Unknown');
    });

    it('should return the right name', function () {
        var name = 'seres.begrep.Begrepsmodell_29d78925e6a6f2b7:7df3bfdc:0000013dee0f5474:802e';
        testName = query.getElementNameFromUri(testUrl);
        expect(testName).toEqual(name);
    });
});

xdescribe('execute', function () {
    it('should  ', function () {
        query.execute('select * where {?a ?b ?c}');
    });
});
