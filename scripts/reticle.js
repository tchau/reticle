YUI.add('reticle', function (Y) {

   Y.Reticle = Y.namespace('Y.Reticle');

   Y.Reticle.Reticle = function() {
      Y.Reticle.Reticle.superclass.constructor.apply(this, arguments);
   };

   Y.extend(Y.Reticle.Reticle, Y.Widget, {

   	initializer: function(config) {
         Y.Reticle.Reticle.superclass.constructor.apply(this, arguments);
   		console.log('created new Reticle');
   	},

      renderUI: function() {
         var contentBox = this.get('contentBox');

         var el = Y.Node.create('<div id="reticle">' +
               '<div class="info-panel"></div><div class="menu-container"></div>' +
            '</div>');

         contentBox.append(el);
      },

      syncUI: function() {
         this._moveReticle();
      },

   	scopeUp: function() {
   		var curr = this.get('curr');
   		// console.log('scoping up');

   		// limit at canvas top level
   	   if (curr.parent('#canvas').length == 0) {
   	     	curr = curr.parent().first();
   	   }

   	   this.set('curr', curr);
   	   this._moveReticle();
   	},
   	
   	scopeDown: function() {
   		console.log('scoping down');
   		var curr = this.get('curr');
 			if (curr.children().length > 0) {
	 			curr = curr.children().first();
 			}
   	   this.set('curr', curr);
   	   this._moveReticle();
   	},

   	moveUp: function() {
   		console.log('moving up')
   		var curr = this.get('curr');
   		if (curr.prev().length == 0) {
   	     	curr = curr.siblings().last();
   	   }
   	   else {
   		   curr = curr.prev();
   	   }
   	   this.set('curr', curr);
   	   this._moveReticle();
   	},

   	moveDown: function() {
   		console.log('moving down')
   		var curr = this.get('curr');
         console.log(curr)
   		if (curr.next().length == 0) {
   			curr = curr.siblings().first();
   		}
   		else {
   			curr = curr.next();
   		}
   	   this.set('curr', curr);
   	   this._moveReticle();
   	},

   	_moveReticle: function() {
   		var curr = this.get('curr');

			// var reticle = Y.one('#reticle');
         var reticle = $('#reticle');
			reticle.offset(curr.offset());
			reticle.width(curr.innerWidth());
			reticle.height(curr.innerHeight());

         this.fire('moved');
   	},

      showMenu: function(menu) {

         //sigh
         menu.render(Y.one('#reticle').one('.menu-container'));

      },

   	appendAfter: function(newEl) {
   		var curr = this.get('curr');
	      curr.after(newEl);
	      this.set('curr', newEl);
         this._moveReticle();
   	}

  }, {
   	NAME: 'Reticle',
   	ATTRS: {
   		curr: {
   			value: null
   		},

   		keyboard: {
   			value: null
   		}
   	}
  });

}, '1.0', {
    requires: ['node', 'event', 'base', 'widget']
});
