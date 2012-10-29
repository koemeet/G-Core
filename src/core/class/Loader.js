/**
 * @class G.Loader
 * 
 * G.Loader is responsible for loading classes dynamically. The {@link G.Loader#require G.Loader.require} and {@link G.Loader#requires G.Loader.requires} methods
 * are generally not called from the Loader class. Use the shorthands {@link G#require G.require} and {@link G#requires G.requires} instead.
 * 
 * ### Usage ###
 * To require only one class:
 * 
 * 	G.require('G.window.Window');
 *
 * To require multiple classes at once:
 * 
 * 	G.requires(['G.window.Window', 'G.another.Class', 'G.another.Class2']);
 * 
 * 
 * 
 * @singleton 
 */
(function() {
	
	G.Loader = {
		
		/**
		 * Require multiple classes
		 * 
		 * @param {Array} classes
		 */
		requires: function(classes) {
			for (i in classes)
			{
				G.Loader.require(classes[i]);
			}
		},
		
		/**
		 * Require Class
		 * 
		 * @param {String} className
		 */
		require: function(className) {
			if (!G.ClassManager.isDefined(className))
			{
				G.injectScript(className);
				
				return true;
			}
			
			G.Logger.warn(className + " is already loaded");
		},
		
		/**
		 * Get contents of file
		 *  
 	 	 * @param {String} className
 	 	 * @return {String} Contents of file
		 */
		getFile: function(className)
		{
			return G.injectScript(className, true);
		}
		
	};
	
	/**
     * Convenient alias of {@link G.Loader#require}. Please see the introduction documentation of
     * {@link G.Loader} for examples.
     * 
     * @member G
     * @method require
     */
	G.require 	= G.Loader.require;
	
	/**
	 * Alias of {@link G.Loader#require}. Please see the documentation of {@link G.Loader} for more info.
	 * 
	 * @member G
	 * @method requires 
	 */
	G.requires 	= G.Loader.requires;
	
})();