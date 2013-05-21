YUI.add('reticle-attributes', function (Y) {

   Y.Reticle = Y.namespace('Y.Reticle');

	/***
		Encodes knowledge of HTML
	*/
	var helpers = {
		mimeType: function() {

		}
	};

	/**
		do we want to enumerate all valid children...
		or simply say which tags MUST be inside of certain others? 

		in many cases it's infeasible...
		well, we can do a combo

			// only valid within a select
			OPTION
				validParents: select

			// cannot contain children
			A
				validChildren: []

			// null means anything is good
			DIV
				validChildren: null
	*/


	// map or ... fuck.
	// this should probably just be a list

	Y.Reticle.Tags = [
		{
			name: 'A',
			displayType: 'inline',
			validChildren: ['IMG']
		},

		{
			name: 'DIV',
			displayType: 'block'
		},

		{
			name: 'UL',
			attributes: [],
			validChildren: ['LI'],
			displayType: 'block'
		},

		{
			name: 'IMG',
			attributes: ['src'],
			validChildren: [],
			displayType: 'inline'
		},

		{
			name: 'INPUT',
			displayType: 'block',
			terminal: true, // a terminal tag, has no children
			attributes: [
				{
					name: 'accept',
					// literal or function
					values: [ 'audio/*', 'video/*', 'image/*', helpers.mimeType ]
				},

				{
					name: 'align',
					warn: 'deprecated in html4.01',
					values: [ 'left', 'right', 'top', 'middle', 'bottom' ]
				},

				{ name: 'formaction', values: [ helpers.url ] },

				{ name: 'type', values: ['button', 'checkbox', 'radio'] }
			]
		},

		{
			name: 'P',
			displayType: 'block'
		},

		{
			name: 'LI',
			validParents: 'UL',
			validChildren: 'UL',
			displayType: 'block'
		},

		{
			name: 'SELECT',
			validChildren: ['OPTION'],
			displayType: 'block'
		},

		{
			name: 'OPTION',
			displayType: 'block',
			validParents: ['SELECT']
		},

		{
			name: 'SPAN',
			displayType: 'inline'
		}
	];

	Y.Reticle.TagMeta = {
		findByName: function(name) {
			return Y.Array.find(Y.Reticle.Tags, function(meta) {
				return (meta.name === name);
			});
		}
		// getAsList: function() {
		// 	var list = [];
		// 	Y.Object.each(Y.Reticle.Tags, function(value, key) {
		// 		list.push();
		// 	});
		// }
	};


}, '1.0', {
    requires: []
});
