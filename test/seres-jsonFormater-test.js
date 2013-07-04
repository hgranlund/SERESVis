var testValues = window.seres.testValues;
var json = testValues.subClassOfJsonGraphParsed;
var formater = jsonFormater(json);
describe('In seres-visualGraphh.js:', function() {
    describe('The function toGraphObject()', function() {

        it('should be defined', function() {
            expect(formater.toGraphObject).toBeDefined();
        });

        it("should return json", function() {
            expect(formater.toGraphObject(['Nivå'])).toEqual(jasmine.any(Object));
        });

        it("should have the right format", function() {
            var parsedJson = formater.toGraphObject(['Nivå']);
            expect(parsedJson.links).toBeDefined();
            expect(parsedJson.nodes).toBeDefined();
        });

        it("should contains right values for a triple", function() {
            expand = [];
            for (var subject in json) {
                expand.push(subject);
            }
            var parsedJson = formater.toGraphObject(expand);
            expect(parsedJson.links[0].source.name).toEqual("Stukturnivå");
            expect(parsedJson.links[0].target.name).toEqual("Nivå");
            expect(parsedJson.nodes[63].name).toEqual("Implementasjonselement");
        });

    });

    describe('the function filterSparqlJson', function() {
        it('should filter correctly', function() {
            var filtered = formater.filterSparqlJson('xmi.uuid');
            expect(filtered['test']).toBeDefined();
        });
    });
});