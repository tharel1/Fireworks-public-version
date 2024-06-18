import { Pipe, PipeTransform } from '@angular/core';
import {Map} from "immutable";

@Pipe({
  name: 'hanabiNumber',
  standalone: true
})
export class HanabiNumberPipe implements PipeTransform {

  protected readonly map: Map<number, string> = Map([
    [1, 'one'],
    [2, 'two'],
    [3, 'three'],
    [4, 'four'],
    [5, 'five'],
  ]);

  transform(value: number, ...args: unknown[]): string {
    return this.map.get(value) ?? '';
  }

}
