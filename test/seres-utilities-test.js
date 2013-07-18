describe('seres-utilities', function () {
  var util = window.seres.utilities;
  describe('toLegalClassName', function () {


    it('should return an empty string if arg is undefined', function () {
      var className = util.toLegalClassName();
      expect(className).toEqual('');
    });

    it('should return a legall class name', function () {
      var className = util.toLegalClassName('Begrep_45s6af46s5dfsdf21');
      expect(className).toEqual('begrep-45s6af46s5dfsdf21');

    });


    it('should to return the same string ut called twice', function () {
      var className = util.toLegalClassName('Begrep_45s6af46s5dfsdf21');
      className = util.toLegalClassName(className);
      expect(className).toEqual('begrep-45s6af46s5dfsdf21');

    });
  });

  describe('getPropertyValue', function () {
    var object;

    beforeEach(function () {
      object = {
        a: 1,
        b: 2
      };
    });

    it('should return the property', function () {
      expect(util.getPropertyValue('a', object)).toEqual(1);
    });

    it('should return null if property dont exist', function () {
      expect(util.getPropertyValue('DontExist', object)).toBeNull();
    });

    it('should return null if object is undefined', function () {
      expect(util.getPropertyValue('DontExist', object.ss)).toBeNull();
    });
  });

  describe('addNodeToNodes', function () {
    var nodes, node1, node2;

    beforeEach(function () {
      nodes = [];
      node1 = {
        id: '1'
      };
      node2 = {
        id: '2'
      };
    });

    it('should add node to nodes if nodes not contain node', function () {
      util.addNodeToNodes(node1, nodes);
      util.addNodeToNodes(node2, nodes);
      expect(nodes).toContain(node1);
      expect(nodes).toContain(node2);
    });

    it('should not add node to nodes if nodes contain node', function () {
      nodes.push(node1);
      nodes.push(node2);
      util.addNodeToNodes(node1, nodes);
      util.addNodeToNodes(node2, nodes);
      expect(nodes.length).toEqual(2, 'duplacte node was added');
    });
  });

  describe('getNode', function () {
    var nodes, node1, node2;

    beforeEach(function () {
      nodes = [];
      node1 = {
        id: '1'
      };
      node2 = {
        id: '2'
      };
    });

    it('should get existing node', function () {
      nodes.push(node1);
      nodes.push(node2);
      expect(util.getNode(node1, nodes)).toMatch(node1);
      expect(util.getNode(node2, nodes)).toMatch(node2);
    });

    it('should return false if node not exist', function () {
      expect(util.getNode(node1, nodes)).toBeFalsy();
      expect(util.getNode(node2, nodes)).toBeFalsy();
    });
  });

});
