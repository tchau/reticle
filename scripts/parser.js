YUI.add('parser', function (Y) {

   Y.Reticle = Y.namespace('Y.Reticle');

   Y.Reticle.Parser = function() {
      Y.Reticle.Parser.superclass.constructor.apply(this, arguments);
   };

   var tags = ['div', 'span', 'h1'];

   Y.extend(Y.Reticle.Parser, Y.Base, {

    initializer: function() {
      Y.Reticle.Parser.superclass.constructor.apply(this, arguments);
      console.log('created new Parser');
    },

    _makeTextNode: function(el) {
      var blockEl = Y.Node.create('<div class="block-el text"></div>');
      blockEl.append(el.get('nodeValue'));
      return blockEl;
    },

    // recursively parses DOM into data elements
    parse: function(el) {

      // base case: TEXT node
      if (el.get('nodeType') == 3) {
        return this._makeTextNode(el);
      }

      // create blockEl from element attributes
      var blockEl = Y.Node.create('<div class="block-el"></div>');
      var nodeName = el.get('nodeName');
      blockEl.addClass(Y.Reticle.TagMeta.findByName(nodeName).displayType);

      // NODE NAME (div, span etc)
      blockEl.setAttribute('data-node-name', el.get('nodeName'));

      // ID
      var id = el.get('id');
      if (Y.Lang.isValue(id) && id !== '') {
        blockEl.setAttribute('data-id', id);
      }

      // CLASSES
      var claz = el.get('className');
      if (Y.Lang.isValue(claz) && claz !== '')
        blockEl.setAttribute('data-classes', claz);

      // RECURSE
      // TODO this does not account for text nodes
      el.get('children').each(function(child) {
        if (Y.Lang.isValue(child)) {
          blockEl.append(this.parse(child));
        }
      }, this);

      return blockEl;
    }

  }, {
    NAME: 'Parser',
    ATTRS: {
      A: {
        value: 'asdf'
      }
    }
  });

}, '1.0', {
    requires: ['node', 'event', 'base', 'handlebars', 'reticle-attributes']
});
