import {Set} from "immutable";
import {HanabiPlayer} from "../hanabi-player.model";
import {HanabiGame} from "../hanabi-game.model";
import {HanabiCardInfos, HanabiInfos} from "./internal";

export class HanabiInfosFromPov extends HanabiInfos {

  readonly pov: HanabiPlayer;

  constructor(builder: Builder) {
    super(builder);
    this.pov = builder.pov;
  }

  static override builder(): Builder {
    return new Builder();
  }

  static override empty(): HanabiInfosFromPov {
    return HanabiInfosFromPov.builder().build();
  }

  static override copy(copy: HanabiInfosFromPov): Builder {
    return HanabiInfosFromPov.builder()
      .withGame(copy.game)
      .withCards(copy.cards)
      .withPov(copy.pov);
  }

  static override fromJson(json: any): HanabiInfosFromPov {
    return HanabiInfosFromPov.builder()
      .withGame(HanabiGame.fromJson(json.game))
      .withCards(Set(json.cards).map(c => HanabiCardInfos.fromJson(c)))
      .withPov(HanabiPlayer.fromJson(json.pov))
      .build();
  }

}

export namespace HanabiInfosFromPov {
}

class Builder {

  game: HanabiGame = HanabiGame.empty();
  cards: Set<HanabiCardInfos> = Set.of();
  pov: HanabiPlayer = HanabiPlayer.empty();

  withGame(game: HanabiGame): Builder {
    this.game = game;
    return this;
  }

  withCards(cards: Set<HanabiCardInfos>): Builder {
    this.cards = cards;
    return this;
  }

  withPov(pov: HanabiPlayer): Builder {
    this.pov = pov;
    return this;
  }

  build(): HanabiInfosFromPov {
    return new HanabiInfosFromPov(this);
  }
}
