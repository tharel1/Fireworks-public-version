import {AfterViewInit, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {HanabiGame} from "../../models/hanabi-game.model";
import {HanabiPlayer} from "../../models/hanabi-player.model";
import {map, Subscription, tap, timer} from "rxjs";
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
import {CardAnimator} from "../../services/card-animator.service";
import {HanabiCommandPlay} from "../../models/hanabi-command/hanabi-command-play.model";
import {HanabiCommandDiscard} from "../../models/hanabi-command/hanabi-command-discard.model";
import {HanabiHistory} from "../../models/hanabi-history.model";
import {HanabiCommandClueColor} from "../../models/hanabi-command/hanabi-command-clue-color.model";
import {ClueAnimator} from "../../services/clue-animator.service";
import {HanabiCommandClueValue} from "../../models/hanabi-command/hanabi-command-clue-value.model";

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
export class HanabiComponent implements OnInit, OnDestroy, AfterViewInit {

  protected game: HanabiGame = HanabiGame.empty();
  protected settings: HanabiSettings = HanabiSettings.empty();

  protected user: User = User.empty();
  protected selfPlayer: HanabiPlayer = HanabiPlayer.empty();
  protected sending = false;

  protected history: HanabiHistory = HanabiHistory.empty();

  private readonly watcher = new Subscription();

  constructor(
    private socketService: SocketService,
    private store: HanabiStore,
    private userStore: UserStore,
    private cardAnimator: CardAnimator,
    private clueAnimator: ClueAnimator
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

    this.watcher.add(this.socketService.fromEvent<HanabiGame>('updated').pipe(
      map(game => HanabiGame.fromJson(game)),
      tap(game => {
        this.sending = false;
        this.game = game;
        this.history = HanabiHistory.builder()
          .withGame(this.game)
          .build();
        this.selfPlayer = this.game.players.find(p => p.user.equals(this.user)) ?? HanabiPlayer.empty();
        this.animateForward(this.game, this.game.history.last());
      })
    ).subscribe());
  }

  ngOnDestroy(): void {
    this.cardAnimator.resetCardPositions();
    this.watcher.unsubscribe();
  }



  // Game
  protected applyCommand(command: HanabiCommand): void {
    this.sending = true;
    this.selfPlayer = HanabiPlayer.copy(this.selfPlayer).withPlaying(false).build();
    const game = HanabiGame.copy(command.update(this.game))
      .withHistory(this.game.history.push(command))
      .build();
    timer(150).pipe(tap(() => this.socketService.emit('update', game))).subscribe();
  }



  // Animator
  ngAfterViewInit(): void {
    timer(0).subscribe(() => this.cardAnimator.saveAllCardPositions(this.game));
  }

  @HostListener('window:resize')
  private onResize(): void {
    this.cardAnimator.saveAllCardPositions(this.game);
  }

  protected onHistory(history: HanabiHistory): void {
    this.history = history;

    switch (this.history.lastAction) {
      case HanabiHistory.Action.GO_FORWARD:
        this.animateForward(this.history.state ?? this.game, this.history.lastCommand());
        return;
      case HanabiHistory.Action.GO_BACKWARD:
        this.animateBackward(this.history.state ?? this.game, this.history.lastCommand());
        return;
      case HanabiHistory.Action.CANCEL:
        timer(0).subscribe(() => this.cardAnimator.saveAllCardPositions(this.game));
        return;
    }
  }

  private animateForward(state: HanabiGame, command?: HanabiCommand): void {
    switch (command?.type) {
      case HanabiCommand.Type.PLAY:
        const playCommand = command as HanabiCommandPlay;
        this.cardAnimator.scheduleCardToMove(100, state, playCommand.card);
        this.cardAnimator.scheduleCardToMove(600, state, state.players.find(p => p.equals(playCommand.target))?.cards.first());
        return;
      case HanabiCommand.Type.DISCARD:
        const discardCommand = command as HanabiCommandDiscard;
        this.cardAnimator.scheduleCardToMove(100, state, discardCommand.card, true);
        this.cardAnimator.scheduleCardToMove(600, state, state.players.find(p => p.equals(discardCommand.target))?.cards.first());
        return;
      case HanabiCommand.Type.CLUE_COLOR:
        const clueColorCommand = command as HanabiCommandClueColor;
        clueColorCommand.target.cards.filter(c => c.color === clueColorCommand.color)
          .forEach((c, i) => {
            this.clueAnimator.scheduleClueToMove(c, i*50);
          });
        return;
      case HanabiCommand.Type.CLUE_VALUE:
        const clueValueCommand = command as HanabiCommandClueValue;
        clueValueCommand.target.cards.filter(c => c.value === clueValueCommand.value)
          .forEach((c, i) => {
            this.clueAnimator.scheduleClueToMove(c, i*50);
          });
        return;
      default:
        return;
    }
  }

  private animateBackward(state: HanabiGame, command?: HanabiCommand): void {
    switch (command?.type) {
      case HanabiCommand.Type.PLAY:
        const playCommand = command as HanabiCommandPlay;
        this.cardAnimator.scheduleCardToMove(100, state, state.drawPile.last());
        this.cardAnimator.scheduleCardToMove(600, state, playCommand.card);
        return;
      case HanabiCommand.Type.DISCARD:
        const discardCommand = command as HanabiCommandDiscard;
        this.cardAnimator.scheduleCardToMove(100, state, state.drawPile.last());
        this.cardAnimator.scheduleCardToMove(600, state, discardCommand.card);
        return;
      default:
        return;
    }
  }
}
