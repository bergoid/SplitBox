(function (root, undefined) {
define(['radi'], function (ra) {

'use strict';
var sb = {};

var dirClass = {
    column: "sbTrack sbColumn",
    row: "sbTrack sbRow"
};

var splitterClass = {
    column: "sbSplitter sbHorizontal",
    row: "sbSplitter sbVertical"
};

var dim = {
    column: "height",
    row: "width"
};

sb.css = function()
{
    return ra.create
    (
        "style",
        {
            type: "text/css",
            innerHTML: "\
            .sbPanel\
            {\
                flex-grow: 1;\
            }\
            .sbTrack\
            {\
                display: flex;\
                flex-grow: 1;\
            }\
            .sbRow\
            {\
                flex-flow: row nowrap;\
            }\
            .sbColumn\
            {\
                flex-flow: column nowrap;\
            }\
            .sbSplitter\
            {\
                flex-grow: 0;\
                background-color: #C0C0C0;\
            }\
            .sbSplitter:hover\
            {\
                background-color: #E0E0E0;\
            }\
            .sbHorizontal\
            {\
                min-width: 100%;\
                min-height: 8px;\
                cursor: row-resize;\
            }\
            .sbVertical\
            {\
                min-width: 8px;\
                min-height: 100%;\
                cursor: col-resize;\
            }\
            "
        }
    );
};

//
var enableGrow = function(rootElem)
{
    if ( (ra.hasClass(rootElem, "sbTrack")) )
    {
        var dir = getComputedStyle(rootElem)["flex-direction"];

        // Store size of panels in array
        var sizes = [];
        ra.forEach
        (
            rootElem.children,
            function(elem)
            {
                if (!ra.hasClass(elem, "sbSplitter"))
                    sizes.push(parseInt(getComputedStyle(elem)[dim[dir]], 10));
            }
        );

        // Set grow factor of panels to their respective proportional size
        var sum = sizes.reduce(function(a, b) { return a + b; });
        ra.forEach
        (
            rootElem.children,
            function(elem, i)
            {
                if (!ra.hasClass(elem, "sbSplitter"))
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

            element.parentNode && element.parentNode.children && ra.forEach
            (
                element.parentNode.children,
                function(elem)
                {
//                    if (ra.hasClass(elem, "sbPanel"))
                    if (!ra.hasClass(elem, "sbSplitter"))
                        elem.sbStoredSize = parseInt(getComputedStyle(elem)[dim[dir]], 10);
                }
            );

            element.parentNode && element.parentNode.children && ra.forEach
            (
                element.parentNode.children,
                function(elem)
                {
//                    if (ra.hasClass(elem, "sbPanel"))
                    if (!ra.hasClass(elem, "sbSplitter"))
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

        root.removeEventListener('mousemove', drag);
        root.removeEventListener('mouseup', endDrag);

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
            root.addEventListener('mousemove', drag);
            root.addEventListener('mouseup', endDrag);
        }
    );

    //
    return {
        element: element,
        setNextPanel : setNextPanel
    };

};

//
sb.build = function(container, layout)
{
    if ((layout.srow) || (layout.scol))
    {
        var dir = (layout.srow) ? "row" : "column";
        var layoutChildren = (layout.srow) ? layout.srow : layout.scol;

        ra.addClass(container, dirClass[dir]);

        var splitter = undefined;

        ra.forEach
        (
            layoutChildren,
            function(layoutChild, index)
            {
                var elemChild;

                if (ra.isElement(layoutChild))
                {
                    elemChild = ra.append(container, layoutChild);
                }
                else
                {
                    elemChild = ra.append
                    (
                        container,
                        "div"/*,
                        {
                            className: "sbPanel"
                        }*/
                    );
                }
                if (index>0)
                {
                    splitter.setNextPanel(elemChild);
                }
                if (index<layoutChildren.length-1)
                {
                    splitter = createSplitter(dir, elemChild);
                    container.appendChild(splitter.element);
                }

                if (elemChild != layoutChild)
                    sb.build(elemChild, layoutChild);

            }
        );
    }
    else
        if ((layout.row) || (layout.col))
        {
            var layoutChildren = (layout.row) ? layout.row : layout.col;
            var dir = (layout.row) ? "row" : "column";

            ra.addClass(container, dirClass[dir]);

            ra.forEach
            (
                layoutChildren,
                function(layoutChild)
                {
                    sb.build(container, layoutChild);
                }
            );
        }
        else
        {
            ra.append(container, layout);
        }

    return container;
};

//
return sb;

});})(this);
