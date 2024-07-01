import {List, Set, ValueObject} from "immutable";
import {HanabiCard} from "./hanabi-card.model";
import {HanabiGame} from "./hanabi-game.model";
import {User} from "../../../../core/models/user.model";
import {RandomUtil} from "../../../../core/utils/random.util";
import {HanabiPlayer} from "./hanabi-player.model";
import {ArrayUtil} from "../../../../core/utils/array.util";
import {JsonType, PlainJson} from "../../../../core/utils/plain-json.model";

export class HanabiSettings implements ValueObject, PlainJson<HanabiSettings> {

  readonly playersNumber: number;
  readonly maxValue: number;
  readonly colors: List<HanabiCard.Color>;
  readonly maxClues: number;
  readonly maxBombs: number;

  constructor(builder: Builder) {
    this.playersNumber = builder.playersNumber;
    this.maxValue = builder.maxValue;
    this.colors = builder.colors;
    this.maxClues = builder.maxClues;
    this.maxBombs = builder.maxBombs;
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
      .withMaxClues(copy.maxClues)
      .withMaxBombs(copy.maxBombs);
  }

  static fromJson(json: any): HanabiSettings {
    return HanabiSettings.builder()
      .withPlayersNumber(json.playersNumber)
      .withMaxValue(json.maxValue)
      .withColors(List(json.colors))
      .withMaxClues(json.maxClues)
      .withMaxBombs(json.maxBombs)
      .build();
  }

  toJson(): JsonType<HanabiSettings> {
    return {
      playersNumber: this.playersNumber,
      maxValue: this.maxValue,
      colors: this.colors.toArray(),
      maxClues: this.maxClues,
      maxBombs: this.maxBombs
    }
  }

  equals(other: unknown): boolean {
    return false;
  }

  hashCode(): number {
    return 0;
  }

  values(): List<number> {
    return ArrayUtil.range(1, this.maxValue);
  }

  maxScore(): number {
    return this.maxValue * this.colors.size;
  }

  createGame(users: Set<User>): HanabiGame {
    const firstPlayerIndex = RandomUtil.random(users.size);

    let cards = RandomUtil.shuffle(this.colors
      .flatMap(color => this.cardsByColor(color)))
      .map((c, i) => HanabiCard.copy(c).withId(i).build());

    return HanabiGame.builder()
      .withSettings(HanabiSettings.copy(this)
        .withPlayersNumber(users.size)
        .build())
      .withTurn(1)
      .withPlayers(RandomUtil.shuffle(users.toList()).map((u: User, i: number) => {
        const hand = cards.slice(0, 5);
        cards = cards.slice(5);

        return HanabiPlayer.builder()
          .withUser(u)
          .withPlaying(firstPlayerIndex === i)
          .withCards(hand)
          .build();
      }))
      .withDrawPile(cards)
      .withClues(this.maxClues)
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
  maxClues: number = 0;
  maxBombs: number = 0;

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

  withMaxClues(maxClues: number): Builder {
    this.maxClues = maxClues;
    return this;
  }

  withMaxBombs(maxBombs: number): Builder {
    this.maxBombs = maxBombs;
    return this;
  }

  build(): HanabiSettings {
    return new HanabiSettings(this);
  }
}
