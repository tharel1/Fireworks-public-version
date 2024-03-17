import { Injectable } from '@angular/core';
import {HanabiGame} from "../../features/games/hanabi/models/hanabi-game.model";

@Injectable({
  providedIn: 'root'
})
export class HanabiStore {
  public game: HanabiGame = HanabiGame.empty();
}
