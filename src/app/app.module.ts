import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MatCardModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DndModule } from 'ngx-drag-drop';
import { NestableModule } from './ngx-nestable';
import { MatButtonModule, MatToolbarModule, MatSlideToggleModule, MatIconModule } from '@angular/material';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
// import { TreeViewComponent } from '@syncfusion/ej2-angular-navigations';

@NgModule({
  declarations: [
    AppComponent,
    // TreeViewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    DragDropModule,
    DndModule,
    NestableModule,
    MatIconModule,
    TreeViewModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}