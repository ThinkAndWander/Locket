import { timeUnit } from "./model"

/** Casts time from any unit to any unit. Months are always 30 days long. */
export function getTime(amount: number, from: timeUnit, to: timeUnit): number {
    switch (from) {
        case timeUnit.hours: break
        case timeUnit.day:
        case timeUnit.dayInWeek:
            amount = amount * 24
            break
        case timeUnit.month:
        case timeUnit.monthInYear:
            amount = amount * 24 * 30
            break
        case timeUnit.season:
            amount = amount * 24 * 30 * 3
            break
        case timeUnit.year:
            amount = amount * 24 * 30 * 12
            break
        default: from satisfies never // TS catch missing cases
    }

    switch (to) {
        case timeUnit.hours:
            return Math.floor(amount)
        case timeUnit.day:
            return Math.floor(amount / 24)
        case timeUnit.dayInWeek:
            return Math.floor((amount / 24) % 7)
        case timeUnit.month:
            return Math.floor(amount / 24 / 30)
        case timeUnit.monthInYear:
            return Math.floor((amount / 24 / 30) % 12)
        case timeUnit.season:
            return Math.floor(((amount / 24 / 30) % 12) / 4)
        case timeUnit.year:
            return Math.floor(amount / 24 / 30 / 12)
        default: to satisfies never // TS catch missing cases
            return -1
    }
}