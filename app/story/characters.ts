import { newHeadmate } from "../core/model/headmates";
import { pronouns } from "../core/model/pronouns";
import { system, headmate, character } from "../core/model/model";

let _autoID = 0

/** This is where known characters should be added. */
export let characters: character[] = [
    _newCharacter({}, {
        name: 'Jane Doe',
        attributes: ["amenable"],
        bodyAttractPreference: "none",
        pronouns: [pronouns.they]
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