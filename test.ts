import assert from "assert";
import { rehype } from "rehype";
import headings from "rehype-autolink-headings";
import slug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { defaultSchema } from "rehype-sanitize";
import customEmoji from "./index.js";

const schema = structuredClone(defaultSchema);
assert.ok(schema.attributes);

const customEmojiOptions = {
  emoji: {
    dog: "dog.png",
    cat: "cat.png",
    "triumph-1": "triumph.png",
    stuck_out_tongue_winking_eye: "tongue.png",
  },
};

const compiler = rehype().use(slug).use(headings).use(customEmoji, customEmojiOptions).use(rehypeStringify);

describe("rehype-custom-emoji", function () {
  describe("minimal compiler", function () {
    it("replaces custom emojis in text when they have an entry in the options", async function () {
      /* eslint-disable quotes */
      const tests: Record<string, string> = {
        "This is :dog:": 'This is <img src="dog.png" alt="dog emoji" class="custom-emoji" aria-hidden>',
        ":dog: is not :cat:":
          '<img src="dog.png" alt="dog emoji" class="custom-emoji" aria-hidden> is not <img src="cat.png" alt="cat emoji" class="custom-emoji" aria-hidden>',
        ":triumph:": ":triumph:",
        ":triumph-1:": '<img src="triumph.png" alt="triumph 1 emoji" class="custom-emoji" aria-hidden>',
        ":stuck_out_tongue_winking_eye:":
          '<img src="tongue.png" alt="stuck out tongue winking eye emoji" class="custom-emoji" aria-hidden>',
      };
      /* eslint-enable quotes */

      for (const [input, expected] of Object.entries(tests)) {
        const result = await compiler.process(input);
        const expectedHtml = "<html><head></head><body>" + expected + "</body></html>";
        assert.equal(String(result), expectedHtml, `input: ${JSON.stringify(input)}`);
      }
    });

    it("does not replace custom emoji-like text", async function () {
      const tests: Record<string, string> = {
        "This text does not include custom emoji.": "This text does not include custom emoji.",
        ":++: or :foo: or :cat": ":++: or :foo: or :cat",
        "::": "::",
      };

      for (const [input, expected] of Object.entries(tests)) {
        const result = await compiler.process(input);
        const expectedHtml = "<html><head></head><body>" + expected + "</body></html>";
        assert.equal(String(result), expectedHtml, `input: ${JSON.stringify(input)}`);
      }
    });

    it("replaces custom emoji in link text", async function () {
      /* eslint-disable quotes */
      const tests: Record<string, string> = {
        "In inline code, <code>:dog: and :cat: are not replaced</code>":
          "In inline code, <code>:dog: and :cat: are not replaced</code>",
        "In code, <pre>:dog: and :cat: are not replaced</pre>": "In code, <pre>:dog: and :cat: are not replaced</pre>",
        '<a href="https://example.com">here :dog: and :cat: are replaced!</a>':
          '<a href="https://example.com">here <img src="dog.png" alt="dog emoji" class="custom-emoji" aria-hidden> and <img src="cat.png" alt="cat emoji" class="custom-emoji" aria-hidden> are replaced!</a>',
      };
      /* eslint-enable quotes */

      for (const [input, expected] of Object.entries(tests)) {
        const result = await compiler.process(input);
        const expectedHtml = "<html><head></head><body>" + expected + "</body></html>";
        assert.equal(String(result), expectedHtml, `input: ${JSON.stringify(input)}`);
      }
    });
  });

  describe("works with other rehype plugins", function () {
    it("replaces custom emoji in transformed HTML text", async function () {
      // `id="hello-world"` is inserted by rehype-slug
      // `<a aria-hidden="true" tabindex="-1" href="#hello-world">...` is inserted by rehype-autolink-headings
      const input = "<h1>Hello world</h1><p>Woo :dog: is not :cat:.</p>";
      /* eslint-disable quotes */
      const expected =
        '<h1 id="hello-world"><a aria-hidden="true" tabindex="-1" href="#hello-world"><span class="icon icon-link"></span></a>Hello world</h1><p>Woo <img src="dog.png" alt="dog emoji" class="custom-emoji" aria-hidden> is not <img src="cat.png" alt="cat emoji" class="custom-emoji" aria-hidden>.</p>';
      /* eslint-enable quotes */

      const result = await compiler.process(input);
      const expectedHtml = "<html><head></head><body>" + expected + "</body></html>";
      assert.equal(String(result), expectedHtml, `input: ${JSON.stringify(input)}`);
    });
  });
});
