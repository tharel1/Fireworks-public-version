import {hash, is, List, ValueObject} from "immutable";
import {User} from "./user.model";
import {JsonType, PlainJson} from "../utils/plain-json.model";

export class Room implements ValueObject, PlainJson<Room> {

  readonly id: string;
  readonly owner: User;
  readonly guests: List<User>;
  readonly starting: boolean;

  constructor(builder: Builder) {
    this.id = builder.id;
    this.owner = builder.owner;
    this.guests = builder.guests;
    this.starting = builder.starting;
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
      .withOwner(copy.owner)
      .withGuests(copy.guests)
      .withStarting(copy.starting);
  }

  static fromJson(json: any): Room {
    return Room.builder()
      .withId(json.id)
      .withOwner(User.fromJson(json.owner))
      .withGuests(List(json.guests).map(u => User.fromJson(u)))
      .withStarting(json.starting)
      .build();
  }

  toJson(): JsonType<Room> {
    return {
      id: this.id,
      owner: this.owner.toJson(),
      guests: this.guests.map(u => u.toJson()).toArray(),
      starting: this.starting
    };
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
  owner: User = User.empty();
  guests: List<User> = List.of();
  starting: boolean = false;

  withId(id: string): Builder {
    this.id = id;
    return this;
  }

  withOwner(owner: User): Builder {
    this.owner = owner;
    return this;
  }

  withGuests(guests: List<User>): Builder {
    this.guests = guests;
    return this;
  }

  withStarting(starting: boolean): Builder {
    this.starting = starting;
    return this;
  }

  build(): Room {
    return new Room(this);
  }
}
