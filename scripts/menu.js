YUI.add('menu', function (Y) {

   Y.Reticle = Y.namespace('Y.Reticle');

   Y.Reticle.Menu = function() {
      Y.Reticle.Menu.superclass.constructor.apply(this, arguments);
   };

   // var tags = 'a,div,span,img,h1,h2,h3,h4,table,tr';
   // tags = tags.split(',');




  var PROMPT_MODES = {
    appendAfter: 'Add Element',
    append: 'Insert Element'
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

      // what tags?


      var menu = Y.Node.create('<div>' + prompt +
          '<input type="text"></input>' +
          '<div class="tagset"></div>' +
          '<div class="foot">ENTER to commit</div>' +
        '</div>');
      menu.addClass('menu');

      var tagset = menu.one('.tagset');

      // show contextual menu
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

      contentBox.append(menu);
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
        console.log(tag.getAttribute('data-name'), does)
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
      console.log('committing choice');

      this.fire('create-requested', {
        elementName: this.get('bestMatch')
      });

    },

    focus: function() {
      this.get('contentBox').one('input').focus();
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
