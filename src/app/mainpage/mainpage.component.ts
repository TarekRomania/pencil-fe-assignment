import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css'],
})
export class MainpageComponent {
  @ViewChild('white_board_iframe')
  whiteBoardIframe!: ElementRef<HTMLIFrameElement>;
  @ViewChild('black_board_iframe')
  blackBoardIframe!: ElementRef<HTMLIFrameElement>;

  gameFinished = false;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    window.addEventListener('message', (event) => {
      if (event.data.mate) {
        this.gameFinished = true;
        return;
      }

      const lastTurnColor = event.data.color;

      const targetIframe =
        lastTurnColor === 'white'
          ? this.blackBoardIframe
          : this.whiteBoardIframe;

      const targetWindow = targetIframe.nativeElement.contentWindow;
      if (targetWindow) {
        targetWindow.postMessage(event.data, this.getIframePageUrl());
      }
    });
  }

  onGameEnd() {
    this.gameFinished = true;
  }

  reset() {
    this.gameFinished = false;

    const resetData = { reset: true };

    this.whiteBoardIframe.nativeElement.contentWindow?.postMessage(
      resetData,
      this.getIframePageUrl()
    );

    this.blackBoardIframe.nativeElement.contentWindow?.postMessage(
      resetData,
      this.getIframePageUrl()
    );

    localStorage.clear();
  }

  private getIframePageUrl(): string {
    const relativeUrl = this.router.serializeUrl(
      this.router.createUrlTree(['/iframepage'])
    );

    return window.location.origin + relativeUrl;
  }
}
