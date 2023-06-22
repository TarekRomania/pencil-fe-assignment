import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  Output,
  ViewChild,
} from '@angular/core';
import { NgxChessBoardView } from 'ngx-chess-board';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoryMove } from 'ngx-chess-board/lib/history-move-provider/history-move';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent {
  isWhiteBoard: boolean = false;

  @Input() onGameEnd!: () => void;

  @ViewChild('board', { static: false }) board!: NgxChessBoardView;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.isWhiteBoard = params['isWhite'] ?? false;
    });

    window.addEventListener('message', (event) => {
      if (event.data.reset) {
        this.handleResetEvent();
      } else {
        this.handleMoveEvent(event.data);
      }
    });
  }

  ngAfterViewInit() {
    if (!this.isWhiteBoard) {
      setTimeout(() => {
        this.board.reverse();
      });
    }

    const currBoardState = localStorage.getItem('board');
    if (currBoardState) {
      this.board.setFEN(currBoardState);
    }
  }

  onMove() {
    const lastMove = this.board.getMoveHistory().slice(-1)[0];
    window.parent.postMessage(lastMove, this.getMainPageUrl());
  }

  private handleResetEvent() {
    this.board.reset();
    localStorage.clear();
  }

  private handleMoveEvent(moveData: HistoryMove) {
    this.board.move(moveData.move);
    localStorage.setItem('board', this.board.getFEN());

    if (moveData.mate) {
      this.onGameEnd();
    }
  }

  private getMainPageUrl(): string {
    const relativeUrl = this.router.serializeUrl(
      this.router.createUrlTree(['/mainpage'])
    );

    return window.location.origin + relativeUrl;
  }
}
