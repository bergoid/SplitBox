(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define([], factory(root));
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(root);
    } else {
        root.radi = factory(root);
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {

'use strict';
var ra = {};
var supports = !!root.addEventListener;
var settings;
var defaults = 
{
	initClass: 'js-radi',
	
	outputEnabled: true,
	logEnabled: true,
	infoEnabled: true,
	warnEnabled: true,
	errorEnabled: true
};

//
var eventHandler = function (event)
{
};

//
ra.destroy = function ()
{
	if ( !settings ) return;
	document.documentElement.classList.remove( settings.initClass );
	document.removeEventListener('click', eventHandler, false);
	settings = null;
};

ra.init = function ( options )
{
	if ( !supports ) return;
	ra.destroy();
	settings = ra.extend( defaults, options || {} );
	document.documentElement.classList.add( settings.initClass );
	document.addEventListener('click', eventHandler, false);
	root.console.log("Hello from radi!");
};


//
ra.forEach = function(array, loopFun, breakable)
{
	if (!array)
		return false;

	var i=0, element;
	if (breakable)
	{
		while (element = array[i])
			if (loopFun(element,i++))
				return true;
	}
	else
		while (element = array[i])
			loopFun(element,i++);

	return false;
};

//
ra.pad = function (num, size)
{
	var s = num+"";
	while (s.length < size)
		s = "0" + s;
	return s;
};

//
ra.urlEncode = function(str)
{
	return encodeURIComponent(str).replace
	(
		/[!'()*]/g,
		function(c)
		{
			return '%' + c.charCodeAt(0).toString(16);
		}
	);
};

//
ra.getRandom = function (from,to)
{
	return Math.floor((Math.random()*(to-from+1))+from);
};

//
ra.getUniqueNumber = function()
{
	var id = 0;
	return function() { return id++; }
}();

//
if (Array.prototype.indexOf)
{
	ra.has = function (a,elem) { return (a.indexOf(elem) != -1); };
}
else
{
	ra.has = function (a,elem) {
		return ra.forEach(
			a,
			function(arrayElem){
				if (arrayElem == elem)
					return true;
				},
			true
			);
		};
}

//
ra.pushUnique = function(array, elem)
{
	if (!ra.has(array, elem))
		array.push(elem);
}

//
ra.isArray = ('isArray' in Array) ? Array.isArray : function (value) {
	return Object.prototype.toString.call(value) === '[object Array]';
};


//
ra.getEvent = function(event)
{
	return (window.event == undefined) ? event : window.event;
}

//
ra.getKeyCode = function(event)
{
	return (typeof event.which === "number") ? event.which : event.keyCode;
}

//
ra.el = function (id)
{
	return document.getElementById(id);
};

//
ra.body = function ()
{
	return document.getElementsByTagName("body")[0];
};

//
ra.deleteChildren = function(element)
{
	if (element)
		while (element.firstChild)
			element.removeChild(element.firstChild);
};

//
ra.deleteElementById = function(id)
{
	var element = document.getElementById(id);

	if (element)
		if (element.parentNode)
			element.parentNode.removeChild(element);
};

//
ra.crel = function(type, arg2, arg3)
{
	var theNode = undefined;
	var key="";
	var i=0;
	var properties = undefined;
	var children = undefined;

	if (type)
	{
		if (ra.isArray(arg3))
		{
			properties = arg2;
			children = arg3;
		}
		else
			if (ra.isArray(arg2))
				children = arg2;
			else
				properties = arg2;

		theNode = document.createElement(type);

		if (theNode)
		{
			if (properties)
				for (key in properties)
					theNode[key] = properties[key];

			if (children)
				if (typeof children[0] === "string")
					theNode.appendChild(ra.crel(children[0], children[1], children[2]));
				else
					ra.forEach(
						children,
						function(elem){
							if (ra.isArray(elem))
								theNode.appendChild(ra.crel(elem[0], elem[1], elem[2]));
							else
								theNode.appendChild(elem);
							}
						);
		}
	}

	return theNode;
}

//
ra.prependChild = function(parent, child)
{
	parent.insertBefore(child,parent.firstChild);
}

//
if (document.getElementsByClassName)
{
	ra.getElementsByClassName = function(rootElem, className)
	{
		return rootElem.getElementsByClassName(className);
	};
}
else
{
	ra.getElementsByClassName = function(rootElem, className)
	{
		var i = 0;
		var j = 0;
		var a = [];
		var els = rootElem.getElementsByTagName("*");
		ra.forEach(
			els,
			function(elem){
				if (ra.hasClass(elem, className))
					a.push(elem);
				}
			)
		return a;
	};
}

//
ra.getAllElements = function(rootElem)
{
	if (rootElem)
		return rootElem.getElementsByTagName("*");
	else
		return false;
};

//
ra.scrollToBottom = function()
{
	setTimeout(function(){ window.scrollTo(0,document.body.scrollHeight); }, 0);
};


//
ra.clear_console = function()
{
	window.console && window.console.clear();
};

//
ra.log = function(msg)
{
	settings.outputEnabled && settings.logEnabled && window.console && window.console.log(msg);
};

//
ra.info = function(msg)
{
	settings.outputEnabled && settings.infoEnabled && window.console && window.console.info(msg);
};

//
ra.warn = function(msg)
{
	settings.outputEnabled && settings.warnEnabled && window.console && window.console.warn(msg);
};

//
ra.error = function(msg)
{
	settings.outputEnabled && settings.errorEnabled && window.console && window.console.error(msg);
};

//
ra.loadScript = function(filename, onload, element_id)
{
	var elem;

	if (filename.slice(-3) == ".js")
	{
		elem = document.createElement('script');
		elem.type = "text/javascript";
		elem.src = filename;
	}
	else
	{
		elem = document.createElement('link');
		elem.rel = "stylesheet";
		elem.type = "text/css";
		elem.href = filename;
	}

	if (element_id)
	  elem.id = element_id;

	if (onload)
		if (elem.readyState == undefined)
		{
			ra.log("not oldIE");
			elem.onload = onload;
		}
		else
		{
			ra.log("oldIE !");
			elem.onreadystatechange = function()
				{
					if (this.readyState == 'complete')
						onload();
				}
		}

	if (element_id)
	{
		var old_elem = ra.el(element_id);
		if (old_elem)
		{
			document.getElementsByTagName("head")[0].replaceChild(elem, old_elem);
			return;
		}
	}

	document.getElementsByTagName("head")[0].appendChild(elem);
};

//
if (String.prototype.trim)
{
  ra.trim = function(s) {
	  return s.trim();
	};
}
else
{
  ra.trim = function(s) {
	  return s.replace(/^\s+|\s+$/g,"");
	};
}

//
ra.hasName = function(s, name)
{
  return (s.search(new RegExp("\\b" + name + "\\b", "g"))!=-1);
}

//
ra.addName = function(s,name)
{
  if (s.search(new RegExp("\\b" + name + "\\b", "g")) == -1)
	return s + " " + name;
  else
	return s;
};

//
ra.removeName = function(s,name)
{
  return ra.trim(s.replace(new RegExp("\\b" + name + "\\b", "g"), "").replace(/\s{2,}/g, " "));
};

//
ra.hasClass = function(e, className)
{
  if (e)
	return ra.hasName(e.className, className);
};

//
ra.addClass = function(e, className)
{
  if (e)
	e.className = ra.addName(e.className, className);
};

//
ra.removeClass = function(e, className)
{
  if (e)
	e.className = ra.removeName(e.className, className);
};

//
ra.styledButtonChild = function(label, onclick, enable)
{
	if (enable)
		return ra.crel(
			"a",
			{
				"className" : "ignoreenable",
				"innerHTML" : label,
				"href" : "#",
				"onclick" : function(){ onclick(); return false; },
				"data-onclick" : onclick
			}
			);
	else
		return ra.crel(
			"span",
			{
				"className": "ignoreenable",
				"innerHTML": label,
				"data-onclick": onclick
			}
			);

	return child;
};

//
ra.enableString = { "false" : "disabled", "true" : "enabled"};

//
ra.styledButton = function(id, label, onclick, enable, extraClasses)
{
	var classString = "styledButton " + ra.enableString[enable];

	if (extraClasses)
		classString += " " + extraClasses;

	return ra.crel(
		"div",
		{ id:id, className:classString},
		[ ra.styledButtonChild(label, onclick, enable) ]
		);
};

//
ra.onRadioButtonClicked = function(idClicked, ids)
{
	if ( (idClicked) && (ids) && (ra.isArray(ids)) )
	{
		ra.forEach(
			ids,
			function(id) { ra.removeClass(ra.el(id), "selected"); }
			);
		ra.addClass(ra.el(idClicked), "selected");
	}
};

//
ra.onCheckBoxClicked = function(idClicked)
{
	var el = undefined;

	if (idClicked)
	{
		el = ra.el(idClicked);
		if (el)
		{
			if (ra.hasClass(el, "selected"))
				ra.removeClass(ra.el(idClicked), "selected");
			else
				ra.addClass(ra.el(idClicked), "selected");
		}
	}
};

//
ra.radioButton = function(id, ids, label, onclick, enable, extraClasses)
{
	var classString = "radioButton";

	if (extraClasses)
		classString += " " + extraClasses;

	return ra.styledButton(id, label, function() { ra.onRadioButtonClicked(id, ids); if (onclick) onclick(); }, enable, classString);
};

//
ra.checkBox = function(id, label, onclick, enable, extraClasses)
{
	var classString = "checkBox";

	if (extraClasses)
		classString += " " + extraClasses;

	return ra.styledButton(id, label, function() { ra.onCheckBoxClicked(id); if (onclick) onclick(); }, enable, classString);
};

//
ra.enableElement = function(el, enable, remember)
{
	var enable_core = function(el, enable)
		{
			if (ra.hasClass(el, "styledButton"))
			{
				if ((ra.hasClass(el, ra.enableString[!enable])))
				{
					var oldChild = el.firstChild;
					if (oldChild)
					{
						var newChild = ra.styledButtonChild(oldChild.innerHTML, oldChild["data-onclick"], enable);
						if (newChild)
						{
							el.removeChild(oldChild);
							el.appendChild(newChild);
						}
					}
				}
			}
			else
				el.disabled = !enable;

			ra.removeClass(el, ra.enableString[!enable]);
			ra.addClass(el, ra.enableString[enable]);
		}

	if (el)
		if (!ra.hasClass(el, "ignoreenable"))
			if (!enable)
			{
				if (remember)
					el.previous_disabled = ra.hasClass(el, "disabled");
				enable_core(el, false);
			}
			else
				enable_core(el, remember ? !el.previous_disabled : true);
};

//
ra.enableElementTree = function(el, enable, remember)
{
	var children = [];

	if (el)
	{
		ra.enableElement(el, enable, remember);

		children = ra.getAllElements(el);
		if (children)
			ra.forEach(
				children,
				function(elem){
					ra.enableElement(elem, enable, remember);
					}
				);
	}
	else
		ra.warn("ra.enableElementTree() : arg 'el' undefined");
};

//
ra.isElement = function(obj)
{
	try 
	{
		return obj instanceof HTMLElement;
	}
	catch(e)
	{
		return (typeof obj==="object") &&
		  (obj.nodeType===1) && (typeof obj.style === "object") &&
		  (typeof obj.ownerDocument ==="object");
	}
};


/**
 *
 * Taken from: https://github.com/cferdinandi/buoy
 *
 * Merge two or more objects. Returns a new object.
 * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
 * @param {Object}   objects  The objects to merge together
 * @returns {Object}          Merged values of defaults and options
 */
ra.extend = function()
{
	// Variables
	var extended = {};
	var deep = false;
	var i = 0;
	var length = arguments.length;

	// Check if a deep merge
	if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
		deep = arguments[0];
		i++;
	}

	// Merge the object into the extended object
	var merge = function (obj) {
		for ( var prop in obj ) {
			if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
				// If deep merge and property is an object, merge properties
				if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
					extended[prop] = buoy.extend( true, extended[prop], obj[prop] );
				} else {
					extended[prop] = obj[prop];
				}
			}
		}
	};

	// Loop through each object and conduct a merge
	for ( ; i < length; i++ ) {
		var obj = arguments[i];
		merge(obj);
	}

	return extended;

};

//
// Public APIs
//

return ra;

});
