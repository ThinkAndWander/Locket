@Setup
<div class="clearfix">
<img loading="lazy" style="float: left; margin: 0 0.4rem 0.4rem 0;" src="images/cocoa.gif" alt="A mug of hot cocoa"/>

# Welcome!
To make sure the cocoa is *just right*, you can enter your name, pronouns and preferences about the character(s) you'll be playing as. Locket supports having headmates! You can update this any time from "game" in the top bar.
</div>
<div class="controlsArea inline">
  <h2 style="display: inline;">Headmates</h2>
  <button aria-label="Add headmate" id="addHeadmate">+</button>
  <label for="inputSystemName">System Name</label>
  <input id="inputSystemName" type="text" placeholder="None" />
</div>
<div class="controlsArea"><!-- Generated --></div>
<template id="headmateControls">
    <details id="headmateEntry" class="preferenceCategory" name="headmateEntry">
        <summary id="headmateSummary"><h2 id="summaryTitle">New headmate<!-- Generated --></h2></summary>
        <div class="controlRow">
            <label for="inputHeadmateName">Name</label>
            <input id="inputHeadmateName" type="text" placeholder="None" />
        </div>
        <h3>Pronouns</h3>
        <p>Be yourself! Select many common pronouns from the dropdown, or write yours in. Write-ins need all five tenses, like: they them their theirs themself. You can add multiple sets by separating with slashes or enter.</p>
        <div class="controlRow">
            <label for="inputPronouns3P">Pronouns</label>
            <select id="inputPronouns3P"><!-- Generated --></select>
            <input type="text" style="margin: 0;" id="pronounsWriteIn" placeholder="Write in pronouns"></textarea>
            <p id="pronounStatus" role="status" style="margin-top: 0.1rem;">Current pronouns: they/them</p>
        </div>
        <div class="controlRow">
            <label for="inputPronouns3PUsage">Pronoun Usage</label>
            <select id="inputPronouns3PUsage">
                <option value="use pronouns" selected>Use pronouns</option>
                <option value="use name">Use name only</option>
                <option value="cycle">Cycle pronouns</option>
                <option value="randomize">Randomized pronoun</option>
            </select>
        </div>
        <div class="controlRow">
            <label for="inputPronouns1PUsage">I or We?</label>
            <select id="inputPronouns1PUsage">
                <option value="singular" selected>"I"</option>
                <option value="plural">"We" when co-fronting</option>
                <option value="always plural">"We" always</option>
                <option value="use name">Use name</option>
            </select>
        </div>
        <h3>Game preferences</h3>
        <span>Body attraction is how others are attracted to you, if any. Gendered language choice is the difference in being addressed by hey, hey dude, and hey girl!</span>
        <div class="controlRow">
            <label for="inputHeadmateBodyAttraction">Body attraction</label>
            <select id="inputHeadmateBodyAttraction">
                <option value="any" selected>Any</option>
                <option value="none">None</option>
                <option value="masc">Masc</option>
                <option value="fem">Fem</option>
            </select>
        </div>
        <div class="controlRow">
            <label for="inputHeadmateGenderedLanguage">Gendered language choice</label>
            <select id="inputHeadmateGenderedLanguage">
                <option value="none" selected>None</option>
                <option value="masc">Masc</option>
                <option value="fem">Fem</option>
            </select>
        </div>
        <button id="removeHeadmate">Remove this headmate</button>
    </summary>
</template>

```js
game.story.callbacks.afterLoad.push(() => {

    let isFirst = true
    let idCount = 0
    const controlsArea = document.querySelector(".controlsArea")

    const addHeadmateBttn = document.getElementById("addHeadmate")
        addHeadmateBttn.id += String(idCount)
        addHeadmateBttn.addEventListener("click", () => {
            addHeadmate()
    })

    // The system name for plural users, but it defaults for single users if no name is set, so it works here too.
    const inputSystemName = document.getElementById("inputSystemName")
    inputSystemName.addEventListener("input", () => {
        game.player.system.systemName = (inputSystemName.value === '')
            ? undefined : inputSystemName.value

        if (doneBttn.disabled) {
            doneBttn.disabled = false
            doneBttn.innerText = "Done! Start the story"
        }
    })

    const doneBttn = document.getElementById('doneButton')

    const addHeadmate = () => {
        // Instantiates the template for headmate controls
        const copy = document.importNode(document.getElementById("headmateControls").content, true)
        let thisHeadmate

        // Adds the headmate entry
        if (isFirst) {
            thisHeadmate = game.player.system.headmates[game.player.system.headmates.length - 1]
        } else {
            thisHeadmate = api.newHeadmate(game.player.system)
            game.player.system.headmates.push(thisHeadmate)
        }
        const headmateIndex = game.player.system.headmates.length - 1

        // Labels need a unique ID target but templates are reusable, so we need to increment *every* ID and the labels
        const everyLabel = copy.querySelectorAll('label')
        for (let i = 0; i < everyLabel.length; i++) {
            everyLabel[i].htmlFor += String(headmateIndex)
        }

        const headmateSummary = copy.querySelector('#headmateSummary')
        headmateSummary.id += String(idCount)
        const summaryTitle = copy.querySelector('#summaryTitle')
        summaryTitle.id += String(idCount)

        const nameInput = copy.querySelector('#inputHeadmateName')
        nameInput.id += String(idCount)
        nameInput.addEventListener("input", () => {
            if (doneBttn.disabled) {
                doneBttn.disabled = false
                doneBttn.innerText = "Done! Start the story"
            }
            
            thisHeadmate.name = nameInput.value.trim()
            summaryTitle.innerText = thisHeadmate.name
            if (thisHeadmate.name === '') {
                game.player.system.systemName = undefined
                summaryTitle.innerText = 'New headmate'
            }
        })

        // Populate third-person pronouns with permutations of common ones.
        const pronouns3p = copy.querySelector('#inputPronouns3P')
        pronouns3p.id += String(idCount)
        const mainPronouns = ['They', 'She', 'He', 'It', 'Fae', 'Xe', 'Ae']
        const unusuals = ['Co', 'Thon', 'Per', 'Hu', 'One', 'E', 'Ey', 'Ve', 'Vi', 'Ze']
        const mainPronouns2 = ['them', 'her', 'him', 'it', 'faer', 'xem', 'aer']
        const unusuals2 = ['co', 'thon', 'per', 'hum', 'one', 'em', 'em', 'ver', 'vir', 'zir']
        const doublePronouns = []
        const triplePronouns = []
        const childElementsToAppend = []
        mainPronouns.forEach((pronoun, i) => {
            const option = document.createElement('OPTION')
            option.text = pronoun + '/' + mainPronouns2[i]
            option.value = pronoun.toLowerCase()
            if (i === 0) { option.selected = true }
            childElementsToAppend.push(option)

            mainPronouns.forEach((pronoun2) => {
                if (pronoun === pronoun2) { return }
                const option = document.createElement('OPTION')
                option.text = pronoun + '/' + pronoun2
                option.value = pronoun + ' ' + pronoun2
                doublePronouns.push(option)

                mainPronouns.forEach((pronoun3) => {
                    if (pronoun === pronoun3 || pronoun2 === pronoun3) { return }
                    const option = document.createElement('OPTION')
                    option.text = pronoun + '/' + pronoun2 + '/' + pronoun3
                    option.value = pronoun + ' ' + pronoun2 + ' ' + pronoun3
                    triplePronouns.push(option)
                })
            })
        })
        unusuals.forEach((pronoun, i) => {
            const option = document.createElement('OPTION')
            option.text = pronoun + '/' + unusuals2[i]
            option.value = pronoun.toLowerCase()
            childElementsToAppend.push(option)
        })
        childElementsToAppend.push(document.createElement('HR'))
        childElementsToAppend.splice(childElementsToAppend.length, 0, ...doublePronouns)
        childElementsToAppend.push(document.createElement('HR'))
        childElementsToAppend.splice(childElementsToAppend.length, 0, ...triplePronouns)
        pronouns3p.append(...childElementsToAppend)

        // When choosing pronouns from the dropdown
        pronouns3p.addEventListener("change", () => {
            thisHeadmate.pronouns3P = []
            if (pronouns3p.value.includes(' ')) {
                pronouns3p.value.split(' ').forEach(pronoun => {
                    thisHeadmate.pronouns3P.push(api.pronouns[pronoun.toLowerCase()])
                })
            } else {
                thisHeadmate.pronouns3P.push(api.pronouns[pronouns3p.value])
            }

            // Update pronoun status report
            let newStatus = 'Current pronouns: ' + (thisHeadmate.pronouns3P.length === 1
                ? thisHeadmate.pronouns3P.map(o => o[0] + '/' + o[1]).join('')
                : thisHeadmate.pronouns3P.filter(o => o[0].trim() !== '').map(o => o[0]).join('/'))
            if (pronounStatus.innerText !== newStatus) { pronounStatus.innerText = newStatus }
        })

        // When writing in your own pronouns
        const pronouns3pwriteIn = copy.querySelector('#pronounsWriteIn')
        pronouns3pwriteIn.id += String(idCount)
        pronouns3pwriteIn.addEventListener("input", () => {
            pronouns3p.disabled = pronouns3pwriteIn.value !== ''

            // When empty, it defaults to pronouns3p and should update to its current value
            if (pronouns3pwriteIn.value === '') {
                pronouns3p.dispatchEvent(new Event('change'))
            }

            // Regex is 5 words separated by 1+ non-word characters
            const pronounMatches = pronouns3pwriteIn.value.matchAll(/\s*((\w|')+(\s|,)+){4}(\w|')+\s*/gm)
            thisHeadmate.pronouns3P = []
            for (const entry of pronounMatches) {
                entry[0].split(/\/|\n/gm).forEach(set => {
                    thisHeadmate.pronouns3P.push(set.trim().split(/\W+/))
                })
            }

            if (thisHeadmate.pronouns3P.length === 0) {
                thisHeadmate.pronouns3P.push(api.pronouns[pronouns3p.value])
            }

            // Update pronoun status report
            let newStatus = 'Current pronouns: ' + (thisHeadmate.pronouns3P.length === 1
                ? thisHeadmate.pronouns3P.map(o => o[0] + '/' + o[1]).join('')
                : thisHeadmate.pronouns3P.filter(o => o[0].trim() !== '').map(o => o[0]).join('/'))
            if (pronounStatus.innerText !== newStatus) { pronounStatus.innerText = newStatus }
        })

        const inputPronouns1PUsage = copy.querySelector("#inputPronouns1PUsage")
        inputPronouns1PUsage.id += String(idCount)
        inputPronouns1PUsage.addEventListener("change", () => {
            thisHeadmate.pronouns1P = inputPronouns1PUsage.value
        })

        const inputPronouns3PUsage = copy.querySelector("#inputPronouns3PUsage")
        inputPronouns3PUsage.id += String(idCount)
        inputPronouns3PUsage.addEventListener("change", () => {
            thisHeadmate.pronounBehavior = inputPronouns3PUsage.value
        })

        const inputHeadmateBodyAttraction = copy.querySelector("#inputHeadmateBodyAttraction")
        inputHeadmateBodyAttraction.id += String(idCount)
        inputHeadmateBodyAttraction.addEventListener("change", () => {
            thisHeadmate.bodyAttractPreference = inputHeadmateBodyAttraction.value
        })

        const inputHeadmateGenderedLanguage = copy.querySelector("#inputHeadmateGenderedLanguage")
        inputHeadmateGenderedLanguage.id += String(idCount)
        inputHeadmateGenderedLanguage.addEventListener("change", () => {
            thisHeadmate.genderedLanguagePreference = inputHeadmateGenderedLanguage.value
        })

        const removeHeadmate = copy.querySelector("#removeHeadmate")
        removeHeadmate.id += String(idCount)
        const headmateEntry = copy.querySelector("#headmateEntry")
        headmateEntry.open = true
        headmateEntry.id += String(idCount)

        if (headmateIndex !== 0) {
            removeHeadmate.addEventListener("click", () => {
                const entries = document.querySelectorAll('summary[id^=headmateSummary]')
                for (let i = 0; i < entries.length; i++) {
                    if (entries[i] === headmateSummary && i < entries.length - 1) {
                        entries[i + 1].focus()
                    } else if (entries[i] === headmateSummary) {
                        entries[i - 1].focus()
                    }
                }

                const index = game.player.system.headmates.findIndex(() => thisHeadmate)
                game.player.system.headmates.splice(headmateIndex, 1)
                headmateEntry.remove()
            })
        } else {
            removeHeadmate.remove() // First headmate must always exist
        }
        

        isFirst = false
        controlsArea.appendChild(copy)
        nameInput.focus()
        idCount++
    }
})
```

<button id="doneButton" style="margin-top: 3rem;" data-fork="intro" disabled>Enter a name first</button>

@Intro
The first memory of your aunt is a haze of brightly-colored events in an uncertain sea.

You met her when you were young, maybe seven. She was a stranger standing next to another lady at a booth outside of a mall. You can't remember the sign, the place, or really most things except the clouds, and who. It looked like it was going to rain, but it never did. There was a smell associated, a light sort of herb like diluted ginger. Your mom told you to go on ahead, talk to them and get to know your aunt.

Her and the lady nearby stood by a booth there, with all kinds of trinkets (you want to say they were stickers, pins and badges, but every time you think about it, it feels more like you're making it up than remembering it).

“It's nice to meet you, dear” she intoned. Her hair was brown like her scarf, a colorful weave of muted greens and ruddy tones. “My name is Maria. What's yours?”

<button data-fork="IntroName">

```js
return game.player.system.headmates.length > 1
    ? "“%I'm um, more than one.”"
    : "“%I'm %(name, name).”"
```

</button>

@IntroName
"Well, it's nice to meet you, %(name, and name)," Maria said. She offered you a decoration from the table to hold, an ornament of something orange.

[Restart.](@Intro)