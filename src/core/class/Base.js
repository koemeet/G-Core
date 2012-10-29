/**
 * @class G.Base
 * @author Steffen Brem <steffenbrem@gmail.com> 
 * 
 * The Base class where every class extends from.
 * 
 * If you want to display a message, simply call this method:
 * 
 * 		G.core.class.Base.test("My message");
 */
G.define("G.core.class.Base", {
	constructor: function() {
		
	},
	
	/**
	 * Test
	 * 
	 * Alert't a message
	 * 
	 * @new
	 */
	test: function(message) {
		alert(message);
	}
});
