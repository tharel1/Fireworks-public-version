import {Injectable} from '@angular/core';
import {HanabiCard} from "../models/hanabi-card.model";
import {timer} from "rxjs";
import {Map} from "immutable";

@Injectable({
  providedIn: 'root'
})
export class HanabiCardAnimator {

  private positions: Map<number, Position> = Map();

  savePosition(card: HanabiCard): void {
    const elem = this.getElement(card);
    if (elem)
      this.positions = this.positions.set(card.id, this.getPosition(elem));
  }

  startAnimation(card: HanabiCard): void {
    timer(0).subscribe(() => {
      const elem = this.getElement(card);
      if (elem) {
        const prevPosition = this.positions.get(card.id) ?? {top: 0, left: 0};
        const newPosition = this.getPosition(elem);
        elem.style.top = `${prevPosition.top - newPosition.top}px`;
        elem.style.left = `${prevPosition.left - newPosition.left}px`;
        timer(10).subscribe(() => {
          elem.style.top = `0px`;
          elem.style.left = `0px`;
          elem.classList.add('start-animation');
        });
        timer(860).subscribe(() => {
          this.savePosition(card);
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
