import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgxChessBoardModule } from 'ngx-chess-board';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { AppRoutingModule } from './app-routing.module';
import { MainpageComponent } from './mainpage/mainpage.component';

@NgModule({
  declarations: [AppComponent, BoardComponent, MainpageComponent],
  imports: [BrowserModule, AppRoutingModule, NgxChessBoardModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
