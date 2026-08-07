import { Currency } from '../types/travel';

/** Pure currency formatter, pulled out of individual components so it isn't
 *  redefined as a new function identity on every render (previously each of
 *  ItineraryView / CommunityFeed / DestinationModal had its own inline copy). */
export function formatCurrency(usd: number, currency: Currency): string {
  const converted = usd * currency.rateToUSD;
  return `${currency.symbol}${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}
