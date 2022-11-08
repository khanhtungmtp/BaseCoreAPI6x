import { NgModule } from '@angular/core';
import { DateAgoPipe } from './date-ago.pipe';
import { UpperCaseFistLetter } from './upper-casefistLetter.pipe';


@NgModule({
    declarations: [
        DateAgoPipe,
        UpperCaseFistLetter
    ],
    exports: [
        DateAgoPipe,
        UpperCaseFistLetter
    ]
})
export class CustomPipesModule { }