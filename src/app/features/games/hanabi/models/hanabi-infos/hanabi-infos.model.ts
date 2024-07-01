import {List, Map, Set, ValueObject} from "immutable";
import {HanabiCardInfos, HanabiInfosFromPov} from './internal';
import {HanabiCard} from "../hanabi-card.model";
import {HanabiSettings} from "../hanabi-settings.model";
import {HanabiGame} from "../hanabi-game.model";
import {HanabiPlayer} from "../hanabi-player.model";
import {User} from "../../../../../core/models/user.model";
import {HanabiMarker} from "../hanabi-assistant/hanabi-marker.model";
import {ArrayUtil} from "../../../../../core/utils/array.util";

export class HanabiInfos implements ValueObject {

  readonly game: HanabiGame;
  readonly cards: Set<HanabiCardInfos>;
  readonly maxValueByColor: Map<HanabiCard.Color, number>;
  readonly boardValueByColor: Map<HanabiCard.Color, number>;
  readonly trashValues: Set<number>;
  readonly trashColors: Set<HanabiCard.Color>;

  constructor(builder: Builder) {
    this.game = builder.game;
    this.cards = builder.cards;
    this.maxValueByColor = builder.maxValueByColor;
    this.boardValueByColor = builder.boardValueByColor;
    this.trashValues = builder.trashValues;
    this.trashColors = builder.trashColors;
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
      .withCards(copy.cards)
      .withMaxValueByColor(copy.maxValueByColor)
      .withBoardValueByColor(copy.boardValueByColor)
      .withTrashValues(copy.trashValues)
      .withTrashColors(copy.trashColors);
  }

  static fromJson(json: any): HanabiInfos {
    return HanabiInfos.builder()
      .withGame(HanabiGame.fromJson(json.game))
      .withCards(Set(json.cards).map(c => HanabiCardInfos.fromJson(c)))
      .withMaxValueByColor(Map<HanabiCard.Color, number>(json.maxValueByColor))
      .withBoardValueByColor(Map<HanabiCard.Color, number>(json.boardValueByColor))
      .withTrashValues(Set(json.trashValues))
      .withTrashColors(Set(json.trashColors))
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

    const maxValueByColor = this.initMaxValueByColor(game.settings, cards);
    const boardValueByColor = this.initBoardValueByColor(game.settings, game.board);

    return HanabiInfos.builder()
      .withGame(game)
      .withCards(cards)
      .withMaxValueByColor(maxValueByColor)
      .withBoardValueByColor(boardValueByColor)
      .withTrashValues(this.initTrashValues(maxValueByColor, boardValueByColor, game.settings))
      .withTrashColors(this.initTrashColors(maxValueByColor, boardValueByColor))
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

  private static modifyCardInfos(cardInfos: Set<HanabiCardInfos>,
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

  private static initMaxValueByColor(settings: HanabiSettings, cardInfos: Set<HanabiCardInfos>): Map<HanabiCard.Color, number> {
    return cardInfos.groupBy(c => c.card.color)
      .map(set => {
        const lostCard = set.toList()
          .sortBy(c => c.card.value)
          .find(c => c.isLost());

        return lostCard ? lostCard.card.value-1 : settings.maxValue;
      })
  }

  private static initBoardValueByColor(settings: HanabiSettings, board: List<HanabiCard>): Map<HanabiCard.Color, number> {
    return settings.colors.groupBy(color => color)
      .map((_, color) => board
        .filter(c => c.color === color)
        .maxBy(c => c.value))
      .map(c => c?.value ?? 0);
  }

  private static initTrashValues(maxValueByColor: Map<HanabiCard.Color, number>,
                                 boardValueByColor: Map<HanabiCard.Color, number>,
                                 settings: HanabiSettings): Set<number> {
    const usefullyValues = settings.colors.map(color => {
      const boardMaxValue = boardValueByColor.get(color) ?? 0;
      const maxValue = maxValueByColor.get(color) ?? 0;
      return ArrayUtil.range(boardMaxValue+1, maxValue);
    })
      .flatMap(list => list.values())
      .toSet();

    return settings.values()
      .filter(v => !usefullyValues.contains(v))
      .toSet();
  }

  private static initTrashColors(maxValueByColor: Map<HanabiCard.Color, number>,
                                 boardValueByColor: Map<HanabiCard.Color, number>): Set<HanabiCard.Color> {
    return maxValueByColor.filter((value, key) => value === boardValueByColor.get(key))
      .keySeq()
      .toSet();
  }

  getCardInfoByCard(card: HanabiCard): HanabiCardInfos {
    return this.cards.find(i => i.card.isIdentical(card)) ?? HanabiCardInfos.empty();
  }

  getCardInfoByMarker(marker: HanabiMarker): HanabiCardInfos {
    const markerCard = HanabiCard.builder().withValue(+marker.value).withColor(marker.color ?? HanabiCard.Color.RED).build();
    return this.getCardInfoByCard(markerCard);
  }

  isCritical(card: HanabiCard): boolean {
    const infos = this.getCardInfoByCard(card);
    return infos.played === 0
        && infos.remaining === 1
        && !this.isTrash(card);
  }

  isTrash(card: HanabiCard): boolean {
    return !!this.trashType(card);
  }

  isKnownForTrash(card: HanabiCard): boolean {
    const trashType = this.trashType(card);
    if (!trashType) return false;

    switch (trashType) {
      case HanabiInfos.TrashType.TRASH_VALUE:
      case HanabiInfos.TrashType.TRASH_COLOR:
        return true;
      case HanabiInfos.TrashType.ALREADY_PLAYED:
      case HanabiInfos.TrashType.UNPLAYABLE:
        return card.isFullyClued();
    }
  }

  trashType(card: HanabiCard): HanabiInfos.TrashType | undefined {
    if (card.valueClue.size > 0 && this.trashValues.contains(card.value))
      return HanabiInfos.TrashType.TRASH_VALUE;

    if (card.colorClue.size > 0 && this.trashColors.contains(card.color))
      return HanabiInfos.TrashType.TRASH_COLOR;

    if (card.value <= (this.boardValueByColor.get(card.color) ?? 0))
      return HanabiInfos.TrashType.ALREADY_PLAYED;

    if (card.value > (this.maxValueByColor.get(card.color) ?? 0))
      return HanabiInfos.TrashType.UNPLAYABLE;

    return undefined;
  }

  remainingCardToClue(): number {
    const cluedCards = this.game.playersCards().filter(c => c.isClued());
    const trashCards = cluedCards.filter(c => this.isKnownForTrash(c));
    const cluedCardsWithoutTrash = cluedCards.size - trashCards.size;

    return this.game.settings.maxScore() - this.game.score() - cluedCardsWithoutTrash;
  }

  remainingClues(): number {
    const cluesWithHighestCards = this.game.remainingCards().filter(c => c.value === this.game.settings.maxValue).size - 1;

    return this.game.clues + this.pace() + cluesWithHighestCards;
  }

  requiredEfficiency(): number {
    return this.remainingCardToClue() / this.remainingClues();
  }

  pace(): number {
    return this.game.score()
         + this.game.drawPile.size
         + this.game.settings.playersNumber
         - this.game.settings.maxScore();
  }

  createPov(currentUser: User): HanabiInfosFromPov {
    const pov = this.game.players.find(p => p.user.equals(currentUser)) ?? HanabiPlayer.empty()

    const visibleCards = this.game.players
      .filter(p => !p.equals(pov))
      .flatMap(p => p.cards);

    return HanabiInfosFromPov.builder()
      .withGame(this.game)
      .withCards(HanabiInfos.modifyCardInfos(this.cards, visibleCards, HanabiCardInfos.incrVisible))
      .withMaxValueByColor(this.maxValueByColor)
      .withBoardValueByColor(this.boardValueByColor)
      .withTrashValues(this.trashValues)
      .withTrashColors(this.trashColors)
      .withPov(pov)
      .build();
  }

}

export namespace HanabiInfos {
  export enum TrashType {
    TRASH_VALUE = 'TRASH_VALUE',
    TRASH_COLOR = 'TRASH_COLOR',
    ALREADY_PLAYED = 'ALREADY_PLAYED',
    UNPLAYABLE = 'UNPLAYABLE'
  }
}

class Builder {

  game: HanabiGame = HanabiGame.empty();
  cards: Set<HanabiCardInfos> = Set.of();
  maxValueByColor: Map<HanabiCard.Color, number> = Map();
  boardValueByColor: Map<HanabiCard.Color, number> = Map();
  trashValues: Set<number> = Set.of();
  trashColors: Set<HanabiCard.Color> = Set.of();

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

  build(): HanabiInfos {
    return new HanabiInfos(this);
  }
}
