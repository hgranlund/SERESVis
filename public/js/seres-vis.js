window.seres.vis = function(query) {
	var vis = {};


	var populateElement = function(parent, parents) {
		var elm = {};
		elm.name = parent;
		elm.subClass = [];
		if (parent in parents) {
			parents[parent].map(function(child) {
				elm.subClass.push(populateElement(child, parents));
			});
		}
		delete parents[parent];
		if (elm.subClass.length === 0) delete elm.subClass;
		return elm;
	};

	vis.tree = function(json) {
		parents = {};
		childs = {};
		tree = [];
		var parent;
		for (var child in json) {
			parent = json[child].object.subClassOf;
			if (typeof(parent) !== 'undefined') {
				if (!(parent in parents)) parents[parent] = [];
				parents[parent].push(child);
				childs[child] = parent;
			}
		}
		for (var root in parents) {
			if (!(root in childs)) {
				tree.push(populateElement(root, parents));
			}
		}
		return tree;
	};
	return vis;
}(window.seres.query);