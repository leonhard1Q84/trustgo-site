/** Internal demo inventory; FE remains the source of live availability. */
const MAXIMUM_RENTAL_DAYS = 5;

export function hasLocalInventory(rentalDays: number): boolean {
  return Number.isInteger(rentalDays) && rentalDays >= 1 && rentalDays <= MAXIMUM_RENTAL_DAYS;
}
