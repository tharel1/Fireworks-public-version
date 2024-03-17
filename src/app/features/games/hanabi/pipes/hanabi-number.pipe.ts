import { Pipe, PipeTransform } from '@angular/core';
import {Map} from "immutable";

@Pipe({
  name: 'hanabiNumber',
  standalone: true
})
export class HanabiNumberPipe implements PipeTransform {

  protected readonly map: Map<number, string> = Map([
    [1, 'ONE'],
    [2, 'TWO'],
    [3, 'THREE'],
    [4, 'FOUR'],
    [5, 'FIVE'],
  ]);

  transform(value: number, ...args: unknown[]): string {
    return this.map.get(value) ?? '';
  }

}
