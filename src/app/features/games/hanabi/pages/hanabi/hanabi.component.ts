import {Component, OnInit} from '@angular/core';
import {HanabiGame} from "../../models/hanabi-game.model";
import {HanabiPlayer} from "../../models/hanabi-player.model";
import {map, tap, timer} from "rxjs";
import {NgIf} from "@angular/common";
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
    MatIconModule
  ],
  standalone: true
})
export class HanabiComponent implements OnInit {
  protected user: User = User.empty();
  protected game: HanabiGame = HanabiGame.empty();
  protected selfPlayer: HanabiPlayer = HanabiPlayer.empty();
  protected sending = false;

  protected history?: HanabiGame;

  protected players = List.of(
    HanabiPlayer.builder()
      .withCards(List.of(
        HanabiCard.builder().withId(1).withValue(1).withColor(HanabiCard.Color.RED).build(),
        HanabiCard.builder().withId(2)
          .withValue(2)
          .withColor(HanabiCard.Color.YELLOW)
          .withColorClue(List.of(HanabiCard.Color.YELLOW))
          .build(),
        HanabiCard.builder().withId(3).withValue(3).withColor(HanabiCard.Color.GREEN).build(),
        HanabiCard.builder().withId(4)
          .withValue(4)
          .withColor(HanabiCard.Color.BLUE)
          .withValueClue(List.of(4))
          .build(),
        HanabiCard.builder().withId(5).withValue(5).withColor(HanabiCard.Color.PURPLE).build()
      ))
      .withUser(User.builder().withName('Thibault').build())
      .withPlaying(true)
      .build(),
    HanabiPlayer.builder().withCards(List.of(
      HanabiCard.builder().withId(5)
        .withValue(5)
        .withColor(HanabiCard.Color.RED)
        .withValueClue(List.of(5, 5, 5))
        .withColorClue(List.of(HanabiCard.Color.RED))
        .build(),
      HanabiCard.builder().withId(4).withValue(4).withColor(HanabiCard.Color.GREEN).build(),
      HanabiCard.builder().withId(3).withValue(2).withColor(HanabiCard.Color.YELLOW).build(),
      HanabiCard.builder().withId(2).withValue(3).withColor(HanabiCard.Color.YELLOW).build(),
      HanabiCard.builder().withId(1).withValue(1).withColor(HanabiCard.Color.YELLOW).build(),
    )).build(),
    HanabiPlayer.builder().withCards(List.of(
      HanabiCard.builder().withId(1).withValue(1).withColor(HanabiCard.Color.RED).build(),
      HanabiCard.builder().withId(2).withValue(2).withColor(HanabiCard.Color.YELLOW).build(),
      HanabiCard.builder().withId(3).withValue(3).withColor(HanabiCard.Color.GREEN).withColorClue(List.of(HanabiCard.Color.GREEN)).build(),
      HanabiCard.builder().withId(4).withValue(4).withColor(HanabiCard.Color.BLUE).build(),
      HanabiCard.builder().withId(5).withValue(5).withColor(HanabiCard.Color.PURPLE).build(),
    )).build(),
  )

  protected board = List.of(
    HanabiCard.builder().withId(1).withValue(1).withColor(HanabiCard.Color.RED).build(),
    HanabiCard.builder().withId(3).withValue(1).withColor(HanabiCard.Color.GREEN).build(),
    HanabiCard.builder().withId(4).withValue(1).withColor(HanabiCard.Color.BLUE).build(),
    HanabiCard.builder().withId(5).withValue(1).withColor(HanabiCard.Color.PURPLE).build(),
    HanabiCard.builder().withId(6).withValue(2).withColor(HanabiCard.Color.RED).build(),
    HanabiCard.builder().withId(7).withValue(3).withColor(HanabiCard.Color.RED).build(),
    HanabiCard.builder().withId(8).withValue(4).withColor(HanabiCard.Color.RED).build(),
    HanabiCard.builder().withId(9).withValue(2).withColor(HanabiCard.Color.PURPLE).build()
  );

  constructor(
    private socketService: SocketService,
    private store: HanabiStore,
    private userStore: UserStore
  ) {}

  ngOnInit(): void {
    this.user = this.userStore.user;
    this.game = this.store.game;
    this.selfPlayer = this.game.players.find(p => p.user.equals(this.user)) ?? HanabiPlayer.empty();
    this.socketService.fromEvent<HanabiGame>('updated').pipe(
      map(game => HanabiGame.fromJson(game)),
      tap(game => {
        this.sending = false;
        this.history = undefined;
        this.game = game;
        console.log(game);
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

  protected readonly HanabiPlayer = HanabiPlayer;
}
