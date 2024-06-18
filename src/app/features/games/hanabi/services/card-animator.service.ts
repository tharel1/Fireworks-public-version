import {Injectable} from '@angular/core';
import {HanabiCard} from "../models/hanabi-card.model";
import {timer} from "rxjs";
import {Map, Set} from "immutable";
import {HanabiGame} from "../models/hanabi-game.model";

@Injectable({
  providedIn: 'root'
})
export class CardAnimator {

  private cardPositions: Map<number, Position> = Map();

  private cardsToMove: Set<CardToMove> = Set.of();

  saveAllCardPositions(game: HanabiGame): void {
    game.allCards().forEach(c => {
      const elem = this.getElement(c);
      if (elem) this.cardPositions = this.cardPositions.set(c.id, this.getPosition(elem));
    });
  }

  resetCardPositions(): void {
    this.cardPositions = Map();
  }

  scheduleCardToMove(delay: number, game: HanabiGame, card?: HanabiCard, fade: boolean = false): void {
    if (!card) return;

    this.cardsToMove = this.cardsToMove.add({
      card: card,
      delay: delay,
      game: game,
      fade: fade
    });
  }

  moveScheduledCard(card: HanabiCard): boolean {
    const scheduledCard = this.cardsToMove.find(cardToMove => cardToMove.card.equals(card));

    if (scheduledCard) {
      this.cardsToMove = this.cardsToMove.remove(scheduledCard);
      this.moveCard(scheduledCard);
    }

    return !!scheduledCard;
  }

  private moveCard(cardToMove: CardToMove): void {
    const card = cardToMove.card;
    const delay = cardToMove.delay;
    const game = cardToMove.game;
    const fade = cardToMove.fade;

    timer(0).subscribe(() => {
      const elem = this.getElement(card);
      if (elem) {
        elem.classList.remove('hide');
        const prevPosition = this.cardPositions.get(card.id);
        if (!prevPosition) throw new Error(`no prev position found for <${card.id}> card id`);
        const newPosition = this.getPosition(elem);
        elem.style.top = `${prevPosition.top - newPosition.top}px`;
        elem.style.left = `${prevPosition.left - newPosition.left}px`;
        elem.style.zIndex = '2';
        timer(10+delay).subscribe(() => {
          elem.style.top = `0px`;
          elem.style.left = `0px`;
          elem.classList.add('start-animation');
        });
        timer(510+delay).subscribe(() => {
          this.saveAllCardPositions(game);
          elem.style.top = ``;
          elem.style.left = ``;
          elem.style.zIndex = ``;
          elem.classList.remove('start-animation');
          if (fade) this.fadeElement(elem);
        });
      }
    });
  }

  private fadeElement(elem: HTMLElement): void {
    elem.style.opacity = '1';
    timer(0).subscribe(() => {
      elem.style.opacity = '0';
      elem.classList.add('start-animation');
    });
    timer(500).subscribe(() => {
      elem.classList.remove('start-animation');
    });
  }

  private getElement(card: HanabiCard) {
    return document.getElementById(`card-${card.id}`);
  }

  private getPosition(elem: HTMLElement): Position {
    const rect = elem.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
  }

}

interface Position {
  readonly top: number;
  readonly left: number;
}

interface CardToMove {
  readonly card: HanabiCard;
  readonly delay: number;
  readonly game: HanabiGame;
  readonly fade: boolean;
}
