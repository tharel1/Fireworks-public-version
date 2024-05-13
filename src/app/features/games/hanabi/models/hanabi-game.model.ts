import {List, Set, ValueObject} from "immutable";
import {HanabiPlayer} from "./hanabi-player.model";
import {HanabiCard} from "./hanabi-card.model";
import {HanabiSettings} from "./hanabi-settings.model";
import {HanabiHint} from "./hanabi-hint.model";
import {HanabiAssistant} from "./hanabi-assistant.model";
import { HanabiInfos } from "./hanabi-infos/internal";

export class HanabiGame implements ValueObject {

  readonly settings: HanabiSettings;
  readonly turn: number;
  readonly players: List<HanabiPlayer>;
  readonly drawPile: List<HanabiCard>;
  readonly discardPile: List<HanabiCard>;
  readonly board: List<HanabiCard>;
  readonly clues: number;
  readonly bombs: number;

  constructor(builder: Builder) {
    this.settings = builder.settings;
    this.turn = builder.turn;
    this.players = builder.players;
    this.drawPile = builder.drawPile;
    this.discardPile = builder.discardPile;
    this.board = builder.board;
    this.clues = builder.clues;
    this.bombs = builder.bombs;
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
      .withBombs(copy.bombs);
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
      .build();
  }

  equals(other: unknown): boolean {
    return false;
  }

  hashCode(): number {
    return 0;
  }

  score(): number {
    return this.board.size;
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
      .build();
  }

  previousTurn(): HanabiGame {
    const previousPlayer = this.previousPlayer();

    return HanabiGame.copy(this)
      .withPlayers(this.players.map((p) => HanabiPlayer.copy(p)
        .withPlaying(p.equals(previousPlayer))
        .build()))
      .withTurn(this.turn-1)
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

  efficiency(): number | undefined {
    const cluedCards = this.playersCards().filter(c => c.isClued()).size;
    const cluedCardsWithoutTrash = cluedCards - 0;
    const remainingCardsToClue = this.settings.maxScore() - this.score() - cluedCardsWithoutTrash;

    const cluesWithHighestCards = this.remainingCards().filter(c => c.value === this.settings.maxValue).size - 1;
    const remainingClues = this.clues + this.pace() + cluesWithHighestCards;

    return remainingCardsToClue / remainingClues;
  }

  pace(): number {
    return this.score() + this.drawPile.size + this.settings.playersNumber - this.settings.maxScore();
  }

  createInfos(): HanabiInfos {
    return HanabiInfos.fromGame(this);
  }

  createAssistant(): HanabiAssistant {
    return HanabiAssistant.builder()
      .withHints(this.allCards().map(c => HanabiHint.builder()
        .withCardId(c.id)
        .build()))
      .build();
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

  build(): HanabiGame {
    return new HanabiGame(this);
  }
}
