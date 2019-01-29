
import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Drag & Drop in Angular 7';
  website = 'https://samorgill.com';
  isSubDrop = false;
  LIST_IDS = [];

  todos = [
    {
      Id: 1,
      name: 'Angular',
      category: 'Web Development',
      nodes: [
        { name: 'Angular-1', nodes: [{ name: 'NG-1' }, { name: 'NG-1.1' }] },
        { name: 'Angular-2', nodes: [{ name: 'NG-2' }, { name: 'NG-2.1' }] },
        { name: 'Angular-3', nodes: [{ name: 'NG-3' }, { name: 'NG-3.1' }] }
      ]
    },
    {
      Id: 2,
      name: 'Flexbox',
      category: 'Web Development',
      nodes: [
        { name: 'Flexbox-1', nodes: [{ name: 'FB-1' }] },
        { name: 'Flexbox-2', nodes: [{ name: 'FB-2' }] },
        { name: 'Flexbox-3', nodes: [{ name: 'FB-3' }] }
      ]
    }
  ];

  onDrop(event: CdkDragDrop<string[]>) {
    console.log('event onDrop :: ', event)
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }

  onDropSub(event: CdkDragDrop<string[]>) {
    console.log('****** onDropSub *******')
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  addId(i) {
    const id = 'cdk-drop-list-' + i;
    if (this.LIST_IDS.indexOf(id) === -1) {
      this.LIST_IDS.push(id);
    }

    return id;
  }

}