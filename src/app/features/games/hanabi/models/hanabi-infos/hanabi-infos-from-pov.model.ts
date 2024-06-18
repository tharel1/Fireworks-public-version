import {Map, Set} from "immutable";
import {HanabiPlayer} from "../hanabi-player.model";
import {HanabiGame} from "../hanabi-game.model";
import {HanabiCardInfos, HanabiInfos} from "./internal";
import {HanabiAssistant} from "../hanabi-assistant/hanabi-assistant.model";
import {HanabiHint} from "../hanabi-assistant/hanabi-hint.model";
import {HanabiCard} from "../hanabi-card.model";

export class HanabiInfosFromPov extends HanabiInfos {

  readonly pov: HanabiPlayer;

  constructor(builder: Builder) {
    super(builder);
    this.pov = builder.pov;
  }

  static override builder(): Builder {
    return new Builder();
  }

  static override empty(): HanabiInfosFromPov {
    return HanabiInfosFromPov.builder().build();
  }

  static override copy(copy: HanabiInfosFromPov): Builder {
    return HanabiInfosFromPov.builder()
      .withGame(copy.game)
      .withCards(copy.cards)
      .withMaxValueByColor(copy.maxValueByColor)
      .withBoardValueByColor(copy.boardValueByColor)
      .withTrashValues(copy.trashValues)
      .withTrashColors(copy.trashColors)
      .withPov(copy.pov);
  }

  static override fromJson(json: any): HanabiInfosFromPov {
    return HanabiInfosFromPov.builder()
      .withGame(HanabiGame.fromJson(json.game))
      .withCards(Set(json.cards).map(c => HanabiCardInfos.fromJson(c)))
      .withMaxValueByColor(Map<HanabiCard.Color, number>(json.maxValueByColor))
      .withBoardValueByColor(Map<HanabiCard.Color, number>(json.boardValueByColor))
      .withTrashValues(Set(json.trashValues))
      .withTrashColors(Set(json.trashColors))
      .withPov(HanabiPlayer.fromJson(json.pov))
      .build();
  }

  allVisibleCards(): Set<HanabiCard> {
    return Set.of(
      ...this.game.drawPile,
      ...this.game.board,
      ...this.game.discardPile,
      ...this.game.players.filter(p => !p.equals(this.pov)).flatMap(p => p.cards)
    );
  }

  createAssistant(): HanabiAssistant {
    return HanabiAssistant.builder()
      .withHints(Set.of(
        ...this.allVisibleCards().map(c => HanabiHint.builder()
          .withCardId(c.id)
          .build()),
        ...this.pov.cards.map(c => HanabiHint.builder()
          .withCardId(c.id)
          .withIsInPovHand(true)
          .build())
        ))
      .build();
  }

}

export namespace HanabiInfosFromPov {
}

class Builder {

  game: HanabiGame = HanabiGame.empty();
  cards: Set<HanabiCardInfos> = Set.of();
  maxValueByColor: Map<HanabiCard.Color, number> = Map();
  boardValueByColor: Map<HanabiCard.Color, number> = Map();
  trashValues: Set<number> = Set.of();
  trashColors: Set<HanabiCard.Color> = Set.of();
  pov: HanabiPlayer = HanabiPlayer.empty();

  withGame(game: HanabiGame): Builder {
    this.game = game;
    return this;
  }

  withCards(cards: Set<HanabiCardInfos>): Builder {
    this.cards = cards;
    return this;
  }

  withMaxValueByColor(maxValueByColor: Map<HanabiCard.Color, number>): Builder {
    this.maxValueByColor = maxValueByColor;
    return this;
  }

  withBoardValueByColor(boardValueByColor: Map<HanabiCard.Color, number>): Builder {
    this.boardValueByColor = boardValueByColor;
    return this;
  }

  withTrashValues(trashValues: Set<number>): Builder {
    this.trashValues = trashValues;
    return this;
  }

  withTrashColors(trashColors: Set<HanabiCard.Color>): Builder {
    this.trashColors = trashColors;
    return this;
  }

  withPov(pov: HanabiPlayer): Builder {
    this.pov = pov;
    return this;
  }

  build(): HanabiInfosFromPov {
    return new HanabiInfosFromPov(this);
  }
}
