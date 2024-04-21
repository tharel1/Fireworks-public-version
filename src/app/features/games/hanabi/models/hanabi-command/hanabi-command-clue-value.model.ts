import {HanabiGame} from "../hanabi-game.model";
import {HanabiPlayer} from "../hanabi-player.model";
import {HanabiCommand} from "./internal";
import {HanabiCard} from "../hanabi-card.model";

export class HanabiCommandClueValue extends HanabiCommand {

  readonly target: HanabiPlayer;
  readonly value: number;

  constructor(builder: Builder) {
    super(HanabiCommand.Type.CLUE_VALUE);
    this.target = builder.target;
    this.value = builder.value;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiCommandClueValue {
    return HanabiCommandClueValue.builder().build();
  }

  static copy(copy: HanabiCommandClueValue): Builder {
    return HanabiCommandClueValue.builder()
      .withTarget(copy.target)
      .withValue(copy.value)
  }

  static override fromJson(json: any): HanabiCommandClueValue {
    return HanabiCommandClueValue.builder()
      .withTarget(HanabiPlayer.fromJson(json.target))
      .withValue(json.value)
      .build();
  }

  update(game: HanabiGame): HanabiGame {
    const nextPlayer = game.nextPlayer();
    return HanabiGame.copy(game)
      .withPlayers(game.players.map((p) => HanabiPlayer.copy(p)
        .withPlaying(p.equals(nextPlayer))
        .withCards(p.equals(this.target)
          ? p.cards.map(c => c.value === this.value
            ? HanabiCard.copy(c).withValueClue(c.valueClue.push(this.value)).build()
            : HanabiCard.copy(c).withImpossibleValues(c.impossibleValues.push(this.value)).build())
          : p.cards)
        .build()))
      .withClues(game.clues-1)
      .build();
  }

  revert(game: HanabiGame): HanabiGame {
    const previousPlayer = game.previousPlayer();
    return HanabiGame.copy(game)
      .withPlayers(game.players.map((p) => HanabiPlayer.copy(p)
        .withPlaying(p.equals(previousPlayer))
        .withCards(p.equals(this.target)
          ? p.cards.map(c => c.value === this.value
            ? HanabiCard.copy(c).withValueClue(c.valueClue.remove(-1)).build()
            : HanabiCard.copy(c).withImpossibleValues(c.impossibleValues.remove(-1)).build())
          : p.cards)
        .build()))
      .withClues(game.clues+1)
      .build();
  }

  checkError(game: HanabiGame): string {
    return game.clues === 0
      ? `You can't give a clue since there is no clue left.`
      : '';
  }

}

export namespace HanabiCommandClueValue {

}

class Builder {
  target: HanabiPlayer = HanabiPlayer.empty();
  value: number = 0;

  withTarget(target: HanabiPlayer): Builder {
    this.target = target;
    return this;
  }

  withValue(value: number): Builder {
    this.value = value;
    return this;
  }

  build(): HanabiCommandClueValue {
    return new HanabiCommandClueValue(this);
  }
}
