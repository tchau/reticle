/*

*/

var GLOB = {};

YUI().use('node', 'event', 'menu-manager', 'parser', 'reticle-attributes', 'keyboard-model', 'reticle', function (Y) {
  console.log('initializing Reticle System...');

  var parser = new Y.Reticle.Parser();
  var parsedEl = parser.parse(Y.one('#data'));
  Y.one('#canvas').append(parsedEl.get('children'));

  // Reticle relies on the "current" element targeted
  // for manipulation -- sort of like the BLOCK CURSOR
  // in a text editor
  var reticle = new Y.Reticle.Reticle({
  	curr:     Y.one('.block-el')
  });
  reticle.render();
  GLOB.reticle = reticle;

  // display and hides menus, positions thems
  var menuMan = new Y.Reticle.MenuManager({
    reticle: reticle,
    parser: parser
  });
  GLOB.menuMan = menuMan;

  // a controller
  var keyboard = new Y.Reticle.KeyboardModel({
    reticle: reticle,
    menuManager: menuMan
  });


  // command interpreter takes action events and turns them into
  // model changes

  function displayMeta() {
    $('#info-layer').empty();

    $('.block-el').each(function(i, el) {

      // text nodes don't get any meta
      if (Y.one(el).hasClass('text')) {
        return;
      }

      var metaContent = $('<div class="content"></div>');
      var metaEl = $('<div></div>').addClass('meta').append(metaContent);

      // displaying
      metaEl.addClass(Y.Reticle.TagMeta.findByName(el.getAttribute('data-node-name')).displayType);

      var nodeAttributes = JSON.parse($(el).attr('data-node-attributes'));
      var classes = nodeAttributes['class'];
      var id = nodeAttributes['id'];

      var nodeEl = $('<div></div>')
        .addClass('bubble')
        .addClass('node-name')
        .html($(el).attr('data-node-name'));
      metaContent.append(nodeEl);

      // draw ID
      if (Y.Lang.isValue(id)) {
        metaContent.append($('<div></div>')
          .addClass('bubble')
          .html('#' + id));
      }

      // draw CLASSES
      if (Y.Lang.isValue(classes)) {
        metaContent.append($('<div></div>')
          .addClass('bubble')
          .html(classes));
      }

      $('#info-layer').append(metaEl);
      metaEl.offset($(el).offset());
    });
  }

  var refreshPreview = function() {
    console.log('refreshing');
    var preview = Y.one('#preview');
    preview.empty();
    Y.one('#canvas').get('children').each(function(child) {
      console.log('yeah');

      preview.append(parser.stringify(child));
    });
  };

  displayMeta();
  refreshPreview();
  reticle.on('structure-change', displayMeta);
  reticle.on('structure-change', refreshPreview);


});


$(document).ready(function() {

	var phrases = ['BUILD', 'TINKER', 'CREATE'];
	var rando = Math.floor(Math.random() * phrases.length);
	$('body').append($('<div></div>')
		.addClass('overlay')
		.append($('<div></div>')
			.addClass('welcome')
			.html(phrases[rando])));
	setTimeout(function() {
		$('.overlay').fadeOut(500);
	}, 1000);


	// reticle behavior
	var curr = $('.block-el').first();

	var moveReticle = function() {
		var reticle = $('#reticle');
		reticle.offset(curr.offset());
		reticle.width(curr.innerWidth());
		reticle.height(curr.innerHeight());
	};


	// init
	moveReticle();

});



