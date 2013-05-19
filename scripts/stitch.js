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
    $('#info-layer').empty()

    $('.block-el').each(function(i, el) {
    	var metaContent = $('<div class="content"></div>');
    	var metaEl = $('<div></div>').addClass('meta').append(metaContent);

      // displaying
      metaEl.addClass(Y.Reticle.TagMeta.findByName(el.getAttribute('data-node-name')).displayType);

    	var classes = $(el).attr('data-classes');
    	var id = $(el).attr('data-id');
       
      var nodeEl = $('<div></div>')
        .addClass('bubble')
        .addClass('node-name')
        .html($(el).attr('data-node-name'));
      metaContent.append(nodeEl);

    	if (Y.Lang.isValue(id)) {
  	  	metaContent.append($('<div></div>')
          .addClass('bubble')
          .html('#' + id));
    	}
    	if (Y.Lang.isValue(classes)) {
        metaContent.append($('<div></div>')
          .addClass('bubble')
          .html(classes));
    	}

    	$('#info-layer').append(metaEl);
    	metaEl.offset($(el).offset());
    });
  }

  displayMeta();
  reticle.on('structure-change', displayMeta);


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
		$('.overlay').fadeOut(1000);
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



