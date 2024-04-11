import {ValueObject} from "immutable";
import {HanabiGame} from "./hanabi-game.model";
import {HanabiCommand} from "./hanabi-command/hanabi-command.model";

export class HanabiHistory implements ValueObject {

  readonly state?: HanabiGame;
  readonly index?: number;
  readonly lastCommand?: HanabiCommand;
  readonly lastDirection?: HanabiHistory.Direction;

  constructor(builder: Builder) {
    this.state = builder.state;
    this.index = builder.index;
    this.lastCommand = builder.lastCommand;
    this.lastDirection = builder.lastDirection;
  }

  private static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiHistory {
    return HanabiHistory.builder().build();
  }

  private static copy(copy: HanabiHistory): Builder {
    return HanabiHistory.builder()
      .withState(copy.state)
      .withIndex(copy.index)
      .withLastCommand(copy.lastCommand)
      .withLastDirection(copy.lastDirection)
  }

  private static fromJson(json: any): HanabiHistory {
    return HanabiHistory.builder()
      .withState(HanabiGame.fromJson(json.state))
      .withIndex(json.index)
      .withLastCommand(HanabiCommand.fromJson(json.lastCommand))
      .withLastDirection(json.lastDirection)
      .build();
  }

  equals(other: unknown): boolean {
    return false;
  }

  hashCode(): number {
    return 0;
  }

  backward(game: HanabiGame): HanabiHistory {
    let index = game.history.size - 1;
    let state = game;
    if (this.state && this.index) {
      index = this.index - 1;
      state = this.state;
    }

    const command = game.history.get(index);
    if (!command) throw new Error(`HanabiHistory can't go back: no command found at index <${index}>.`);

    return HanabiHistory.copy(this)
      .withState(command.revert(state))
      .withIndex(index)
      .withLastCommand(command)
      .withLastDirection(HanabiHistory.Direction.BACKWARD)
      .build();
  }

  forward(game: HanabiGame): HanabiHistory {
    if (!this.state || this.index===undefined) throw new Error(`HanabiHistory can't go forward: state and index must already exist.`);

    const command = game.history.get(this.index);
    if (!command) throw new Error(`HanabiHistory can't go forward: no command found at index <${this.index}>.`);

    if (this.index === game.history.size - 1) {
      return HanabiHistory.builder()
        .withState(undefined)
        .withIndex(undefined)
        .withLastCommand(command)
        .withLastDirection(HanabiHistory.Direction.FORWARD)
        .build();
    }

    return HanabiHistory.builder()
      .withState(command.update(this.state))
      .withIndex(this.index + 1)
      .withLastCommand(command)
      .withLastDirection(HanabiHistory.Direction.FORWARD)
      .build();
  }

  cancel(): HanabiHistory {
    return HanabiHistory.empty();
  }

}

export namespace HanabiHistory {
  export enum Direction {
    FORWARD = 'forward',
    BACKWARD = 'backward'
  }

}

class Builder {
  state?: HanabiGame = undefined;
  index?: number = undefined;
  lastCommand?: HanabiCommand = undefined;
  lastDirection?: HanabiHistory.Direction = undefined;

  withState(state?: HanabiGame): Builder {
    this.state = state;
    return this;
  }

  withIndex(index?: number): Builder {
    this.index = index;
    return this;
  }

  withLastCommand(lastCommand?: HanabiCommand): Builder {
    this.lastCommand = lastCommand;
    return this;
  }

  withLastDirection(lastDirection?: HanabiHistory.Direction) {
    this.lastDirection = lastDirection;
    return this;
  }

  build(): HanabiHistory {
    return new HanabiHistory(this);
  }
}
