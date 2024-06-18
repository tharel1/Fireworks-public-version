import {List} from "immutable";

export class ArrayUtil {

  // range(1, 5) returns -> [1, 2, 3, 4, 5]
  public static range(min: number, max: number): List<number> {
    if (min > max) return List.of();
    return List(Array.from(Array(max-min+1).keys())).map(i => i+min);
  }
}
