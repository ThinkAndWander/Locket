import { emotion, headmate, memory } from "./model"

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