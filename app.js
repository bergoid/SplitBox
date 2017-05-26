(function (root, undefined) {
define(['radi', 'splitbox'], function (ra, sb) {

'use strict';
var app = {};

var container = undefined;

//
var containerDOM = function()
{
    return ra.create
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
    return ra.create
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

});})(this);
