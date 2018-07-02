const fs = require('fs');

// region Constants

const CLIPPING_DELIMITER = '==========';
const NEW_LINE_X2 = '\n\n';
const BULLET = '*';

// endregion

// region Main Program

convertClippings();

/**
 * Converts the Kindle's clippings text file into a Markdown file with a bulleted list of highlights.
 */
function convertClippings() {
    const fileContents = getFileContents(process.argv[2]);
    const clippings = fileContents.split(CLIPPING_DELIMITER);
    const books = [];

    clippings.map(clipping => addHighlightToBook(clipping, books));

    books.forEach(book => {
        removeDuplicateHighlights(book);
        convertToMarkdown(book);
        writeToFile(`${book.title}.md`, convertToMarkdown(book));
    });
}

// endregion


// region Data Transformation

/**
 * Iterates through all clippings from the Kindle's text file and stores them in an array of {@link BookType} objects.
 * 
 * @param {String} clipping - The clipping text from the Kindle's clippings file.
 * @param {Array<BookType>} books - The current collection of books that have had clippings processed.
 */
function addHighlightToBook(clipping, books) {
    const [ bookTitle, info, newline, quote ] = clipping.trim().split('\n');

    // Does the clipping only contain white space?
    // NOTE: This usually happens for the last clipping.
    if (!clipping.replace(/\s/g, '').length) {
        return;
    }

    const book = getBookWithTitle(books, bookTitle);

    if (book) {
        book.highlights.push({ info, quote });
        return;
    }

    // Create a new book with the first highlight from it.
    books.push({
        title: bookTitle,
        highlights: [ { info, quote } ]
    });
}

/**
 * Converts a {@link BookType} into a Markdown bulleted list of highlights.
 *
 * @param {BookType} book - The {@link BookType} object to convert to markdown.
 *
 * @returns {String}
 */
function convertToMarkdown(book) {
    let markdownString = `# ${book.title}${NEW_LINE_X2}`;

    book.highlights.forEach(highlight => {
        const quoteUpper = highlight.quote.charAt(0).toUpperCase() + highlight.quote.substr(1);

        markdownString += `${BULLET} ${quoteUpper}${NEW_LINE_X2}`;
    });

    return markdownString;
}

/**
 * Removes duplicate highlights from the book, leaving the most recent highlight.

 * @note Kindle clippings tend to have duplicates caused by accidentally highlighting 
 *       too much or too little text. When the selection is modified it creates a new
 *       clipping instead of replacing the old one.
 *
 * @param {BookType} book - The book to remove duplicate highlights from. 
 */
function removeDuplicateHighlights(book) {
    book.highlights = book.highlights.filter((highlight, index) => 
        !isDuplicateHighlight(book.highlights.slice(index + 1), highlight)
    );
}

// endregion

// region Utility Methods

/**
 * Returns the {@link BookType} from the collection that matches the given title.
 * 
 * @param {Array<BookType>} books - The collection of books to search.
 * @param {String} bookTitle - The title of the book we are retrieving from the collection.
 */
function getBookWithTitle(books, bookTitle) {
    return books.find(book => book.title === bookTitle);
}

/**
 * Is the highlight a substring of another highlight in the provided collection.
 *
 * @param <Array<HighlightType>> highlights - The collection of highlights to search for duplicates in.
 * @param <HighlighType> highlight - The highlight to check is a duplicate.
 */
function isDuplicateHighlight(highlights, highlight) {
    return highlights.some(
        comparisonHighlight => {
            const quoteA = highlight.quote;
            const quoteB = comparisonHighlight.quote;

            return quoteA.indexOf(quoteB) !== -1 || quoteB.indexOf(quoteA) !== -1;
    });
}

// endregion

// region File I/O

/**
 * Synchronously reads and returns the contents of the given file path.
 *
 * @param {String} filePath - The relative path to the file to read.
 */
function getFileContents(filePath) {
    console.log(`Processing file "${filePath}"...`);

    return fs.readFileSync(filePath, 'utf8');
}

/**
 * Writes the given contents to a file at the given path.
 *
 * @param {String} filePath - The path for where the file should be written.
 * @param {String} fileContent - The contents to write to the file.
 */
function writeToFile(filePath, fileContent) {
    fs.writeFile(filePath, fileContent, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log(`${filePath} written successfully.`);
    }); 
}

// endregion

// region Type Definitions

/**
 * Represents a book, containing a number of highlights made within the Kindle application.
 *
 * @typedef {Object} BookType
 * 
 * @property {String} title - The title of the book.
 * @property {Array<HighlightType>} highlights - A collection of highlights made in the book.
 */

/**
 * Represents a book, containing a number of highlights made within the Kindle application.
 *
 * @typedef {Object} HighlightType
 * 
 * @property {String} info - The information string provided with the highlight (usually contains the location of the highlight and when it was made).
 * @property {String} quote - The actual text from the book that was highlighted.
 */

// endregion

