YUI.add('reticle-underlier-editor', function (Y) {

  Y.Reticle = Y.namespace('Y.Reticle');

  Y.Reticle.UnderlierEditor = function() {
    Y.Reticle.UnderlierEditor.superclass.constructor.apply(this, arguments);
  };

  Y.extend(Y.Reticle.UnderlierEditor, Y.Widget, {

    initializer: function() {
      Y.Reticle.UnderlierEditor.superclass.constructor.apply(this, arguments);
    },

    renderUI: function() {
      var contentBox = this.get('contentBox');

      var title = Y.Node.create("<div class='title'>" + this.get("title") + "</div>");
      contentBox.addClass('menu');
      contentBox.append(title);
      contentBox.append(Y.Node.create('<textarea cols="45" rows="15"></textarea>'));
      contentBox.append(Y.Node.create('<button class="commit-button">Save</button>'));

    },

    syncUI: function() {
      var contentBox = this.get('contentBox');
      contentBox.one('textarea').set('value', this.get('initialValue'));
    },

    bindUI: function() {
      var contentBox = this.get('contentBox');
      contentBox.delegate('click', function(e) {

        this.fire('create-requested', {
          newData: contentBox.one('textarea').get('value')
        });

      }, '.commit-button', this);
    },

    // blip in
    show: function() {
      var contentBox = this.get('contentBox');
      contentBox.removeClass('hidden');
      contentBox.addClass('shown');
    },
    setXY: function(xy) {
      this.get('boundingBox').setXY(xy);
    }

  }, {
    NAME: 'UnderlierEditor',
    ATTRS: {
      title: {
        value: ''
      },
      initialValue: {
        value: null
      }
    }
  });
}, '1.0', {
    requires: ['json', 'menu', 'reticle-attributes']
});
