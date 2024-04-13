import {AfterViewInit, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {HanabiGame} from "../../models/hanabi-game.model";
import {HanabiPlayer} from "../../models/hanabi-player.model";
import {map, Subscription, tap, timer} from "rxjs";
import {NgForOf, NgIf} from "@angular/common";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {HanabiCommand} from "../../models/hanabi-command/hanabi-command.model";
import {HanabiBoardComponent} from "../../components/hanabi-board/hanabi-board.component";
import {List, Set} from "immutable";
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
import {HanabiCommandPlay} from "../../models/hanabi-command/hanabi-command-play.model";
import {HanabiCommandDiscard} from "../../models/hanabi-command/hanabi-command-discard.model";
import {HanabiHistory} from "../../models/hanabi-history.model";

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

    this.watcher.add(this.socketService.fromEvent<HanabiGame>('updated').pipe(
      map(game => HanabiGame.fromJson(game)),
      tap(game => {
        this.sending = false;
        this.history = HanabiHistory.empty();
        this.game = game;
        this.selfPlayer = this.game.players.find(p => p.user.equals(this.user)) ?? HanabiPlayer.empty();
        this.animateForward(this.game, this.game.history.last());
      })
    ).subscribe());
  }

  ngOnDestroy(): void {
    this.animator.resetPositions();
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
    timer(0).subscribe(() => this.animator.savePositions(this.game));
  }

  @HostListener('window:resize')
  private onResize(): void {
    this.animator.savePositions(this.game);
  }

  protected onHistory(history: HanabiHistory): void {
    this.history = history;

    switch (this.history.lastDirection) {
      case HanabiHistory.Direction.FORWARD:
        this.animateForward(this.history.state ?? this.game, this.history.lastCommand);
        return;
      case HanabiHistory.Direction.BACKWARD:
        this.animateBackward(this.history.state ?? this.game, this.history.lastCommand);
        return;
      default:
        timer(0).subscribe(() => this.animator.savePositions(this.game));
        return;
    }
  }

  private animateForward(state: HanabiGame, command?: HanabiCommand): void {
    this.animator.movingCards = Set.of();

    switch (command?.type) {
      case HanabiCommand.Type.PLAY:
        const playCommand = command as HanabiCommandPlay;
        this.animator.movingCards = this.animator.movingCards.add(playCommand.card);
        this.animator.startAnimation(0, state, playCommand.card);
        const drawnCard = state.players.find(p => p.equals(playCommand.target))?.cards.first();
        if (drawnCard) {
          this.animator.movingCards = this.animator.movingCards.add(drawnCard);
          this.animator.startAnimation(850, state, drawnCard);
        }
        return;
      case HanabiCommand.Type.DISCARD:
        const discardCommand = command as HanabiCommandDiscard;
        return;
      default:
        return;
    }
  }

  private animateBackward(state: HanabiGame, command?: HanabiCommand): void {
    switch (command?.type) {
      case HanabiCommand.Type.PLAY:
        const playCommand = command as HanabiCommandPlay;
        this.animator.startAnimation(0, state, state.drawPile.last());
        this.animator.startAnimation(850, state, playCommand.card);
        return;
      case HanabiCommand.Type.DISCARD:
        const discardCommand = command as HanabiCommandDiscard;
        return;
      default:
        return;
    }
  }
}
