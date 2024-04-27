import {List, ValueObject} from "immutable";
import {HanabiCard} from "./hanabi-card.model";
import {HanabiGame} from "./hanabi-game.model";
import {User} from "../../../users/models/user.model";
import {RandomUtil} from "../../../../core/utils/random.util";
import {HanabiPlayer} from "./hanabi-player.model";

export class HanabiSettings implements ValueObject {

  readonly playersNumber: number;
  readonly maxValue: number;
  readonly colors: List<HanabiCard.Color>;

  constructor(builder: Builder) {
    this.playersNumber = builder.playersNumber;
    this.maxValue = builder.maxValue;
    this.colors = builder.colors;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiSettings {
    return HanabiSettings.builder().build();
  }

  static copy(copy: HanabiSettings): Builder {
    return HanabiSettings.builder()
      .withPlayersNumber(copy.playersNumber)
      .withMaxValue(copy.maxValue)
      .withColors(copy.colors)
  }

  static fromJson(json: any): HanabiSettings {
    return HanabiSettings.builder()
      .withPlayersNumber(json.playersNumber)
      .withMaxValue(json.maxValue)
      .withColors(List(json.colors))
      .build();
  }

  equals(other: unknown): boolean {
    return false;
  }

  hashCode(): number {
    return 0;
  }

  buildGame(users: List<User>): HanabiGame {
    const firstPlayerIndex = RandomUtil.random(users.size);

    let cards = RandomUtil.shuffle(this.colors
      .flatMap(color => this.cardsByColor(color)))
      .map((c, i) => HanabiCard.copy(c).withId(i).build());

    return HanabiGame.builder()
      .withTurn(1)
      .withPlayers(users.map((u: User, i: number) => {
        const hand = cards.slice(0, 5);
        cards = cards.slice(5);

        return HanabiPlayer.builder()
          .withUser(u)
          .withPlaying(firstPlayerIndex === i)
          .withCards(hand)
          .build();
      }))
      .withDrawPile(cards)
      .withClues(8)
      .build();
  }

  private cardsByColor(color: HanabiCard.Color): List<HanabiCard> {
    return List.of(
      HanabiCard.builder().withValue(1).withColor(color).build(),
      HanabiCard.builder().withValue(1).withColor(color).build(),
      HanabiCard.builder().withValue(1).withColor(color).build(),
      HanabiCard.builder().withValue(2).withColor(color).build(),
      HanabiCard.builder().withValue(2).withColor(color).build(),
      HanabiCard.builder().withValue(3).withColor(color).build(),
      HanabiCard.builder().withValue(3).withColor(color).build(),
      HanabiCard.builder().withValue(4).withColor(color).build(),
      HanabiCard.builder().withValue(4).withColor(color).build(),
      HanabiCard.builder().withValue(5).withColor(color).build(),
    );
  }

}

export namespace HanabiSettings {
}

class Builder {

  playersNumber: number = 0;
  maxValue: number = 0;
  colors: List<HanabiCard.Color> = List.of();

  withPlayersNumber(playersNumber: number): Builder {
    this.playersNumber = playersNumber;
    return this;
  }

  withMaxValue(maxValue: number): Builder {
    this.maxValue = maxValue;
    return this;
  }

  withColors(colors: List<HanabiCard.Color>): Builder {
    this.colors = colors;
    return this;
  }

  build(): HanabiSettings {
    return new HanabiSettings(this);
  }
}
