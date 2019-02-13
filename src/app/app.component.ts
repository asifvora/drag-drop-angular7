
import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DndDropEvent, DropEffect } from "ngx-drag-drop";
import { DragAndDropEventArgs } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Drag & Drop in Angular 7';
  LIST_IDS = [];
  LIST_IDS2 = [];
  allDropLists = ['node-0'];
  options = {
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
  }
  todos: Object[] = [
    {
      Id: 1,
      name: '1.0.0',
      parentId: 0,
      child: [
        { Id: 2, parentId: 1, name: '1.1.1', child: [{ Id: 3, parentId: 2, name: '1.1.1.1', child: [] }, { Id: 4, parentId: 2, name: '1.1.1.2', child: [{ Id: 5, parentId: 4, name: '1.1.1.3', child: [] }] }] },
        { Id: 6, parentId: 1, name: '1.1.2', child: [] },
        { Id: 7, parentId: 1, name: '1.1.3', child: [] }
      ]
    },
    {
      Id: 8,
      name: '2.0.0',
      parentId: 0,
      child: [
        { Id: 9, parentId: 8, name: '2.1.1', child: [{ Id: 12, parentId: 9, name: '2.1.1.1', child: [] }, { Id: 13, parentId: 9, name: '2.1.1.2', child: [{ Id: 14, parentId: 13, name: '2.1.1.3', child: [] }] }] },
        { Id: 10, parentId: 8, name: '2.1.2', child: [] },
        { Id: 11, parentId: 8, name: '2.1.3', child: [{ Id: 12, parentId: 11, name: '2.1.3.1', child: [] }, { Id: 12, parentId: 11, name: '2.1.3.2', child: [] }] }
      ]
    }, {
      Id: 13,
      parentId: 0,
      name: '3.0.0',
      child: [{ Id: 14, parentId: 13, name: '2.1.3' }, { Id: 15, parentId: 13, name: '2.1.3.2' }]
    },
    {
      Id: 16,
      parentId: 0,
      name: '4.0.0',
      child: []
    }
  ];
  private currentDraggableEvent: DragEvent;

  ngOnInit() {
    // this.arrayMap(this.todos);
  }

  // addIds(Id) {
  //   const id = 'node-' + Id;
  //   if (this.allDropLists.indexOf(id) === -1) {
  //     this.allDropLists.push(id);
  //   }
  // }

  // arrayMap(items) {
  //   items.map(x => {
  //     this.addIds(x.Id);
  //     if (x.nodes && x.nodes.length) {
  //       this.arrayMap(x.nodes);
  //     }
  //   })
  // }

  // onDrop(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  // }

  // onDropSub(event: CdkDragDrop<string[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
  //   }
  // }

  // // addId(i) {
  // //   const id = 'cdk-drop-list-' + i;
  // //   if (this.LIST_IDS.indexOf(id) === -1) {
  // //     this.LIST_IDS.push(id);
  // //   }

  // //   return id;
  // // }

  // drop(ev) {
  //   // console.log('drop :: ', ev)
  //   ev.preventDefault();
  //   var data = ev.dataTransfer.getData("text");
  //   ev.target.appendChild(document.getElementById(data));
  // }

  // allowDrop(ev) {
  //   // console.log('allowDrop :: ', ev)

  //   ev.preventDefault();
  // }

  // drag(ev) {
  //   console.log('drag :: ', ev)

  //   ev.dataTransfer.setData("text", ev.target.id);
  // }

  // maps the appropriate column to fields property
  public field: Object = { dataSource: this.todos, id: 'Id', parentID: 'parentId', text: 'name', hasChildren: 'hasChild' };
  public allowDragAndDrop: boolean = true;

  public nodeDrag(args: DragAndDropEventArgs): void {
    if ((args['draggedNodeData'] && args['draggedNodeData']['parentID'] !== null) && (args['droppedNodeData'] && args['droppedNodeData']['parentID'] === null)) {
      if (args['dropLevel'] === 1) {
        args.dropIndicator = 'e-no-drop';
      } else {
        args.dropIndicator = 'e-drop-in';
      }
    } else if ((args['droppedNodeData'] && args['droppedNodeData']['parentID'] !== null) && (args['draggedNodeData'] && args['draggedNodeData']['parentID'] === null)) {
      args.dropIndicator = 'e-no-drop';
    } else if ((args['droppedNodeData'] && args['droppedNodeData']['parentID'] === null) && (args['draggedNodeData'] && args['draggedNodeData']['parentID'] === null)) {
      if (args['dropLevel'] === 1) {
        args.dropIndicator = 'e-drop-next';
      } else {
        args.dropIndicator = 'e-no-drop';
      }
    } else if ((args['droppedNodeData'] && args['droppedNodeData']['parentID'] === null) && (args['draggedNodeData'] && args['draggedNodeData']['parentID'] !== null)) {
      args.dropIndicator = 'e-drop-in';
    } else if ((args['droppedNodeData'] === null) && (args['draggedNodeData'] && args['draggedNodeData']['parentID'] !== null)) {
      args.dropIndicator = 'e-no-drop';
    }
  }

  public dragStop(args: DragAndDropEventArgs): void {
    if ((args['draggedNodeData'] && args['draggedNodeData']['parentID'] !== null) && (args['droppedNodeData'] && args['droppedNodeData']['parentID'] === null)) {
      args.cancel = true;
      if (args['dropLevel'] === 1) {
        args.cancel = true;
      } else {
        args.cancel = false;
      }
    } else if ((args['droppedNodeData'] && args['droppedNodeData']['parentID'] !== null) && (args['draggedNodeData'] && args['draggedNodeData']['parentID'] === null)) {
      args.cancel = true;
    } else if ((args['droppedNodeData'] && args['droppedNodeData']['parentID'] === null) && (args['draggedNodeData'] && args['draggedNodeData']['parentID'] === null)) {
      if (args['dropLevel'] === 1) {
        args.cancel = false;
      } else {
        args.cancel = true;
      }
    } else if ((args['droppedNodeData'] && args['droppedNodeData']['parentID'] === null) && (args['draggedNodeData'] && args['draggedNodeData']['parentID'] !== null)) {
      args.cancel = false;
    } else if ((args['droppedNodeData'] === null) && (args['draggedNodeData'] && args['draggedNodeData']['parentID'] !== null)) {
      args.cancel = true;
    }
  }
}