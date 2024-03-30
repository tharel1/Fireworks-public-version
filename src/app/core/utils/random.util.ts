import {List} from "immutable";

export class RandomUtil {

  // randomBetween(0, 4) -> [0, 1, 2, 3, 4]
  public static randomBetween(min: number, max: number) {
    return Math.floor(min + Math.random()*(max - min + 1));
  }

  // random(4) -> [0, 1, 2, 3]
  public static random(len: number) {
    return Math.floor(Math.random() * len);
  }

  // shuffle list
  public static shuffle<T>(list: List<T>): List<T> {
    const copy = list.toArray();

    for (let i = list.size - 1; i > 0; i--) {
      const j = this.random(i + 1);
      const temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }

    return List.of(...copy);
  }
}
