YUI.add('menu-manager', function (Y) {

   Y.Reticle = Y.namespace('Y.Reticle');

   Y.Reticle.MenuManager = function() {
      Y.Reticle.MenuManager.superclass.constructor.apply(this, arguments);
   };

   var tags = ['div', 'span', 'h1'];

   Y.extend(Y.Reticle.MenuManager, Y.Base, {

   	initializer: function() {
      Y.Reticle.MenuManager.superclass.constructor.apply(this, arguments);
   		console.log('created new menumanager');

      this.get('reticle').on('moved',function () {
        this._hideMenu();
      }, this);
   	},

    _hideMenu: function() {
      var currMenu = this.get('currentMenu');
      if (Y.Lang.isValue(currMenu)) {
         currMenu.destroy();
      }

      this.fire('blur');
    },

    cancel: function() {
      console.log('cancelling')
      this._hideMenu();
    },

   	showAddMenu: function(mode) {
      var reticle = this.get('reticle');
      var parser = this.get('parser');
      this._hideMenu();
      
      // menu
      var root;
      if (mode == 'appendAfter') {
        root = reticle.get('curr').get('parentNode');
      }
      else if (mode == 'append'){
        root = reticle.get('curr');
      }

      var menu = new Y.Reticle.Menu({
        mode: mode,
        rootNode: root
      });

   		// generaets newEl
   		menu.on('create-requested', function(e) {
        console.log("making a new one", e.elementName);
        var el = e.elementName;
        var node = Y.Node.create('<' + el + '></' + el + '>');

        if (mode == 'appendAfter') {
          reticle.appendAfter(parser.parse(node));
        }
        else if (mode == 'append') {
          reticle.append(parser.parse(node));
        }

        this._hideMenu();
   		}, this);

      reticle.showMenu(menu);
      menu.focus();
      this.set('currentMenu', menu);
      this.fire('focused');
   	}

   }, {
   	NAME: 'MenuManager',
   	ATTRS: {
   		reticle: {
   			value: null
   		},
         parser: {
            value: null
         }
   	}
   });

}, '1.0', {
    requires: ['node', 'event', 'base', 'handlebars', 'menu']
});
