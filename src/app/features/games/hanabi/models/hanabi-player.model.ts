import {hash, List, ValueObject} from "immutable";
import {HanabiCard} from "./hanabi-card.model";
import {User} from "../../../users/models/user.model";

export class HanabiPlayer implements ValueObject {

  readonly user: User;
  readonly playing: boolean;
  readonly cards: List<HanabiCard>;

  constructor(builder: Builder) {
    this.user = builder.user;
    this.playing = builder.playing;
    this.cards = builder.cards;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiPlayer {
    return HanabiPlayer.builder().build();
  }

  static copy(copy: HanabiPlayer): Builder {
    return HanabiPlayer.builder()
      .withUser(copy.user)
      .withPlaying(copy.playing)
      .withCards(copy.cards)
  }

  static fromJson(json: any): HanabiPlayer {
    return HanabiPlayer.builder()
      .withUser(User.fromJson(json.user))
      .withPlaying(json.playing)
      .withCards(List(json.cards).map(c => HanabiCard.fromJson(c)))
      .build();
  }

  equals(other: unknown): boolean {
    if (!(other instanceof HanabiPlayer)) {
      return false;
    }
    return this.user.equals(other.user);
  }

  hashCode(): number {
    return hash(this.user.id);
  }

}

export namespace HanabiPlayer {

}

class Builder {
  user: User = User.empty();
  playing: boolean = false;
  cards: List<HanabiCard> = List.of();

  withUser(user: User): Builder {
    this.user = user;
    return this;
  }

  withPlaying(playing: boolean): Builder {
    this.playing = playing;
    return this;
  }

  withCards(cards: List<HanabiCard>): Builder {
    this.cards = cards;
    return this;
  }

  build(): HanabiPlayer {
    return new HanabiPlayer(this);
  }
}
