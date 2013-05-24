/*

*/

var GLOB = {};

YUI().use('node', 'event', 'reticle-data-navigator', 'menu-manager', 'parser', 'reticle-attributes', 'keyboard-model', 'reticle', function (Y) {
  console.log('initializing Reticle System...');

  var parser = new Y.Reticle.Parser();
  var parsedEl = parser.parse(Y.one('#data'));
  Y.one('#canvas').append(parsedEl.get('children'));

  // Reticle relies on the "current" element targeted
  // for manipulation -- sort of like the BLOCK CURSOR
  // in a text editor
  var reticle = new Y.Reticle.Reticle({
  	curr:     Y.one('.block-el'),
    pageData: sample_data
  });
  reticle.render();
  GLOB.reticle = reticle;

  // knows all the CSS rules we have in our system
  // var styleMan = new Y.Reticle.StyleMan({});

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

  // make this SUMMON-able from a given context
  // var dataNav = new Y.Reticle.DataNavigator({
  //   context: sample_data
  // });
  // dataNav.render(Y.one('#data-nav'));

  // var cssCanvas = new Y.Reticle.StyleCanvas({});

  // Y.one('#canvas').delegate('mouseover', function(e) {
  //   if (e.target.hasClass('block-el'))
  //     reticle.setCurrent(e.target);
  // }, '.block-el', this);

  // Y.one('#canvas').delegate('mouseout', function(e) {
  //   if (e.target.hasClass('block-el'))
  //     reticle.setCurrent(e.target);
  // }, '.block-el', this);


  Y.one('#toggle-style').on('click', function() {
    Y.one('#style-canvas').toggleClass('hidden');
  });

  Y.one('#toggle-help').on('click', function() {
    Y.one('#training-wheels').toggleClass('minimized');
  });

  // command interpreter takes action events and turns them into
  // model changes

  function displayMeta() {
    $('#info-layer').empty();

    Y.all('.block-el').each(function(el) {

      // text nodes don't get any meta
      if (Y.one(el).hasClass('text')) {
        return;
      }

      if (Y.Lang.isValue(el.one('.meta')))
        el.all('.meta').remove();

      var metaContent = Y.Node.create('<div class="content"></div>');
      var metaEl = Y.Node.create('<div></div>').addClass('meta').append(metaContent);

      // displaying
      metaEl.addClass(Y.Reticle.TagMeta.findByName(el.getAttribute('data-node-name')).displayType);

      var nodeAttributes = JSON.parse(el.getAttribute('data-node-attributes'));
      var classes = nodeAttributes['class'];
      var id = nodeAttributes['id'];

      var nodeEl = Y.Node.create('<div></div>')
        .addClass('bubble')
        .addClass('node-name')
        .set('text', el.getAttribute('data-node-name'));
      metaContent.appendChild(nodeEl);

      // draw ID
      if (Y.Lang.isValue(id)) {
        metaContent.appendChild(Y.Node.create('<div></div>')
          .addClass('bubble')
          .set('text', '#' + id));
      }

      // draw CLASSES
      if (Y.Lang.isValue(classes)) {
        metaContent.appendChild(Y.Node.create('<div></div>')
          .addClass('bubble')
          .set('text', classes));
      }

      // $('#info-layer').append(metaEl);
      el.prepend(metaEl);
      // metaEl.offset($(el).offset());
    });
  }

  var refreshPreview = function() {
    console.log('refreshing');
    var preview = Y.one('#preview');
    preview.empty();

    var str = "";
    Y.one('#canvas').get('children').each(function(child) {
      str += parser.stringify(child);
    });
    console.log(str);
    preview.append(Y.Handlebars.render(str, sample_data));
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

	// var moveReticle = function() {
	// 	var reticle = $('#reticle');
	// 	reticle.offset(curr.offset());
	// 	reticle.width(curr.innerWidth());
	// 	reticle.height(curr.innerHeight());
	// };


	// // init
	// moveReticle();

});



