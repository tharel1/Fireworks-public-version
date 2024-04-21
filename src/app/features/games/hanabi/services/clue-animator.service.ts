import {Injectable} from '@angular/core';
import {HanabiCard} from "../models/hanabi-card.model";
import {timer} from "rxjs";
import {Set} from "immutable";

@Injectable({
  providedIn: 'root'
})
export class ClueAnimator {

  private cluesToMove: Set<ClueToMove> = Set.of();

  scheduleClueToMove(card: HanabiCard, delay: number): void {
    this.cluesToMove = this.cluesToMove.add({
      cardId: card.id,
      delay: delay
    });
  }

  moveScheduledClue(cardId: number): boolean {
    const scheduledClue = this.cluesToMove.find(clueToMove => clueToMove.cardId === cardId);

    if (scheduledClue) {
      this.cluesToMove = this.cluesToMove.remove(scheduledClue);
      this.moveClue(scheduledClue);
    }

    return !!scheduledClue;
  }

  private moveClue(clueToMove: ClueToMove): void {
    const cardId = clueToMove.cardId;
    const delay = clueToMove.delay;

    timer(0).subscribe(() => {
      const elem = this.getElement(cardId);
      if (elem) {
        timer(10+delay).subscribe(() => {
          elem.classList.add('active');
        });
      }
    });
  }

  private getElement(cardId: number) {
    return document.getElementById(`clue-${cardId}`);
  }

}

interface ClueToMove {
  readonly cardId: number;
  readonly delay: number;
}
