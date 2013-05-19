/***
	Encodes knowledge of HTML
*/
var helpers = {
	mimeType: function() {

	}
};

var attrs = {
	a: {
		displayType: 'inline'
	},

	div: {
		displayType: 'block'
	},

	ul: {
		attributes: [],
		validChildren: ['li']
	},

	input: {
		attributes: [
			{
				name: 'accept'
				// literal or function
				values: [ 'audio/*', 'video/*', 'image/*', helpers.mimeType ]
			},

			{
				name: 'align',
				warn: 'deprecated in html4.01'
				values: [ 'left', 'right', 'top', 'middle', 'bottom' ]
			},

			{
				name: 'formaction',
				values: [ helpers.url ]
			}
		]
	}


}