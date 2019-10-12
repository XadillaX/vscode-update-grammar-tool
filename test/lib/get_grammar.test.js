"use strict";

const assert = require("assert");

const getGrammar = require("../../lib/get_grammar");

describe("lib/get_grammar.test.js", () => {
    it("should download cson", async function() {
        const { result, info } = await getGrammar("Alhadis/language-viml", "grammars/viml.cson", null, "v1.1.10");
        assert.strictEqual(
            result.version,
            "https://github.com/Alhadis/language-viml/commit/c5950dd59dfb11dc34df2f4077a410821ad71c5b");
        assert.strictEqual(result.name, "VimL");
        assert.strictEqual(result.scopeName, "source.viml");
        assert(result.patterns);
        assert(result.repository.syntax);

        assert.deepStrictEqual(info, {
            commitSha: "c5950dd59dfb11dc34df2f4077a410821ad71c5b",
            commitDate: "2019-09-19T05:29:00Z"
        });
    });

    it("should modify grammar", async function() {
        const { result } = await getGrammar("Alhadis/language-viml", "grammars/viml.cson", function(grammar) {
            assert(grammar.repository.vimUserCommand);
            const keys = Object.keys(grammar.repository);
            for(const key of keys) {
                delete grammar.repository[key];
            }

            grammar.repository.modified = true;
        }, "v1.1.10");

        assert.strictEqual(result.name, "VimL");
        assert.strictEqual(result.scopeName, "source.viml");
        assert(result.patterns);
        assert.deepStrictEqual(Object.keys(result.repository), [ "modified" ]);
        assert(result.repository.modified);
    });
});
