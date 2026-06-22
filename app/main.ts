import "./style";
import { loadFromLocalStorage } from './core/persistence'
import { injectPronouns } from './core/model/pronouns'
import { headmate } from "./core/model/headmates";
import { system } from "./core/model/system";

const el = document.createElement('P')
el.append("test")


// TODO: TESTING
const firstOne: headmate = {
    
}
const player: system = {
    headmates: [],
    systemName: undefined
}
player.headmates.push(firstOne)
injectPronouns()





// Performs all one-time needs here.
loadFromLocalStorage() // Loads persisted data and determines locale.

document.body.appendChild(el)