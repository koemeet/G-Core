/**
 * @class G.Class
 *
 * Handles class creation throughout the framework. This is a low level factory that is used by G.ClassManager and generally
 * should not be used directly. If you choose to use G.Class you will lose out on the namespace, aliasing and depency loading
 * features made available by G.ClassManager. The only time you would use G.Class directly is to create an anonymous class.
 *
 * If you wish to create a class you should use {@link G#define G.define} which aliases
 * {@link G.ClassManager#create G.ClassManager.create} to enable namespacing and dynamic dependency resolution.
 * 
 * # Usage:
 * 
 * 	@example	
 * 	alert('sjahdajshd');
 * 
 *
 * G.Class is the factory and **not** the superclass of everything. For the base class that **all** Ext classes inherit
 * from, see {@link G.Base}.
 * 
 * @extends G.ClassManager
 * @mixin G.Loader
 */
(function() {
	
	G.Class = {
		extendingClass: {},
		
		/**
		 * Create class
		 * 
		 * If there is only one parameter, which is an object, it will be used as the class context.
		 * 
		 * @param {Function} 	parent		The object to inherit from
 		 * @param {Object} 		current		The current object
		 */
		create: function(parent, object) {			
			if (arguments.length == 1 && typeof parent == "object")
			{
				object = parent;
				parent = false;
			}
			
			// Make a global variable of the classname
			G.ClassManager.defineClassGlobal(object.className);
			
			// Create the class constructor
			var evalStr = object.className + ' = function() {' +
				'if (arguments[0] == G.Class.extendingClass) return;' +
				'this.constructor.apply(this, arguments);' +
			'};' +
			'var constuctor = ' + object.className + ';';
									
			eval(evalStr);
			
			if (parent)
			{
				constuctor.prototype = new parent(G.Class.extendingClass);
			}
			
			// Give every method the parent method inside, so that they can call there super
			if (object)
			{
				G.Class.inherit(constuctor.prototype, object);
			}
						
			return constuctor;
		},
		
		/**
		 * Mixin interface
		 * 
		 * Mix an interface class into a existing Class.
		 * 
		 * @param {Object|Function} object
		 * @param {Object|Function} interface
		 * @return {Object} The original object with the interface mixed in
		 */
		mixin: function(object, interface) {
			var _object    = (typeof object == "function") ? object.prototype : object;
			var _interface = (typeof interface == "function") ? interface.prototype : interface;
			
			for (i in _interface)
			{
				_object[i] = _interface[i];
			}
			
			return object;
		},
		
		/**
		 * Create a singleton from an constructor function
		 * 
		 * @param {Function} object
		 * @return {Object} 
		 */
		singleton: function(object) {
			var klass = new object();
			
			return klass;
		},
		
		/**
		 * Inherit members from parent object
		 * 
		 * This also creates the parent method, which can be used to call the super of the class. 
		 * 
 		 * @param {Object} dest
 		 * @param {Object} src
 		 * @param {Object} fname
		 */
		inherit : function(dest, src, fname) {
			if (arguments.length == 3) 
			{
				var ancestor 	= dest[fname];
				var descendent 	= src[fname];
				var method 		= descendent;
				
				descendent = function() {					
					var ref = this.parent;
					this.parent = ancestor;
					
					// Support for calling other methods from parent
					/*if (arguments.length > 0)
					{
						method = dest[arguments[0]];
						arguments = arguments[1] || [];
					}*/
					
					var result = method.apply(this, arguments);					
					ref ? this.parent = ref : delete this.parent;
					return result;
				};
				
				descendent.valueOf = function() {
					return method;
				};
				
				descendent.toString = function() {
					return method.toString();
				};

				dest[fname] = descendent;
			} 
			else 
			{
				for (var prop in src) 
				{
					if (typeof (src[prop]) == 'function') 
					{
						G.Class.inherit(dest, src, prop);
					} else 
					{
						dest[prop] = src[prop];
					}
				}
			}
			
			return dest;
		}
		
	};
	
})();
