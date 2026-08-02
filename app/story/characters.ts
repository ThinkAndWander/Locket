import { newHeadmate } from "../core/model/headmates"
import { system, headmate, character } from "../core/model/model"
import { pronouns } from '../GUI/consts'

let _autoID = 0

/** This is where known characters should be added. */
export let characters: character[] = [
    _newCharacter({}, {
        name: 'Jane Doe',
        attributes: ["amenable"],
        bodyAttractPreference: "none",
        pronouns3P: [pronouns.they]
    })
]

/** A utility function to generate a new character object and mix in the properties. */
function _newCharacter(
    systemProps: Partial<Omit<system, 'headmates'>>,
    headmateProps: Partial<headmate>,
    others?: (systemRef: system) => headmate[]): character
{
    const self: system = {
        systemName: undefined,
        headmates: []
    }

    self.headmates.push({
        ...newHeadmate(self),
        ...headmateProps
    })

    if (others) {
        self.headmates.concat(others(self))
    }

    return {
        id: _autoID++,
        self: {
            ...self,
            ...systemProps
        }
    }
}