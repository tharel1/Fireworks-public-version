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

  update(game: HanabiGame): HanabiGame {
    const nextPlayer = game.nextPlayer();
    return HanabiGame.copy(game)
      .withPlayers(game.players.map((p) => HanabiPlayer.copy(p)
        .withPlaying(p.equals(nextPlayer))
        .withCards(p.equals(this.target)
          ? p.cards.map(c => c.color === this.color
            ? HanabiCard.copy(c).withColorClue(c.colorClue.push(this.color)).build()
            : HanabiCard.copy(c).withImpossibleColors(c.impossibleColors.push(this.color)).build())
          : p.cards)
        .build()))
      .build();
  }

  revert(game: HanabiGame): HanabiGame {
    const previousPlayer = game.previousPlayer();
    return HanabiGame.copy(game)
      .withPlayers(game.players.map((p) => HanabiPlayer.copy(p)
        .withPlaying(p.equals(previousPlayer))
        .withCards(p.equals(this.target)
          ? p.cards.map(c => c.color === this.color
            ? HanabiCard.copy(c).withColorClue(c.colorClue.remove(-1)).build()
            : HanabiCard.copy(c).withImpossibleColors(c.impossibleColors.remove(-1)).build())
          : p.cards)
        .build()))
      .build();
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
