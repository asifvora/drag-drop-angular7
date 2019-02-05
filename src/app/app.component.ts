
import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Drag & Drop in Angular 7';
  LIST_IDS = [];
  todos = [
    {
      Id: 1,
      name: '1.0.0',
      category: 'Web Development',
      nodes: [
        { Id: 2, name: '1.1.1', nodes: [{ Id: 3, name: '1.1.1.1', nodes: [] }, { Id: 4, name: '1.1.1.2', nodes: [{ Id: 5, name: '1.1.1.3', nodes: [] }] }] },
        { Id: 6, name: '1.1.2', nodes: [] },
        { Id: 7, name: '1.1.3', nodes: [] }
      ]
    },
    {
      Id: 8,
      name: '2.0.0',
      category: 'Web Development',
      nodes: [
        { Id: 9, name: '2.1.1', nodes: [{ Id: 12, name: '2.1.1.1', nodes: [] }, { Id: 13, name: '2.1.1.2', nodes: [{ Id: 14, name: '2.1.1.3', nodes: [] }] }] },
        { Id: 10, name: '2.1.2', nodes: [] },
        { Id: 11, name: '2.1.3', nodes: [{ Id: 12, name: '2.1.3.1', nodes: [] }, { Id: 12, name: '2.1.3.2', nodes: [] }] }
      ]
    }, {
      Id: 13,
      name: '3.0.0',
      category: 'Web Development',
      nodes: []
    }
  ];

  ngOnInit() { }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }

  onDropSub(event: CdkDragDrop<string[]>) {
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