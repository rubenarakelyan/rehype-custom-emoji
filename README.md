# @rubenarakelyan/rehype-custom-emoji

[![CI][ci-badge]][ci]
[![npm][npm-badge]][npm]

[@rubenarakelyan/rehype-custom-emoji][npm] is a [rehype](https://github.com/rehypejs/rehype) plugin to replace `:emoji:`
with custom-defined images.

Heavily inspired by [remark-emoji](https://github.com/rhysd/remark-emoji).

## Usage

```
rehype().use(emoji, options);
```

```javascript
import { rehype } from "rehype";
import customEmoji from "@rubenarakelyan/rehype-custom-emoji";

const doc = "Emojis in this text will be replaced: :dog:";
const processor = rehype().use(customEmoji, {
  emoji: {
    dog: "/images/dog.png"
  }
});
const file = await processor.process(doc);

console.log(String(file));
// => Emojis in this text will be replaced: <img src="/images/dog.png" alt="dog emoji" class="custom-emoji" aria-hidden>
```

Remember to import the `global.css` stylesheet to apply some basic styling to your custom emoji. This mostly ensures that
the emoji are the same size as the surrounding text so they act like real emoji.

If you are using the TailwindCSS `typography` extension's `prose` styling, you will need some extra CSS to remove the top
and bottom margins it applies to all images.

## Options

### `options.emoji`

An object where the keys are the emoji shortcodes, and values are paths to the custom emoji images. For example,

```javascript
{
  dog: "/images/dog.png"
}
```

will register the shortcode `:dog:`, which will be replaced with an HTML `<img>` tag pointing to `/images/dog.png`.

## Licence

[MIT licence](LICENSE).

[ci-badge]: https://github.com/rubenarakelyan/rehype-custom-emoji/actions/workflows/ci.yml/badge.svg
[ci]: https://github.com/rubenarakelyan/rehype-custom-emoji/actions/workflows/ci.yml
[npm-badge]: https://badge.fury.io/js/rubenarakelyan%2Frehype-custom-emoji.svg
[npm]: https://www.npmjs.com/package/@rubenarakelyan/rehype-custom-emoji
