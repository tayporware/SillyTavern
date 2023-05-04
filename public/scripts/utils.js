export function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}

export function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
    return array;
}

export function download(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

export async function urlContentToDataUri(url, params) {
    const response = await fetch(url, params);
    const blob = await response.blob();
    return await new Promise(callback => {
        let reader = new FileReader();
        reader.onload = function () { callback(this.result); };
        reader.readAsDataURL(blob);
    });
}

export function getBase64Async(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            resolve(reader.result);
        };
        reader.onerror = function (error) {
            reject(error);
        };
    });
}

export async function parseJsonFile(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = event => resolve(JSON.parse(event.target.result));
        fileReader.onerror = error => reject(error);
        fileReader.readAsText(file);
    });
}

export function getStringHash(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed,
        h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }

    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

export function getUniqueName(name, exists) {
    let i = 1;
    let baseName = name;
    while (exists(name)) {
        name = `${baseName} (${i})`;
        i++;
    }
    return name;
}

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));
export const isSubsetOf = (a, b) => (Array.isArray(a) && Array.isArray(b)) ? b.every(val => a.includes(val)) : false;

export function incrementString(str) {
    // Find the trailing number or it will match the empty string
    const count = str.match(/\d*$/);

    // Take the substring up until where the integer was matched
    // Concatenate it to the matched count incremented by 1
    return str.substr(0, count.index) + (++count[0]);
};

export function stringFormat(format) {
    const args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
    });
};

// Save the caret position in a contenteditable element
export function saveCaretPosition(element) {
    // Get the current selection
    const selection = window.getSelection();

    // If the selection is empty, return null
    if (selection.rangeCount === 0) {
        return null;
    }

    // Get the range of the current selection
    const range = selection.getRangeAt(0);

    // If the range is not within the specified element, return null
    if (!element.contains(range.commonAncestorContainer)) {
        return null;
    }

    // Return an object with the start and end offsets of the range
    const position = {
        start: range.startOffset,
        end: range.endOffset
    };

    console.log('Caret saved', position);

    return position;
}

// Restore the caret position in a contenteditable element
export function restoreCaretPosition(element, position) {
    // If the position is null, do nothing
    if (!position) {
        return;
    }

    console.log('Caret restored', position);

    // Create a new range object
    const range = new Range();

    // Set the start and end positions of the range within the element
    range.setStart(element.childNodes[0], position.start);
    range.setEnd(element.childNodes[0], position.end);

    // Create a new selection object and set the range
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}