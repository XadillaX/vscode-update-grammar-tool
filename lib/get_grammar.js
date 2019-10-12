"use strict";

const path = require("path");

const cson = require("cson-parser");
const plist = require("fast-plist");

const download = require("./download");
const getCommitSha = require("./get_commit_sha");

async function getGrammar(repoId, repoPath, modifyGrammar, version) {
    const contentPath = `https://raw.githubusercontent.com/${repoId}/${version}/${repoPath}`;
    console.log(`Reading from ${contentPath}`);

    const content = await download(contentPath);

    const ext = path.extname(repoPath);
    let grammar;

    switch(ext) {
    case ".tmLanguage":
    case ".plist":
        grammar = plist.parse(content);
        break;

    case ".cson":
        grammar = cson.parse(content);
        break;

    case ".json":
    case ".JSON-tmLanguage":
        grammar = JSON.parse(content);
        break;

    default:
        throw new Error(`Unknown file extension: ${ext}`);
    }

    if(modifyGrammar) {
        modifyGrammar(grammar);
    }

    const info = await getCommitSha(repoId, repoPath);
    const result = {
        information_for_contributors: [ // eslint-disable-line
            `This file has been converted from https://github.com/${repoId}/blob/master/${repoPath}`,
            "If you want to provide a fix or improvement, please create a pull request against the " +
                "original repository.",
            "Once accepted there, we are happy to receive an update request."
        ]
    };

    if(info) {
        result.version = `https://github.com/${repoId}/commit/${info.commitSha}`;
    }

    const keys = [ "name", "scopeName", "comment", "injections", "patterns", "repository" ];
    for(const key of keys) {
        if(grammar.hasOwnProperty(key)) {
            result[key] = grammar[key];
        }
    }

    return { result, info };
}

module.exports = getGrammar;
