var testValues = window.seres.testValues;
var jsonOrig = {
  'Seres': {
    'data': {},
    'object': {}
  },
  'Dokumentasjon': {
    'data': {},
    'object': {
      'subClassOf': 'Seres'
    }
  },
  'Forvaltingselement': {
    'data': {},
    'object': {
      'subClassOf': 'Seres'
    }
  },
  'SERESelement': {
    'data': {},
    'object': {
      'subClassOf': 'Seres'
    }
  },
  'Nivå': {
    'data': {},
    'object': {
      'subClassOf': 'SERESelement'
    }
  },
  'test_sereselement': {
    'data': {
      'xmi.uuid': 'fsadf23r3f98h978sfhsdfs98'
    },
    'object': {
      'type': 'SERESelement',
      "begrep": "test_begrep"
    }
  },
  'test_begrep': {
    'data': {
      'xmi.uuid': 'fsadf23r3f98h978sfhsdfs98'
    },
    'object': {
      'type': 'SERESelement',
      "sereselement": "test_sereselement"
    }
  }
};
var individual = {
  data: {
    'xmi.uuid': 'fsadf23r3f98h978sfhsdfs98'
  },
  object: {
    type: 'SERESelement',
    begrep: 'test_begrep'
  },
  id: 'test-sereselement',
  size: 5,
  name: '',
  index: 0,
  isInduvidual: true,
  isExpanded: true,
  children: ['test_begrep']
};

var formatter;

describe('seres-jsonformatter:', function () {


  beforeEach(function () {
    formatter = jsonFormatter(jsonOrig);
  });


  describe('The function toGraphObject()', function () {

    it('should be defined', function () {
      expect(formatter.toGraphObject).toBeDefined();
    });

    it("should return json", function () {
      expect(formatter.toGraphObject(['SERESelement'])).toEqual(jasmine.any(Object));
    });

    it("should have the right format", function () {
      var parsedJson = formatter.toGraphObject(['SERESelement']);
      expect(parsedJson.links).toBeDefined();
      expect(parsedJson.nodes).toBeDefined();
    });

    it("should create and links with rigth id's", function () {
      expand = [];
      for (var subject in jsonOrig) {
        expand.push(subject);
      }
      var parsedJson = formatter.toGraphObject(expand);
      expect(parsedJson.links[0].source).toEqual(1);
      expect(parsedJson.links[0].target).toEqual(0);
      expect(parsedJson.nodes[2].name).toEqual("Forvaltingselement");
    });

  });

  xdescribe('the function filterSparqlJson', function () {
    it('should filter correctly', function () {
      var filtered = formatter.filterSparqlJson('xmi.uuid');
      expect(filtered['test']).toBeDefined();
    });
  });


  describe('The function toTreeObject()', function () {
    var jsonOrig = testValues.subClassOfJsonGraphParsed;

    it('should be defined', function () {
      expect(formatter.toTreeObject).toBeDefined();
    });

    it("should return object", function () {
      expect(formatter.toTreeObject()).toEqual(jasmine.any(Object));
    });

    it("should have the right format", function () {
      var parsedJson = formatter.toTreeObject();
      expect(parsedJson[0].name).toBeDefined();
      expect(parsedJson[0].children).toBeDefined();
    });

    it("should add children to nodes ", function () {
      var parsedJson = formatter.toTreeObject();
      expect(parsedJson[0].name).toEqual('Seres');
      expect(parsedJson[0].children.length).toEqual(3);
      expect(parsedJson[0].children[2].name).toEqual("SERESelement");
      expect(parsedJson[0].children[2].individuals[0].class).toEqual("test-sereselement");
    });

  });


  describe('createNode', function () {
    it('should create a individual with correct values', function () {
      var node = formatter.createNode('test_sereselement', 0);
      expect(node.index).toEqual(0);
      expect(node.class).toEqual('test-sereselement');
      expect(node.data['xmi.uuid']).toEqual('fsadf23r3f98h978sfhsdfs98');
      expect(node.object.type).toEqual('SERESelement');
      expect(node.isIndividual).toBeTruthy('it is not marked as an individual');
      expect(node.isExpanded).toEqual(false);
    });

    it('should create a class/m induvituals with correct values', function () {
      var node = formatter.createNode('SERESelement', 0);
      expect(node.name).toEqual('SERESelement');
      expect(node.index).toEqual(0);
      expect(node.class).toEqual('sereselement');
      expect(node.object.subClassOf).toEqual('Seres');
      expect(node.isExpanded).toEqual(false);
      expect(node.children.length).toEqual(3);
      expect(node.children[2]).toEqual('test_begrep');
    });

    it('should create a standard node if json does not contain subject', function (done) {
      // console.log("LOG:",node);
      var node = formatter.createNode('', 0);
      expect(node.size).toBeDefined();
      expect(node.isExpanded).toEqual(false);
      expect(node.index).toEqual(0);
      expect(node.class).toEqual(0);
    });


    it("should auto increment default class", function () {
      var node = formatter.createNode('', 0);
      expect(node.class).toEqual(0);
      node = formatter.createNode('', 0);
      expect(node.class).toEqual(1);
      node = formatter.createNode('', 0);
      expect(node.class).toEqual(2);

    });

    //TODO: change format to [[child, linkName],[...]]
    it("should create individuals with all children", function () {
      var node = formatter.createNode('test_sereselement', 0);
      expect(node.children.length).toEqual(1);
      expect(node.children[0]).toEqual('test_begrep');
    });


    it('should add all childeren to a class', function () {
      var node = formatter.createNode('Seres', 0);
      expect(node.children.length).toEqual(3);
    });

    it('should add an empty children/parents array if no children/parents exist', function () {
      var node = formatter.createNode('Forvaltingselement', 0);
      expect(node.children.length).toEqual(0, 'did not add empty children list');
      node = formatter.createNode('Seres', 0);
      expect(node.parents.length).toEqual(0, 'did not add empty parents list');
    });

    xit("should call addIndividualAttributes when an individual is created", function () {
      var addIndividualAttributes = spyOn(formatter, "addIndividualAttributes");
      var node = formatter.createNode('test_sereselement', 0);
      expect(addIndividualAttributes).wasCalled();
      expect(addIndividualAttributes.mostRecentCall.args[0].id).toBe(node.id);
    });

    xit("should call populateParents", function () {
      var populateParents = spyOn(formatter, "populateParents");
      var node = formatter.createNode('test_sereselement', 0);
      console.log("LOG:", populateParents);
      expect(populateParents).wasCalled();
      expect(populateParents.mostRecentCall.args[0].id).toBe(node.id);
    });
  });


  describe("addIndividualAttributes", function () {
    var indi;

    beforeEach(function () {
      indi = individual;
    });

    it("should set isIndividual to true", function () {
      indi.isIndividual = false;
      formatter.addIndividualAttributes(indi);
      expect(indi.isIndividual).toBeTruthy();
    });
  });

  describe("populateParents", function () {
    var indi;

    beforeEach(function () {
      indi = individual;
    });

    it("should add all parents to node", function () {
      var node = formatter.createNode('test_sereselement', 0);
      expect(node.parents.length).toEqual(2);
      expect(node.parents[1]).toMatch({
        parent: 'test_begrep',
        link: 'begrep'
      });
    });
  });

  describe('createLink', function () {
    it('should create a link between two connected nodes', function (done) {
      var nodes = formatter.toGraphObject(['Seres', 'Forvaltingselement', 'SERESelement'])
        .nodes;
      var links = [];
      links = links.concat(formatter.createLink(0, nodes));
      links = links.concat(formatter.createLink(1, nodes));
      links = links.concat(formatter.createLink(2, nodes));
      expect(links[0].source).toEqual(1);
      expect(links[0].target).toEqual(0);
      expect(links[0].name).toEqual('subClassOf');

      expect(links[1].source).toEqual(2);
      expect(links[1].target).toEqual(0);
      expect(links[1].name).toEqual('subClassOf');
    });


    it("should add parents/children for induviduals", function () {
      var nodes = formatter.toGraphObject(['test_begrep', 'test_sereselement', 'SERESelement'])
        .nodes;
      var links = formatter.createLink(0, nodes);
      expect(links[0].source).toEqual(0);
      expect(links[0].target).toEqual(1);
      expect(links[0].name).toEqual('sereselement');

      expect(links[1].source).toEqual(1);
      expect(links[1].target).toEqual(0);
      expect(links[1].name).toEqual('subClassOf');

      expect(links[2].source).toEqual(0);
      expect(links[2].target).toEqual(2);
      expect(links[2].name).toEqual('type');

    });
  });
});
