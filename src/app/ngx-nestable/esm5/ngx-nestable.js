import { __values } from 'tslib';
import { Component, Output, Input, EventEmitter, Renderer2, ElementRef, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, NgZone, Directive, HostListener, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

var _traverseChildren = function (tree, callback, parent) {
    if (parent === void 0) { parent = null; }
    for (var i = 0; i < tree.length; i++) {
        var item = tree[i];
        if (typeof item === 'undefined') {
            continue;
        }
        var callbackResult = callback(item, parent);
        if (callbackResult) {
            break;
        }
        if (item.children) {
            _traverseChildren(item.children, callback, item);
        }
    }
};
var _insertAfter = function (newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};
var _getParents = function (el, parentSelector) {
    if (parentSelector === void 0) { parentSelector = document.body; }
    var parents = [];
    var parentNode = el.parentNode;
    while (parentNode !== parentSelector) {
        var o = parentNode;
        if (!parentNode) {
            break;
        }
        if (parentNode.tagName === parentSelector.tagName) {
            parents.push(o);
        }
        parentNode = o.parentNode;
    }
    parents.push(parentSelector);
    return parents;
};
var _closest = function (el, selector) {
    var matchesFn;
    ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].some(function (fn) {
        if (typeof document.body[fn] === 'function') {
            matchesFn = fn;
            return true;
        }
        return false;
    });
    var parent;
    while (el) {
        parent = el.parentElement;
        if (parent === null) {
            break;
        }
        var matches = parent[matchesFn](selector);
        if (parent && matches) {
            return parent;
        }
        el = parent;
    }
    return null;
};
var _offset = function (elem) {
    var box = { top: 0, left: 0 };
    if (typeof elem.getBoundingClientRect !== undefined) {
        box = elem.getBoundingClientRect();
    }
    return {
        top: box.top + (window.pageYOffset || elem.scrollTop) - (elem.clientTop || 0),
        left: box.left + (window.pageXOffset || elem.scrollLeft) - (elem.clientLeft || 0)
    };
};
var _findObjectInTree = function (array, id) {
    var result = null;
    _traverseChildren(array, function (item) {
        if (item['$$id'] === Number.parseInt(id)) {
            result = item;
            return true;
        }
    });
    return result;
};
var REGISTER_HANDLE = 'NESTABLE_DRAG_HANDLE_REGISTER';
var DRAG_START = 'NESTABLE_DRAG_HANDLE_START';
var EXPAND_COLLAPSE = 'NESTABLE_EXPAND_COLLAPSE_EVENT';
var defaultSettings = ({
    listNodeName: 'ul',
    itemNodeName: 'li',
    rootClass: 'dd',
    listClass: 'dd-list',
    itemClass: 'dd-item',
    dragClass: 'dd-dragel',
    handleClass: 'dd-handle',
    collapsedClass: 'dd-collapsed',
    placeClass: 'dd-placeholder',
    group: 0,
    maxDepth: 5,
    threshold: 20,
    fixedDepth: false,
    exportCollapsed: true,
    disableDrag: false,
});
var mouse = {
    moving: 0,
    offsetX: 0,
    offsetY: 0,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    nowX: 0,
    nowY: 0,
    distX: 0,
    distY: 0,
    dirAx: 0,
    dirX: 0,
    dirY: 0,
    lastDirX: 0,
    lastDirY: 0,
    distAxX: 0,
    distAxY: 0
};
var PX = 'px';
var ɵ0 = function () {
    var el = document.createElement('div'), docEl = document.documentElement;
    if (!('pointerEvents' in el.style)) {
        return false;
    }
    el.style.pointerEvents = 'auto';
    el.style.pointerEvents = 'x';
    docEl.appendChild(el);
    var supports = window.getComputedStyle &&
        window.getComputedStyle(el, '').pointerEvents === 'auto';
    docEl.removeChild(el);
    return !!supports;
};
var hasPointerEvents = (ɵ0)();
var NestableComponent = /** @class */ (function () {
    function NestableComponent(ref, renderer, el, zone) {
        this.ref = ref;
        this.renderer = renderer;
        this.el = el;
        this.zone = zone;
        this.listChange = new EventEmitter();
        this.drop = new EventEmitter();
        this.drag = new EventEmitter();
        this.disclosure = new EventEmitter();
        this.options = defaultSettings;
        this.disableDrag = false;
        this.dragRootEl = null;
        this.dragEl = null;
        this.dragModel = null;
        this.moving = false;
        this.dragDepth = 0;
        this.relativeDepth = 0;
        this.hasNewRoot = false;
        this.pointEl = null;
        this.items = [];
        this._componentActive = false;
        this._mouse = Object.assign({}, mouse);
        this._list = [];
        this._itemId = 0;
        this._registerHandleDirective = false;
    }
    Object.defineProperty(NestableComponent.prototype, "list", {
        get: function () {
            return this._list;
        },
        set: function (list) {
            this._list = list;
            this._generateItemIds();
        },
        enumerable: true,
        configurable: true
    });
    NestableComponent.prototype.ngOnInit = function () {
        this._componentActive = true;
        var optionKeys = Object.keys(defaultSettings);
        try {
            for (var optionKeys_1 = __values(optionKeys), optionKeys_1_1 = optionKeys_1.next(); !optionKeys_1_1.done; optionKeys_1_1 = optionKeys_1.next()) {
                var key = optionKeys_1_1.value;
                if (typeof this.options[key] === 'undefined') {
                    this.options[key] = defaultSettings[key];
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (optionKeys_1_1 && !optionKeys_1_1.done && (_a = optionKeys_1.return)) _a.call(optionKeys_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this._generateItemIds();
        this._generateItemExpanded();
        this._createHandleListener();
        var e_1, _a;
    };
    NestableComponent.prototype.ngOnDestroy = function () { };
    NestableComponent.prototype._generateItemIds = function () {
        var _this = this;
        _traverseChildren(this._list, function (item) {
            item['$$id'] = _this._itemId++;
        });
    };
    NestableComponent.prototype._generateItemExpanded = function () {
        _traverseChildren(this._list, function (item) {
            if (typeof item.expanded === 'undefined') {
                item['$$expanded'] = true;
            }
            else {
                item['$$expanded'] = true;
            }
        });
    };
    NestableComponent.prototype._createHandleListener = function () {
        var _this = this;
        this.renderer.listen(this.el.nativeElement, REGISTER_HANDLE, function () {
            _this._registerHandleDirective = true;
        });
        this.renderer.listen(this.el.nativeElement, DRAG_START, function (data) {
            _this.dragStart(data.detail.event, data.detail.param.item, data.detail.param.parentList);
        });
        this.renderer.listen(this.el.nativeElement, EXPAND_COLLAPSE, function (data) {
            _this.disclosure.emit({
                item: data.detail.item,
                // expanded: data.detail.item['$$expanded']
                expanded: true
            });
        });
    };
    NestableComponent.prototype._createDragClone = function (event, dragItem) {
        this._mouseStart(event, dragItem);
        if (!this._registerHandleDirective) {
            this._mouse.offsetY = dragItem.nextElementSibling
                ? dragItem.nextElementSibling.clientHeight / 2
                : dragItem.clientHeight / 2;
        }
        this.dragEl = document.createElement(this.options.listNodeName);
        document.body.appendChild(this.dragEl);
        this.renderer.addClass(this.dragEl, this.options.dragClass);
        this.renderer.setStyle(this.dragEl, 'left', event.pageX - this._mouse.offsetX + PX);
        this.renderer.setStyle(this.dragEl, 'top', event.pageY - this._mouse.offsetY + PX);
        this.renderer.setStyle(this.dragEl, 'position', 'absolute');
        this.renderer.setStyle(this.dragEl, 'z-index', 9999);
        this.renderer.setStyle(this.dragEl, 'pointer-events', 'none');
    };
    NestableComponent.prototype._createPlaceholder = function (event, dragItem) {
        this._placeholder = document.createElement('div');
        this._placeholder.classList.add(this.options.placeClass);
        _insertAfter(this._placeholder, dragItem);
        dragItem.parentNode.removeChild(dragItem);
        this.dragEl.appendChild(dragItem);
        this.dragRootEl = dragItem;
    };
    NestableComponent.prototype._calculateDepth = function () {
        var depth;
        var items = this.dragEl.querySelectorAll(this.options.itemNodeName);
        for (var i = 0; i < items.length; i++) {
            depth = _getParents(items[i], this.dragEl).length;
            if (depth > this.dragDepth) {
                this.dragDepth = depth;
            }
        }
        this.relativeDepth = _getParents(this._placeholder, this.el.nativeElement.querySelector(this.options.listNodeName)).length;
    };
    NestableComponent.prototype._mouseStart = function (event, dragItem) {
        this._mouse.offsetX = event.pageX - _offset(dragItem).left;
        this._mouse.offsetY = event.pageY - _offset(dragItem).top;
        this._mouse.startX = this._mouse.lastX = event.pageX;
        this._mouse.startY = this._mouse.lastY = event.pageY;
    };
    NestableComponent.prototype._mouseUpdate = function (event) {
        this._mouse.lastX = this._mouse.nowX;
        this._mouse.lastY = this._mouse.nowY;
        this._mouse.nowX = event.pageX;
        this._mouse.nowY = event.pageY;
        this._mouse.distX = this._mouse.nowX - this._mouse.lastX;
        this._mouse.distY = this._mouse.nowY - this._mouse.lastY;
        this._mouse.lastDirX = this._mouse.dirX;
        this._mouse.lastDirY = this._mouse.dirY;
        this._mouse.dirX =
            this._mouse.distX === 0 ? 0 : this._mouse.distX > 0 ? 1 : -1;
        this._mouse.dirY =
            this._mouse.distY === 0 ? 0 : this._mouse.distY > 0 ? 1 : -1;
    };
    NestableComponent.prototype._showMasks = function () {
        var masks = this.el.nativeElement.getElementsByClassName('nestable-item-mask');
        for (var i = 0; i < masks.length; i++) {
            masks[i].style.display = 'block';
        }
    };
    NestableComponent.prototype._hideMasks = function () {
        var masks = this.el.nativeElement.getElementsByClassName('nestable-item-mask');
        for (var i = 0; i < masks.length; i++) {
            masks[i].style.display = 'none';
        }
    };
    NestableComponent.prototype._calcMouseDistance = function (m) {
        m.distAxX += Math.abs(m.distX);
        if (m.dirX !== 0 && m.dirX !== m.lastDirX) {
            m.distAxX = 0;
        }
        m.distAxY += Math.abs(m.distY);
        if (m.dirY !== 0 && m.dirY !== m.lastDirY) {
            m.distAxY = 0;
        }
    };
    NestableComponent.prototype._move = function (event) {
        var depth, list;
        var dragRect = this.dragEl.getBoundingClientRect();
        this.renderer.setStyle(this.dragEl, 'left', event.pageX - this._mouse.offsetX + PX);
        this.renderer.setStyle(this.dragEl, 'top', event.pageY - this._mouse.offsetY + PX);
        this._mouseUpdate(event);
        var newAx = Math.abs(this._mouse.distX) > Math.abs(this._mouse.distY) ? 1 : 0;
        if (!this._mouse.moving) {
            this._mouse.dirAx = newAx;
            this._mouse.moving = 1;
            return;
        }
        if (this._mouse.dirAx !== newAx) {
            this._mouse.distAxX = 0;
            this._mouse.distAxY = 0;
        }
        else {
            this._calcMouseDistance(this._mouse);
        }
        this._mouse.dirAx = newAx;
        if (!hasPointerEvents) {
            this.dragEl.style.visibility = 'hidden';
        }
        var pointEl = document.elementFromPoint(event.pageX - document.body.scrollLeft, event.pageY - (window.pageYOffset || document.documentElement.scrollTop));
        if (!hasPointerEvents) {
            this.dragEl.style.visibility = 'visible';
        }
        if (pointEl &&
            (pointEl.classList.contains('nestable-item-mask') ||
                pointEl.classList.contains(this.options.placeClass))) {
            this.pointEl = pointEl.parentElement.parentElement;
        }
        else {
            return;
        }
        if (!this.options.fixedDepth &&
            this._mouse.dirAx &&
            this._mouse.distAxX >= this.options.threshold) {
            this._mouse.distAxX = 0;
            var previous = this._placeholder.previousElementSibling;
            if (this._mouse.distX > 0 && previous) {
                list = previous.querySelectorAll(this.options.listNodeName);
                list = list[list.length - 1];
                depth = _getParents(this._placeholder, this.el.nativeElement.querySelector(this.options.listNodeName)).length;
                if (depth + this.dragDepth <= this.options.maxDepth) {
                    if (!list) {
                        list = document.createElement(this.options.listNodeName);
                        list.style.paddingLeft = this.options.threshold + PX;
                        list.appendChild(this._placeholder);
                        previous.appendChild(list);
                    }
                    else {
                        list = previous.querySelector(":scope > " + this.options.listNodeName);
                        list.appendChild(this._placeholder);
                    }
                }
            }
            if (this._mouse.distX < 0) {
                var next = document.querySelector("." + this.options.placeClass + " + " + this.options.itemNodeName);
                var parentElement = this._placeholder.parentElement;
                if (!next && parentElement) {
                    var closestItem = _closest(this._placeholder, this.options.itemNodeName);
                    if (closestItem) {
                        parentElement.removeChild(this._placeholder);
                        _insertAfter(this._placeholder, closestItem);
                    }
                }
            }
        }
        if (!pointEl.classList.contains('nestable-item-mask')) {
            return;
        }
        var pointElRoot = _closest(this.pointEl, "." + this.options.rootClass), isNewRoot = pointElRoot
            ? this.dragRootEl.dataset['nestable-id'] !==
            pointElRoot.dataset['nestable-id']
            : false;
        if (!this._mouse.dirAx || isNewRoot) {
            if (isNewRoot &&
                this.options.group !== pointElRoot.dataset['nestable-group']) {
                return;
            }
            depth =
                this.dragDepth -
                1 +
                _getParents(this.pointEl, this.el.nativeElement.querySelector(this.options.listNodeName)).length;
            if (depth > this.options.maxDepth) {
                return;
            }
            var before = event.pageY <
                _offset(this.pointEl).top + this.pointEl.clientHeight / 2;
            var placeholderParent = this._placeholder.parentNode;
            var pointRelativeDepth = void 0;
            pointRelativeDepth = _getParents(this.pointEl, this.el.nativeElement.querySelector(this.options.listNodeName)).length;
            if (this.options.fixedDepth) {
                if (pointRelativeDepth === this.relativeDepth - 1) {
                    var childList = this.pointEl.querySelector(this.options.listNodeName);
                    if (!childList.children.length) {
                        childList.appendChild(this._placeholder);
                    }
                }
                else if (pointRelativeDepth === this.relativeDepth) {
                    if (before) {
                        this.pointEl.parentElement.insertBefore(this._placeholder, this.pointEl);
                    }
                    else {
                        _insertAfter(this._placeholder, this.pointEl);
                    }
                    if (Array.prototype.indexOf.call(this.pointEl.parentElement.children, this.pointEl) ===
                        this.pointEl.parentElement.children.length - 1) {
                        _insertAfter(this._placeholder, this.pointEl);
                    }
                }
            }
            else if (before) {
                this.pointEl.parentElement.insertBefore(this._placeholder, this.pointEl);
            }
            else {
                _insertAfter(this._placeholder, this.pointEl);
            }
        }
    };
    NestableComponent.prototype.reset = function () {
        var keys = Object.keys(this._mouse);
        try {
            for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                var key = keys_1_1.value;
                this._mouse[key] = 0;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this._itemId = 0;
        this.moving = false;
        this.dragEl = null;
        this.dragRootEl = null;
        this.dragDepth = 0;
        this.relativeDepth = 0;
        this.hasNewRoot = false;
        this.pointEl = null;
        var e_2, _a;
    };
    NestableComponent.prototype.dragStartFromItem = function (event, item, parentList) {
        if (!this._registerHandleDirective) {
            this.dragStart(event, item, parentList);
        }
    };
    NestableComponent.prototype.dragStart = function (event, item, parentList) {
        this._oldListLength = this.list.length;
        if (!this.options.disableDrag) {
            event.stopPropagation();
            event.preventDefault();
            if (event.originalEvent) {
                event = event.originalEvent;
            }
            if (event.type.indexOf('mouse') === 0) {
                if (event.button !== 0) {
                    return;
                }
            }
            else {
                if (event.touches.length !== 1) {
                    return;
                }
            }
            this.ref.detach();
            this._dragIndex = parentList.indexOf(item);
            this.dragModel = parentList.splice(parentList.indexOf(item), 1)[0];
            var dragItem = _closest(event.target, this.options.itemNodeName);
            if (dragItem === null) {
                return;
            }
            this._parentDragId = Number.parseInt(dragItem.parentElement.parentElement.id);
            var dragRect = dragItem.getBoundingClientRect();
            this._showMasks();
            this._createDragClone(event, dragItem);
            this.renderer.setStyle(this.dragEl, 'width', dragRect.width + PX);
            this._createPlaceholder(event, dragItem);
            this.renderer.setStyle(this._placeholder, 'height', dragRect.height + PX);
            this._calculateDepth();
            this.drag.emit({
                originalEvent: event,
                item: item
            });
            this._cancelMouseup = this.renderer.listen(document, 'mouseup', this.dragStop.bind(this));
            this._cancelMousemove = this.renderer.listen(document, 'mousemove', this.dragMove.bind(this));
        }
    };
    NestableComponent.prototype.dragStop = function (event) {
        this._cancelMouseup();
        this._cancelMousemove();
        this._hideMasks();
        if (this.dragEl) {
            var draggedId = Number.parseInt(this.dragEl.firstElementChild.id);
            var placeholderContainer = _closest(this._placeholder, this.options.itemNodeName);
            var changedElementPosition = this._dragIndex !==
                Array.prototype.indexOf.call(this._placeholder.parentElement.children, this._placeholder);
            var index = Array.prototype.indexOf.call(this._placeholder.parentElement.children, this._placeholder);
            if ((this._dragIndex === index) && (this._oldListLength === this.list.length)) {
                changedElementPosition = true;
            }
            if (placeholderContainer === null) {
                this.list.splice(Array.prototype.indexOf.call(this._placeholder.parentElement.children, this._placeholder), 0, Object.assign({}, this.dragModel));
            }
            else {
                placeholderContainer = _findObjectInTree(this.list, Number.parseInt(placeholderContainer.id));
                if (!placeholderContainer.children) {
                    placeholderContainer.children = [];
                    placeholderContainer.children.push(Object.assign({}, this.dragModel));
                }
                else {
                    placeholderContainer.children.splice(Array.prototype.indexOf.call(this._placeholder.parentElement.children, this._placeholder), 0, Object.assign({}, this.dragModel));
                }
                if (index === this._dragIndex) {
                    changedElementPosition = false;
                }
                if (!changedElementPosition) {
                    changedElementPosition =
                        placeholderContainer['$$id'] !== this._parentDragId;
                }
            }
            this._placeholder.parentElement.removeChild(this._placeholder);
            this.dragEl.parentNode.removeChild(this.dragEl);
            this.dragEl.remove();
            this.reset();
            this.listChange.emit(this.list);
            this.drop.emit({
                originalEvent: event,
                destination: placeholderContainer,
                item: this.dragModel,
                changedElementPosition: changedElementPosition
            });
            this.ref.reattach();
        }
    };
    NestableComponent.prototype.dragMove = function (event) {
        if (this.dragEl) {
            event.preventDefault();
            if (event.originalEvent) {
                event = event.originalEvent;
            }
            this._move(event.type.indexOf('mouse') === 0 ? event : event.touches[0]);
        }
    };
    NestableComponent.prototype.expandAll = function () {
        _traverseChildren(this._list, function (item) {
            item['$$expanded'] = true;
        });
        this.ref.markForCheck();
    };
    NestableComponent.prototype.collapseAll = function () {
        _traverseChildren(this._list, function (item) {
            item['$$expanded'] = false;
        });
        this.ref.markForCheck();
    };
    return NestableComponent;
}());
NestableComponent.decorators = [
    {
        type: Component, args: [{
            selector: 'ngx-nestable',
            template: `<ng-container *ngTemplateOutlet="nestableList; context:{nestable: list, depth: 0}"></ng-container>
            <ng-template #nestableList let-nestable="nestable" let-depth="depth">
              <ul [style.padding-left.px]="depth ? options.threshold : 0" [class]="options.listClass">
                <li [class]="options.itemClass" [id]="item.Id" *ngFor="let item of nestable">
                  {{item.name}}
                  <ng-container *ngTemplateOutlet="nestableItem; context:{nestable: nestable, item: item, depth: depth}">
                  </ng-container>
                  <ng-container *ngIf="item.nodes">
                    <ng-container *ngTemplateOutlet="nestableList; context:{nestable: item.nodes, depth: depth + 1}">
                    </ng-container>
                  </ng-container>
                  <ul [class]="options.listClass" [style.padding-left.px]="options.threshold"></ul>
                </li>
              </ul>
            </ng-template>
            <ng-template #nestableItem let-parentList="nestable" let-item="item" let-depth="depth">
              <div class="nestable-item-container mat-list-item" (mousedown)="dragStartFromItem($event, item, parentList)">
                <ng-container *ngTemplateOutlet="template; context:{$implicit: {item: item, parentList: parentList}, depth: depth}">
                </ng-container>
                <div class="nestable-item-mask"></div>
              </div>
            </ng-template>`,
            styles: ["@import url(https://fonts.googleapis.com/css?family=Roboto);ul .dd-placeholder{margin:5px 0;padding:0;min-height:30px;background:#f2fbff;border:1px dashed #b6bcbf;-webkit-box-sizing:border-box;box-sizing:border-box}ul li .nestable-item-mask{display:none;position:absolute;top:0;bottom:0;right:0;left:0;z-index:9998}ul li .nestable-expand-button{display:block;position:relative;cursor:pointer;float:left;width:25px;height:14px;padding:0;white-space:nowrap;overflow:hidden;border:0;background:0 0;font-size:18px;line-height:1;text-align:center;font-weight:700;outline:0}ul li .nestable-item-container:hover{background:rgba(0,0,0,.04)}ol,ul{list-style:none}"],
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush
        },]
    },
];
NestableComponent.ctorParameters = function () {
    return [
        { type: ChangeDetectorRef },
        { type: Renderer2 },
        { type: ElementRef },
        { type: NgZone }
    ];
};
NestableComponent.propDecorators = {
    listChange: [{ type: Output }],
    drop: [{ type: Output }],
    drag: [{ type: Output }],
    disclosure: [{ type: Output }],
    template: [{ type: Input }],
    options: [{ type: Input }],
    disableDrag: [{ type: Input }],
    list: [{ type: Input }]
};
var NestableDragHandleDirective = /** @class */ (function () {
    function NestableDragHandleDirective(_el) {
        this._el = _el;
    }
    NestableDragHandleDirective.prototype.onMouseDown = function (event) {
        var detail = {
            param: this.ngxNestableDragHandle,
            event: event
        };
        this._el.nativeElement.dispatchEvent(new CustomEvent(DRAG_START, { bubbles: true, detail: detail }));
    };
    NestableDragHandleDirective.prototype.ngOnInit = function () {
        this._el.nativeElement.dispatchEvent(new CustomEvent(REGISTER_HANDLE, { bubbles: true, detail: this.ngxNestableDragHandle }));
    };
    return NestableDragHandleDirective;
}());
NestableDragHandleDirective.decorators = [
    {
        type: Directive, args: [{
            selector: '[ngxNestableDragHandle]'
        },]
    },
];
NestableDragHandleDirective.ctorParameters = function () {
    return [
        { type: ElementRef }
    ];
};
NestableDragHandleDirective.propDecorators = {
    ngxNestableDragHandle: [{ type: Input }],
    onMouseDown: [{ type: HostListener, args: ['mousedown', ['$event'],] }]
};
var NestableExpandCollapseDirective = /** @class */ (function () {
    function NestableExpandCollapseDirective(_el) {
        this._el = _el;
    }
    NestableExpandCollapseDirective.prototype.onMouseDown = function (event) {
        event.stopPropagation();
    };
    NestableExpandCollapseDirective.prototype.onClick = function (event) {
        this.ngxNestableExpandCollapse.item['$$expanded'] = true;
        // this.ngxNestableExpandCollapse.item['$$expanded'] = !this.ngxNestableExpandCollapse.item['$$expanded'];
        this._el.nativeElement.dispatchEvent(new CustomEvent(EXPAND_COLLAPSE, {
            bubbles: true,
            detail: this.ngxNestableExpandCollapse
        }));
    };
    return NestableExpandCollapseDirective;
}());
NestableExpandCollapseDirective.decorators = [
    {
        type: Directive, args: [{
            selector: '[ngxNestableExpandCollapse]'
        },]
    },
];
NestableExpandCollapseDirective.ctorParameters = function () {
    return [
        { type: ElementRef }
    ];
};
NestableExpandCollapseDirective.propDecorators = {
    ngxNestableExpandCollapse: [{ type: Input }],
    onMouseDown: [{ type: HostListener, args: ['mousedown', ['$event'],] }],
    onClick: [{ type: HostListener, args: ['click', ['$event'],] }]
};
var NestableModule = /** @class */ (function () {
    function NestableModule() {
    }
    return NestableModule;
}());
NestableModule.decorators = [
    {
        type: NgModule, args: [{
            imports: [CommonModule],
            declarations: [
                NestableComponent,
                NestableDragHandleDirective,
                NestableExpandCollapseDirective
            ],
            exports: [
                NestableComponent,
                NestableDragHandleDirective,
                NestableExpandCollapseDirective
            ]
        },]
    },
];

export { NestableComponent, NestableModule, NestableDragHandleDirective as ɵa, NestableExpandCollapseDirective as ɵb };
//# sourceMappingURL=ngx-nestable.js.map
