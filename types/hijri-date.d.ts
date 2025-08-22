declare module 'hijri-date' {
  class HijriDate {
    constructor(date?: Date | string | number);
    getDate(): number;
    getMonth(): number;
    getFullYear(): number;
    toDateString(): string;
    toString(): string;
  }
  
  export = HijriDate;
}