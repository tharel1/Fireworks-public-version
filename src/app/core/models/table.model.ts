import {hash, is, List, Set, ValueObject} from "immutable";
import {User} from "./user.model";
import {JsonType, PlainJson} from "../utils/plain-json.model";
import {HanabiGame} from "../../features/games/hanabi/models/hanabi-game.model";
import {HanabiCommand} from "../../features/games/hanabi/models/hanabi-command/hanabi-command.model";

export class Table implements ValueObject, PlainJson<Table> {

  readonly id: string;
  readonly users: Set<User>;
  readonly initialGame: HanabiGame;
  readonly commands: List<HanabiCommand>;

  constructor(builder: Builder) {
    this.id = builder.id;
    this.users = builder.users;
    this.initialGame = builder.initialGame;
    this.commands = builder.commands;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): Table {
    return Table.builder().build();
  }

  static copy(copy: Table): Builder {
    return Table.builder()
      .withId(copy.id)
      .withUsers(copy.users)
      .withInitialGame(copy.initialGame)
      .withCommands(copy.commands);
  }

  static fromJson(json: any): Table {
    return Table.builder()
      .withId(json.id)
      .withUsers(Set(json.users).map(u => User.fromJson(u)))
      .withInitialGame(HanabiGame.fromJson(json.initialGame))
      .withCommands(List(json.commands).map(c => HanabiCommand.fromJson(c)))
      .build();
  }

  toJson(): JsonType<Table> {
    return {
      id: this.id,
      users: this.users.map(u => u.toJson()).toArray(),
      initialGame: this.initialGame.toJson(),
      commands: this.commands.map(c => c.toJson()).toArray()
    };
  }

  equals(other: unknown): boolean {
    if (!(other instanceof Table)) {
      return false;
    }
    return is(this.id, other.id);
  }

  hashCode(): number {
    return hash(this.id);
  }

  createGame(): HanabiGame {
    let game = this.initialGame;
    for (let command of this.commands)
      game = command.update(game);
    return game;
  }

}

export namespace Table {

}

class Builder {
  id: string = '';
  users: Set<User> = Set.of();
  initialGame: HanabiGame = HanabiGame.empty();
  commands: List<HanabiCommand> = List.of();

  withId(id: string): Builder {
    this.id = id;
    return this;
  }

  withUsers(users: Set<User>): Builder {
    this.users = users;
    return this;
  }

  withInitialGame(initialGame: HanabiGame): Builder {
    this.initialGame = initialGame;
    return this;
  }

  withCommands(commands: List<HanabiCommand>): Builder {
    this.commands = commands;
    return this;
  }

  build(): Table {
    return new Table(this);
  }
}
