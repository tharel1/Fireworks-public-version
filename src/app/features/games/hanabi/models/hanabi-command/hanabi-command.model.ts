import {HanabiGame} from "../hanabi-game.model";
import {ValueObject} from "immutable";
import {HanabiCommandAdd, HanabiCommandRemove} from "./internal";

export abstract class HanabiCommand implements ValueObject {

  readonly type: HanabiCommand.Type;

  protected constructor(type: HanabiCommand.Type) {
    this.type = type;
  }

  static fromJson(json: any): HanabiCommand {
    switch (json.type as HanabiCommand.Type) {
      case HanabiCommand.Type.ADD:
        return HanabiCommandAdd.fromJson(json);
      case HanabiCommand.Type.REMOVE:
        return HanabiCommandRemove.fromJson(json);
    }
  }

  equals(other: unknown): boolean {
    return false;
  }

  hashCode(): number {
    return 0;
  }

  abstract update(game: HanabiGame): HanabiGame;
  abstract revert(game: HanabiGame): HanabiGame;
}

export namespace HanabiCommand {
  export enum Type {
    ADD = 'ADD',
    REMOVE = 'REMOVE'
  }
}
