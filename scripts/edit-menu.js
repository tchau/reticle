YUI.add('edit-menu', function (Y) {

   Y.Reticle = Y.namespace('Y.Reticle');

  Y.Reticle.EditMenu = function() {
    Y.Reticle.EditMenu.superclass.constructor.apply(this, arguments);
  };
  Y.extend(Y.Reticle.EditMenu, Y.Widget, {

    initializer: function() {
      Y.Reticle.Menu.superclass.constructor.apply(this, arguments);

      // the editors we manage
      this._attributeEditors = [];
    },

    renderUI: function() {
      var contentBox = this.get('contentBox');
      var node = this.get('node');

      var nodeName = node.getAttribute('data-node-name');
      var meta = Y.Reticle.TagMeta.findByName(nodeName);
      var attrs = Y.Reticle.BaseAttributes.concat(meta.attributes || []);

      prompt = 'Edit ' + nodeName;

      var menu = Y.Node.create('<div><div class="prompt">' + prompt + '</div>' +
          '<div class="attributes"></div>' +
          '<div class="foot">ENTER to commit</div>' +
        '</div>');
      menu.addClass('menu');

      // render attribute fiels
      var nodeAttrs = JSON.parse(node.getAttribute('data-node-attributes'));
      Y.Array.each(attrs, function(attr) {
        var attrEditor = new Y.Reticle.AttributeEditor({
          attr: attr, 
          existingValue: nodeAttrs[attr.name] || ""
        });

        attrEditor.render(menu.one('.attributes'));
        this._attributeEditors.push(attrEditor);

        attrEditor.on('preview-requested', function(e) {
          var potentialValue = e.value;
          var nodeAttributes = this.getValue();
          nodeAttributes[attr.name] = potentialValue;
          this.fire('preview-requested', {
            nodeAttributes: nodeAttributes
          })
        }, this);
      }, this);

      menu.addClass('hidden');
      contentBox.append(menu);
    },

    // blip in
    show: function() {
      var contentBox = this.get('contentBox');
      contentBox.one('.menu').removeClass('hidden');
      contentBox.one('.menu').addClass('shown');
    },

    hide: function() {
      var contentBox = this.get('contentBox');
      contentBox.one('.menu').removeClass('shown');
      contentBox.one('.menu').addClass('hidden');
    },

    bindUI: function() {
      var contentBox = this.get('contentBox');

      // enter key
      contentBox.delegate('key', Y.bind(this.commit, this), 'enter', 'input');
    },

    getValue: function() {
      var nodeAttributes = {};
      Y.Array.each(this._attributeEditors, function(ed) {
        nodeAttributes[ed.getName()] = ed.getValue();
      });
      return nodeAttributes;
    },

    commit: function(tag) {
      var contentBox = this.get('contentBox');

      nodeAttributes = this.getValue();

      console.log('Commit Edit', nodeAttributes);

      this.fire('update-requested', {
        nodeAttributes: nodeAttributes
      });
    },

    focus: function() {
    	if (Y.Lang.isValue(this.get('contentBox').one('input'))) {
	      this.get('contentBox').one('input').focus();
    	}
    },

    setXY: function(xy) {
      this.get('boundingBox').setXY(xy);
    }

  }, {
    NAME: 'EditMenu',
    ATTRS: {
      node: {
        value: null
      }
    }
  });
}, '1.0', {
    requires: ['json', 'menu', 'reticle-attributes', 'reticle-attribute-editor']
});
