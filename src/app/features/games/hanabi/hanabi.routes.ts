import {Routes} from "@angular/router";
import {HanabiComponent} from "./pages/hanabi/hanabi.component";
import {HanabiLobbyComponent} from "./pages/hanabi-lobby/hanabi-lobby.component";

export const routes: Routes = [
  { path: '', redirectTo: '/games/hanabi/lobby', pathMatch: 'full' },
  { path: `lobby`, component: HanabiLobbyComponent},
  { path: `:id`, component: HanabiComponent}
];
