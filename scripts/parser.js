YUI.add('parser', function (Y) {

   Y.Reticle = Y.namespace('Y.Reticle');

   Y.Reticle.Parser = function() {
      Y.Reticle.Parser.superclass.constructor.apply(this, arguments);
   };

   var tags = ['div', 'span', 'h1'];
   var isHandlebarsBlock = function(tagName) {
    var meta = Y.Reticle.TagMeta.findByName(tagName);
    return Y.Lang.isValue(meta.type) && meta.type == 'handlebars';
   };

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

    // recursively parses the block-els we have and creates real html
    stringify: function(blockEl) {

      if (blockEl.hasClass('text')) {
        // console.log(blockEl.get('text'));
        // var textEl = Y.Node.create(blockEl.get('text'));
        // if (Y.Lang.isValue(textEl)) {
        //   return textEl.get('outerHTML');
        // }
        // else {
        //   return '';
        // }
        return blockEl.get('text');
      }

      var tagName = blockEl.getAttribute('data-node-name');
      var nodeAttributes = JSON.parse(blockEl.getAttribute('data-node-attributes'));

      if (isHandlebarsBlock(tagName)) {
        // handlebars
        // return '{{'
        var childStr = "";
        blockEl.all('> .block-el').each(function(child) {
          childStr += this.stringify(child);
        }, this);

        // argument to the handlebars block thing
        // return '{{' + tagName + ' ' + nodeAttributes.argument + '}}' + childStr + '{{/' + tagName + '}}';
        // var hbStr = '{{#' + tagName.toLowerCase() + ' ' + 'collection' + '}}' + childStr + '{{/' + tagName.toLowerCase() + '}}';
        console.log("HB CHILD STR " + childStr);
        var hbStr = '{{#' + tagName.toLowerCase() + ' ' + nodeAttributes.argument + '}}' + childStr + '{{/' + tagName.toLowerCase() + '}}';
        // console.log(hbStr);
        return hbStr;
      }
      else {

        // stupid BR
        if (tagName == 'BR')
          return '<br />';

        // plain HTML
        var node = Y.Node.create('<' + tagName + '></' + tagName + '>');

        Y.Object.each(nodeAttributes, function(value, key) {
          if (Y.Lang.isValue(value)) {
            node.setAttribute(key, value);
          }
        });

        blockEl.all('> .block-el').each(function(child) {
          node.append(this.stringify(child));
        }, this);
      }
      return node.get('outerHTML');
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

      if (isHandlebarsBlock(nodeName)) {
        blockEl.addClass('handlebars-block');
      }

      // NODE NAME (div, span etc)
      blockEl.setAttribute('data-node-name', el.get('nodeName'));

      // transfer all attributes into a data object
      var nodeAttributes = {};
      Y.Array.each(el.getDOMNode().attributes, function(attr) {
        var key = attr.name;
        var value = attr.value;
        nodeAttributes[key] = value;
      });

      blockEl.setAttribute('data-node-attributes', JSON.stringify(nodeAttributes));

      // RECURSE
      // TODO this does not account for text nodes
      el.get('childNodes').each(function(child) {
        if (Y.Lang.isValue(child)) {

         if (! (child.get('nodeType') == 3 && child.get('text').trim() == '')) {
            blockEl.append(this.parse(child));
         }
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
    requires: ['node', 'json', 'event', 'base', 'handlebars', 'reticle-attributes']
});
