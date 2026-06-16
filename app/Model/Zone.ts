/** The identified zones in a game. All zones are order-specific to allow for positional effects. */
export const Zones: {[key: string]: [boolean, boolean]} = {

    Scenario: [false, false], // The main scenario, typically only one card occupies this
    Charm: [false, false], // A per-player zone where created effects go to have continuous effect
    Trinket: [false, false], // A per-player zone where out-of-game items are allowed to have continuous effect
    Resolution: [false, false], // A per-player zone 
    Result: [false, false] // A per-player
}