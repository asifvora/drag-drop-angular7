
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

  todos = [
    {
      name: 'Angular',
      category: 'Web Development',
      nodes: [{ name: 'Angular-1' }, { name: 'Angular-2' }, { name: 'Angular-3' }]
    },
    {
      name: 'Flexbox',
      category: 'Web Development',
      nodes: [{ name: 'Flexbox-1' }, { name: 'Flexbox-2' }, { name: 'Flexbox-3' }]
    },
    // {
    //   name: 'iOS',
    //   category: 'App Development',
    //   nodes: [{ name: 'iOS-1' }, { name: 'iOS-2' }, { name: 'iOS-3' }]
    // },
    // {
    //   name: 'Java',
    //   category: 'Software development',
    //   nodes: [{ name: 'Java-1' }, { name: 'Java-2' }, { name: 'Java-3' }]
    // }
  ];

  onDrop(event: CdkDragDrop<string[]>) {
    console.log('event', event)
    if (event.previousContainer === event.container) {
      console.log('If ***')
      moveItemInArray(event.container.data,
        event.previousIndex,
        event.currentIndex);
    } else {
      console.log('else ***')
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex, event.currentIndex);
    }
  }

  onDropSub(event: CdkDragDrop<string[]>, index) {
    console.log('****** onDropSub *******', index)
    console.log(' event', event)
    if (event.previousContainer === event.container) {
      console.log('If ***')
      // moveItemInArray(event.container.data[index]['nodes'],
      moveItemInArray(event.container.data,
        event.previousIndex,
        event.currentIndex);
    } else {
      console.log('else ***')
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex, event.currentIndex);
    }
  }


}