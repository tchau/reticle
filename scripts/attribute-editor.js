YUI.add('reticle-attribute-editor', function (Y) {

  Y.Reticle = Y.namespace('Y.Reticle');

  // Fires:
  //  	preview-requested
  //    changed

  Y.Reticle.AttributeEditor = function() {
    Y.Reticle.AttributeEditor.superclass.constructor.apply(this, arguments);
  };

  Y.extend(Y.Reticle.AttributeEditor, Y.Widget, {

    initializer: function() {
      Y.Reticle.AttributeEditor.superclass.constructor.apply(this, arguments);
    },

    renderUI: function() {
      var contentBox = this.get('contentBox');

      var attr = this.get('attr');
      var existingValue = this.get('existingValue');

      // render attribute fiels
      console.log(attr);
      var attrEl = Y.Node.create('<div class="attribute-editor">' +

          '<label>' + attr.name + '</label>' +
          '<div class="field"></div>' +
          '<div class="choices"></div>' +
          '</div>');

      // attrEl.append(this._getInputForAttribute(attr, existingValue));
      var inputEl = Y.Node.create('<input class="attr-field" name="' + attr.name + '" value="' + existingValue + '"></input>');
      attrEl.one('.field').append(inputEl);

    	// create a helper for enums
      if (attr.type == 'enum' && Y.Lang.isValue(attr.choices)) {
      	Y.Array.each(attr.choices, function(choice) {
	      	var choiceEl = Y.Node.create('<a class="enum-value">' + choice + '</a>') ;
	      	choiceEl.setData(choice);
	      	attrEl.one('.choices').append(choiceEl);
      	});
      }

      contentBox.append(attrEl);
    },

    _getInputForAttribute: function(attr, existingValue) {
    	var contentBox = this.get('contentBox');

    },

    _requestPreview: function(value) {
      	console.log('preview', value);
      	this.fire('preview-requested', {
      		// mock value
      		value: value
      	});
    },

    bindUI: function() {
      var contentBox = this.get('contentBox');
      contentBox.one('.attr-field').on('change', function() {
      	this._requestPreview(this.getValue());
      }, this);

      // do we want selects or just a cloud of values...?
      // select hovers
      contentBox.delegate('hover', function(e) {
      	this._requestPreview(e.target.getData());
      }, '.enum-value', this);

      contentBox.delegate('click', function(e) {
      	contentBox.one('.attr-field').set('value', e.target.getData());
      	this._requestPreview(e.target.getData());
      }, '.enum-value', this);

    },

    getName: function() {
    	return this.get('attr').name;
    },

    getValue: function() {
    	var input = this.get('contentBox').one('.attr-field');
      if (input.get('value').trim() !== '') {
        return input.get('value');
      }
      else {
      	return null;
      }
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
    NAME: 'AttributeEditor',
    ATTRS: {
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
