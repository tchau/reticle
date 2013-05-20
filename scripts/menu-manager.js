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

      this.get('reticle').on('moved', function() {
        this._hideMenu();
      }, this);
    },

    _hideMenu: function() {
      var currMenu = this.get('currentMenu');
      var reticle = this.get('reticle');
      if (Y.Lang.isValue(currMenu)) {
        currMenu.destroy();
      }

      this.fire('blur');
    },

    cancel: function() {
      var currMenu = this.get('currentMenu');
      var reticle = this.get('reticle');

      // empty text nodes: kill them
      if (Y.Lang.isValue(currMenu)) {
        if (currMenu instanceof Y.Reticle.InlineTextMenu && currMenu.getText().trim() === "") {
          reticle.removeCurr();
        }
      }

      this._hideMenu();
    },

    // for purposes of context, what node we'll be putting into
    _getRootForMode: function(mode) {
      var reticle = this.get('reticle');
      if (mode == 'append') {
        return reticle.get('curr').get('parentNode');
      } else if (mode == 'insert') {
        return reticle.get('curr');
      }
      else {
        throw "Unsupported mode.";
      }
    },

    editNewTextNode: function(mode) {
      // var textNode = Y.Node.create('')
      var parser = this.get('parser');
      var reticle = this.get('reticle');
      var textNode;

      if (mode === 'insert') {
        textNode = parser.parse(Y.Node.create("&nbsp;"));
        reticle.insert(textNode);
      }
      else if (mode == 'append') {
        textNode = parser.parse(Y.Node.create("&nbsp;"));
        reticle.appendAfter(textNode);
      }

      // sort of like a menu.. where you can only edit text.. inline
      var menu = new Y.Reticle.InlineTextMenu({});
      menu.render(textNode);

      this.set('currentMenu', menu);
      this.fire('focused');
      menu.focus();

      // if you cancel with no contents...
      // delete the node
      menu.on('create-requested', function(e) {
        var text = menu.getText();
        textNode.empty();
        textNode.set('text', text);
        this._hideMenu();
      }, this);
    },

    showAddElementMenu: function(mode) {
      var reticle = this.get('reticle');
      var parser = this.get('parser');
      this._hideMenu();

      // menu
      var root = this._getRootForMode(mode);

      var menu = new Y.Reticle.Menu({
        mode: mode,
        rootNode: root
      });

      // generaets newEl
      menu.on('create-requested', function(e) {
        console.log("making a new one", e.elementName);
        var el = e.elementName;
        var node = Y.Node.create('<' + el + '></' + el + '>');

        if (mode == 'append') {
          reticle.appendAfter(parser.parse(node));
        } else if (mode == 'insert') {
          reticle.insert(parser.parse(node));
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
