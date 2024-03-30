import { Injectable } from '@angular/core';
import {HanabiGame} from "../../features/games/hanabi/models/hanabi-game.model";
import {HanabiSettings} from "../../features/games/hanabi/models/hanabi-settings.model";

@Injectable({
  providedIn: 'root'
})
export class HanabiStore {
  public settings?: HanabiSettings;
  public game?: HanabiGame;
}
