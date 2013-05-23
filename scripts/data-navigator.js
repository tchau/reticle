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

      Y.Object.each(data, function(value, key) {
        // make a child...?

        // or just render a huge ass tree thing?
        // onclick - commit the path to that object? 

      });

      /*
        recursively
    
        make widgets... and stick listeners on them...??? or make each thing its own widget... with
        widget children..?

      */
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
