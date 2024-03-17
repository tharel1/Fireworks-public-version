import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {Router} from "@angular/router";
import {map, Observable, tap, timer} from "rxjs";
import {Set} from "immutable";
import {MatTooltipModule} from "@angular/material/tooltip";
import {HanabiGame} from "../../models/hanabi-game.model";
import {HanabiPlayer} from "../../models/hanabi-player.model";
import {User} from "../../../../users/models/user.model";
import {Room} from "../../../../users/models/room.model";
import {HanabiStore} from "../../../../../core/stores/hanabi.store";
import {UserStore} from "../../../../../core/stores/user.store";
import {SocketService} from "../../../../../core/sockets/socket.service";

@Component({
  selector: 'app-hanabi-lobby',
  templateUrl: './hanabi-lobby.component.html',
  styleUrls: ['./hanabi-lobby.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule],
})
export class HanabiLobbyComponent implements OnInit {

  protected user: User = User.empty();
  protected rooms: Set<Room> = Set.of();
  protected currentRoom?: Room;
  protected starting$?: Observable<number>;

  constructor(
    private socketService: SocketService,
    private router: Router,
    private hanabiStore: HanabiStore,
    private userStore: UserStore
  ) {}

  ngOnInit(): void {
    this.user = this.userStore.user;

    this.socketService.fromEvent<Room[]>('rooms').pipe(
      map(rooms => Set(rooms.map(r => Room.fromJson(r)))),
      tap(rooms => {
        this.rooms = rooms;
        if (this.rooms.isEmpty()) {
          this.currentRoom = undefined;
        }
      })
    ).subscribe();

    this.socketService.fromEvent<Room>('joined').pipe(
      map(room => Room.fromJson(room)),
      tap(room => {
        this.rooms = this.rooms.map(r => {
          if (r.id === room.id) return room;
          return r;
        });
        if (this.currentRoom?.id === room.id) this.currentRoom = room;
      })
    ).subscribe();

    this.socketService.fromEvent<HanabiGame>('started').pipe(
      map(game => HanabiGame.fromJson(game)),
      tap(game => {
        this.hanabiStore.game = game;
        this.starting$ = timer(0, 1000).pipe(
          map(value => 3 - value),
          tap(value => {
            if (value === 0) this.router.navigateByUrl(`games/hanabi/${this.currentRoom?.id}`).then();
          })
        );
      })
    ).subscribe();
  }

  protected addRoom(): void {
    this.currentRoom = Room.builder()
      .withId(crypto.randomUUID())
      .build();
    this.socketService.emit('join', this.currentRoom, this.user);
  }

  protected joinRoom(room: Room): void {
    this.currentRoom = room;
    this.socketService.emit('join', room, this.user);
  }

  protected start(): void {
    if (!this.currentRoom) return;

    const randomFirstPlayerIdx = Math.floor(Math.random() * this.currentRoom.users.size);

    this.socketService.emit('start', HanabiGame.builder()
      .withPlayers(this.currentRoom.users.map((u: User, i: number) => HanabiPlayer.builder()
        .withUser(u)
        .withPlaying(randomFirstPlayerIdx === i)
        .build()
      ))
      .withCounter(10)
      .build());
  }

  protected isOwner(): boolean {
    return this.currentRoom?.users.first(undefined)?.id === this.user.id;
  }

}
