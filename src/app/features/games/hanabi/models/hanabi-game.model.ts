import {List, ValueObject} from "immutable";
import {HanabiPlayer} from "./hanabi-player.model";
import {HanabiCommand} from "./hanabi-command/internal";
import {HanabiCard} from "./hanabi-card.model";

export class HanabiGame implements ValueObject {

  readonly history: List<HanabiCommand>;
  readonly players: List<HanabiPlayer>;
  readonly drawPile: List<HanabiCard>;
  readonly discardPile: List<HanabiCard>;
  readonly board: List<HanabiCard>;
  readonly clues: number;
  readonly bombs: number;

  constructor(builder: Builder) {
    this.history = builder.history;
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
      .withHistory(copy.history)
      .withPlayers(copy.players)
      .withDrawPile(copy.drawPile)
      .withDiscardPile(copy.discardPile)
      .withBoard(copy.board)
      .withClues(copy.clues)
      .withBombs(copy.bombs)
  }

  static fromJson(json: any): HanabiGame {
    return HanabiGame.builder()
      .withHistory(List(json.history).map((c: any) => HanabiCommand.fromJson(c)))
      .withPlayers(List(json.players).map((p: any) => HanabiPlayer.fromJson(p)))
      .withDrawPile(List(json.drawPile).map((c: any) => HanabiCard.fromJson(c)))
      .withDiscardPile(List(json.discardPile).map((c: any) => HanabiCard.fromJson(c)))
      .withBoard(List(json.board).map((c: any) => HanabiCard.fromJson(c)))
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

}

export namespace HanabiGame {

}

class Builder {

  history: List<HanabiCommand> = List.of();
  players: List<HanabiPlayer> = List.of();
  drawPile: List<HanabiCard> = List.of();
  discardPile: List<HanabiCard> = List.of();
  board: List<HanabiCard> = List.of();
  clues: number = 0;
  bombs: number = 0;

  withHistory(history: List<HanabiCommand>): Builder {
    this.history = history;
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
