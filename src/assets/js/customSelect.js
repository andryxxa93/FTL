export const customSelect = (selector, initial = false) => {
    const csSelector = document.querySelector(`#${selector}-select`);
    const csInput = csSelector.querySelector('input')
    const csList = csSelector.querySelector('ul')
    const csOptions = csList.querySelectorAll('li')
    const csIcons = csSelector.querySelector('.custom-select-icons')
    const csStatus = document.querySelector(`#${selector}-select-status`)
    const aOptions = Array.from(csOptions)

    let csState = "initial";

    csSelector.setAttribute('role', 'combobox') 
    csSelector.setAttribute('aria-haspopup', 'listbox') 
    csSelector.setAttribute('aria-owns', 'custom-select-list') 
    csInput.setAttribute('aria-autocomplete', 'both') 
    csInput.setAttribute('aria-controls', 'custom-select-list') 
    csList.setAttribute('role', 'listbox') 
    csOptions.forEach(function(option) {
        option.setAttribute('role', 'option') 
        option.setAttribute('tabindex', "-1")  
    })

    let initialOption;
    if (initial) {
        initialOption = csList.querySelector('.initial');
        makeChoice(initialOption);
    }
    
    csSelector.addEventListener('click', function(e) {
    const currentFocus = findFocus()
    switch(csState) {
        case 'initial' : 
            toggleList('Open')
            setState('opened')
            break
        case 'opened':
            if (currentFocus === csInput) {
                toggleList('Shut')
                setState('initial')
            } else if (currentFocus.tagName === 'LI') {
                makeChoice(currentFocus)
                toggleList('Shut')
                setState('closed')
            } else if (e.target.closest('.custom-select-icons')) {
                toggleList('Shut')
                setState('initial')
            }
            break
        case 'filtered':
            if (currentFocus.tagName === 'LI') {
                makeChoice(currentFocus)
                toggleList('Shut')
                setState('closed')
            } 

            break
        case 'closed':
            toggleList('Open')
            setState('filtered')
            break
    }
    })

    csSelector.addEventListener('keyup', function(e) {
    doKeyAction(e.key)
    })

    document.addEventListener('click', function(e) {
    if (!e.target.closest(`#${selector}-select`)) {
        toggleList('Shut')
        setState('initial')
        } 
    })

    function rotateIcon() {
        let iconClass = 'openIcon'; 
        if (csIcons.classList.contains(iconClass)) {
            csIcons.classList.remove(iconClass);
            return
        }
        csIcons.classList.add(iconClass);
    }

    function toggleList(whichWay) {
    if (whichWay === 'Open') {
        csList.classList.remove('hidden-all')
        csSelector.setAttribute('aria-expanded', 'true')
    } else { // === 'Shut'
        csList.classList.add('hidden-all')
        csSelector.setAttribute('aria-expanded', 'false')
    }
    }

    function findFocus() {
    const focusPoint = document.activeElement
    return focusPoint
    }

    function moveFocus(fromHere, toThere) {
    const aCurrentOptions = aOptions.filter(function(option) {
        if (option.style.display === '') {
        return true
        }
    })
    if (aCurrentOptions.length === 0) {
        return
    }
    if (toThere === 'input') {
        csInput.focus()
    }
    switch(fromHere) {
        case csInput:
        if (toThere === 'forward') {
            aCurrentOptions[0].focus()
        } else if (toThere === 'back') {
            aCurrentOptions[aCurrentOptions.length - 1].focus()
        }
        break
        case csOptions[0]: 
        if (toThere === 'forward') {
            aCurrentOptions[1].focus()
        } else if (toThere === 'back') {
            csInput.focus()
        }
        break
        case csOptions[csOptions.length - 1]:
        if (toThere === 'forward') {
            aCurrentOptions[0].focus()
        } else if (toThere === 'back') {
            aCurrentOptions[aCurrentOptions.length - 2].focus()
        }
        break
        default:
        const currentItem = findFocus()
        const whichOne = aCurrentOptions.indexOf(currentItem)
        if (toThere === 'forward') {
            const nextOne = aCurrentOptions[whichOne + 1]
            nextOne.focus()
        } else if (toThere === 'back' && whichOne > 0) {
            const previousOne = aCurrentOptions[whichOne - 1]
            previousOne.focus()
        } else { 
            csInput.focus()
        }
        break
    }
    }

    function doFilter() {
    const terms = csInput.value
    const aFilteredOptions = aOptions.filter(function(option) {
        if (option.innerText.toUpperCase().startsWith(terms.toUpperCase())) {
        return true
        }
    })
    csOptions.forEach(option => option.style.display = "none")
    aFilteredOptions.forEach(function(option) {
        option.style.display = ""
    })
    setState('filtered')
    updateStatus(aFilteredOptions.length)
    }

    function updateStatus(howMany) {
    csStatus.textContent = howMany + " options available."
    }

    function makeChoice(whichOption) {
        const optionTitle = whichOption.querySelector('span')
        csInput.value = optionTitle.textContent
        if (initialOption) {
            return
        }
        moveFocus(document.activeElement, 'input')
    }

    function setState(newState) {
    switch (newState) {
        case 'initial': 
        csState = 'initial'
        break
        case 'opened': 
        csState = 'opened'
        break
        case 'filtered':
        csState = 'filtered'
        break
        case 'closed': 
        csState = 'closed'
    }
    }

    function doKeyAction(whichKey) {
    const currentFocus = findFocus()
    switch(whichKey) {
        case 'Enter':
        if (csState === 'initial') { 
            // if state = initial, toggleOpen and set state to opened
            toggleList('Open')
            setState('opened')
        } else if (csState === 'opened' && currentFocus.tagName === 'LI') { 
            // if state = opened and focus on list, makeChoice and set state to closed
            makeChoice(currentFocus)
            toggleList('Shut')
            setState('closed')
        } else if (csState === 'opened' && currentFocus === csInput) {
            // if state = opened and focus on input, close it
            toggleList('Shut')
            setState('closed')
        } else if (csState === 'filtered' && currentFocus.tagName === 'LI') {
            // if state = filtered and focus on list, makeChoice and set state to closed
            makeChoice(currentFocus)
            toggleList('Shut')
            setState('closed')
        } else if (csState === 'filtered' && currentFocus === csInput) {
            // if state = filtered and focus on input, set state to opened
            toggleList('Open')
            setState('opened')
        } else { // i.e. csState is closed, or csState is opened/filtered but other focus point?
            // if state = closed, set state to filtered? i.e. open but keep existing input? 
            toggleList('Open')
            setState('filtered')
        }
        break

        case 'Escape':
        // if state = initial, do nothing
        // if state = opened or filtered, set state to initial
        // if state = closed, do nothing
        if (csState === 'opened' || csState === 'filtered') {
            toggleList('Shut')
            setState('initial')
        }
        break

        case 'ArrowDown':
        if (csState === 'initial' || csState === 'closed') {
            // if state = initial or closed, set state to opened and moveFocus to first
            toggleList('Open')
            moveFocus(csInput, 'forward')
            setState('opened')
        } else {
            // if state = opened and focus on input, moveFocus to first
            // if state = opened and focus on list, moveFocus to next/first
            // if state = filtered and focus on input, moveFocus to first
            // if state = filtered and focus on list, moveFocus to next/first
            toggleList('Open')
            moveFocus(currentFocus, 'forward')
        } 
        break
        case 'ArrowUp':
        if (csState === 'initial' || csState === 'closed') {
            // if state = initial, set state to opened and moveFocus to last
            // if state = closed, set state to opened and moveFocus to last
            toggleList('Open')
            moveFocus(csInput, 'back')
            setState('opened')
        } else {
            // if state = opened and focus on input, moveFocus to last
            // if state = opened and focus on list, moveFocus to prev/last
            // if state = filtered and focus on input, moveFocus to last
            // if state = filtered and focus on list, moveFocus to prev/last
            moveFocus(currentFocus, 'back')
        }
        break 
        default:
        if (csState === 'initial') {
            // if state = initial, toggle open, doFilter and set state to filtered
            toggleList('Open')
            doFilter()
            setState('filtered')
        } else if (csState === 'opened') {
            // if state = opened, doFilter and set state to filtered
            doFilter()
            setState('filtered')
        } else if (csState === 'closed') {
            // if state = closed, doFilter and set state to filtered
            doFilter()
            setState('filtered')
        } else { // already filtered
            doFilter()
        }
        break 
    }
    }
}