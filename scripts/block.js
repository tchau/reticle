YUI.add('reticle-block', function (Y) {

  Y.Reticle = Y.namespace('Y.Reticle');

  Y.Reticle.Block = function() {
    Y.Reticle.Block.superclass.constructor.apply(this, arguments);
  };

  Y.Reticle.Block = Y.Base.create('block', Y.Widget, [Y.WidgetParent, Y.WidgetChild], {

    initializer: function() {
      Y.Reticle.Block.superclass.constructor.apply(this, arguments);
    },

    renderUI: function() {
      var contentBox = this.get('contentBox');
      var el = this.get('el');

      if (el.get('nodeType') == 3) {
        var blockEl = Y.Node.create('<div class="block-el text"></div>');
        blockEl.append(el.get('nodeValue'));
      }
      else {
        var blockEl = Y.Node.create('<div class="block-el"></div>');
        var nodeName = el.get('nodeName');
        blockEl.addClass(Y.Reticle.TagMeta.findByName(nodeName).displayType);

        // NODE NAME (div, span etc)
        blockEl.setAttribute('data-node-name', el.get('nodeName'));

        // transfer all attributes into a data object
        var nodeAttributes = {};
        Y.Array.each(el.getDOMNode().attributes, function(attr) {
          var key = attr.name;
          var value = attr.value;
          nodeAttributes[key] = value;
        });

        console.log(nodeAttributes);
        blockEl.setAttribute('data-node-attributes', JSON.stringify(nodeAttributes));
      }

      contentBox.append(blockEl);
    },

    bindUI: function() {
      var contentBox = this.get('contentBox');
    }
  }, {
    NAME: 'Block',
    ATTRS: {
      attr: {
        value: null // the html element attribute 
      },

      existingValue: {
        value: null // current value of the attribute
      },

      el: {
        value: null
      }
    }
  });
}, '1.0', {
    requires: ['node', 'widget', 'widget-parent', 'widget-child', 'json', 'event', 'base', 'handlebars', 'reticle-attributes']
});
