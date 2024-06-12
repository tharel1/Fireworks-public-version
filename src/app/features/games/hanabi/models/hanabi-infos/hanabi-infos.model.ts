import {List, Set, ValueObject} from "immutable";
import {HanabiInfosFromPov, HanabiCardInfos} from './internal';
import {HanabiCard} from "../hanabi-card.model";
import {HanabiSettings} from "../hanabi-settings.model";
import {HanabiGame} from "../hanabi-game.model";
import {HanabiPlayer} from "../hanabi-player.model";
import {User} from "../../../../users/models/user.model";
import {HanabiMarker} from "../hanabi-marker.model";

export class HanabiInfos implements ValueObject {

  readonly game: HanabiGame;
  readonly cards: Set<HanabiCardInfos>;

  constructor(builder: Builder) {
    this.game = builder.game;
    this.cards = builder.cards;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiInfos {
    return HanabiInfos.builder().build();
  }

  static copy(copy: HanabiInfos): Builder {
    return HanabiInfos.builder()
      .withGame(copy.game)
      .withCards(copy.cards);
  }

  static fromJson(json: any): HanabiInfos {
    return HanabiInfos.builder()
      .withGame(HanabiGame.fromJson(json.game))
      .withCards(Set(json.cards).map(c => HanabiCardInfos.fromJson(c)))
      .build();
  }

  equals(other: unknown): boolean {
    return false;
  }

  hashCode(): number {
    return 0;
  }

  static fromGame(game: HanabiGame): HanabiInfos {
    let cards = this.emptyCardInfos(game.settings);
    cards = this.modifyCardInfos(cards, game.remainingCards(), HanabiCardInfos.incrRemaining);
    cards = this.modifyCardInfos(cards, game.board, HanabiCardInfos.incrPlayed);
    cards = this.modifyCardInfos(cards, game.discardPile, HanabiCardInfos.incrDiscarded);

    return HanabiInfos.builder()
      .withGame(game)
      .withCards(cards)
      .build();
  }

  private static emptyCardInfos(settings: HanabiSettings): Set<HanabiCardInfos> {
    return settings.colors.flatMap(color =>
      settings.values().map(i => HanabiCardInfos.builder()
        .withCard(HanabiCard.builder()
          .withValue(i)
          .withColor(color)
          .build())
        .build())).toSet();
  }

  protected static modifyCardInfos(cardInfos: Set<HanabiCardInfos>,
                                 cards: List<HanabiCard>,
                                 modifier: (prev: HanabiCardInfos) => HanabiCardInfos): Set<HanabiCardInfos> {
    let list = cardInfos.toList();

    cards.forEach(c => {
      const index = list.findIndex(s => c.isIdentical(s.card));
      const cardInfo = list.get(index)!;
      list = list.set(index, modifier(cardInfo));
    });

    return list.toSet();
  }

  createPov(currentUser: User): HanabiInfosFromPov {
    const pov = this.game.players.find(p => p.user.equals(currentUser)) ?? HanabiPlayer.empty()

    const visibleCards = this.game.players
      .filter(p => !p.equals(pov))
      .flatMap(p => p.cards);

    return HanabiInfosFromPov.builder()
      .withGame(this.game)
      .withCards(HanabiInfos.modifyCardInfos(this.cards, visibleCards, HanabiCardInfos.incrVisible))
      .withPov(pov)
      .build();
  }

  getCardInfoByCard(card: HanabiCard): HanabiCardInfos {
    return this.cards.find(i => i.card.isIdentical(card)) ?? HanabiCardInfos.empty()
  }

  getCardInfoByMarker(marker: HanabiMarker): HanabiCardInfos {
    const markerCard = HanabiCard.builder().withValue(+marker.value).withColor(marker.color ?? HanabiCard.Color.RED).build();
    return this.getCardInfoByCard(markerCard);
  }

}

export namespace HanabiInfos {
}

class Builder {

  game: HanabiGame = HanabiGame.empty();
  cards: Set<HanabiCardInfos> = Set.of();

  withGame(game: HanabiGame): Builder {
    this.game = game;
    return this;
  }

  withCards(cards: Set<HanabiCardInfos>): Builder {
    this.cards = cards;
    return this;
  }

  build(): HanabiInfos {
    return new HanabiInfos(this);
  }
}
