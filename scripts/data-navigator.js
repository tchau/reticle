YUI.add('reticle-data-navigator', function (Y) {

  Y.Reticle = Y.namespace('Y.Reticle');

  Y.Reticle.DataNavigator = function() {
    Y.Reticle.DataNavigator.superclass.constructor.apply(this, arguments);
  };

  Y.extend(Y.Reticle.DataNavigator, Y.Widget, {

    initializer: function() {
      Y.Reticle.DataNavigator.superclass.constructor.apply(this, arguments);
    },

    renderUI: function() {
      var contentBox = this.get('contentBox');

      console.log(this.get('context'));
      var data = this.get('context');

      var title = Y.Node.create("<div class='title'>Select a Variable</div>");
      var menu = Y.Node.create("<div></div>");
      menu.addClass('data-navigator');
      contentBox.append(title); 
      contentBox.append(menu); 

      var rootNode = this._renderNodeForShit(data);
      menu.append(rootNode.one('.value'));

      menu.addClass('hidden');

      // Y.Object.each(data, function(value, key) {
      //   // make a child...?
      //   console.log(key);
      //   this._renderNodeForShit(value);
      //   // or just render a huge ass tree thing?
      //   // onclick - commit the path to that object? 
      // });
    },

    bindUI: function() {
      var contentBox = this.get('contentBox');
      contentBox.delegate('click', function(e) {
        // need to get the PATH
        var targetNode = e.currentTarget;
        var ancestors = targetNode.ancestors('.data-node');

        var pathArr = this._generatePathFromAncstry(ancestors);
        pathArr.push(targetNode.getAttribute('data-key'));
        var path = pathArr.join('.');

        console.log("FULL PATH TO DATA: " + path);
        this.fire('create-requested', {
          variablePath: path
        });

        e.stopPropagation();
      }, '.data-node', this);

    },

    _generatePathFromAncstry: function(ancestors) {
      var keys = [];
      ancestors.each(function(ancestor) {
        keys.push( ancestor.getAttribute('data-key') );
      });
      return keys;
    },

    _renderNodeForShit: function(value, key) {
      if (Y.Lang.isArray(value)) {
        var arr = Y.Node.create('<div class="data-node array"><div class="key">' + key + '</div><div class="value"></div></div>');
        arr.setAttribute('data-key', key);
        Y.Array.each(value, function(obj, i) {
          arr.one('.value').append(this._renderNodeForShit(obj, i));
        }, this);
        return arr;
      }
      else if (Y.Lang.isObject(value)) {
        var objEl = Y.Node.create('<div class="data-node object"><div class="key">' + key + '</div><div class="value"></div></div>');
        objEl.setAttribute('data-key', key);

        Y.Object.each(value, function(obj, okey) {
          objEl.one('.value').append(this._renderNodeForShit(obj, okey));
        }, this);

        return objEl;
      }
      else {
        // terminal
        var terminalEl = Y.Node.create('<div class="data-node terminal"><div class="key">' + key + '</div>  ' + value + '</div>');
        terminalEl.setAttribute('data-key', key);
        return terminalEl;
      }

    },
    // blip in
    show: function() {
      var contentBox = this.get('contentBox');
      contentBox.removeClass('hidden');
      contentBox.addClass('shown');
    },
    setXY: function(xy) {
      this.get('boundingBox').setXY(xy);
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
