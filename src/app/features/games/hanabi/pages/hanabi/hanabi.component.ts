import {AfterViewInit, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {HanabiGame} from "../../models/hanabi-game.model";
import {map, Subscription, tap, timer} from "rxjs";
import {HanabiCommand} from "../../models/hanabi-command/hanabi-command.model";
import {HanabiStore} from "../../../../../core/stores/hanabi.store";
import {SocketService} from "../../../../../core/sockets/socket.service";
import {HanabiSettings} from "../../models/hanabi-settings.model";
import {CardAnimator} from "../../services/card-animator.service";
import {HanabiCommandPlay} from "../../models/hanabi-command/hanabi-command-play.model";
import {HanabiCommandDiscard} from "../../models/hanabi-command/hanabi-command-discard.model";
import {HanabiHistory} from "../../models/hanabi-history.model";
import {HanabiCommandClueColor} from "../../models/hanabi-command/hanabi-command-clue-color.model";
import {ClueAnimator} from "../../services/clue-animator.service";
import {HanabiCommandClueValue} from "../../models/hanabi-command/hanabi-command-clue-value.model";
import {ProgressBarComponent} from "../../../../../shared/components/progress-bar/progress-bar.component";
import {HanabiStateComponent} from "../../components/hanabi-state/hanabi-state.component";
import {HanabiSideElemsComponent} from "../../components/hanabi-side-elems/hanabi-side-elems.component";

@Component({
  selector: 'app-hanabi',
  templateUrl: './hanabi.component.html',
  styleUrls: ['./hanabi.component.scss'],
  imports: [
    ProgressBarComponent,
    HanabiStateComponent,
    HanabiSideElemsComponent
  ],
  standalone: true
})
export class HanabiComponent implements OnInit, OnDestroy, AfterViewInit {

  game: HanabiGame = HanabiGame.empty();
  settings: HanabiSettings = HanabiSettings.empty();
  history: HanabiHistory = HanabiHistory.empty();

  protected sending = false;

  private readonly watcher = new Subscription();

  constructor(
    private socketService: SocketService,
    private store: HanabiStore,
    private cardAnimator: CardAnimator,
    private clueAnimator: ClueAnimator
  ) {}

  ngOnInit(): void {
    this.settings = this.store.settings ?? HanabiSettings.empty();
    this.game = this.store.game ?? HanabiGame.empty();

    this.watcher.add(this.socketService.fromEvent<HanabiGame>('updated').pipe(
      map(game => HanabiGame.fromJson(game)),
      tap(game => {
        this.sending = false;
        this.game = game;
        this.history = HanabiHistory.builder()
          .withGame(this.game)
          .build();
        this.animateForward(this.game, this.game.history.last());
      })
    ).subscribe());
  }

  ngOnDestroy(): void {
    this.cardAnimator.resetCardPositions();
    this.watcher.unsubscribe();
  }



  // Game
  protected onGameUpdate(game: HanabiGame): void {
    this.sending = true;
    timer(250).subscribe(() => this.socketService.emit('update', game));
  }



  // Animator
  ngAfterViewInit(): void {
    timer(0).subscribe(() => this.cardAnimator.saveAllCardPositions(this.game));
  }

  @HostListener('window:resize')
  private onResize(): void {
    this.cardAnimator.saveAllCardPositions(this.game);
  }

  protected onHistoryUpdate(history: HanabiHistory): void {
    this.history = history;

    switch (this.history.lastAction) {
      case HanabiHistory.Action.GO_FORWARD:
        this.animateForward(this.history.state ?? this.game, this.history.lastCommand());
        return;
      case HanabiHistory.Action.GO_BACKWARD:
      case HanabiHistory.Action.CANCEL:
        timer(0).subscribe(() => this.cardAnimator.saveAllCardPositions(this.game));
        return;
    }
  }

  private animateForward(state: HanabiGame, command?: HanabiCommand): void {
    switch (command?.type) {
      case HanabiCommand.Type.PLAY:
        const playCommand = command as HanabiCommandPlay;
        const bombExploded = state.discardPile.some(c => c.equals(playCommand.card));
        if (bombExploded) {
          document.getElementById('game-root')?.classList.remove('bomb-exploded');
          timer(0).subscribe(() => document.getElementById('game-root')?.classList.add('bomb-exploded'));
        }
        this.cardAnimator.scheduleCardToMove(100, state, playCommand.card, bombExploded);
        this.cardAnimator.scheduleCardToMove(600, state, state.players.find(p => p.equals(playCommand.source))?.cards.first());
        return;
      case HanabiCommand.Type.DISCARD:
        const discardCommand = command as HanabiCommandDiscard;
        this.cardAnimator.scheduleCardToMove(100, state, discardCommand.card, true);
        this.cardAnimator.scheduleCardToMove(600, state, state.players.find(p => p.equals(discardCommand.source))?.cards.first());
        return;
      case HanabiCommand.Type.CLUE_COLOR:
        const clueColorCommand = command as HanabiCommandClueColor;
        clueColorCommand.target.cards.filter(c => c.color === clueColorCommand.color)
          .filter(c => c.colorClue.isEmpty() && c.valueClue.isEmpty())
          .forEach((c, i) => {
            this.clueAnimator.scheduleClueToMove(c, i*50);
          });
        return;
      case HanabiCommand.Type.CLUE_VALUE:
        const clueValueCommand = command as HanabiCommandClueValue;
        clueValueCommand.target.cards.filter(c => c.value === clueValueCommand.value)
          .filter(c => c.colorClue.isEmpty() && c.valueClue.isEmpty())
          .forEach((c, i) => {
            this.clueAnimator.scheduleClueToMove(c, i*50);
          });
        return;
      default:
        return;
    }
  }
}
