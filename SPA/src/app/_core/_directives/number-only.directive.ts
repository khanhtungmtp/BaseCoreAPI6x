import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[numberOnly]',
})
export class NumberOnlyDirective implements OnChanges {
  private hasDecimalPoint = false;
  private hasNegativeSign = false;
  private navigationKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste',
  ];

  @Input() decimal = false;
  @Input() decimalSeparator = '.';
  @Input() allowNegatives = false;
  @Input() allowPaste = true;
  @Input() negativeSign = '-';
  @Input() min = -Infinity;
  @Input() max = Infinity;
  @Input() pattern?: string;
  @Input() patternCustom?: string | RegExp;
  private regex: RegExp | null = null;
  private predefinedPatterns: { [key: string]: RegExp } = {
    allowsTwoDecimalPlaces: /^\d+(\.\d{1,2})?$/,
    allowsOneDecimalPlaces: /^\d+(\.\d{1,1})?$/,
  };
  inputElement: HTMLInputElement;

  constructor(public el: ElementRef) {
    this.inputElement = el.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pattern']) {
      this.regex = this.pattern ? this.getPatternByName(this.pattern) : null;
    } else if (changes['patternCustom']) {
      this.regex = this.patternCustom ? RegExp(this.patternCustom) : null;
    }

    if (changes['min']) {
      this.min = this.parseNumber(this.min);
    }

    if (changes['max']) {
      this.max = this.parseNumber(this.max);
    }
  }

  private getPatternByName(name: string): RegExp | null {
    return this.predefinedPatterns[name] || null;
  }

  private parseNumber(value: any): number {
    const parsedValue = Number(value);
    return isNaN(parsedValue) ? -Infinity : parsedValue;
  }

  @HostListener('beforeinput', ['$event'])
  onBeforeInput(e: InputEvent): void {
    if (isNaN(Number(e.data))) {
      if (
        e.data === this.decimalSeparator ||
        (e.data === this.negativeSign && this.allowNegatives)
      ) {
        return; // go on
      }
      e.preventDefault();
      e.stopPropagation();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if (
      this.navigationKeys.includes(e.key) || // Allow: navigation keys: backspace, delete, arrows, etc.
      ((e.key === 'a' || e.code === 'KeyA') && e.ctrlKey) || // Allow: Ctrl+A
      ((e.key === 'c' || e.code === 'KeyC') && e.ctrlKey) || // Allow: Ctrl+C
      ((e.key === 'v' || e.code === 'KeyV') && e.ctrlKey) || // Allow: Ctrl+V
      ((e.key === 'x' || e.code === 'KeyX') && e.ctrlKey) || // Allow: Ctrl+X
      ((e.key === 'a' || e.code === 'KeyA') && e.metaKey) || // Allow: Cmd+A (Mac)
      ((e.key === 'c' || e.code === 'KeyC') && e.metaKey) || // Allow: Cmd+C (Mac)
      ((e.key === 'v' || e.code === 'KeyV') && e.metaKey) || // Allow: Cmd+V (Mac)
      ((e.key === 'x' || e.code === 'KeyX') && e.metaKey) // Allow: Cmd+X (Mac)
    ) {
      // let it happen, don't do anything
      return;
    }

    let newValue = '';

    if (this.decimal && e.key === this.decimalSeparator) {
      newValue = this.forecastValue(e.key);
      if (
        newValue.split(this.decimalSeparator).length > 2 ||
        !newValue.match(/^\d/)
      ) {
        // has two or more decimal points
        e.preventDefault();
        return;
      } else {
        this.hasDecimalPoint = newValue.includes(this.decimalSeparator);
        return; // Allow: only one decimal point
      }
    }

    if (e.key === this.negativeSign && this.allowNegatives) {
      newValue = this.forecastValue(e.key);
      if (
        newValue.charAt(0) !== this.negativeSign ||
        newValue.split(this.negativeSign).length > 2
      ) {
        e.preventDefault();
        return;
      } else {
        this.hasNegativeSign = newValue.includes(this.negativeSign);
        return;
      }
    }

    // Ensure that it is a number and stop the keypress
    if (e.key === ' ' || isNaN(Number(e.key))) {
      e.preventDefault();
      return;
    }

    newValue = newValue || this.forecastValue(e.key);
    // check the input pattern RegExp
    if (this.regex && !this.regex.test(newValue)) {
      e.preventDefault();
      return;
    }

    const newNumber = Number(newValue);
    if (newNumber > this.max || newNumber < this.min) {
      e.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: any): void {
    if (!this.allowPaste) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    let pastedInput: string = '';
    if ((window as any)['clipboardData']) {
      // Browser is IE
      pastedInput = (window as any)['clipboardData'].getData('text');
    } else if (event.clipboardData && event.clipboardData.getData) {
      // Other browsers
      pastedInput = event.clipboardData.getData('text/plain');
    }

    this.pasteData(pastedInput);
    event.preventDefault();
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    const textData = event.dataTransfer?.getData('text') ?? '';
    this.inputElement.focus();
    this.pasteData(textData);
    event.preventDefault();
  }

  private pasteData(pastedContent: string): void {
    const sanitizedContent = this.sanitizeInput(pastedContent);
    if (
      sanitizedContent.includes(this.negativeSign) &&
      this.hasNegativeSign &&
      !this.getSelection().includes(this.negativeSign)
    ) {
      return;
    }

    const pasted = document.execCommand('insertText', false, sanitizedContent);
    if (!pasted) {
      if (this.inputElement.setRangeText) {
        const { selectionStart: start, selectionEnd: end } = this.inputElement;
        this.inputElement.setRangeText(
          sanitizedContent,
          start ?? 0,
          end ?? 0,
          'end'
        );

        // Angular's Reactive Form relies on "input" event, but on Firefox, the setRangeText method doesn't trigger it
        // so we have to trigger it ourselves.
        if (typeof (window as any)['InstallTrigger'] !== 'undefined') {
          this.inputElement.dispatchEvent(
            new Event('input', { cancelable: true })
          );
        }
      } else {
        // Browser does not support setRangeText, e.g. IE
        this.insertAtCursor(this.inputElement, sanitizedContent);
      }
    }

    if (this.decimal) {
      this.hasDecimalPoint = this.inputElement.value.includes(
        this.decimalSeparator
      );
    }

    this.hasNegativeSign = this.inputElement.value.includes(this.negativeSign);
  }

  // The following 2 methods were added from the below article for browsers that do not support setRangeText
  // https://stackoverflow.com/questions/11076975/how-to-insert-text-into-the-textarea-at-the-current-cursor-position
  private insertAtCursor(myField: HTMLInputElement, myValue: string): void {
    const startPos = myField.selectionStart ?? 0;
    const endPos = myField.selectionEnd ?? 0;

    myField.value =
      myField.value.substring(0, startPos) +
      myValue +
      myField.value.substring(endPos, myField.value.length);

    const pos = startPos + myValue.length;
    myField.focus();
    myField.setSelectionRange(pos, pos);

    this.triggerEvent(myField, 'input');
  }

  private triggerEvent(el: HTMLInputElement, type: string): void {
    if ('createEvent' in document) {
      // modern browsers, IE9+
      const e = document.createEvent('HTMLEvents');
      e.initEvent(type, false, true);
      el.dispatchEvent(e);
    }
  }
  // end stack overflow code

  private sanitizeInput(input: string): string {
    let result = '';
    let regex;
    if (this.decimal && this.isValidDecimal(input)) {
      regex = new RegExp(
        `${this.getNegativeSignRegExp()}[^0-9${this.decimalSeparator}]`,
        'g'
      );
    } else {
      regex = new RegExp(`${this.getNegativeSignRegExp()}[^0-9]`, 'g');
    }

    result = input.replace(regex, '');

    const maxLength = this.inputElement.maxLength;
    if (maxLength > 0) {
      // the input element has maxLength limit
      const allowedLength =
        maxLength -
        this.inputElement.value.length +
        (result.includes(this.negativeSign) ? 1 : 0);
      result = allowedLength > 0 ? result.substring(0, allowedLength) : '';
    }

    return result;
  }

  private getNegativeSignRegExp(): string {
    return this.allowNegatives &&
      (!this.hasNegativeSign || this.getSelection().includes(this.negativeSign))
      ? `(?!^${this.negativeSign})`
      : '';
  }

  private isValidDecimal(string: string): boolean {
    if (!this.hasDecimalPoint) {
      return string.split(this.decimalSeparator).length <= 2;
    } else {
      // the input element already has a decimal separator
      const selectedText = this.getSelection();
      if (selectedText && selectedText.includes(this.decimalSeparator)) {
        return string.split(this.decimalSeparator).length <= 2;
      } else {
        return !string.includes(this.decimalSeparator);
      }
    }
  }

  private getSelection(): string {
    return this.inputElement.value.substring(
      this.inputElement.selectionStart ?? 0,
      this.inputElement.selectionEnd ?? 0
    );
  }

  private forecastValue(key: string): string {
    const selectionStart = this.inputElement.selectionStart ?? 0;
    const selectionEnd = this.inputElement.selectionEnd ?? 0;
    const oldValue = this.inputElement.value;
    return (
      oldValue.substring(0, selectionStart) +
      key +
      oldValue.substring(selectionEnd)
    );
  }
}
