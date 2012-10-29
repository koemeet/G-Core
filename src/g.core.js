/**
 * @class G
 * 
 * @singleton
 */
var G = G || {};

(function() {
	
	G = {
		
		/** 
		 * When set to true, console is used to show debug information.
		 * 
		 * @property {Function}
		 */
		debug: false,
		
		/**
		 * Empty function
		 * 
		 * @property {Function}
		 */
		emptyFn: function() {},
		
		/**
		 * Config
		 * 
		 * @property {Object}
		 */
		config: {
			
		},
		
		/**
		 * Set config
		 * 
		 * @param {Object} config 
		 */
		setConfig: function(config) {
			this.config = config;
		},
		
		/**
		 * RUNTIME
		 * 
		 * This method is called on runtime, and does all the necessary setup
		 * 
		 * @private
		 */
		_runtime: function() {
			G.setConfig({
				paths: {
					G: this.getRoot()
				}
			});
			
			this.injectScript("G.core.class.Loader");
			this.injectScript("G.core.class.ClassManager");
			
			// Require necearry classes
			G.requires([
				'G.core.class.Class'
			]);
		},
		
		/**
		 * Inject the Loader class
		 * 
		 * @param {String} className
		 * @param {Boolean} content If set to true, the contents will be returned
		 * @private
		 */
		injectScript: function(className, content) {
			var parts = className.split('.');
			
			for (i in this.config.paths)
			{
				if (i == parts[0])
				{
					parts[0] = this.config.paths[i];
					parts[0] = parts[0].substr(0, parts[0].length - 1);
				}
			}
			
			var file = parts.join('/') + '.js';
			
			// Get the loader script synchronous
			if (content == true)
			{
				var returnValue = false;
				
				$.ajax({
					url: file,
					async: false,
					success: function(data) {
						returnValue = data;
					}
				});
				
				return returnValue;
			}
			else
			{
				$.ajax({
					url: file,
					async: false,
					dataType: "script"
				});
			}
		},
		
		/**
		 * Get root
		 * 
		 * Returns the root folder of the core .js file
		 * 
		 * @private
		 */
		getRoot: function() {
			var scripts = document.getElementsByTagName("head")[0].getElementsByTagName("script");
			var path = scripts[scripts.length-1].src;
			return path.substring(0, path.lastIndexOf('/') + 1);
		}
	};
	
	
	(function() {
		
		G.Logger = {
			log: function(str) {
				console.log(str);
			},
			warn: function(str) {
				console.warn(str);
			},
			error: function(str) {
				throw new Error(str);
			}
		};
		
	})();
	
	
	// ===================================================================================================== //
	// ============================================== RUNTIME ============================================== //
	// ===================================================================================================== //
	
	G._runtime();
	
})();
