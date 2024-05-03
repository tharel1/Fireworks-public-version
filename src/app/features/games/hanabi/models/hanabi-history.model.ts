import {List, ValueObject} from "immutable";
import {HanabiGame} from "./hanabi-game.model";
import {HanabiCommand} from "./hanabi-command/internal";

export class HanabiHistory implements ValueObject {

  readonly game: HanabiGame;
  readonly state?: HanabiGame;
  readonly commands: List<HanabiCommand>;
  readonly index?: number;
  readonly lastAction: HanabiHistory.Action;

  constructor(builder: Builder) {
    this.game = builder.game;
    this.state = builder.state;
    this.commands = builder.commands;
    this.index = builder.index;
    this.lastAction = builder.lastAction;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiHistory {
    return HanabiHistory.builder().build();
  }

  static copy(copy: HanabiHistory): Builder {
    return HanabiHistory.builder()
      .withGame(copy.game)
      .withState(copy.state)
      .withCommands(copy.commands)
      .withIndex(copy.index)
      .withLastAction(copy.lastAction);
  }

  static fromJson(json: any): HanabiHistory {
    return HanabiHistory.builder()
      .withState(HanabiGame.fromJson(json.game))
      .withState(HanabiGame.fromJson(json.state))
      .withCommands(List(json.commands).map(c => HanabiCommand.fromJson(c)))
      .withIndex(json.index)
      .withLastAction(json.lastAction)
      .build();
  }

  equals(other: unknown): boolean {
    return false;
  }

  hashCode(): number {
    return 0;
  }

  goBackward(): HanabiHistory {
    let index = this.commands.size - 1;
    let state = this.game;
    if (this.state && this.index) {
      index = this.index - 1;
      state = this.state;
    }

    const command = this.commands.get(index);
    if (!command) throw new Error(`HanabiHistory can't go back: no command found at index <${index}>.`);

    return HanabiHistory.copy(this)
      .withState(command.revert(state))
      .withIndex(index)
      .withLastAction(HanabiHistory.Action.GO_BACKWARD)
      .build();
  }

  goForward(): HanabiHistory {
    if (!this.state || this.index===undefined) throw new Error(`HanabiHistory can't go forward: state and index must already exist.`);

    const command = this.commands.get(this.index);
    if (!command) throw new Error(`HanabiHistory can't go forward: no command found at index <${this.index}>.`);

    if (this.index === this.commands.size - 1) {
      return HanabiHistory.copy(this)
        .withState(undefined)
        .withIndex(undefined)
        .withLastAction(HanabiHistory.Action.GO_FORWARD)
        .build();
    }

    return HanabiHistory.copy(this)
      .withState(command.update(this.state))
      .withIndex(this.index + 1)
      .withLastAction(HanabiHistory.Action.GO_FORWARD)
      .build();
  }

  cancel(): HanabiHistory {
    return HanabiHistory.copy(this)
      .withState(undefined)
      .withIndex(undefined)
      .withLastAction(HanabiHistory.Action.CANCEL)
      .build();
  }

  goTo(command: HanabiCommand): HanabiHistory {
    if (!this.commands.contains(command)) throw new Error(`HanabiHistory can't go to: command not found in game.`);

    let updatedHistory = this.cancel();

    while (updatedHistory.lastCommand() !== command) {
      updatedHistory = updatedHistory.goBackward();
    }

    return updatedHistory;
  }

  canGoBack(): boolean {
    return this.index !== 0 && !this.commands.isEmpty();
  }

  isInHistory(): boolean {
    return !!this.state;
  }

  lastCommand(): HanabiCommand | undefined {
    switch (this.lastAction) {

      case HanabiHistory.Action.GO_BACKWARD:
        return this.index === undefined
          ? this.commands.last()
          : this.commands.get(this.index);

      case HanabiHistory.Action.GO_FORWARD:
        return this.commands.get((this.index ?? 0) - 1);

      default:
        return undefined;
    }
  }

}

export namespace HanabiHistory {
  export enum Action {
    GO_FORWARD = 'GO_FORWARD',
    GO_BACKWARD = 'GO_BACKWARD',
    CANCEL = 'CANCEL'
  }

}

class Builder {
  game: HanabiGame = HanabiGame.empty();
  state?: HanabiGame = undefined;
  commands: List<HanabiCommand> = List.of();
  index?: number = undefined;
  lastAction: HanabiHistory.Action = HanabiHistory.Action.CANCEL;

  withGame(game: HanabiGame): Builder {
    this.game = game;
    return this;
  }

  withState(state?: HanabiGame): Builder {
    this.state = state;
    return this;
  }

  withCommands(commands: List<HanabiCommand>): Builder {
    this.commands = commands;
    return this;
  }

  withIndex(index?: number): Builder {
    this.index = index;
    return this;
  }

  withLastAction(lastAction: HanabiHistory.Action) {
    this.lastAction = lastAction;
    return this;
  }

  build(): HanabiHistory {
    return new HanabiHistory(this);
  }
}
