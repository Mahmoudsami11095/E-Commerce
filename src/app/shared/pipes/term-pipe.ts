import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'term'
})
export class TermPipe implements PipeTransform {

  transform(value: string, count: number): string {
    return value.split(" ", count).join(" ");
  }

}
