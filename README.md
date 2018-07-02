# kindle-to-markdown

This repository contains a Node.js script that converts a Kindle _clippings_ file (e.g. _"My Clippings.txt"_) into a number of Markdown files (one for each book) containing a list of bulleted highlights.

> NOTE: Kindle clippings tend to have duplicates caused by accidentally highlighting too much or too little text. When the selection is modified it creates a new clipping instead of replacing the old one. This script attempts to remove these duplicates only leaving the newest highlight (which is assumed to be the correct clipping).

## Usage

1. Install [Node.js](https://nodejs.org/en/download/) on your machine.
1. Plug in your Kindle reader to your computer.
1. Open a terminal/command prompt.
1. Change directories to the _<Kindle>/documents/_ folder containing the _My Clippings.txt_ file.
1. Run `node kindle-clippings-to-markdown.js My\ Clippings.txt`.
1. Notice the generated _.md_ files created within the current directory.

> A sample _My Clippings.txt_ file (along with its output) has been provided in this repository for testing purposes.