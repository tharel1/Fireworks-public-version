import {HanabiGame} from "../hanabi-game.model";
import {ValueObject} from "immutable";
import {HanabiCommandPlay, HanabiCommandClueColor, HanabiCommandClueValue, HanabiCommandDiscard} from "./internal";

export abstract class HanabiCommand implements ValueObject {

  readonly type: HanabiCommand.Type;

  protected constructor(type: HanabiCommand.Type) {
    this.type = type;
  }

  static fromJson(json: any): HanabiCommand {
    switch (json.type as HanabiCommand.Type) {
      case HanabiCommand.Type.PLAY:
        return HanabiCommandPlay.fromJson(json);
      case HanabiCommand.Type.DISCARD:
        return HanabiCommandDiscard.fromJson(json);
      case HanabiCommand.Type.CLUE_COLOR:
        return HanabiCommandClueColor.fromJson(json);
      case HanabiCommand.Type.CLUE_VALUE:
        return HanabiCommandClueValue.fromJson(json);
    }
  }

  equals(other: unknown): boolean {
    return false;
  }

  hashCode(): number {
    return 0;
  }

  abstract fill(game: HanabiGame): HanabiCommand;
  abstract update(game: HanabiGame): HanabiGame;
  abstract revert(game: HanabiGame): HanabiGame;
  abstract checkError(game: HanabiGame): string;
}

export namespace HanabiCommand {
  export enum Type {
    PLAY = 'PLAY',
    DISCARD = 'DISCARD',
    CLUE_COLOR = 'CLUE_COLOR',
    CLUE_VALUE = 'CLUE_VALUE'
  }
}
