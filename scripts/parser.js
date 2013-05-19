YUI.add('parser', function (Y) {

   Y.Reticle = Y.namespace('Y.Reticle');

   Y.Reticle.Parser = function() {
      Y.Reticle.Parser.superclass.constructor.apply(this, arguments);
   };

   var tags = ['div', 'span', 'h1'];

   Y.extend(Y.Reticle.Parser, Y.Base, {

   	initializer: function() {
         Y.Reticle.Parser.superclass.constructor.apply(this, arguments);
   		console.log('created new Parser');
   	},

   	// recursively parses DOM into data elements
   	parse: function(el) {

 		   // create blockEl from element attributes
 		   var blockEl = Y.Node.create('<div class="block-el"></div>');

         blockEl.setAttribute('data-nodeName', el.get('nodeName'));

         var id = el.get('id')
         if (Y.Lang.isValue(id) && id !== '')
    		   blockEl.setAttribute('data-id', id);

         var claz = el.get('className')
         if (Y.Lang.isValue(claz) && claz !== '')
    		   blockEl.setAttribute('data-classes', claz);

         console.log(blockEl);

   	   // children.each
         el.get('children').each(function(child) {
            // blockEl.apepend(parse(children))
            console.log(child);
            if (Y.Lang.isValue(child)) {
               blockEl.append(this.parse(child));
            }
         }, this);

 			// return blockEl
         return blockEl;
   	}

   }, {
   	NAME: 'Parser',
   	ATTRS: {
   		A: {
   			value: 'asdf'
   		}
   	}
   });

}, '1.0', {
    requires: ['node', 'event', 'base', 'handlebars']
});
