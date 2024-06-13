import {AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {HanabiInfosFromPov} from '../../models/hanabi-infos/internal';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {HanabiSideSheetComponent} from "../../components/hanabi-side-sheet/hanabi-side-sheet.component";
import {UserStore} from "../../../../../core/stores/user.store";

@Component({
  selector: 'app-hanabi',
  templateUrl: './hanabi.component.html',
  styleUrls: ['./hanabi.component.scss'],
  imports: [
    ProgressBarComponent,
    HanabiStateComponent,
    HanabiSideElemsComponent,
    MatSidenav,
    HanabiSideSheetComponent,
    MatSidenavContent,
    MatSidenavContainer
  ],
  standalone: true
})
export class HanabiComponent implements OnInit, OnDestroy, AfterViewInit {

  game: HanabiGame = HanabiGame.empty();
  history: HanabiHistory = HanabiHistory.empty();
  preferences: HanabiPreferences = HanabiPreferences.empty();
  infos: HanabiInfosFromPov = HanabiInfosFromPov.empty();
  assistant: HanabiAssistant = HanabiAssistant.empty();

  protected sending = false;

  private readonly watcher = new Subscription();

  @ViewChild('side_sheet') private sideSheet!: MatSidenav;

  constructor(
    private socketService: SocketService,
    private store: HanabiStore,
    private userStore: UserStore,
    private cardAnimator: CardAnimator,
    private clueAnimator: ClueAnimator,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.game = this.store.game ?? HanabiGame.empty();
    this.preferences = HanabiPreferences.builder()
      .withShowCritical(true)
      .withShowMarkerWarnings(true)
      .withMarkerCleaning(true)
      .build();
    this.infos = this.game.createInfos().createPov(this.userStore.user);
    this.assistant = this.infos.createAssistant();

    this.watcher.add(this.socketService.fromEvent<HanabiCommand>('updated').pipe(
      map(command => HanabiCommand.fromJson(command)),
      tap(command => {
        this.sending = false;
        this.game = command.update(this.game);
        this.infos = this.game.createInfos().createPov(this.userStore.user);
        this.assistant = this.assistant.update(this.infos);
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



  // Events
  protected onCommand(command: HanabiCommand): void {
    this.sending = true;
    timer(250).subscribe(() => this.socketService.emit('update', command));
  }

  protected onHistory(history: HanabiHistory): void {
    this.history = history;

    const gameOrHistory = this.history.state ?? this.game;
    this.infos = gameOrHistory.createInfos().createPov(this.userStore.user);
    this.assistant = this.assistant.update(this.infos);

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

  protected onPreferences(preferences: HanabiPreferences): void {
    this.preferences = preferences;
    this.snackBarService.success(`Your preferences were successfully saved.`);
  }

  protected onAssistant(assistant: HanabiAssistant): void {
    this.assistant = assistant;

    if (this.assistant.selectedCardId !== undefined) this.openSideSheet();
    else this.closeSideSheet();
  }



  // Side sheet
  protected openSideSheet(): void {
    this.sideSheet.open().then(() => this.cardAnimator.saveAllCardPositions(this.game));
  }

  protected closeSideSheet(): void {
    this.sideSheet.close().then(() => this.cardAnimator.saveAllCardPositions(this.game));
  }



  // Animations
  ngAfterViewInit(): void {
    timer(0).subscribe(() => this.cardAnimator.saveAllCardPositions(this.game));
  }

  @HostListener('window:resize')
  private onResize(): void {
    this.cardAnimator.saveAllCardPositions(this.game);
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
