# SESESVis



## Setup

### Easy setup

To use the buildin test data:

    Open public/index.html


### Proper setup


    Install an endpoint, i.e. jena-fuseki (http://jena.apache.org/download/index.html)
    Import graph data to the endpoint

Modify query request in public/seres-run.js (line 2) to:

    var json = query.execute(queryString, host, output, stylesheet)

i.e.:

    var json = query.execute('construct where {?a ?s ?b}', 'http://localhost:3030/ds/query?', 'json');


Then just:

    Open public/index.html
