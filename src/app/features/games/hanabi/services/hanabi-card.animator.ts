import {Injectable} from '@angular/core';
import {HanabiCard} from "../models/hanabi-card.model";
import {timer} from "rxjs";
import {List, Map} from "immutable";
import {HanabiGame} from "../models/hanabi-game.model";

@Injectable({
  providedIn: 'root'
})
export class HanabiCardAnimator {

  private positions: Map<number, Position> = Map();

  savePositions(game: HanabiGame): void {
    List.of(
      ...game.drawPile,
      ...game.board,
      ...game.discardPile,
      ...game.players.flatMap(p => p.cards)
    ).forEach(c => {
      const elem = this.getElement(c);
      if (elem) this.positions = this.positions.set(c.id, this.getPosition(elem));
    });
  }

  resetPositions(): void {
    this.positions = Map();
  }

  startAnimation(delay: number, game: HanabiGame, card?: HanabiCard): void {
    if (!card) throw new Error('startAnimation: No card to animate');

    timer(0).subscribe(() => {
      const elem = this.getElement(card);
      if (elem) {
        const prevPosition = this.positions.get(card.id);
        if (!prevPosition) throw new Error('startAnimation: No prev position');
        const newPosition = this.getPosition(elem);
        elem.style.top = `${prevPosition.top - newPosition.top}px`;
        elem.style.left = `${prevPosition.left - newPosition.left}px`;
        timer(10+delay).subscribe(() => {
          elem.style.top = `0px`;
          elem.style.left = `0px`;
          elem.classList.add('start-animation');
        });
        timer(860+delay).subscribe(() => {
          this.savePositions(game);
          elem.style.top = ``;
          elem.style.left = ``;
          elem.classList.remove('start-animation');
        });
      }
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
  top: number;
  left: number;
}
