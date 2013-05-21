YUI.add('menu', function (Y) {

   Y.Reticle = Y.namespace('Y.Reticle');

   // var tags = 'a,div,span,img,h1,h2,h3,h4,table,tr';
   // tags = tags.split(',');

  var PROMPT_MODES = {
    append: 'Add Element',
    insert: 'Insert Element'
  };

  Y.Reticle.InlineTextMenu = function() {
    Y.Reticle.InlineTextMenu.superclass.constructor.apply(this, arguments);
  };

  Y.extend(Y.Reticle.InlineTextMenu, Y.Widget, {

    renderUI: function() {
      var contentBox = this.get('contentBox');
      console.log('rendering.....');
      contentBox.append(Y.Node.create('<input />'));
    },

    bindUI: function() {
      var contentBox = this.get('contentBox');
      contentBox.one('input').on('key', function() {
        this.commit();
      }, 'enter', this);
    },

    focus: function() {
      var contentBox = this.get('contentBox');
      contentBox.one('input').focus();
    },

    getText: function() {
      var contentBox = this.get('contentBox');
      return contentBox.one('input').get('value');
    },

    commit: function() {
      this.fire('create-requested', {
        elementName: this.get('bestMatch')
      });
    }

  }, {
    NAME: 'InlineTextMenu',
    ATTRS: {
      mode: {
        value: null // insert, append
      }
    }
  });


  Y.Reticle.Menu = function() {
    Y.Reticle.Menu.superclass.constructor.apply(this, arguments);
  };
  Y.extend(Y.Reticle.Menu, Y.Widget, {

    initializer: function() {
      Y.Reticle.Menu.superclass.constructor.apply(this, arguments);
      console.log('created new Menu');
    },

    renderUI: function() {
      var contentBox = this.get('contentBox');

      // what action?
      var prompt = PROMPT_MODES[this.get('mode')];

      var menu = Y.Node.create('<div><div class="prompt">' + prompt + '</div>' +
          '<input type="text"></input>' +
          '<div class="tagset"></div>' +
          '<div class="foot">ENTER to commit</div>' +
        '</div>');
      menu.addClass('menu');

      // show contextual menu
      var tagset = menu.one('.tagset');
      var tags = this._getFilteredTags();
      Y.Array.each(tags, function(tagMeta) {
        var tag = tagMeta.name;
        var chars = tag.split('');
        chars = Y.Array.map(chars, function(c) {
          return '<span class="' + c + '">' + c + "</span>";
        });
        tagset.append(
          Y.Node.create('<div class="tagname" data-name="' + tag + '">' +
          chars.join('') +
          '</div>'));
      });

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

    _getFilteredTags: function() {
      var root = this.get('rootNode');
      var rootMeta = Y.Reticle.TagMeta.findByName(root.getAttribute('data-node-name'));

      var filtered = [];

      console.log("ROOT META: ", rootMeta);

      // if this root has a strict list, filter only those in that list
      if (Y.Lang.isValue(rootMeta.validChildren)) {
        Y.Array.each(Y.Reticle.Tags, function(meta) {
          if (rootMeta.validChildren.indexOf(meta.name) > -1) {
            filtered.push(meta);
          }
        });
      } else {
        // go through all potential children
        Y.Array.each(Y.Reticle.Tags, function(meta) {
          // if it has a strict parent, see if it matches the root
          if (Y.Lang.isValue(meta.validParents)) {
            if (meta.validParents.indexOf(rootMeta.name) > -1) {
              filtered.push(meta);
            }
          } else {
            // else good to go
            filtered.push(meta);
          }
        });
      }

      // if this root has no strict list


      return filtered;
    },

    bindUI: function() {
      var input = this.get('contentBox').one('input');
      var contentBox = this.get('contentBox');
      var tagset = contentBox.one('.tagset');

      var containsAll = function(tag, chars) {

        var does = Y.Array.reduce(chars, true, function(prev, c) {
          return prev && Y.Lang.isValue(tag.one('.' + c));
        });
        console.log(tag.getAttribute('data-name'), does);
        return does;
      };

      // enter key
      input.on('key', function() {
        // find best match..
        this.commit();
      }, 'enter', this);

      // need to make sure it highlights the ones where it matches
      // ALL chars in the input
      input.on('valuechange', function() {
        tagset.all('.highlighted').removeClass('highlighted');
        var str = input.get('value');
        str = str.toUpperCase();
        var chars = str.split('');

        var partialMatches = [];

        tagset.all('.tagname').each(function(tag) {
          if (containsAll(tag, chars)) {
            // contains all
            partialMatches.push(tag);
            Y.Array.each(chars, function(c) {
              tag.all('.' + c).addClass('highlighted');
            });
          }
        });

        // special highlight for best match
        //var scores
        tagset.all('.best').removeClass('best');
        if (partialMatches.length > 0) {
          partialMatches[0].addClass('best');
          this.set('bestMatch', partialMatches[0].getAttribute('data-name'));
        }
      }, this);

    },

    commit: function(tag) {
      this.fire('create-requested', {
        elementName: this.get('bestMatch')
      });
    },

    focus: function() {
      this.get('contentBox').one('input').focus();
    },

    setXY: function(xy) {
      this.get('boundingBox').setXY(xy);
    }

  }, {
    NAME: 'Menu',
    ATTRS: {
      bestMatch: {
        value: null
      },
      mode: {
        value: null // appendAfter, append
      },
      rootNode: {
        value: null
      }
    }
  });
}, '1.0', {
    requires: ['node', 'array-extras', 'event', 'base', 'handlebars', 'widget', 'reticle-attributes']
});
