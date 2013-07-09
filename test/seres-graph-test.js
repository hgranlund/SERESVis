xdescribe('visual graph', function() {
	var d = document;
	var el = d.createElement("div");
	$(el).attr("id","graph-container");
	var visualGraph = window.seres.visualGraph;
	jQuery.fn.d3Click = function() {
		this.each(function(i, e) {
			var evt = document.createEvent("MouseEvents");
			evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			e.dispatchEvent(evt);
		});
	};

	xdescribe('graph', function() {
		var json = {
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
			}
		};

		xit('it should render correctly circles and paths.', function() {
			var graph = visualGraph.startGraph(json)
			var circles = el.getElementsByTagName("circle");
			var paths = el.getElementsByTagName("path");
			debugger;
			expect(circles.length).toEqual(4);
			expect(paths.length).toEqual(3);
		});

		xit("it should trigger a 'rendered' event when finish rendering.", function(done) {
			var graph = new Insights(el, nodes, links).render();
			graph.on("rendered", done)
		});

		xit("it should put focus on a node.", function() {
			var graph = new Insights(el, nodes, links);

			graph.focus(function(d) {
				return d.id === 1;
			});

			expect(graph.focusedNode.id).to.equal(1);
			expect(graph.adjacentNodes[2]).to.equal(true);
		});

		xit("it should reset the graph when focus is put on a node", function() {

		});

		xit("it should reset a focused state.", function() {

		});

		//it('it should put focus on a node when clicked.', function(done) {
		//    var graph = new Insights(el, nodes, links);

		//    graph.on("rendered", function() {
		//        var $el = $("#insights .node", el).eq(0);
		//        var spy = sinon.spy(graph, "onCircleClick");

		//        $el.d3Click();

		//        expect(spy.called).to.be.ok;
		//        done();
		//    });

		//});
	});


	xdescribe('cluster', function() {
		// body...
	})
})