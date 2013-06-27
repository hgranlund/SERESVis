var vis = window.seres.visual;
var testValues = window.seres.testValues;
describe('In seres-d3.js:', function() {
	describe('The function toTreeJson()', function() {
		var json = testValues.subClassOfJsonGraphParsed;

		it('should be defined', function() {
			expect(vis.toTreeJson).toBeDefined();
		});

		it("should return json", function() {
			expect(vis.toTreeJson(json)).toEqual(jasmine.any(Object));
		});

		it("should have the right format", function() {
			var parsedJson = vis.toTreeJson(json);
			expect(parsedJson[0].name).toBeDefined();
			expect(parsedJson[0].subClass).toBeDefined();
		});

		it("should contains right values for a triple", function() {
			var parsedJson = vis.toTreeJson(json);
			var childOfRoot = 'Dokumentasjon';
			var root = "Seres";
			var aSubject2 = "Implementasjonselement";
			var aObjectProperty2 = "subClassOf";
			var aObject = "SERESelement";
			expect(parsedJson[0].name).toEqual(root);
			expect(parsedJson[0].subClass.length).toEqual(3);
			expect(parsedJson[0].subClass[2].name).toEqual("SERESelement");
			expect(parsedJson[0].subClass[2].subClass[4].subClass[13].name).toEqual("DataTypeegenskap");
		});

	});
});
