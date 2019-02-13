import { OnInit, EventEmitter, ViewContainerRef, Renderer2, ElementRef, ChangeDetectorRef, OnDestroy, NgZone } from '@angular/core';
import { NestableSettings } from './nestable.models';
export declare class NestableComponent implements OnInit, OnDestroy {
    private ref;
    private renderer;
    private el;
    private zone;
    listChange: EventEmitter<{}>;
    drop: EventEmitter<{}>;
    drag: EventEmitter<{}>;
    disclosure: EventEmitter<{}>;
    template: ViewContainerRef;
    options: NestableSettings;
    disableDrag: boolean;
    list: any[];
    dragRootEl: any;
    dragEl: any;
    dragModel: any;
    moving: boolean;
    /**
     * Dragged element contains children, and those children contain other children and so on...
     * This property gives you the number of generations contained within the dragging item.
     */
    dragDepth: number;
    /**
     * The depth of dragging item relative to element root (ngx-nestable)
     */
    relativeDepth: number;
    hasNewRoot: boolean;
    pointEl: any;
    items: any[];
    private _componentActive;
    private _mouse;
    private _list;
    private _cancelMousemove;
    private _cancelMouseup;
    private _placeholder;
    private _itemId;
    private _registerHandleDirective;
    private _dragIndex;
    private _parentDragId;
    private _oldListLength;
    constructor(ref: ChangeDetectorRef, renderer: Renderer2, el: ElementRef, zone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    private _generateItemIds();
    private _generateItemExpanded();
    private _createHandleListener();
    private _createDragClone(event, dragItem);
    private _createPlaceholder(event, dragItem);
    /**
     * Sets depth proerties (relative and drag)
     */
    private _calculateDepth();
    private _mouseStart(event, dragItem);
    private _mouseUpdate(event);
    private _showMasks();
    private _hideMasks();
    /**
     * calc mouse traverse distance on axis
     * @param m - mouse
     */
    private _calcMouseDistance(m);
    private _move(event);
    reset(): void;
    dragStartFromItem(event: any, item: any, parentList: any): void;
    private dragStart(event, item, parentList);
    dragStop(event: any): void;
    dragMove(event: any): void;
    expandAll(): void;
    collapseAll(): void;
}
