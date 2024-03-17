import {hash, is, List, ValueObject} from "immutable";
import {User} from "./user.model";

export class Room implements ValueObject {

  readonly id: string;
  readonly users: List<User>;

  constructor(builder: Builder) {
    this.id = builder.id;
    this.users = builder.users;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): Room {
    return Room.builder().build();
  }

  static copy(copy: Room): Builder {
    return Room.builder()
      .withId(copy.id)
      .withUsers(copy.users)
  }

  static fromJson(json: any): Room {
    return Room.builder()
      .withId(json.id)
      .withUsers(List(json.users).map((user: any) => User.fromJson(user)))
      .build();
  }

  equals(other: unknown): boolean {
    if (!(other instanceof Room)) {
      return false;
    }
    return is(this.id, other.id);
  }

  hashCode(): number {
    return hash(this.id);
  }

}

export namespace Room {

}

class Builder {
  id: string = '';
  users: List<User> = List.of();

  withId(id: string): Builder {
    this.id = id;
    return this;
  }

  withUsers(users: List<User>): Builder {
    this.users = users;
    return this;
  }

  build(): Room {
    return new Room(this);
  }
}
