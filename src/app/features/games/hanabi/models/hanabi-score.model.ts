import {ValueObject} from "immutable";
import {User} from "../../../../core/models/user.model";
import {HanabiGame} from "./hanabi-game.model";

export class HanabiScore implements ValueObject {

  readonly user: User;
  readonly score: number;
  readonly rank: number;

  constructor(builder: Builder) {
    this.user = builder.user;
    this.score = builder.score;
    this.rank = builder.rank;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiScore {
    return HanabiScore.builder().build();
  }

  static copy(copy: HanabiScore): Builder {
    return HanabiScore.builder()
      .withUser(copy.user)
      .withScore(copy.score)
      .withRank(copy.rank);
  }

  static fromJson(json: any): HanabiScore {
    return HanabiScore.builder()
      .withUser(User.fromJson(json.user))
      .withScore(json.score)
      .withRank(json.rank)
      .build();
  }

  equals(other: unknown): boolean {
    return false;
  }

  hashCode(): number {
    return 0;
  }

  trend(game: HanabiGame): HanabiScore.Trend {
    const maxScore = game.settings.maxScore();

    if (this.score === maxScore)   return 'perfect';
    if (this.score === maxScore-1) return 'great';
    if (this.score === maxScore-2) return 'ok';
    return 'bad';
  }

}

export namespace HanabiScore {
  export type Trend = 'perfect' | 'great' | 'ok' | 'bad';
}

class Builder {

  user: User = User.empty();
  score: number = 0;
  rank: number = 0;

  withUser(user: User): Builder {
    this.user = user;
    return this;
  }

  withScore(score: number): Builder {
    this.score = score;
    return this;
  }

  withRank(rank: number): Builder {
    this.rank = rank;
    return this;
  }

  build(): HanabiScore {
    return new HanabiScore(this);
  }
}
