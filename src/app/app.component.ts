
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
  array = ["<ul>"];

  todos = [
    {
      Id: 1,
      name: 'Angular',
      category: 'Web Development',
      nodes: [
        { Id: 2, name: 'Angular-1', nodes: [{ Id: 3, name: 'Angular-1.1', nodes: [] }, { Id: 4, name: 'Angular-1.2', nodes: [{ Id: 5, name: 'Angular-1.2.1', nodes: [] }] }] },
        { Id: 6, name: 'Angular-2', nodes: [] },
        { Id: 7, name: 'Angular-3', nodes: [] }
      ]
    },
    {
      Id: 2,
      name: 'Flexbox',
      category: 'Web Development',
      nodes: [
        { Id: 8, name: 'Flexbox-1', nodes: [{ Id: 11, name: 'fb-1.1', nodes: [{ Id: 12, name: 'fb-1.1.1', nodes: [{ Id: 13, name: 'fb-1.1.1.1', nodes: [{ Id: 14, name: 'fb-1.1.1.1.1', nodes: [] }] }] }] }] },
        { Id: 9, name: 'Flexbox-2', nodes: [] },
        { Id: 10, name: 'Flexbox-3', nodes: [] }
      ]
    }
  ];


  ngOnInit() {
    this.printList(this.todos);
    this.array.push("</ul>");
    $("#list").html(this.array.join(""));
  }

  printList(items) {
    // console.log('type ::', items)
    switch ($.type(items)) {
      case "object":
        this.getChildren(items);
        break;
      case "string":
        this.array.push("<li>" + items + "</li>");
        break;
      case "array":
        this.printArray(items);
        break;
    }
  }

  getChildren(parent) {
    if ($.type(parent) === "array" && parent.length > 0) {
      this.array.push("<ul>");
    }

    if ($.type(parent) === "array" && parent.length > 0) {
      for (let child in parent) {
        if (parent[child].name) {
          this.array.push("<li>" + parent[child].name);
        }
        if (parent[child].nodes.length > 0) {
          this.array.push("<ul >");
        }
        this.printArray(parent[child].nodes);
        if (parent[child].nodes.length > 0) {
          this.array.push("</ul >");
        }
        if (parent[child].name) {
          this.array.push("</li>");
        }
      }
    } else {
      for (let child in parent) {
        this.printList(parent[child]);
      }
    }

    if ($.type(parent) === "array" && parent.length > 0) {
      this.array.push("</ul>");
    }
  }

  printArray(myArray) {
    const length = myArray.length;
    for (let i = 0; i < length; i++) {
      if (myArray[i].nodes.length > 0) {
        this.array.push("<li><b>" + myArray[i].name + "</b>");
      } else {
        this.array.push("<li>" + myArray[i].name);
      }
      this.getChildren(myArray[i].nodes);
      this.array.push("</li>");
    }
  }

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