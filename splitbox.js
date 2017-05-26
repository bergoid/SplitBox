(function (root, undefined) {
define(['radi'], function (ra) {

'use strict';
var sb = {};

var dirClass = {
    column: "sbColumn",
    row: "sbRow"
};

var splitterClass = {
    column: "sbHorSplitter",
    row: "sbVerSplitter"
};

var dim = {
    column: "height",
    row: "width"
};

//
var enableGrow = function(root)
{
    if ( (ra.hasClass(root, "sbRow")) || (ra.hasClass(root, "sbColumn")) )
    {
        var dir = getComputedStyle(root)["flex-direction"];

        // Store size of panels in array
        var sizes = [];
        ra.forEach
        (
            root.children,
            function(elem)
            {
               if (ra.hasClass(elem, "sbPanel"))
                    sizes.push(parseInt(getComputedStyle(elem)[dim[dir]], 10));
            }
        );

        // Set grow factor of panels to their respective proportional size
        var sum = sizes.reduce(function(a, b) { return a + b; });
        ra.forEach
        (
            root.children,
            function(elem, i)
            {
                if (ra.hasClass(elem, "sbPanel"))
                {
                    setFlex(elem, sizes[i/2]/sum, sizes[i/2]/sum, 0);
                    enableGrow(elem);
                }
            }
        );
    }
};

//
var setFlex = function(elem, grow, shrink, basis)
{
    if (!elem)
        return;

    elem.style.flex = "" + grow + " " + shrink + " " + basis + "px";
}

//
var createSplitter = function(dir, prevPanel)
{
    var lastPos;
    var isDragging = false;
    var nextPanel;

    var element =  ra.create
    (
        "div",
        {
            className: splitterClass[dir]
        }
    );

    var setNextPanel = function(np)
    {
        nextPanel = np;
    };

    var getPos = function(evt)
    {
        return (dir == "column") ? evt.clientY : evt.clientX;
    };

    //
    var drag = function(evt)
    {

        var sizeDiff = getPos(evt) - lastPos;

        var oldSizePrev = parseInt(getComputedStyle(prevPanel)[dim[dir]], 10);
        var oldSizeNext = parseInt(getComputedStyle(nextPanel)[dim[dir]], 10);

        var newSizePrev =  oldSizePrev + sizeDiff;
        var newSizeNext =  oldSizeNext - sizeDiff;

        if ( (newSizePrev<20) || (newSizeNext<20) )
            return;

        if (!isDragging)
        {
            isDragging = true;
            // growEnabled = false;

            element.parentNode && element.parentNode.children && ra.forEach
            (
                element.parentNode.children,
                function(elem)
                {
                    if (ra.hasClass(elem, "sbPanel"))
                        elem.sbStoredSize = parseInt(getComputedStyle(elem)[dim[dir]], 10);
                }
            );

            element.parentNode && element.parentNode.children && ra.forEach
            (
                element.parentNode.children,
                function(elem)
                {
                    if (ra.hasClass(elem, "sbPanel"))
                        setFlex(elem, 0, 0 , elem.sbStoredSize);
                }
            );
        }

        setFlex(prevPanel, 0, 0, newSizePrev);
        setFlex(nextPanel, 0, 0, newSizeNext);

        lastPos = getPos(evt);
    };

    //
    var endDrag = function()
    {
        isDragging = false;

        window.removeEventListener('mousemove', drag);
        window.removeEventListener('mouseup', endDrag);

        element.parentNode && enableGrow(element.parentNode);
    };

    //
    element.addEventListener
    (
        'mousedown',
        function(evt)
        {
            evt.preventDefault();    // prevent text selection
            lastPos = getPos(evt);
            window.addEventListener('mousemove', drag);
            window.addEventListener('mouseup', endDrag);
        }
    );

    //
    return {
        element: element,
        setNextPanel : setNextPanel
    };

};

//
sb.draw = function(container, layout)
{
    if (ra.isElement(layout))
    {
        container.appendChild(layout);
        return;
    }

    var dir = (layout.row) ? "row" : "column";
    var panels = (layout.row) ? layout.row : layout.column;

    ra.addClass(container, dirClass[dir]);

    var splitter = undefined;

    ra.forEach
    (
        panels,
        function(panelLayout, index)
        {
            var panelElem = ra.create
            (
                "div",
                {
                    className: "sbPanel"
                }
            );
            container.appendChild(panelElem);
            if (index>0)
                splitter.setNextPanel(panelElem);
            if (index<panels.length-1)
            {
                splitter = createSplitter(dir, panelElem);
                container.appendChild(splitter.element);
            }
            sb.draw(panelElem, panelLayout);
        }
    );
};

//
return sb;

});})(this);
