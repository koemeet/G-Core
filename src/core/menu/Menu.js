/**
 * @class G.menu.Menu
 * 
 * G.menu.Menu is a powerful class that turns your HTML list into a navigation menu! You have alot of control on how your menu will behave.
 * 
 * # Usage:
 * 
 * To convert your HTML list into a G Menu, use the following:
 * 
 * 	G.require('G.menu.Menu');
 * 
 * 	var menu = new G.menu.Menu(element);
 * 
 */
G.define('G.menu.Menu', {
	
	constructor: function(element, options) {
		this.menuCollection = [];
    
	    this.elements = {};
	    this.elements.root = element;
	    this.elements.uls  = element.getElementsByTagName('ul');
	    
	    // Default options
	    this.options = {
	        accordion: false,
	        transition: 'slide',
	        collapse: true,
	        storeCollapse: true
	    };
	    
	    if (!options) options = {};
	    if ( typeof(options.accordion) !== "undefined" ) {this.options.accordion = options.accordion;}
	    if ( typeof(options.transition) !== "undefined" ) {this.options.transition = options.transition;}
	    if ( typeof(options.collapse) !== "undefined" ) {this.options.collapse = options.collapse;}
	    if ( typeof(options.storeCollapse) !== "undefined" ) {this.options.storeCollapse = options.storeCollapse;}
	    
	    if ( typeof this.options.transition == 'object' ) {
	        if ( this.options.transition.speed === undefined ) {
	            this.options.transition.speed = 300;
	        }
	        if ( this.options.transition.type === undefined ) {
	            this.options.transition.type = 'none';
	        }
	    }
	    
	    this.setup();
	},
	
	/**
	 * Setup menu 
	 *
	 * @private 
	 */
	setup: function() {
		var self = this, root = this.elements.root;
    
	    for ( i = 0; i < root.children.length; i++ ) {
	        a = root.children[i];
	        if ( a.children[1] ) {
	            a = a.children[1];
	        }
	        if ( a.children.length > 0 && this.options.collapse ) {this._hide(a);}
	        
	        a._g = {
	            level: 0,
	            position: [i]
	        };
	        this.menuCollection[i] = a;
	        this.menuCollection[i].items = [];
	        
	        for ( j = 0; j < a.children.length; j++ ) {
	            b = a.children[j];
	            if ( b.children[1] ) {
	                b = b.children[1];
	            }
	            
	            if ( b.children.length > 0 && this.options.collapse ) {this._hide(b);}
	            
	            b._g = {
	                level: 1,
	                position: [i, j]
	            };
	            this.menuCollection[i].items[j] = b;
	            this.menuCollection[i].items[j].items = [];
	            
	            for ( k = 0; k < b.children.length; k++ ) {
	                c = b.children[k];
	                if ( c.children[1] ) {
	                    c = c.children[1];
	                }
	                	                
	                if ( c.children.length > 1 && this.options.collapse ) {this._hide(c);}
	                
	                c._g = {
	                    level: 2,
	                    position: [i, j, k]
	                };
	                this.menuCollection[i].items[j].items[k] = c;
	                this.menuCollection[i].items[j].items[k].items = [];
	            }
	        }
		}
		
		// Setup click event
	    var a = this.elements.root.getElementsByTagName('a');
	    
	    for ( i = 0; i < a.length; i++ ) {
	        c = a[i];
	        c.onclick = function(e) {
	            e = e || window.event;
	            
	            var ul = this.parentNode.children[1];
	            var display = ul.style.display;
	            
	            
	            if ( self.options.accordion === true ) {
	                for ( j = 0; j < self.elements.uls.length; j++ ) {
	                    if ( self.options.storeCollapse === true ) {
	                        if ( ul._g.level == self.elements.uls[j]._g.level ) {
	                            self.hide(self.elements.uls[j]);
	                        }
	                    } else {
	                        if ( ul._g.level <= self.elements.uls[j]._g.level ) {
	                            self.hide(self.elements.uls[j]);
	                        }
	                    }
	                }
	            }
	            
	            if ( display == 'none' ) {
	                self.show(ul);
	                self._setCookie('g_menu', ul._g.position.join(','));
	            } else {
	                self.hide(ul);
	                if ( ul._g.position.length > 1 ) {
	                    var array = ul._g.position.pop();
	                    if ( typeof array == 'Array' ) {
	                        self._setCookie('g_menu', array.join(','));
	                    }
	                } else {
	                    self._setCookie('g_menu', '');
	                }
	            }
	        };
	    }
	    
	    // Is there any cookie with data?
	    var cookie = this._getCookie('g_menu');
	    
	    if ( cookie ) {
	        var array = cookie.split(',');
	        this.open.apply(this, array);
	    }
	},
	
	close: function() {
		var obj = this._getMenuItem(arguments);
    
    	obj.style.display = 'none';
	},
	
	/**
	 * Open menu section
	 * 
	 * 	var menu = new G.menu.Menu(element);
	 * 	menu.open(1, 0); // Opens the second item in the list, then opens the first item of that list 
	 * 
	 * @param {Array} args (optional) Menu items to open
	 */
	open: function() {
		for ( i = 0, temp = []; i < arguments.length; i++ ) {
	        a = arguments[i];
	        temp.push(a);
	        
	        var obj = this._getMenuItem(temp);
	        
	        if (obj)
	        {
	        	obj.style.display = 'block';
	        }
	    }
	},
	
	_getMenuItem: function(arguments) {
		if ( arguments ) {
	        switch (arguments.length) {
	            case 1:
	                obj = this.menuCollection[arguments[0]]
	            break;
	            case 2:
	                obj = this.menuCollection[arguments[0]].items[arguments[1]]
	            break;
	            case 3:
	                obj = this.menuCollection[arguments[0]].items[arguments[1]].items[arguments[2]];
	            break;
	        }
	    } else {
	        throw new Error("No arguments where passed");
	    }
	    
	    return obj;
	},
	
	/**
	 * Show
	 *  
 	 * @param {Object} element
	 */
	show: function(element) {
		if ( typeof this.options.transition == 'object' ) {                        
	        if ( this.options.transition.type == 'slide' ) {
	            $(element).slideDown(this.options.transition.speed);
	        } else if ( this.options.transition.type == 'fade' ) {
	            $(element).fadeIn(this.options.transition.speed);
	        } else {
	            this._show(element);
	        }
	    } else {
	        if ( this.options.transition == 'slide' ) {
	            $(element).slideDown('fast');
	        } else if ( this.options.transition == 'fade' ) {
	            $(element).fadeIn('fast');
	        } else {
	            this._show(element);
	        }
	    }
	},
	
	/**
	 * Hide
	 *  
 	 * @param {Object} element
	 */
	hide: function(element) {
		if ( typeof this.options.transition == 'object' ) {                        
	        if ( this.options.transition.type == 'slide' ) {
	            $(element).slideUp(this.options.transition.speed);
	        } else if ( this.options.transition.type == 'fade' ) {
	            this._hide(element);
	        } else {
	            this._hide(element);
	        }
	    } else {
	        if ( this.options.transition == 'slide' ) {
	            $(element).slideUp('fast');
	        } else if ( this.options.transition == 'fade' ) {
	            this._hide(element);
	        } else {
	            this._hide(element);
	        }
	    }
	},
	
	_setCookie: function(name, value) {
    	document.cookie = name + "=" + value;
	},
	
	_getCookie: function(name) {
		var i,x,y,ARRcookies=document.cookie.split(";");
	    for (i=0;i<ARRcookies.length;i++)
	    {
	        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
	        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
	        x=x.replace(/^\s+|\s+$/g,"");
	        if (x==name)
	        {
	            return unescape(y);
	        }
	    }
	},
	
	_hide: function(element) {
		element.style.display = 'none';
	},
	
	_show: function(element) {
		element.style.display = 'block';
	}
});