import {AfterViewInit, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {HanabiGame} from "../../models/hanabi-game.model";
import {map, Subscription, tap, timer} from "rxjs";
import {HanabiStore} from "../../../../../core/stores/hanabi.store";
import {SocketService} from "../../../../../core/sockets/socket.service";
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
import {HanabiCommand} from "../../models/hanabi-command/internal";
import {HanabiPreferences} from "../../models/hanabi-preferences.model";
import {SnackBarService} from "../../../../../shared/services/snack-bar.service";
import {HanabiAssistant} from "../../models/hanabi-assistant.model";
import {HanabiInfos} from '../../models/hanabi-infos/internal';

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
  history: HanabiHistory = HanabiHistory.empty();
  preferences: HanabiPreferences = HanabiPreferences.empty();
  infos: HanabiInfos = HanabiInfos.empty();
  assistant: HanabiAssistant = HanabiAssistant.empty();

  protected sending = false;

  private readonly watcher = new Subscription();

  constructor(
    private socketService: SocketService,
    private store: HanabiStore,
    private cardAnimator: CardAnimator,
    private clueAnimator: ClueAnimator,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.game = this.store.game ?? HanabiGame.empty();
    this.infos = this.game.createInfos();
    this.assistant = this.game.createAssistant();

    this.watcher.add(this.socketService.fromEvent<HanabiCommand>('updated').pipe(
      map(command => HanabiCommand.fromJson(command)),
      tap(command => {
        this.sending = false;
        this.game = command.update(this.game);
        this.infos = this.game.createInfos();
        this.history = HanabiHistory.builder()
          .withGame(this.game)
          .withCommands(this.history.commands.push(command))
          .build();
        this.animateForward(this.game, command);
      })
    ).subscribe());
  }

  ngOnDestroy(): void {
    this.cardAnimator.resetCardPositions();
    this.watcher.unsubscribe();
  }

  protected onCommand(command: HanabiCommand): void {
    this.sending = true;
    timer(250).subscribe(() => this.socketService.emit('update', command));
  }

  protected onPreferences(preferences: HanabiPreferences): void {
    this.preferences = preferences;
    this.snackBarService.success(`Your preferences were successfully saved.`);
  }

  protected onAssistant(assistant: HanabiAssistant): void {
    this.assistant = assistant;
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

    const gameOrHistory = this.history.state ?? this.game;
    this.infos = gameOrHistory.createInfos();

    switch (this.history.lastAction) {
      case HanabiHistory.Action.GO_FORWARD:
        this.animateForward(gameOrHistory, this.history.lastCommand());
        return;
      case HanabiHistory.Action.GO_BACKWARD:
        this.animateBackward(gameOrHistory, this.history.lastCommand());
        return;
      case HanabiHistory.Action.CANCEL:
      case HanabiHistory.Action.GO_TO:
        timer(0).subscribe(() => this.cardAnimator.saveAllCardPositions(gameOrHistory));
        return;
    }
  }

  private animateForward(state: HanabiGame, command?: HanabiCommand): void {
    switch (command?.type) {
      case HanabiCommand.Type.PLAY:
        const playCommand = command as HanabiCommandPlay;
        if (playCommand.isBomb) {
          document.getElementById('game-root')?.classList.remove('bomb-exploded');
          timer(0).subscribe(() => document.getElementById('game-root')?.classList.add('bomb-exploded'));
        }
        this.cardAnimator.scheduleCardToMove(100, state, playCommand.card, playCommand.isBomb);
        state.players.find(p => p.equals(playCommand.source))?.cards.forEach(c => {
          this.cardAnimator.scheduleCardToMove(100, state, c);
        });
        return;
      case HanabiCommand.Type.DISCARD:
        const discardCommand = command as HanabiCommandDiscard;
        this.cardAnimator.scheduleCardToMove(100, state, discardCommand.card, true);
        state.players.find(p => p.equals(discardCommand.source))?.cards.forEach(c => {
          this.cardAnimator.scheduleCardToMove(100, state, c);
        });
        return;
      case HanabiCommand.Type.CLUE_COLOR:
        const clueColorCommand = command as HanabiCommandClueColor;
        clueColorCommand.target.cards.filter(c => c.color === clueColorCommand.color)
          .filter(c => !c.isClued())
          .forEach((c, i) => {
            this.clueAnimator.scheduleClueToMove(c, i*50);
          });
        return;
      case HanabiCommand.Type.CLUE_VALUE:
        const clueValueCommand = command as HanabiCommandClueValue;
        clueValueCommand.target.cards.filter(c => c.value === clueValueCommand.value)
          .filter(c => !c.isClued())
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
        state.players.find(p => p.equals(playCommand.source))?.cards.forEach(c => {
          this.cardAnimator.scheduleCardToMove(100, state, c);
        });
        return;
      case HanabiCommand.Type.DISCARD:
        const discardCommand = command as HanabiCommandDiscard;
        this.cardAnimator.scheduleCardToMove(100, state, state.drawPile.last());
        state.players.find(p => p.equals(discardCommand.source))?.cards.forEach(c => {
          this.cardAnimator.scheduleCardToMove(100, state, c);
        });
        return;
      default:
        return;
    }
  }
}
