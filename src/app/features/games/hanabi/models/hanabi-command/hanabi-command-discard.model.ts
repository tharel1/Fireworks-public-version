import {HanabiGame} from "../hanabi-game.model";
import {HanabiPlayer} from "../hanabi-player.model";
import {HanabiCommand} from "./internal";
import {HanabiCard} from "../hanabi-card.model";

export class HanabiCommandDiscard extends HanabiCommand {

  readonly target: HanabiPlayer;
  readonly card: HanabiCard;
  readonly index: number;

  constructor(builder: Builder) {
    super(HanabiCommand.Type.DISCARD);
    this.target = builder.target;
    this.card = builder.card;
    this.index = builder.index;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiCommandDiscard {
    return HanabiCommandDiscard.builder().build();
  }

  static copy(copy: HanabiCommandDiscard): Builder {
    return HanabiCommandDiscard.builder()
      .withTarget(copy.target)
      .withCard(copy.card)
      .withIndex(copy.index)
  }

  static override fromJson(json: any): HanabiCommandDiscard {
    return HanabiCommandDiscard.builder()
      .withTarget(HanabiPlayer.fromJson(json.target))
      .withCard(HanabiCard.fromJson(json.card))
      .withIndex(json.index)
      .build();
  }

  update(game: HanabiGame): HanabiGame {
    const nextPlayer = game.nextPlayer();
    return HanabiGame.copy(game)
      .withPlayers(game.players.map((p) => HanabiPlayer.copy(p)
        .withPlaying(p.equals(nextPlayer))
        .withCards(p.equals(this.target)
          ? p.cards.remove(this.index)
          : p.cards)
        .build()))
      .withDiscardPile(game.discardPile.push(this.card))
      .build();
  }

  revert(game: HanabiGame): HanabiGame {
    const previousPlayer = game.previousPlayer();
    return HanabiGame.copy(game)
      .withPlayers(game.players.map((p) => HanabiPlayer.copy(p)
        .withPlaying(p.equals(previousPlayer))
        .withCards(p.equals(this.target)
          ? p.cards.insert(this.index, this.card)
          : p.cards)
        .build()))
      .withDiscardPile(game.discardPile.remove(-1))
      .build();
  }

}

export namespace HanabiCommandDiscard {

}

class Builder {
  target: HanabiPlayer = HanabiPlayer.empty();
  card: HanabiCard = HanabiCard.empty();
  index: number = 0;

  withTarget(target: HanabiPlayer): Builder {
    this.target = target;
    return this;
  }

  withCard(card: HanabiCard): Builder {
    this.card = card;
    return this;
  }

  withIndex(index: number): Builder {
    this.index = index;
    return this;
  }

  build(): HanabiCommandDiscard {
    return new HanabiCommandDiscard(this);
  }
}
