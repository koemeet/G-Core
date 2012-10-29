/**
 * @class G.ClassManager
 * 
 * G.ClassManager manages all classes in the whole framework. Generally it's not accessed directly, rather,
 * use these shorthands:
 * 
 * - {@link G#define G.define}
 * - {@link G#create G.create}
 * 
 * # Usage:
 * 
 * 	G.define(className, options);
 * 
 * Where options is an object representing the class itself.
 * 
 * 	@example
 * 	G.define('Person', {
 * 		name: '',
 * 		age: 0,
 * 
 * 		constructor: function(name, age) {
 * 			if (name) this.name = name;
 * 			if (age) this.age = age;
 * 		},
 * 
 * 		speak: function(message) {
 * 			alert("Hello, I'm " + this.name + "! This is my message for you: " + message);
 * 
 * 			return this;
 * 		}
 * 	});
 * 
 * 	var klaas = new Person('Klaas', 18);
 * 	klaas.speak('Hello again!'); // Alerts: Hello, I'm Klaas! This is my message for you: Hello again!
 * 
 * @singleton
 */
(function() { 

	G.ClassManager = {
		
		baseClass: "G.core.class.Base",
		
		/**
		 * Stores all classes that were created with G.create(). We store
		 * the class namespace as key.
		 *  
		 */
		classes: {},
		
		/**
		 * Checks if the specific class has been defined
		 * 
		 * @param {String} className
		 */
		isDefined: function(className) {
			for (i in this.classes)
			{
				if (i == className)
				{
					return true;
				}
			}
			
			return false;
		},
		
		/**
		 * Define class to the classes property
		 *  
	 	 * @param {String} className
		 */
		define: function(className, options) {
			var object = null;
			
			options.className = className;
			
			// Support for extending classes
			if (typeof options.extend != "undefined")
			{
				G.require(options.extend);
				
				var extend = G.ClassManager.get(options.extend);
				
				// Override the current class with the extended version
				object = G.Class.create(extend, options);
			}
			else
			{
				if (className == G.ClassManager.baseClass)
				{
					object = G.Class.create(options);
				}
				else
				{
					G.require(G.ClassManager.baseClass);
					
					var baseClass = G.ClassManager.get(G.ClassManager.baseClass);
					
					object = G.Class.create(baseClass, options);
				}
			}
			
			// Support for implementing classes
			if (typeof options.implements != "undefined")
			{
				G.require(options.implements);

				var mixin = G.ClassManager.get(options.implements);
								
				object = G.Class.mixin(object, mixin);
			}
			
			// Support for singletons
			if (typeof options.singleton != "undefined" && options.singleton === true)
			{
				object = G.Class.singleton(object);
				
				// Change the global scope variable too
				G.ClassManager.defineClassGlobal(className, object);
			}
												
			G.ClassManager.classes[className] = object;
		},
		
		/**
		 * Define a class to the global window object
		 * 
		 * @param {String} className 
		 */
		defineClassGlobal: function(className, object) {						
			var parts = className.split('.');
			G._temp = object;
			
			var prefix = parts[0];
			var evalString = "var " + prefix + " = " + prefix + " || {};\r\n";
			delete parts[0];
			
			var obj = window;
			
			for (i in parts)
			{
				c = parts[i];
				
				if (i == parts.length-1 && typeof(object) != "undefined")
				{
					evalString += prefix + "." + c + " = G._temp;\r\n";
				}
				else
				{
					evalString += prefix + "." + c + " = " + prefix + "." + c + " || {};\r\n";
				}
				prefix += "." + c;
			}
						
			window.eval.call(window, evalString);
		},
		
		/**
		 * Get class
		 * 
		 * @param {String} className 
		 */
		get: function(className) {
			return this.classes[className];
		},
		
		/**
		 * Create class
		 * 
		 * You can change de default members of the class by passing a object as second parameter.
		 *  
	  	 * @param {String} classname
	  	 * @param {Object} options
		 */
		create: function(className, options) {
			if (className != null && typeof className != 'string') {
	            //throw new Error("[Ext.define] Invalid class name '" + className + "' specified, must be a non-empty string");
	        }
	
			G.require(className);
			
			// Get Class members
			var object = G.ClassManager.get(className);
			
			if (options)
			{
				G.Class.mixin(object, options);
			}
			
			// Singleton
			if (typeof(object) == "object") return object;
			
			return new object();
		}
	};
	
	/**
	 * Alias of {@link G.ClassManager#create G.ClassManager.create}. See documentation of {@link G.ClassManager} for more info.
	 * 
	 * @member G
	 * @method create 
	 */
	G.create = G.ClassManager.create;
	
	/**
	 * Alias of {@link G.ClassManager#define G.ClassManager.define}. See documentation of {@link G.ClassManager} for more info.
	 * 
	 * @member G
	 * @method define 
	 */
	G.define = G.ClassManager.define;
})();
