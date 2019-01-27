module.exports = function(app) {
    var sheetCache = app.get("cache").partition("sheets");


    var googleAuthFactory = require("../../lib/googleAuth");
    

    var google = {
	sheets:function(request){
	    var sheetOpsFactory = require("../../lib/sheetOps"),
    		{ getSheet, copySheet, testConnection } = sheetOpsFactory(request);
	    
	    return {
		copySheet,
		testConnection,
		getSheet: async function(sheet, options = {}) {
		    var cached = null;
		    if (!options.force) {
			var cached = sheetCache.get(sheet);
			if (cached) console.log(`Using cached copy for sheet ${sheet}`);
		    }
		    var found = cached || await getSheet(sheet);
		    sheetCache.set(sheet, found);
		    return found;
		}
	    }
	},
	auth: googleAuthFactory
    }

    app.set("google", google);
}
