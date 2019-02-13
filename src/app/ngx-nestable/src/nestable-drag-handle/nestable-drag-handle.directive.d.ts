import { OnInit, ElementRef } from '@angular/core';
export declare class NestableDragHandleDirective implements OnInit {
    private _el;
    ngxNestableDragHandle: any;
    onMouseDown(event: any): void;
    constructor(_el: ElementRef);
    ngOnInit(): void;
}
