YUI.add('keyboard-model', function (Y) {

   Y.Reticle = Y.namespace('Y.Reticle');

  Y.Reticle.KeyboardModel = function() {
    Y.Reticle.KeyboardModel.superclass.constructor.apply(this, arguments);
  };

  //////////////////////////////////////////
  ///  KEY CODES
  ///
  var SHIFT_STATE = false;
  var SHIFT = [16];

  var J = 74; var K = 75;
  var UP = [38, K]; var LEFT = [37]; var DOWN = [40, J]; var RIGHT = [39];
  var DIRECTIONS = [UP, LEFT, DOWN, RIGHT];
  var DIRECTIONALS = UP.concat(LEFT).concat(DOWN).concat(RIGHT);

  var DEL = [46];
  var A = 65;
  var COMMANDS = [A, DEL];

  var keymap = Y.Node.DOM_EVENTS.key.eventDef.KEY_MAP;
  keymap.shift = 16;
  keymap.arrowup = 38;
  keymap.arrowleft = 37;
  keymap.arrowdown = 40;
  keymap.arrowright = 39;
  keymap.del = 46;

  //////////////////////////////////////////
  ///  KEYBAORD MODEL
  ///
  Y.extend(Y.Reticle.KeyboardModel, Y.Base, {

    initializer: function(config) {
      Y.Reticle.KeyboardModel.superclass.constructor.apply(this, arguments);

      this.listen();
      this.bindIndicators();
      this.bindMenuMan();

      // TODO need to 
      // maintain a stack of foci 
      // when a Menu appears, that is the new Focus
      // key events are now manipulating the new focus
    },

    bindMenuMan: function() {
      var menuMan = this.get('menuManager');
      menuMan.on('focused', function() {
        this.set('mode', 'MENU');
      }, this);
      menuMan.on('blur', function() {
        this.set('mode', 'NAV');
      }, this);

      this.on('modeChange', function() {
        // console.log('keyboardmode change')
      });
    },

    bindIndicators: function() {
			$(document).keyup(function(e) {

        var key = e.keyCode;

        // modifiers
        if (SHIFT.indexOf(key) >= 0) {
          SHIFT_STATE = false;
        }

        $('#shift-status').removeClass('on');
      });
    },

    listen: function() {

      Y.one(document).on('keydown', function(e) {
        // console.log(e.keyCode);
      });

      var reticle = this.get('reticle');
      var menuMan = this.get('menuManager');

      Y.one(document).on('key', this._showShift, 'shift', this);
      Y.one(document).on('key', this._hideShift, 'keyup:shift', this);

      var wrap = Y.bind(function(fun, scope) {
        return Y.bind(function(e) {
          if (this.get('mode') == 'NAV') {
            fun.call(scope, e);
          }
        }, this);
      }, this);

      // cancel menu
      Y.one(document).on('key', function(e) {
        menuMan.cancel();
      }, 'esc', this);

      // ENTER
      Y.one(document).on('key', wrap(function() {
        console.log('entering... ');

        // edit 
        // need to be able to edit/add text quickly from
        // ANY point... what if i have a mixed node already..


      }), 'enter', this);

      // DEL
      Y.one(document).on('key', wrap(function() {
        reticle.removeCurr();
      }), 'del', this);

      // E for editing a node
      Y.one(document).on('key', wrap(function(e) {
        menuMan.editCurrentNode();
        e.preventDefault();
      }, this), 'e', this);

      // A for appending text
      Y.one(document).on('key', wrap(function(e) {
        menuMan.editNewTextNode('append');
        e.preventDefault();
      }, this), 'a', this);

      // I for inserting text
      Y.one(document).on('key', wrap(function(e) {
        menuMan.editNewTextNode('insert');
        e.preventDefault();
      }, this), 'i', this);

      // I+SHIFT for insert element
      Y.one(document).on('key', wrap(function(e) {
        menuMan.showAddElementMenu('insert');
        e.halt();
        e.preventDefault();
      }, this), 'i+shift', this);

      // A+SHIFT for append element
      Y.one(document).on('key', wrap(function(e) {
        menuMan.showAddElementMenu('append');
        e.halt();
        e.preventDefault();
      }, this), 'a+shift', this);

      // J or DOWN
      Y.one(document).on('key', wrap(reticle.scopeDown, reticle), 'arrowdown+shift,74+shift', reticle);
      Y.one(document).on('key', wrap(function(e) {
        if (!e.shiftKey) {
          reticle.moveDown();
        }
      }, this), 'arrowdown,74', this);

      // K or UP`
      Y.one(document).on('key', wrap(reticle.scopeUp, reticle), 'arrowup+shift,75+shift', reticle);
      Y.one(document).on('key', wrap(function(e) {
        if (!e.shiftKey) {
          reticle.moveUp();
        }
      }, this), 'arrowup,75', this);

    },

    _showShift: function() {
      $('#shift-status').addClass('on');
    }

  }, {
    NAME: 'KeyboardModel',
    ATTRS: {
      reticle: {
        value: null
      },
      menuManager: {
        value: null
      },
      mode: {
        value: "NAV"
      }
    }
  });

}, '1.0', {
    requires: ['node', 'event', 'base']
});
