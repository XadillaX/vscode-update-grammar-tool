#!/usr/bin/env node
"use strict";

const chalk = require("chalk");
const parser = require("nomnom")
    .script("update-grammar")
    .help("Update vscode grammars from upstream")
    .options({
        "repo-id": {
            position: 0,
            help: "The repository ID",
            required: true
        },
        "file-pairs": {
            position: 1,
            help: "The source file path in repository and the destination file path pairs",
            list: true,
            required: true
        }
    });

const update = require("../lib/update");

const opts = parser.parse();

if(!opts["file-pairs"].length || opts["file-pairs"].length % 2) {
    parser.print(`\n${chalk.red("File pairs must be pairs.")}\n${parser.getUsage()}`, 1);
    process.exit(4);
}

const repoId = opts["repo-id"];
const filePairs = opts["file-pairs"];

for(let i = 0; i < filePairs.length; i += 2) {
    update(repoId, filePairs[i], filePairs[i + 1]).catch(e => {
        console.error(e);
        process.exit(1);
    });
}
