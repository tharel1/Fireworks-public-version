import {HanabiGame} from "../hanabi-game.model";
import {HanabiPlayer} from "../hanabi-player.model";
import {HanabiCommand} from "./internal";
import {HanabiCard} from "../hanabi-card.model";

export class HanabiCommandClueColor extends HanabiCommand {

  readonly target: HanabiPlayer;
  readonly color: HanabiCard.Color;

  constructor(builder: Builder) {
    super(HanabiCommand.Type.CLUE_COLOR);
    this.target = builder.target;
    this.color = builder.color;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiCommandClueColor {
    return HanabiCommandClueColor.builder().build();
  }

  static copy(copy: HanabiCommandClueColor): Builder {
    return HanabiCommandClueColor.builder()
      .withTarget(copy.target)
      .withColor(copy.color)
  }

  static override fromJson(json: any): HanabiCommandClueColor {
    return HanabiCommandClueColor.builder()
      .withTarget(HanabiPlayer.fromJson(json.target))
      .withColor(json.color)
      .build();
  }

  fill(game: HanabiGame): HanabiCommandClueColor {
    return this;
  }

  update(game: HanabiGame): HanabiGame {
    return HanabiGame.copy(game)
      .withPlayers(game.players.map((p) => HanabiPlayer.copy(p)
        .withCards(p.equals(this.target)
          ? p.cards.map(c => c.color === this.color
            ? HanabiCard.copy(c).withColorClue(c.colorClue.push(this.color)).build()
            : HanabiCard.copy(c).withImpossibleColors(c.impossibleColors.push(this.color)).build())
          : p.cards)
        .build()))
      .withClues(game.clues-1)
      .build()
      .nextTurn();
  }

  revert(game: HanabiGame): HanabiGame {
    return HanabiGame.copy(game)
      .withPlayers(game.players.map((p) => HanabiPlayer.copy(p)
        .withCards(p.equals(this.target)
          ? p.cards.map(c => c.color === this.color
            ? HanabiCard.copy(c).withColorClue(c.colorClue.remove(-1)).build()
            : HanabiCard.copy(c).withImpossibleColors(c.impossibleColors.remove(-1)).build())
          : p.cards)
        .build()))
      .withClues(game.clues+1)
      .build()
      .previousTurn();
  }

  checkError(game: HanabiGame): string {
    return game.clues === 0
      ? `You can't give a clue since there is no clue left.`
      : '';
  }

}

export namespace HanabiCommandClueColor {

}

class Builder {
  target: HanabiPlayer = HanabiPlayer.empty();
  color: HanabiCard.Color = HanabiCard.Color.RED;

  withTarget(target: HanabiPlayer): Builder {
    this.target = target;
    return this;
  }

  withColor(color: HanabiCard.Color): Builder {
    this.color = color;
    return this;
  }

  build(): HanabiCommandClueColor {
    return new HanabiCommandClueColor(this);
  }
}
