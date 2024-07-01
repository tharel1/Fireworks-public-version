import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {Router} from "@angular/router";
import {combineLatest, iif, map, Observable, Subscription, tap, timer} from "rxjs";
import {List, Set} from "immutable";
import {MatTooltipModule} from "@angular/material/tooltip";
import {UserStore} from "../../../../../core/stores/user.store";
import {HanabiSettings} from "../../models/hanabi-settings.model";
import {HanabiCard} from "../../models/hanabi-card.model";
import {MatDivider} from "@angular/material/divider";
import {RoomRepository} from "../../../../../core/repositories/room.repository";
import {User} from "../../../../../core/models/user.model";
import {Room} from "../../../../../core/models/room.model";
import {TableRepository} from "../../../../../core/repositories/table.repository";
import {Table} from "../../../../../core/models/table.model";

@Component({
  selector: 'app-hanabi-lobby',
  templateUrl: './hanabi-lobby.component.html',
  styleUrls: ['./hanabi-lobby.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule, MatDivider],
})
export class HanabiLobbyComponent implements OnInit, OnDestroy {

  protected user: User = User.empty();
  protected rooms: Set<Room> = Set.of();
  protected currentRoom?: Room;
  protected starting$?: Observable<number>;

  protected settings: HanabiSettings = HanabiSettings.builder()
    .withPlayersNumber(0)
    .withMaxValue(5)
    .withColors(List.of(HanabiCard.Color.RED, HanabiCard.Color.YELLOW, HanabiCard.Color.GREEN, HanabiCard.Color.BLUE, HanabiCard.Color.PURPLE))
    .withMaxClues(8)
    .withMaxBombs(3)
    .build();

  private readonly watcher = new Subscription();

  constructor(
    private readonly router: Router,
    private readonly userStore: UserStore,
    private readonly roomRepository: RoomRepository,
    private readonly tableRepository: TableRepository
  ) { }

  ngOnInit(): void {
    this.watcher.add(combineLatest([
      this.userStore.get(),
      this.roomRepository.listenAll()
    ]).pipe(
      tap(([user, rooms]) => {
        this.user = user ?? User.empty();
        this.rooms = Set.of(...rooms);
        this.currentRoom = this.rooms.find(r => this.currentRoom?.owner.equals(this.user) || r.guests.some(g => g.equals(this.user)));

        if (this.currentRoom?.starting)
          this.starting$ = timer(0, 1000).pipe(
            map(value => 3 - value),
            tap(value => {
              if (value === 0) {
                this.router.navigateByUrl(`games/hanabi/${this.currentRoom?.id}`).then();
                if (this.currentRoom && this.isOwner()) {
                  this.watcher.add(this.roomRepository.delete(this.currentRoom).subscribe());
                  const users = Set.of(this.currentRoom.owner, ...this.currentRoom.guests);
                  this.watcher.add(this.tableRepository.create(Table.builder()
                    .withId(this.currentRoom.id)
                    .withUsers(users)
                    .withInitialGame(this.settings.createGame(users))
                    .build()
                  ).subscribe());
                }
                this.currentRoom = undefined;
              }
            })
          );
        else
          this.starting$ = undefined;
      })
    ).subscribe());
  }

  ngOnDestroy(): void {
    if (!this.currentRoom)
      return this.watcher.unsubscribe();

    this.watcher.add(iif(() => this.currentRoom?.owner.equals(this.user) ?? false,
      this.roomRepository.delete(this.currentRoom),
      this.roomRepository.update(Room.copy(this.currentRoom).withGuests(this.currentRoom.guests.filter(g => !g.equals(this.user))).build())
    ).pipe(
      tap(() => this.watcher.unsubscribe())
    ).subscribe());
  }

  protected addRoom(): void {
    this.watcher.add(this.roomRepository.create(Room.builder()
      .withId(crypto.randomUUID())
      .withOwner(this.user)
      .build()).pipe(
        tap(room => this.currentRoom = room)
    ).subscribe());
  }

  protected joinRoom(room: Room): void {
    this.watcher.add(this.roomRepository.update(Room.copy(room)
      .withGuests(room.guests.push(this.user))
      .build()).pipe(
        tap(room => this.currentRoom = room)
    ).subscribe());
  }

  protected leaveRoom(room: Room): void {
    this.watcher.add(this.roomRepository.update(Room.copy(room)
      .withGuests(room.guests.filter(g => !g.equals(this.user)))
      .build()
    ).subscribe());
  }

  protected start(room: Room): void {
    this.watcher.add(this.roomRepository.update(Room.copy(room)
      .withStarting(true)
      .build()
    ).subscribe());
  }

  protected isOwner(): boolean {
    return this.currentRoom?.owner.equals(this.user) ?? false;
  }

}
