(function (root, undefined) {
define(['radi', 'splitbox'], function (ra, sb) {

'use strict';
var app = {};

app.css = function()
{
    return ra.create
    (
        "style",
        {
            type: "text/css",
            innerHTML: "\
            body\
            {\
                display: flex;\
                flex-flow: column nowrap;\
                height: 100vh;\
                max-height: 100vh;\
                margin: 0;\
                padding: 0;\
            }\
            .leaf\
            {\
                flex-grow: 1;\
            }\
            .container\
            {\
                flex-grow: 1;\
                margin: 1em;\
                border: 2px solid #808080;\
            }\
            "
        }
    );
};

//
var containerDOM = function()
{
    return ra.create
    (
        "div",
        {
            className: "container"
        }
    );
};

//
var panelDOM = function(content)
{
    return ra.create
    (
        "div",
        {
            className: "sbPanel",
            innerHTML: content
        }
    );
};

var layout =
{
    scol:
    [
        {
            srow:
            [
                panelDOM("C")
            ]
        },
        {
            srow:
            [
                panelDOM("D1"),
                {
                    scol:
                    [
                        panelDOM("E1"),
                        panelDOM("E2"),
                        panelDOM("E3")
                    ]
                },
                [
                    panelDOM("D3")
                ]
            ]
        }
    ]
};

//
//var layout =
//{
//    srow:
//    [
//        {
//            scol:
//            [
//                panelDOM("A"),
//                panelDOM("B"),
//                panelDOM("C"),
//            ]
//        },
//        {
//            scol:
//            [
//                {
//                    srow:
//                    [
//                        panelDOM("D"),
//                        panelDOM("E"),
//                        panelDOM("F")
//                    ]
//                },
//                {
//                    srow:
//                    [
//                        panelDOM("G"),
//                        panelDOM("H"),
//                        panelDOM("I"),
//                        panelDOM("J")
//                    ]
//                }
//            ]
//        }
//    ]
//};

//
app.go = function(state)
{
    var container = containerDOM();

    ra.append
    (
        ra.body(),
        [
            sb.css(),
            app.css(),
            container
        ]
    );

    sb.build(container, layout);
};

//
return app;

});})(this);
