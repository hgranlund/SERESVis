var config = module.exports;

config["My tests"] = {
    rootPath: "../",
    environment: "browser", // or "node"
    sources: [   // Paths are relative to config file
        "public/js/*.js"      // Glob patterns supported
    ],
    tests: [
        "test/*-test.js"
    ]
};

// Add more configuration groups as needed