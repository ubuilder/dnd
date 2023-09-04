"use strict";
//utils functions
Object.defineProperty(exports, "__esModule", { value: true });
exports.addResizePoints = exports.addWrapperToComponent = exports.addComponentControllers = exports.removePlaceholder = exports.replacePlaceholder = exports.addPlaceholder = exports.insertAtIndex = exports.findIndex = exports.isDropZone = exports.isSlot = void 0;
function replacePlaceholder(element) {
    var _a;
    (_a = document.getElementById('component-placeholder')) === null || _a === void 0 ? void 0 : _a.replaceWith(element);
}
exports.replacePlaceholder = replacePlaceholder;
function addPlaceholder(e) {
    var placeholder = document.createElement('div');
    placeholder.id = 'component-placeholder';
    if (!isSlot(e) && !isDropZone(e))
        return;
    var index = findIndex(e);
    insertAtIndex(e.target, placeholder, index);
}
exports.addPlaceholder = addPlaceholder;
function isDropZone(e) {
    return e.target.classList.contains('drop-zone');
}
exports.isDropZone = isDropZone;
function findIndex(e) {
    //crazy low level implementation
    var target = e.target;
    var children = target.childNodes;
    if (children.length == 0)
        return 0;
    if (children[0].nodeName.startsWith('#')) {
        var range = document.createRange();
        range.selectNode(children[0]);
        var top_1 = range.getBoundingClientRect().top;
        range.detach();
        if (e.clientY < top_1)
            return 0;
    }
    else {
        if (e.clientY < children[0].querySelector('.u-component').getBoundingClientRect().top)
            return 0;
    }
    for (var i = 0; i < children.length; i++) {
        var child = void 0;
        var rect = void 0;
        if (children[i].nodeName.startsWith('#')) {
            child = children[i];
            var range = document.createRange();
            range.selectNode(child);
            rect = range.getBoundingClientRect();
            range.detach();
        }
        else {
            child = children[i].querySelector('.u-component');
            rect = child.getBoundingClientRect();
        }
        if (e.clientY > rect.top && e.clientY < rect.bottom) {
            return e.clientY < rect.top + rect.height / 2 ? i : i + 1;
        }
    }
    return children.length;
}
exports.findIndex = findIndex;
function insertAtIndex(parrent, child, index) {
    if (index == 0) {
        return parrent.prepend(child);
    }
    else if (index == parrent.children.length) {
        return parrent.append(child);
    }
    else {
        return parrent.insertBefore(child, parrent.children[index]);
    }
}
exports.insertAtIndex = insertAtIndex;
function isSlot(e) {
    return e.target.classList.contains('u-slot');
}
exports.isSlot = isSlot;
function removePlaceholder() {
    var _a;
    (_a = document.getElementById('component-placeholder')) === null || _a === void 0 ? void 0 : _a.remove();
}
exports.removePlaceholder = removePlaceholder;
function addResizePoints(target) {
    var edges = document.createElement('div');
    edges.classList.add('edges');
    edges.innerHTML = "\n\t\t\t<div class = 'resize-point left'></div>\n\t\t\t<div class = 'resize-point right'></div>\n\t\t\t<div class = 'resize-point top'></div>\n\t\t\t<div class = 'resize-point bottom'></div>\n\t\t\t<div class = 'resize-point top left top-left'></div>\n\t\t\t<div class = 'resize-point top right top-right'></div>\n\t\t\t<div class = 'resize-point bottom left bottom-left'></div>\n\t\t\t<div class = 'resize-point bottom right bottom-right '></div>\n\t\t\t";
    target.append(edges);
}
exports.addResizePoints = addResizePoints;
function addComponentControllers(target) {
    var _a, _b;
    var control = document.createElement('div');
    control.classList.add('control');
    control.innerHTML = "<div class = 'holder'></div><div class = 'close'></div>";
    target.append(control);
    (_a = target.querySelector('.close')) === null || _a === void 0 ? void 0 : _a.addEventListener('mousedown', function (e) {
        e.preventDefault();
        console.log('click', target);
        target.parentElement.remove();
    }, true);
    (_b = target.querySelector('.holder')) === null || _b === void 0 ? void 0 : _b.addEventListener('focusin', function (e) {
        e.stopPropagation();
        e.preventDefault();
    }, true);
}
exports.addComponentControllers = addComponentControllers;
function addWrapperToComponent(html) {
    var element = document.createElement('span');
    element.classList.add('component-wrapper');
    element.innerHTML = html;
    return element;
}
exports.addWrapperToComponent = addWrapperToComponent;
