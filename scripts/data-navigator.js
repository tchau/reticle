YUI.add('reticle-data-navigator', function (Y) {

  Y.Reticle = Y.namespace('Y.Reticle');

  Y.Reticle.DataNavigator = function() {
    Y.Reticle.DataNavigator.superclass.constructor.apply(this, arguments);
  };

  Y.extend(Y.Reticle.DataNavigator, Y.Widget, {

    initializer: function() {
      Y.Reticle.DataNavigator.superclass.constructor.apply(this, arguments);
    },

    /**

      obj: {
        valueA: TERMINAL,
        valueB: obj,
        valueC: arr
      }

      [terminal1, terminal2]

    */

    renderUI: function() {
      var contentBox = this.get('contentBox');

      console.log(this.get('context'));
      var data = this.get('context');

      var menu = Y.Node.create("<div></div>");
      menu.addClass('data-navigator');
      contentBox.append(menu); 

      var rootNode = this._renderNodeForShit(data);
      menu.append(rootNode.get('children'));

      // Y.Object.each(data, function(value, key) {
      //   // make a child...?
      //   console.log(key);
      //   this._renderNodeForShit(value);
      //   // or just render a huge ass tree thing?
      //   // onclick - commit the path to that object? 
      // });
    },

    _renderNodeForShit: function(value, key) {
      if (Y.Lang.isArray(value)) {
        var arr = Y.Node.create('<div class="data-node array"><div class="key">' + key + '</div><div class="value"></div></div>');
        Y.Array.each(value, function(obj, i) {
          arr.one('.value').append(this._renderNodeForShit(obj, i));
        }, this);
        return arr;
      }
      else if (Y.Lang.isObject(value)) {
        var objEl = Y.Node.create('<div class="data-node object"><div class="key">' + key + '</div><div class="value"></div></div>');

        Y.Object.each(value, function(obj, okey) {
          objEl.one('.value').append(this._renderNodeForShit(obj, okey));
        }, this);
        
        return objEl;
      }
      else {
        // terminal
        return Y.Node.create('<div class="data-node terminal"><div class="key">' + key + '</div>  ' + value + '</div>');
      }

    },

    setXY: function(xy) {
      this.get('boundingBox').setXY(xy);
    },

    bindUI: function() {
      var contentBox = this.get('contentBox');
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
    }
  }, {
    NAME: 'DataNavigator',
    ATTRS: {

      context: {
        value: null // all the awesome page data we're gonna have
      },

      attr: {
        value: null // the html element attribute 
      },

      existingValue: {
        value: null // current value of the attribute
      }
    }
  });
}, '1.0', {
    requires: ['json', 'menu', 'reticle-attributes']
});
