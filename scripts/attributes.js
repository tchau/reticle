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

	Y.Reticle.BaseAttributes = [
		  {name: 'id', type:'text'},
		  {name: 'class', type:'text'}, 
		  {name: 'title', type:'text'}
	];

	Y.Reticle.Tags = [
		{
			name: 'A',
			attributes: [
				{ name: 'href', type: 'url' },
				{ name: 'target', type: 'open_enum', choices: ['_blank', '_parent', '_self', '_top'] }
			],
			displayType: 'inline',
			validChildren: ['IMG', 'SPAN'],
			defaultContent: 'A hyperlink'
		},

		{
			name: 'DIV',
			displayType: 'block'
		},

		{ name: 'H1', displayType: 'block', defaultContent: 'Heading 1' },
		{ name: 'H2', displayType: 'block', defaultContent: 'Heading 2' },
		{ name: 'H3', displayType: 'block', defaultContent: 'Heading 3' },

		{
			name: 'FORM',
			displayType: 'block',
			attributes: [
				{ name: 'name',   type: 'text' },
				{ name: 'action', type: 'url' },
				{ name: 'method', type: 'enum', choices: ['post', 'get'], defaultValue: 'post' }
				]
		},

		{
			name: 'IMG',
			attributes: [
				{ name: 'src', type: 'text', defaultValue: 'no-image.png' },
				{ name: 'alt', type: 'text' }
			],
			validChildren: [],
			displayType: 'inline'
		},

		{
			name: 'INPUT',
			displayType: 'block',
			terminal: true, // a terminal tag, has no children
			defaults: [
				{ attr: 'type', value: 'text' }
			],
			attributes: [
				{ name: 'accept', values: [ 'audio/*', 'video/*', 'image/*', helpers.mimeType ] },
				{ name: 'formaction', values: [ helpers.url ] },
				{ name: 'name', type: 'text' },
				{ name: 'type', 
					type: 'enum',
					choices: ['button', 'checkbox', 'radio', 'text', 'password'],
					defaultValue: 'text'
				},
				{
					name: 'value',
					type: 'text',
					defaultValue: 'Input Value'
				}
			]
		},

		{
			name: 'P',
			displayType: 'block',
			validChildren: ['A', 'SPAN', 'IMG'],
			defaultContent: 'Paragraph text'
		},

		{
			name: 'LI',
			validParents: 'UL',
			validChildren: 'UL',
			displayType: 'block',
			defaultContent: 'List Item'
		},

		{
			name: 'SELECT',
			validChildren: ['OPTION'],
			displayType: 'block'
		},

		{
			name: 'OPTION',
			displayType: 'block',
			attributes: [
				{ name: 'disabled', type: 'specific', choices: ['disabled'] },
				{ name: 'label',    type: 'text' },
				{ name: 'selected', type: 'specific', choices: ['selected'] },
				{ name: 'value',    type: 'text' }
			],
			validParents: ['SELECT']
		},

		{
			name: 'SPAN',
			displayType: 'inline'
		},
		{
			name: 'TABLE',
			attributes: [],
			validChildren: ['TR', 'THEAD', 'TBODY'],
			displayType: 'block' // well its really a table... 
		},
		{
			name: 'THEAD',
			validParents: ['TABLE'],
			validChildren: ['TR'],
			displayType: 'block' // well its really a table... 
		},
		{
			name: 'TR',
			validParents: ['TABLE', 'TBODY', 'THEAD'],
			validChildren: ['TD'],
			displayType: 'block' // well its really a table... 
		},
		{
			name: 'TD',
			attributes: [
				{ name: 'rowspan', type: 'number', defaultValue: 1 },
				{ name: 'colspan', type: 'number', defaultValue: 1 }
			],
			validParents: ['TR'],
			validChildren: ['TD'],
			defaultContent: 'A cell',
			displayType: 'block' // well its really a table... 
		},
		{
			name: 'UL',
			attributes: [],
			validChildren: ['LI'],
			displayType: 'block'
		},
	];

	Y.Reticle.TagMeta = {
		findByName: function(name) {
			return Y.Array.find(Y.Reticle.Tags, function(meta) {
				return (meta.name === name);
			});
		},

		// sigh this is pretty bad. 
		getCapabilityContext: function(blockEl) {

			// text node
			if (blockEl.hasClass('text') || blockEl.getAttribute('data-node-name' == 'INPUT')) {
				return {
					insertable: false
				};
			} else {
				return {
					insertable: true
				};
			}

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
