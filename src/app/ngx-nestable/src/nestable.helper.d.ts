export declare const _traverseChildren: (tree: any, callback: any, parent?: any) => void;
export declare const _insertAfter: (newNode: any, referenceNode: any) => void;
export declare const _replace: (newNode: any, referenceNode: any) => void;
export declare const _replaceTargetWithElements: (target: any, elements: any) => void;
export declare const _getParents: (el: any, parentSelector?: HTMLElement) => any[];
export declare const _closest: (el: any, selector: any) => any;
export declare const _offset: (elem: any) => {
    top: number;
    left: number;
};
export declare const _findObjectInTree: (array: any, id: any) => any;
