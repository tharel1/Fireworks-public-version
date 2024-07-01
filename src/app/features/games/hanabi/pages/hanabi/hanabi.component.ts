import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HanabiGame} from "../../models/hanabi-game.model";
import {combineLatest, distinctUntilChanged, Subscription, tap, timer} from "rxjs";
import {CardAnimator} from "../../services/card-animator.service";
import {HanabiCommandPlay} from "../../models/hanabi-command/hanabi-command-play.model";
import {HanabiCommandDiscard} from "../../models/hanabi-command/hanabi-command-discard.model";
import {HanabiHistory} from "../../models/hanabi-history.model";
import {HanabiCommandClueColor} from "../../models/hanabi-command/hanabi-command-clue-color.model";
import {ClueAnimator} from "../../services/clue-animator.service";
import {HanabiCommandClueValue} from "../../models/hanabi-command/hanabi-command-clue-value.model";
import {ProgressBarComponent} from "../../../../../shared/components/progress-bar/progress-bar.component";
import {HanabiGameComponent} from "../../components/hanabi-game/hanabi-game.component";
import {HanabiSideElemsComponent} from "../../components/hanabi-side-elems/hanabi-side-elems.component";
import {HanabiCommand} from "../../models/hanabi-command/internal";
import {HanabiPreferences} from "../../models/hanabi-preferences.model";
import {SnackBarService} from "../../../../../shared/services/snack-bar.service";
import {HanabiAssistant} from "../../models/hanabi-assistant/hanabi-assistant.model";
import {HanabiInfosFromPov} from '../../models/hanabi-infos/internal';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {HanabiSideSheetComponent} from "../../components/hanabi-side-sheet/hanabi-side-sheet.component";
import {MatDialog} from "@angular/material/dialog";
import {
  HanabiScoresDialogComponent,
  HanabiScoresDialogData
} from "../../components/hanabi-side-elems/hanabi-scores-dialog/hanabi-scores-dialog.component";
import {User} from "../../../../../core/models/user.model";
import {UserStore} from "../../../../../core/stores/user.store";
import {TableRepository} from "../../../../../core/repositories/table.repository";
import {Router} from "@angular/router";
import {Table} from "../../../../../core/models/table.model";

@Component({
  selector: 'app-hanabi',
  templateUrl: './hanabi.component.html',
  styleUrls: ['./hanabi.component.scss'],
  imports: [
    ProgressBarComponent,
    HanabiGameComponent,
    HanabiSideElemsComponent,
    MatSidenav,
    HanabiSideSheetComponent,
    MatSidenavContent,
    MatSidenavContainer
  ],
  standalone: true
})
export class HanabiComponent implements OnInit, OnDestroy {

  user: User = User.empty();
  game: HanabiGame = HanabiGame.empty();
  history: HanabiHistory = HanabiHistory.empty();
  preferences: HanabiPreferences = HanabiPreferences.empty();
  infos: HanabiInfosFromPov = HanabiInfosFromPov.empty();
  assistant: HanabiAssistant = HanabiAssistant.empty();

  protected gameOrHistory: HanabiGame = HanabiGame.empty();
  protected sending = false;

  private initialized: boolean = false;
  private tableId: string = '';
  private table: Table = Table.empty();

  private readonly watcher = new Subscription();

  @ViewChild('side_sheet') private sideSheet!: MatSidenav;

  constructor(
    private readonly userStore: UserStore,
    private readonly tableRepository: TableRepository,
    private readonly router: Router,
    private readonly snackBarService: SnackBarService,
    private readonly dialog: MatDialog,
    private readonly cardAnimator: CardAnimator,
    private readonly clueAnimator: ClueAnimator
  ) { }

  ngOnInit(): void {
    this.tableId = this.router.url.split('/').pop() ?? '';

    this.watcher.add(combineLatest([
      this.userStore.get(),
      this.tableRepository.listen(this.tableId).pipe(
        distinctUntilChanged((t1, t2) => t1?.commands.size === t2?.commands.size)
      )
    ]).pipe(
      tap(([user, table]) => {
        if (!user || !table) return;

        if (!this.initialized) {
          this.initialized = true;
          this.initGame(user, table);
        }
        else {
          this.updateGame(table.commands.last());
        }
      })
    ).subscribe());
  }

  ngOnDestroy(): void {
    this.cardAnimator.resetCardPositions();
    this.watcher.unsubscribe();
  }



  private initGame(user: User, table: Table): void {
    this.user = user ?? User.empty();
    this.table = table ?? Table.empty();
    this.game = this.table.createGame();
    this.history = HanabiHistory.builder()
      .withGame(this.game)
      .withCommands(this.table.commands)
      .build();
    this.preferences = HanabiPreferences.builder()
      .withShowCritical(true)
      .withShowTrash(true)
      .withShowMarkerWarnings(true)
      .withMarkerCleaning(true)
      .build();
    this.infos = this.game.createInfos().createPov(this.user);
    this.assistant = this.infos.createAssistant();
    this.gameOrHistory = this.game;
    timer(0).subscribe(() => this.cardAnimator.saveAllCardPositions(this.gameOrHistory));
  }

  private updateGame(command: HanabiCommand): void {
    this.sending = false;
    this.game = command.update(this.game);
    this.infos = this.game.createInfos().createPov(this.user);
    this.assistant = this.assistant.update(this.infos);
    this.history = HanabiHistory.builder()
      .withGame(this.game)
      .withCommands(this.history.commands.push(command))
      .build();
    this.gameOrHistory = this.game;

    this.animateForward(this.game, command);
    if (this.game.finished) this.finishGame();
  }

  private finishGame(): void {
    timer(1000).subscribe(() => {
      this.dialog.open<HanabiScoresDialogComponent, HanabiScoresDialogData>(
        HanabiScoresDialogComponent,
        { data: { game: this.game, infos: this.infos }}
      );
    });
  }



  // Events
  protected onCommand(command: HanabiCommand): void {
    this.sending = true;
    this.watcher.add(this.tableRepository.update(Table.copy(this.table)
      .withCommands(this.history.commands.push(command))
      .build()
    ).subscribe());
  }

  protected onHistory(history: HanabiHistory): void {
    this.history = history;

    this.gameOrHistory = this.history.state ?? this.game;
    this.infos = this.gameOrHistory.createInfos().createPov(this.user);
    this.assistant = this.assistant.update(this.infos);

    switch (this.history.lastAction) {
      case HanabiHistory.Action.GO_FORWARD:
        this.animateForward(this.gameOrHistory, this.history.lastCommand());
        return;
      case HanabiHistory.Action.GO_BACKWARD:
        this.animateBackward(this.gameOrHistory, this.history.lastCommand());
        return;
      case HanabiHistory.Action.CANCEL:
      case HanabiHistory.Action.GO_TO:
        timer(0).subscribe(() => this.cardAnimator.saveAllCardPositions(this.gameOrHistory));
        return;
    }
  }

  protected onPreferences(preferences: HanabiPreferences): void {
    this.preferences = preferences;
    this.snackBarService.success(`Preferences successfully saved.`);
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
  @HostListener('window:resize')
  private onResize(): void {
    this.cardAnimator.saveAllCardPositions(this.game);
  }

  private animateForward(game: HanabiGame, command?: HanabiCommand): void {
    switch (command?.type) {
      case HanabiCommand.Type.PLAY:
        const playCommand = command as HanabiCommandPlay;
        if (playCommand.isBomb) {
          document.getElementById('game-root')?.classList.remove('bomb-exploded');
          timer(0).subscribe(() => document.getElementById('game-root')?.classList.add('bomb-exploded'));
        }
        this.cardAnimator.scheduleCardToMove(100, game, playCommand.card, playCommand.isBomb);
        game.players.find(p => p.equals(playCommand.source))?.cards.forEach(c => {
          this.cardAnimator.scheduleCardToMove(100, game, c);
        });
        return;
      case HanabiCommand.Type.DISCARD:
        const discardCommand = command as HanabiCommandDiscard;
        this.cardAnimator.scheduleCardToMove(100, game, discardCommand.card, true);
        game.players.find(p => p.equals(discardCommand.source))?.cards.forEach(c => {
          this.cardAnimator.scheduleCardToMove(100, game, c);
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

  private animateBackward(game: HanabiGame, command?: HanabiCommand): void {
    switch (command?.type) {
      case HanabiCommand.Type.PLAY:
        const playCommand = command as HanabiCommandPlay;
        this.cardAnimator.scheduleCardToMove(100, game, game.drawPile.last());
        game.players.find(p => p.equals(playCommand.source))?.cards.forEach(c => {
          this.cardAnimator.scheduleCardToMove(100, game, c);
        });
        return;
      case HanabiCommand.Type.DISCARD:
        const discardCommand = command as HanabiCommandDiscard;
        this.cardAnimator.scheduleCardToMove(100, game, game.drawPile.last());
        game.players.find(p => p.equals(discardCommand.source))?.cards.forEach(c => {
          this.cardAnimator.scheduleCardToMove(100, game, c);
        });
        return;
      default:
        return;
    }
  }
}
