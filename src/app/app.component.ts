
import { Component, OnInit } from '@angular/core';
import { DragAndDropEventArgs } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Welcome to Multilevel Drag & Drop in Angular 7';
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
  // maps the appropriate column to fields property
  public field: Object = { dataSource: this.todos, id: 'Id', parentID: 'parentId', text: 'name', hasChildren: 'hasChild' };
  public allowDragAndDrop: boolean = true;
  private allowMultiSelection: Boolean = true;

  ngOnInit() { }


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

  //get updated array
  public dataSourceChanged(e): void {
    console.log('dataSourceChanged', e)
  }
}