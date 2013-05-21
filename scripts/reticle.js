YUI.add('reticle', function (Y) {

   Y.Reticle = Y.namespace('Y.Reticle');

   Y.Reticle.Reticle = function() {
      Y.Reticle.Reticle.superclass.constructor.apply(this, arguments);
   };

   Y.extend(Y.Reticle.Reticle, Y.Widget, {

    initializer: function(config) {
      Y.Reticle.Reticle.superclass.constructor.apply(this, arguments);
      console.log('created new Reticle');
    },

    renderUI: function() {
       var contentBox = this.get('contentBox');

       var el = Y.Node.create('<div id="reticle">' +
             '<div class="info-panel"></div><div class="commands">'+
             '<span class="insert">insert</span><span class="add">add</span></span class="edit">edit</span></div>' +
          '</div>');

       contentBox.append(el);
    },

    syncUI: function() {
       this._moveReticle();
    },

    scopeUp: function() {
      var curr = this.get('curr');

      // limit at canvas top level
      if (curr.get('parentNode').get('id') !== 'canvas') {
        curr = curr.get('parentNode');
      }

      this.set('curr', curr);
      this._moveReticle();
    },

    scopeDown: function() {
      var curr = this.get('curr');
      if (curr.get('children').size() > 0) {
        curr = curr.get('children').item(0);
      }
      this.set('curr', curr);
      this._moveReticle();
    },

    moveUp: function() {
      var curr = this.get('curr');
      if (!Y.Lang.isValue(curr.previous())) {
        curr = curr.siblings('.block-el:last-child').item(0);
      } else {
        curr = curr.previous();
      }
      this.set('curr', curr);
      this._moveReticle();
    },

    moveDown: function() {
      var curr = this.get('curr');

      if (!Y.Lang.isValue(curr.next())) {
        curr = curr.siblings('.block-el:first-child').item(0);
      } else {
        curr = curr.next();
      }
      this.set('curr', curr);
      this._moveReticle();
    },

    _moveReticle: function() {
      var curr = this.get('curr');
			var reticle = Y.one('#reticle');

      reticle.setXY(curr.getXY());
      reticle.setStyles({
        width: curr.get('offsetWidth') - 2,
        height: curr.get('offsetHeight') -2
      });

      // update menu with context
      this._updateMenuWithContext(Y.Reticle.TagMeta.getCapabilityContext(curr));


      this.fire('moved');
    },

    _updateMenuWithContext: function(context) {

      // if it's a text node ... cannot do inserts
      var reticle = Y.one('#reticle');
      if (!context.insertable)
        reticle.one('.commands .insert').hide();


      // if it's an INPUT tag, can't do inserts

    },

    showMenu: function(menu) {

      // sigh
      // menu.render(Y.one('#reticle').one('.menu-container'));
      var reticle = Y.one('#reticle');

      menu.render('#menu-layer');
      var reticleXY = reticle.getXY();
      menu.setXY([
        reticleXY[0],
        reticleXY[1] + reticle.get('offsetHeight')
      ]);

      menu.show();

    },

    removeCurr: function() {
      var curr = this.get('curr');

      var newCurr;

      if (Y.Lang.isValue(curr.next())) {
        newCurr = curr.next();
      }
      else if (Y.Lang.isValue(curr.previous())) {
        newCurr = curr.previous();
      }
      else {
        newCurr = curr.get('parentNode');
      }

      curr.remove();
      this.set('curr', newCurr);
      this._moveReticle();
      this.fire('structure-change');
    },

    // nests it inside
    insert: function(newEl) {
      var curr = this.get('curr');
      curr.insert(newEl);
      this.set('curr', newEl);
      this._moveReticle();

      // move somehwere else...into a structuremanager thing
      this.fire('structure-change');
    },

    // appends after as sibling
    appendAfter: function(newEl) {
      var curr = this.get('curr');
      curr.insert(newEl, 'after');
      this.set('curr', newEl);
      this._moveReticle();

      // move somehwere else...into a structuremanager thing
      this.fire('structure-change');
    },

    // update curr with new attributes
    update: function(nodeAttributes) {
      var curr = this.get('curr');
      curr.setAttribute('data-node-attributes', JSON.stringify(nodeAttributes));
      this.fire('structure-change');
    },

    refresh: function() {
      this._moveReticle();
      this.fire('structure-change');
    }

  }, {
    NAME: 'Reticle',
    ATTRS: {
      curr: {
        value: null,
        validator: function(v) {
          return Y.Lang.isValue(v);
        }
      },

      keyboard: {
        value: null
      }
    }
  });

}, '1.0', {
  requires: ['node', 'event', 'base', 'widget']
});