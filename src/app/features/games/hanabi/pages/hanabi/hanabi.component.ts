import {Component, HostListener, OnInit} from '@angular/core';
import {HanabiGame} from "../../models/hanabi-game.model";
import {HanabiPlayer} from "../../models/hanabi-player.model";
import {map, tap, timer} from "rxjs";
import {NgForOf, NgIf} from "@angular/common";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {HanabiCommand} from "../../models/hanabi-command/hanabi-command.model";
import {HanabiBoardComponent} from "../../components/hanabi-board/hanabi-board.component";
import {List} from "immutable";
import {HanabiHistoryComponent} from "../../components/hanabi-history/hanabi-history.component";
import {HanabiCard} from "../../models/hanabi-card.model";
import {MatCardModule} from "@angular/material/card";
import {HanabiDrawPileComponent} from "../../components/hanabi-draw-pile/hanabi-draw-pile.component";
import {HanabiDiscardPileComponent} from "../../components/hanabi-discard-pile/hanabi-discard-pile.component";
import {HanabiInfosComponent} from "../../components/hanabi-infos/hanabi-infos.component";
import {HanabiStateComponent} from "../../components/hanabi-state/hanabi-state.component";
import {HanabiPlayerComponent} from "../../components/hanabi-player/hanabi-player.component";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {User} from "../../../../users/models/user.model";
import {HanabiStore} from "../../../../../core/stores/hanabi.store";
import {UserStore} from "../../../../../core/stores/user.store";
import {SocketService} from "../../../../../core/sockets/socket.service";
import {HanabiSettings} from "../../models/hanabi-settings.model";
import {MatButton} from "@angular/material/button";
import {HanabiCardAnimator} from "../../services/hanabi-card.animator";

@Component({
  selector: 'app-hanabi',
  templateUrl: './hanabi.component.html',
  styleUrls: ['./hanabi.component.scss'],
  imports: [
    NgIf,
    MatProgressBarModule,
    HanabiBoardComponent,
    HanabiHistoryComponent,
    MatCardModule,
    HanabiDrawPileComponent,
    HanabiDiscardPileComponent,
    HanabiInfosComponent,
    HanabiStateComponent,
    HanabiPlayerComponent,
    MatDividerModule,
    MatIconModule,
    MatButton,
    NgForOf
  ],
  standalone: true
})
export class HanabiComponent implements OnInit {

  protected game: HanabiGame = HanabiGame.empty();
  protected settings: HanabiSettings = HanabiSettings.empty();

  protected user: User = User.empty();
  protected selfPlayer: HanabiPlayer = HanabiPlayer.empty();
  protected sending = false;

  protected history?: HanabiGame;

  constructor(
    private socketService: SocketService,
    private store: HanabiStore,
    private userStore: UserStore,
    private animator: HanabiCardAnimator
  ) {}

  ngOnInit(): void {
    this.settings = this.store.settings ?? HanabiSettings.builder()
      .withPlayersNumber(0)
      .withMaxValue(5)
      .withColors(List.of(HanabiCard.Color.RED, HanabiCard.Color.YELLOW, HanabiCard.Color.GREEN, HanabiCard.Color.BLUE, HanabiCard.Color.PURPLE))
      .build();
    this.game = this.store.game ?? this.settings.buildGame(List.of(this.userStore.user, User.empty(), User.empty()));

    this.user = this.userStore.user;
    this.selfPlayer = this.game.players.find(p => p.user.equals(this.user)) ?? HanabiPlayer.empty();

    this.socketService.fromEvent<HanabiGame>('updated').pipe(
      map(game => HanabiGame.fromJson(game)),
      tap(game => {
        this.sending = false;
        this.history = undefined;
        this.game = game;
        this.selfPlayer = this.game.players.find(p => p.user.equals(this.user)) ?? HanabiPlayer.empty();
      })
    ).subscribe();
  }


  protected applyCommand(command: HanabiCommand): void {
    this.sending = true;
    this.selfPlayer = HanabiPlayer.copy(this.selfPlayer).withPlaying(false).build();
    const game = HanabiGame.copy(command.update(this.game))
      .withHistory(this.game.history.insert(0, command))
      .build();
    timer(150).pipe(tap(() => this.socketService.emit('update', game))).subscribe();
  }



  // History
  protected onHistory(history: HanabiGame): void {
    this.history = history;
  }


  // Animator
  @HostListener('window:resize')
  private onResize() {
    console.log('resize');
    List.of(
      ...this.game.drawPile,
      ...this.game.board,
      ...this.game.discardPile,
      ...this.game.players.flatMap(p => p.cards)
    ).forEach(c => this.animator.savePosition(c));
  }

  addCardToBoard(): void {
    const card =
      HanabiCard.builder().withId(15).withValue(5).withColor(HanabiCard.Color.PURPLE).build();
    this.game = HanabiGame.copy(this.game)
      .withBoard(this.game.board.push(card))
      .build();
    this.animator.startAnimation(card);
  }
}
