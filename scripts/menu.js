YUI.add('menu', function (Y) {

   Y.Reticle = Y.namespace('Y.Reticle');

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
      var inputEl = Y.Node.create('<input />');
      inputEl.set('value', this.get('value'));
      contentBox.append(inputEl);
      contentBox.append(Y.Node.create('<div class="hb-assist"></div>'));
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
      this.fire('create-requested', {});
    }

  }, {
    NAME: 'InlineTextMenu',
    ATTRS: {
      value: {
        value: "" // current value of the text node
      },
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

      // categories
      var categories = this._getCategoriesForTags(tags);
      Y.Array.each(categories, function(cat) {
        var catEl = Y.Node.create('<div class="tag-category"><div class="title"></div></div>');
        catEl.addClass(cat);
        catEl.one('.title').set('text', cat);
        tagset.append(catEl);
      });
      
      tagset.append(Y.Node.create('<div class="tag-category CONTENT"><div class="title">CONTENT</div></div>'));

      // render tags
      Y.Array.each(tags, function(tagMeta) {
        var tag = tagMeta.name;
        var chars = tag.split('');
        chars = Y.Array.map(chars, function(c) {
          return '<span class="' + c + '">' + c + "</span>";
        });

        var tagEl = Y.Node.create('<div class="tagname" data-name="' + tag + '">' +
            chars.join('') +
            '</div>');
        if (Y.Lang.isValue(tagMeta.category)) {
          tagset.one('.' + tagMeta.category).append(tagEl);
        }
        else {

          tagset.one('.CONTENT').append(tagEl);
        }
      });

      // empty?
      if (tagset.one('.CONTENT').all('.tagname').size() == 0) {
        tagset.one('.CONTENT').remove();
      }

      // now, tack on handlebars type shit
      // var hbEl = Y.Node.create('<div class="tag-category HANDLEBARS"><div class="title">HANDLEBARS</div></div>');
      // var hbExprEl = Y.Node.create('<div class="tagname" data-name="each">' +
      //       .join('') +
      //       '</div>');
      //   if (Y.Lang.isValue(tagMeta.category)) {
      // tagset.append(hbEl);

      menu.addClass('hidden');
      contentBox.append(menu);
    },

    _getCategoriesForTags: function(tags) {
      var cats = [];
      Y.Array.each(tags, function(tagMeta) {
        if (Y.Lang.isValue(tagMeta.category) && cats.indexOf(tagMeta.category) == -1) {
          cats.push(tagMeta.category);
        }
      });
      return cats;
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

      // enter key
      input.on('key', this.commit, 'enter', this);

      // need to make sure it highlights the ones where it matches
      // ALL chars in the input
      input.on('valuechange', this._highlightBestMatch, this);

      contentBox.delegate('hover', function(e) {
        this.set('bestMatch', e.currentTarget );
      }, '.tagname', this);

      contentBox.delegate('click', function(e) {
        this.set('bestMatch', e.currentTarget );
        this.commit();
      }, '.tagname', this);


      this.after('bestMatchChange', function() {
        var contentBox = this.get('contentBox');
        var tagset = contentBox.one('.tagset');
        var bestMatch = this.get('bestMatch');
        tagset.all('.best').removeClass('best');
        bestMatch.addClass('best');

        this.fire('preview-requested', {
          elementName: bestMatch.getAttribute('data-name')
        });
      }, this);
    },

    _highlightBestMatch: function() {
      var input = this.get('contentBox').one('input');
      var contentBox = this.get('contentBox');
      var tagset = contentBox.one('.tagset');

      // does this tag name contain all chars?
      var scoreTagForChars = function(tag, chars) {
        var score = 0;
        var tagNameChars = tag.getAttribute('data-name').split('');

        //dot product tagNameChars * chars
        for (var i = 0; i < tagNameChars.length; i++) {
          var c1 = tagNameChars[i];
          var c2 = chars[i];
          if (c1 == c2)
            score++;
        }

        return score;
      };

      tagset.all('.highlighted').removeClass('highlighted');
        var str = input.get('value');
        str = str.toUpperCase();
        var chars = str.split('');

        var partialMatches = [];
        var bestMatch = {
          tag: null,
          score: 0
        };
        tagset.all('.tagname').each(function(tag) {
          var score = scoreTagForChars(tag, chars);
          if (score > 0) {
            // contains all
            partialMatches.push(tag);
            Y.Array.each(chars, function(c) {
              tag.all('.' + c).addClass('highlighted');
            });
          }

          if (score > bestMatch.score) {
            bestMatch = {
              tag: tag,
              score: score
            };
          }
        });

        // special highlight for best match
        //var scores
        if (partialMatches.length > 0) {
          // partialMatches[0].addClass('best');
          if (this.get('bestMatch') != bestMatch) { // prevent jerkiness
            this.set('bestMatch', bestMatch.tag);
          }
        }
    },

    commit: function() {
      this.fire('create-requested', {
        elementName: this.get('bestMatch').getAttribute('data-name')
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
