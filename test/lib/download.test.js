"use strict";

const assert = require("assert");

const download = require("../../lib/download");

describe("lib/download.test.js", () => {
    it("should download cson", async function() {
        const ret = await download("https://raw.githubusercontent.com/Alhadis/language-viml/master/grammars/viml.cson");
        assert(ret.includes("support.function.vimUserCommand.viml"));
    });
});
