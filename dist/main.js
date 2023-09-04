"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var interactjs_1 = __importDefault(require("interactjs"));
var utils_1 = require("./utils");
function default_1() {
    var update;
    var insert;
    var remove;
    var focusIn;
    var focusOut;
    var resize;
    var fireContoller = 0; //conttrol drag over event speed
    function getDetails(event) {
        var _a, _b, _c, _d, _e;
        if (!((_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.tagName))
            return {
                id: undefined,
                target: undefined,
                parent: undefined,
                parentId: undefined,
                slots: undefined
            };
        var target = ((_c = (_b = event === null || event === void 0 ? void 0 : event.target) === null || _b === void 0 ? void 0 : _b.classList) === null || _c === void 0 ? void 0 : _c.contains('u-component'))
            ? event === null || event === void 0 ? void 0 : event.target
            : (_d = event === null || event === void 0 ? void 0 : event.target) === null || _d === void 0 ? void 0 : _d.querySelector('.u-component');
        var parent = (_e = target === null || target === void 0 ? void 0 : target.parentElement.closest('.u-component')) !== null && _e !== void 0 ? _e : target === null || target === void 0 ? void 0 : target.closest('.drop-zone');
        return {
            id: target === null || target === void 0 ? void 0 : target.getAttribute('id'),
            target: target,
            parentId: parent === null || parent === void 0 ? void 0 : parent.getAttribute('id'),
            parent: parent,
            slots: target === null || target === void 0 ? void 0 : target.getAttribute('slots')
        };
    }
    function makeReiszeAbleSelector(targetSelector, _a) {
        var _b = _a === void 0 ? { onResize: undefined } : _a, onResize = _b.onResize;
        (0, interactjs_1.default)(targetSelector)
            .resizable({
            edges: { top: '.top', left: '.left', bottom: '.bottom', right: '.right' },
            listeners: {
                move: function (event) {
                    var _a = event.target.dataset, x = _a.x, y = _a.y;
                    x = (parseFloat(x) || 0) + event.deltaRect.left;
                    y = (parseFloat(y) || 0) + event.deltaRect.top;
                    Object.assign(event.target.style, {
                        width: "".concat(event.rect.width, "px"),
                        height: "".concat(event.rect.height, "px"),
                        transform: "translate(".concat(x, "px, ").concat(y, "px)")
                    });
                    Object.assign(event.target.dataset, { x: x, y: y });
                }
            }
        })
            .on('down', function (event) {
            if (event.target.classList.contains('resize-point')) {
                event.preventDefault();
            }
        })
            .on('resizeend', function (event) {
            var details = getDetails(event);
            onResize && onResize(event, details);
            resize && resize(event, details);
        });
    }
    function makeDragAble(el, _a) {
        var onDragStart = _a.onDragStart, onDragEnd = _a.onDragEnd;
        el.setAttribute('draggable', 'true');
        var target = el;
        if (!target)
            return;
        target.setAttribute('tabindex', 0);
        if (!target.querySelector('.control')) {
            (0, utils_1.addComponentControllers)(target);
        }
        if (!target.querySelector('.edges')) {
            (0, utils_1.addResizePoints)(target);
        }
        el.addEventListener('dragstart', function (event) {
            if (!event.dataTransfer)
                return;
            event.stopPropagation();
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.dropEffect = 'move';
            var template = event.target.outerHTML;
            event.dataTransfer.setData('text/html', template);
            event.target.style.display = 'none';
            onDragStart && onDragStart(event);
            remove && remove(event, getDetails(event));
        });
        el.addEventListener('dragend', function (event) {
            event.target.parentElement.remove();
            onDragEnd && onDragEnd(event);
        });
    }
    function makeDropZone(el, _a) {
        var onDragEnter = _a.onDragEnter, onDragOver = _a.onDragOver, onDragLeave = _a.onDragLeave, onDrop = _a.onDrop;
        onDragEnter &&
            el.addEventListener('dragenter', function (event) {
                event.preventDefault();
                onDragEnter(event);
            });
        el.addEventListener('dragover', function (event) {
            event.preventDefault();
            if (fireContoller < 20) {
                fireContoller++;
                return;
            }
            fireContoller = 0;
            (0, utils_1.removePlaceholder)();
            (0, utils_1.addPlaceholder)(event);
            onDragOver && onDragOver(event);
        });
        onDragLeave &&
            el.addEventListener('dragleave', function (event) {
                (0, utils_1.removePlaceholder)();
                event.preventDefault();
                onDragLeave(event);
            });
        el.addEventListener('drop', function (event) {
            event === null || event === void 0 ? void 0 : event.preventDefault();
            var component = (0, utils_1.addWrapperToComponent)(event === null || event === void 0 ? void 0 : event.dataTransfer.getData('text/html'));
            (0, utils_1.replacePlaceholder)(component);
            onDrop && onDrop(event);
        });
        el.addEventListener('DOMNodeInserted', function (event) {
            var details = getDetails(event);
            var target = details.target;
            if (target) {
                makeDragAble(target, { onDragEnd: undefined, onDragStart: undefined });
            }
            insert && insert(event, details);
        });
        el.addEventListener('focusin', function (event) {
            event.preventDefault();
            event.stopPropagation();
            var details = getDetails(event);
            if (!details.target)
                return;
            focusIn && focusIn(event, details);
        });
        el.addEventListener('click', function (event) {
            var _a, _b;
            event.preventDefault();
            // event.stopPropagation();
            if (!((_b = (_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.classList) === null || _b === void 0 ? void 0 : _b.contains('drop-zone')))
                return;
            focusOut && focusOut(event, {});
        });
    }
    function makeDragAbleSelector(query, _a) {
        var _b = _a === void 0 ? { onDragEnd: undefined, onDragStart: undefined } : _a, onDragStart = _b.onDragStart, onDragEnd = _b.onDragEnd;
        document.querySelectorAll(query).forEach(function (element) {
            makeDragAble(element, { onDragStart: onDragStart, onDragEnd: onDragEnd });
        });
    }
    function makeDropZoneSelector(query, _a) {
        var onDragEnter = _a.onDragEnter, onDragOver = _a.onDragOver, onDragLeave = _a.onDragLeave, onDrop = _a.onDrop;
        document.querySelectorAll(query).forEach(function (element) {
            makeDropZone(element, { onDragEnter: onDragEnter, onDragOver: onDragOver, onDragLeave: onDragLeave, onDrop: onDrop });
        });
    }
    function onUpdate(callback) {
        update = callback;
    }
    function onInsert(callback) {
        insert = callback;
    }
    function onRemove(callback) {
        remove = callback;
    }
    function onFocusIn(callback) {
        focusIn = callback;
    }
    function onFocusOut(callback) {
        focusOut = callback;
    }
    function onResize(callback) {
        resize = callback;
    }
    return {
        makeDragAble: makeDragAble,
        makeDropZone: makeDropZone,
        makeDragAbleSelector: makeDragAbleSelector,
        makeDropZoneSelector: makeDropZoneSelector,
        makeReiszeAbleSelector: makeReiszeAbleSelector,
        onUpdate: onUpdate,
        onInsert: onInsert,
        onRemove: onRemove,
        onFocusIn: onFocusIn,
        onFocusOut: onFocusOut,
        onResize: onResize
    };
}
exports.default = default_1;
