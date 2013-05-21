YUI.add('edit-menu', function (Y) {

   Y.Reticle = Y.namespace('Y.Reticle');

  Y.Reticle.EditMenu = function() {
    Y.Reticle.EditMenu.superclass.constructor.apply(this, arguments);
  };
  Y.extend(Y.Reticle.EditMenu, Y.Widget, {

    initializer: function() {
      Y.Reticle.Menu.superclass.constructor.apply(this, arguments);
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

      var attributesEl = menu.one('.attributes');

     // TODO load up existing values
     var nodeAttrs = JSON.parse(node.getAttribute('data-node-attributes'));
      Y.Array.each(attrs, function(attr) {
        console.log(attr);
        var existingValue = nodeAttrs[attr.name] || "";
        var attrEl = Y.Node.create('<div class="attribute-editor">' +
          '<label>' + attr.name + '</label>' +
          '</div>');
        attrEl.append(this._getInputForAttribute(attr, existingValue));
        attributesEl.append(attrEl);
      }, this);

      menu.addClass('hidden');
      contentBox.append(menu);
    },

    _getInputForAttribute: function(attr, existingValue) {

      if (attr.type == 'enum' && Y.Lang.isValue(attr.choices)) {
        var selectEl = Y.Node.create('<select class="attr-field" name="'+ attr.name+'"></select>');
        Y.Array.each(attr.choices, function(choice) {
          var opt = Y.Node.create('<option class="attr-enum-value" value="' + choice + '">' + choice + '</a>');
          selectEl.append(opt);
          if (existingValue == choice) {
            opt.setAttribute('selected', 'selected');
          }
        });
        return selectEl;
      }

      return Y.Node.create('<input class="attr-field" name="' + attr.name + '" value="' + existingValue + '"></input>');
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

    commit: function(tag) {
      var contentBox = this.get('contentBox');

      var nodeAttributes = {};
      contentBox.all('.attribute-editor .attr-field').each(function(input) {
        if (input.get('value').trim() !== '') {
          nodeAttributes[input.getAttribute('name')] = input.get('value');
        }
      });

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
    requires: ['json', 'menu', 'reticle-attributes']
});
