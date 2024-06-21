export class RoadmapFeature {

  readonly title: string;
  readonly description: string;
  readonly features: string[];
  readonly type: RoadmapFeature.Type;
  readonly releaseDate?: Date;

  constructor(builder: Builder) {
    this.title = builder.title;
    this.description = builder.description;
    this.features = builder.features;
    this.type = builder.type;
    this.releaseDate = builder.releaseDate;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): RoadmapFeature {
    return RoadmapFeature.builder().build();
  }

  public color(): string {
    switch (this.type) {
      case RoadmapFeature.Type.SOON:
        return '';
      case RoadmapFeature.Type.WIP:
        return 'color-primary';
      case RoadmapFeature.Type.DONE:
        return 'color-tertiary';
      case RoadmapFeature.Type.EVENT:
        return 'color-secondary';
      case RoadmapFeature.Type.CHALLENGE:
        return 'color-error';
    }
  }

  public icon(): string {
    switch (this.type) {
      case RoadmapFeature.Type.SOON:
        return 'lightbulb';
      case RoadmapFeature.Type.WIP:
        return 'build';
      case RoadmapFeature.Type.DONE:
        return 'check';
      case RoadmapFeature.Type.EVENT:
        return 'notifications';
      case RoadmapFeature.Type.CHALLENGE:
        return 'local_fire_department';
    }
  }
}

export namespace RoadmapFeature {
  export enum Type {
    SOON = 'SOON',
    WIP = 'WIP',
    DONE = 'DONE',
    EVENT = 'EVENT',
    CHALLENGE = 'CHALLENGE'
  }
}

class Builder {
  title: string = '';
  description: string = '';
  features: string[] = [];
  type: RoadmapFeature.Type = RoadmapFeature.Type.SOON;
  releaseDate?: Date = undefined;

  withTitle(title: string): Builder {
    this.title = title;
    return this;
  }

  withDescription(description: string): Builder {
    this.description = description;
    return this;
  }

  withFeatures(features: string[]): Builder {
    this.features = features;
    return this;
  }

  withType(type: RoadmapFeature.Type): Builder {
    this.type = type;
    return this;
  }

  withReleaseDate(releaseDate?: Date): Builder {
    this.releaseDate = releaseDate;
    return this;
  }

  build(): RoadmapFeature {
    return new RoadmapFeature(this);
  }
}
