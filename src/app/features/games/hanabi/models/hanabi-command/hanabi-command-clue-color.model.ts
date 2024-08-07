import {HanabiGame} from "../hanabi-game.model";
import {HanabiPlayer} from "../hanabi-player.model";
import {HanabiCommand} from "./internal";
import {HanabiCard} from "../hanabi-card.model";
import {JsonType} from "../../../../../core/utils/plain-json.model";

export class HanabiCommandClueColor extends HanabiCommand {

  readonly source: HanabiPlayer;
  readonly target: HanabiPlayer;
  readonly color: HanabiCard.Color;

  constructor(builder: Builder) {
    super(HanabiCommand.Type.CLUE_COLOR);
    this.source = builder.source;
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
      .withSource(copy.source)
      .withTarget(copy.target)
      .withColor(copy.color);
  }

  static override fromJson(json: any): HanabiCommandClueColor {
    return HanabiCommandClueColor.builder()
      .withSource(HanabiPlayer.fromJson(json.source))
      .withTarget(HanabiPlayer.fromJson(json.target))
      .withColor(json.color)
      .build();
  }

  override toJson(): JsonType<HanabiCommandClueColor> {
    return {
      type: this.type,
      source: this.source.toJson(),
      target: this.target.toJson(),
      color: this.color
    };
  }

  fill(game: HanabiGame): HanabiCommandClueColor {
    return HanabiCommandClueColor.copy(this)
      .withSource(game.currentPlayer() ?? HanabiPlayer.empty())
      .build();
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
      ? `No clue left.`
      : '';
  }

}

export namespace HanabiCommandClueColor {

}

class Builder {
  source: HanabiPlayer = HanabiPlayer.empty();
  target: HanabiPlayer = HanabiPlayer.empty();
  color: HanabiCard.Color = HanabiCard.Color.RED;

  withSource(source: HanabiPlayer): Builder {
    this.source = source;
    return this;
  }

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
