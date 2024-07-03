import {List, Set, ValueObject} from "immutable";
import {HanabiPlayer} from "./hanabi-player.model";
import {HanabiCard} from "./hanabi-card.model";
import {HanabiSettings} from "./hanabi-settings.model";
import {HanabiInfos} from "./hanabi-infos/internal";
import {HanabiScore} from "./hanabi-score.model";
import {JsonType, PlainJson} from "../../../../core/utils/plain-json.model";

export class HanabiGame implements ValueObject, PlainJson<HanabiGame> {

  readonly settings: HanabiSettings;
  readonly turn: number;
  readonly players: List<HanabiPlayer>;
  readonly drawPile: List<HanabiCard>;
  readonly discardPile: List<HanabiCard>;
  readonly board: List<HanabiCard>;
  readonly clues: number;
  readonly bombs: number;
  readonly finished: boolean;
  readonly lastTurn?: number;

  constructor(builder: Builder) {
    this.settings = builder.settings;
    this.turn = builder.turn;
    this.players = builder.players;
    this.drawPile = builder.drawPile;
    this.discardPile = builder.discardPile;
    this.board = builder.board;
    this.clues = builder.clues;
    this.bombs = builder.bombs;
    this.finished = builder.finished;
    this.lastTurn = builder.lastTurn;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiGame {
    return HanabiGame.builder().build();
  }

  static copy(copy: HanabiGame): Builder {
    return HanabiGame.builder()
      .withSettings(copy.settings)
      .withTurn(copy.turn)
      .withPlayers(copy.players)
      .withDrawPile(copy.drawPile)
      .withDiscardPile(copy.discardPile)
      .withBoard(copy.board)
      .withClues(copy.clues)
      .withBombs(copy.bombs)
      .withFinished(copy.finished)
      .withLastTurn(copy.lastTurn);
  }

  static fromJson(json: any): HanabiGame {
    return HanabiGame.builder()
      .withSettings(HanabiSettings.fromJson(json.settings))
      .withTurn(json.turn)
      .withPlayers(List(json.players).map(p => HanabiPlayer.fromJson(p)))
      .withDrawPile(List(json.drawPile).map(c => HanabiCard.fromJson(c)))
      .withDiscardPile(List(json.discardPile).map(c => HanabiCard.fromJson(c)))
      .withBoard(List(json.board).map(c => HanabiCard.fromJson(c)))
      .withClues(json.clues)
      .withBombs(json.bombs)
      .withFinished(json.finished)
      .withLastTurn(json.lastTurn)
      .build();
  }

  toJson(): JsonType<HanabiGame> {
    return {
      settings: this.settings.toJson(),
      turn: this.turn,
      players: this.players.map(p => p.toJson()).toArray(),
      drawPile: this.drawPile.map(c => c.toJson()).toArray(),
      discardPile: this.discardPile.map(c => c.toJson()).toArray(),
      board: this.board.map(c => c.toJson()).toArray(),
      clues: this.clues,
      bombs: this.bombs,
      finished: this.finished,
      lastTurn: this.lastTurn ?? null
    }
  }

  equals(other: unknown): boolean {
    return false;
  }

  hashCode(): number {
    return 0;
  }

  isFinished(): boolean {
    return this.hasMaxBombs()
        || this.lastTurnPlayed()
        || this.reachedMaxPossibleScore();
  }

  infoMessage(): string | undefined {
    return `Play/Discard a card or give a clue to a player.`;
  }

  warnMessage(): string | undefined {
    if (this.finished) return `Game finished !`;
    if (!this.lastTurn) return undefined;

    const turnsLeft = this.turnsLeft();
    if (turnsLeft === this.settings.playersNumber)
      return `Empty deck: ${turnsLeft} turns left!`;
    else if (turnsLeft === 1)
      return `Last turn!`;
    else if (turnsLeft === 0)
      return undefined;
    else
      return `${turnsLeft} turns left!`;
  }

  private hasMaxBombs(): boolean {
    return this.bombs === this.settings.maxBombs;
  }

  private lastTurnPlayed(): boolean {
    return this.turn === this.lastTurn;
  }

  private reachedMaxPossibleScore(): boolean {
    return this.score() === this.maxPossibleScore();
  }

  turnsLeft(): number | undefined {
    if (!this.lastTurn) return undefined;
    return (1+this.lastTurn) - this.turn;
  }

  score(): number {
    if (this.hasMaxBombs()) return 0;
    return this.board.size;
  }

  maxPossibleScore(): number {
    return this.createInfos().maxValueByColor.reduce((score, value) => score+value, 0);
  }

  hasMaxClues(): boolean {
    return this.clues === this.settings.maxClues;
  }

  currentPlayer(): HanabiPlayer | undefined {
    return this.players.find(p => p.playing);
  }

  nextPlayer(): HanabiPlayer | undefined {
    const currentPlayer = this.currentPlayer();
    const currentIndex = this.players.findIndex(p => p.equals(currentPlayer));
    return this.players.get(currentIndex === this.players.size-1 ? 0 : currentIndex+1);
  }

  previousPlayer(): HanabiPlayer | undefined {
    const currentPlayer = this.currentPlayer();
    const currentIndex = this.players.findIndex(p => p.equals(currentPlayer));
    return this.players.get(currentIndex === 0 ? this.players.size-1 : currentIndex-1);
  }

  nextTurn(): HanabiGame {
    const nextPlayer = this.nextPlayer();

    return HanabiGame.copy(this)
      .withPlayers(this.players.map((p) => HanabiPlayer.copy(p)
        .withPlaying(p.equals(nextPlayer))
        .build()))
      .withTurn(this.turn+1)
      .withFinished(this.isFinished())
      .withLastTurn(this.lastTurn ?? (this.drawPile.isEmpty()
        ? (this.turn+this.settings.playersNumber)
        : undefined))
      .build();
  }

  previousTurn(): HanabiGame {
    const previousPlayer = this.previousPlayer();

    return HanabiGame.copy(this)
      .withPlayers(this.players.map((p) => HanabiPlayer.copy(p)
        .withPlaying(p.equals(previousPlayer))
        .build()))
      .withTurn(this.turn-1)
      .withFinished(false)
      .withLastTurn(this.drawPile.isEmpty()
        ? this.lastTurn
        : undefined)
      .build();
  }

  allCards(): Set<HanabiCard> {
    return Set.of(
      ...this.drawPile,
      ...this.board,
      ...this.discardPile,
      ...this.playersCards()
    );
  }

  playersCards(): List<HanabiCard> {
    return this.players.flatMap(p => p.cards);
  }

  remainingCards(): List<HanabiCard> {
    return List.of(
      ...this.drawPile,
      ...this.playersCards()
    );
  }

  createInfos(): HanabiInfos {
    return HanabiInfos.fromGame(this);
  }

  createScores(): List<HanabiScore> {
    const score = this.score();
    const rank = score === this.settings.maxScore() ? 1 : 0;

    return this.players.map(p => HanabiScore.builder()
      .withUser(p.user)
      .withScore(score)
      .withRank(rank)
      .build());
  }

}

export namespace HanabiGame {

}

class Builder {

  settings: HanabiSettings = HanabiSettings.empty();
  turn: number = 0;
  players: List<HanabiPlayer> = List.of();
  drawPile: List<HanabiCard> = List.of();
  discardPile: List<HanabiCard> = List.of();
  board: List<HanabiCard> = List.of();
  clues: number = 0;
  bombs: number = 0;
  finished: boolean = false;
  lastTurn?: number = undefined;

  withSettings(settings: HanabiSettings): Builder {
    this.settings = settings;
    return this;
  }

  withTurn(turn: number): Builder {
    this.turn = turn;
    return this;
  }

  withPlayers(players: List<HanabiPlayer>): Builder {
    this.players = players;
    return this;
  }

  withDrawPile(drawPile: List<HanabiCard>): Builder {
    this.drawPile = drawPile;
    return this;
  }

  withDiscardPile(discardPile: List<HanabiCard>): Builder {
    this.discardPile = discardPile;
    return this;
  }

  withBoard(board: List<HanabiCard>): Builder {
    this.board = board;
    return this;
  }

  withClues(clues: number): Builder {
    this.clues = clues;
    return this;
  }

  withBombs(bombs: number): Builder {
    this.bombs = bombs;
    return this;
  }

  withFinished(finished: boolean): Builder {
    this.finished = finished;
    return this;
  }

  withLastTurn(lastTurn?: number): Builder {
    this.lastTurn = lastTurn;
    return this;
  }

  build(): HanabiGame {
    return new HanabiGame(this);
  }
}
