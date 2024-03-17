import {hash, is, ValueObject} from "immutable";

export class User implements ValueObject {

  readonly id: string;
  readonly name: string;

  constructor(builder: Builder) {
    this.id = builder.id;
    this.name = builder.name;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): User {
    return User.builder().build();
  }

  static copy(copy: User): Builder {
    return User.builder()
      .withId(copy.id)
      .withName(copy.name)
  }

  static fromJson(json: any): User {
    return User.builder()
      .withId(json.id)
      .withName(json.name)
      .build();
  }

  equals(other: unknown): boolean {
    if (!(other instanceof User)) {
      return false;
    }
    return is(this.id, other.id);
  }

  hashCode(): number {
    return hash(this.id);
  }

}

export namespace User {

}

class Builder {
  id: string = '';
  name: string = '';

  withId(id: string): Builder {
    this.id = id;
    return this;
  }

  withName(name: string): Builder {
    this.name = name;
    return this;
  }

  build(): User {
    return new User(this);
  }
}
