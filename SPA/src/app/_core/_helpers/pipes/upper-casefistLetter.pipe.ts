import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'UpperCaseFistLetter'
})
export class UpperCaseFistLetter implements PipeTransform {
  transform(word: any, ...args: any[]) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

}
