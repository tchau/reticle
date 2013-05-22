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
    },

    _hideMenu: function() {
      var currMenu = this.get('currentMenu');
      var reticle = this.get('reticle');
      if (Y.Lang.isValue(currMenu)) {
        currMenu.destroy();
        this.set('currentMenu', null);
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

    editCurrentNode: function() {
      // show all node attributes
      var reticle = this.get('reticle');
      var curr = reticle.get('curr');

      // text nodes
      if (curr.hasClass('text')) {
        this._editTextNode(curr);
      }
      else {
        var menu = new Y.Reticle.EditMenu({
          node: curr
        });

        menu.on('preview-requested', function(e) {
          reticle.update(e.nodeAttributes);
        });

        menu.on('update-requested', function(e) {
          this._hideMenu();

          //commit the update...
          reticle.update(e.nodeAttributes);
        }, this);

        reticle.showMenu(menu);
        this.set('currentMenu', menu);
        this.fire('focused');
        menu.focus();
      }
    },

    _editTextNode: function(textNode) {
      var reticle = this.get('reticle');
      // sort of like a menu.. where you can only edit text.. inline
      var menu = new Y.Reticle.InlineTextMenu({
        value: textNode.get('text')
      });
      textNode.empty();
      menu.render(textNode);

      this.set('currentMenu', menu);
      this.fire('focused');
      menu.focus();

      // if you cancel with no contents...
      // delete the node
      menu.on('create-requested', function(e) {
        var text = menu.getText();
        this._hideMenu();
        textNode.empty();
        textNode.set('text', text);
        reticle.refresh();
      }, this);
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
      this._editTextNode(textNode);

      reticle.refresh();
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

      // displays candidate node
      menu.on('preview-requested', function(e) {

        // hacky
        if (Y.one('#append-candidate')) {
          reticle.removeCurr();
        }
        var newBlockEl = this._makeNodeFromTagName(e.elementName);
        newBlockEl.setAttribute('id', 'append-candidate');
        this._appendForMode(newBlockEl, mode);

      }, this);

      // generaets newEl
      menu.on('create-requested', function(e) {
        var tagName = e.elementName;

        var newBlockEl = this._makeNodeFromTagName(tagName);
        this._hideMenu();
        this._appendForMode(newBlockEl, mode);

      }, this);

      reticle.showMenu(menu);
      menu.focus();
      this.set('currentMenu', menu);
      this.fire('focused');
    },

    _appendForMode: function(newBlockEl, mode) {
      var reticle = this.get('reticle');
      if (mode == 'append') {
        reticle.appendAfter(newBlockEl);
      } else if (mode == 'insert') {
        reticle.insert(newBlockEl);
      }
    },

    _makeNodeFromTagName: function(tagName) {
      var parser = this.get('parser');

      var node;
      // do it differently for BR...buggy
      if (tagName== 'BR')
        node = Y.Node.create('<BR />');
      else
        node = Y.Node.create('<' + tagName + '></' + tagName + '>');

      this._populateDefaults(tagName, node);
      var newBlockEl = parser.parse(node);
      return newBlockEl;
    },

    _populateDefaults: function(tagName, node) {
      var meta = Y.Reticle.TagMeta.findByName(tagName);
      Y.Array.each(meta.attributes, function(attribute) {
        console.log("POP DEF", attribute);
        if (Y.Lang.isValue(attribute.defaultValue)) {
          node.setAttribute(attribute.name, attribute.defaultValue);
        }
      });

      if (Y.Lang.isValue(meta.defaultContent)) {
        node.set('text', meta.defaultContent);
      }

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
    requires: ['node', 'event', 'base', 'handlebars', 'menu', 'edit-menu']
});
