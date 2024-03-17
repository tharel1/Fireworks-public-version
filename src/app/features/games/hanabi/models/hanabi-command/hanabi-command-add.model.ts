import {HanabiGame} from "../hanabi-game.model";
import {HanabiPlayer} from "../hanabi-player.model";
import {HanabiCommand} from "./internal";

export class HanabiCommandAdd extends HanabiCommand {

  readonly value: number;

  constructor(builder: Builder) {
    super(HanabiCommand.Type.ADD);
    this.value = builder.value;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiCommandAdd {
    return HanabiCommandAdd.builder().build();
  }

  static copy(copy: HanabiCommandAdd): Builder {
    return HanabiCommandAdd.builder()
      .withValue(copy.value)
  }

  static override fromJson(json: any): HanabiCommandAdd {
    return HanabiCommandAdd.builder()
      .withValue(json.value)
      .build();
  }

  update(game: HanabiGame): HanabiGame {
    const nextPlayer = game.nextPlayer();
    return HanabiGame.copy(game)
      .withCounter(game.counter + this.value)
      .withPlayers(game.players.map((p) => HanabiPlayer.copy(p).withPlaying(p.equals(nextPlayer)).build()))
      .build();
  }

  revert(game: HanabiGame): HanabiGame {
    const previousPlayer = game.previousPlayer();
    return HanabiGame.copy(game)
      .withCounter(game.counter - this.value)
      .withPlayers(game.players.map((p) => HanabiPlayer.copy(p).withPlaying(p.equals(previousPlayer)).build()))
      .build();
  }

}

export namespace HanabiCommandAdd {

}

class Builder {
  value: number = 0;

  withValue(value: number): Builder {
    this.value = value;
    return this;
  }

  build(): HanabiCommandAdd {
    return new HanabiCommandAdd(this);
  }
}
