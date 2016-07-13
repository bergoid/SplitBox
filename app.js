(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define(['radi', 'splitbox'], factory(root));
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(require('radi'), require('splitbox'));
    } else {
        root.sbApp = factory(root, root.radi, root.splitbox);
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function (root, ra, sb) {
'use strict';
var app = {};
var supports = !!root.addEventListener;
var settings;
var defaults = 
{
	initClass: 'js-app'
};

//
var eventHandler = function (event)
{
};

//
app.destroy = function ()
{
	if ( !settings ) return;
	document.documentElement.classList.remove( settings.initClass );
	document.removeEventListener('click', eventHandler, false);
	settings = null;
};

app.init = function ( options )
{
	if ( !supports ) return;
	app.destroy();
	settings = ra.extend( defaults, options || {} );
	ra.init({ outputEnabled: true });
	document.documentElement.classList.add( settings.initClass );
	document.addEventListener('click', eventHandler, false);
	ra.log("Hello from app!");
};

var container = undefined;

//
var containerDOM = function()
{
	return ra.crel
	(
		"div",
		{
			id: "idContainer",
			className: "container"
		}
	);
};

//
var panelDOM = function(content)
{
	return ra.crel
	(
		"div",
		{
			className: "testClass",
			innerHTML: content
		}
	);
};

//
var layout = 
{
	row:
	[
		{
			column:
			[
				panelDOM("A"),
				panelDOM("B"),
				panelDOM("C"),
			]
		},
		{
			column:
			[
				{
					row:
					[
						panelDOM("D"),
						panelDOM("E"),
						panelDOM("F")
					]
				},
				{
					row:
					[
						panelDOM("G"),
						panelDOM("H"),
						panelDOM("I"),
						panelDOM("J")
					]
				}
			]
		}
	]
};

//
app.go = function(state)
{
	container = containerDOM();
	ra.body().appendChild(container);
	sb.draw(container, layout);
};

//
return app;

});
