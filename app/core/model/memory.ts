import { headmate } from "./headmates"
import { emotion } from "./emotion"

/** Memories are events and associations. */
export type memory = {
    /** The headmates that the memory is about. Emotions here may color interactions with them. Self memories will list
     * only the headmate that owns the memory, and emotions will not apply. */
    about: headmate[]

    /** Timestamped to the nearest hour. */
    totalHour: number

    /** Associated emotion and its modifier, decay per hour, and minimum value. */
    emotions?: [emotion, number, number, number][]
}

/** Gets the total emotion value associated to the "about" headmate. */
export function getEmotionWeight(memories: memory[], about: headmate): { [key in emotion]: number } {
    const emotions: { [key in emotion]: number } = {
        [emotion.happy]: 0,
        [emotion.sad]: 0,
        [emotion.upset]: 0
    }

    for (const memory of memories) {
        if (memory.about.includes(about) && memory.emotions) {
            for (const entry of memory.emotions) {
                switch (entry[0]) {
                    case emotion.happy:
                        emotions[emotion.happy] += entry[0]
                        break
                    case emotion.sad:
                        emotions[emotion.sad] += entry[0]
                        break
                    case emotion.upset:
                        emotions[emotion.upset] += entry[0]
                        break
                    default: entry[0] satisfies never // TS catches missing cases
                }
            }
        }
    }

    return emotions
}