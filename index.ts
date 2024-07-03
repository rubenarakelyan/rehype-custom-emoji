import { findAndReplace, type Find, type Replace } from "hast-util-find-and-replace";
import type { Plugin } from "unified";
import type { Root, Element } from "hast";
import { raw } from "hast-util-raw";

const RE_EMOJI = /:[\w_-]+:/g;
const RE_PUNCT = /[_-]/g;

/**
 * Configuration of @rubenarakelyan/rehype-custom-emoji plugin.
 */
export interface RehypeCustomEmojiOptions {
  /**
   * Defines custom emoji. Keys are shortcodes without the `:`
   * (eg. `ruby` for the `:ruby:` shortcode), and values are paths
   * to the emoji image to replace the shortcode with.
   */
  emoji: Record<string, string>;
}

export const rehypeCustomEmoji: Plugin<[(RehypeCustomEmojiOptions | null | undefined)?], Root> = options => {
  function image(src: string, label: string): Element {
    return {
      type: "element",
      tagName: "img",
      properties: {
        src: src,
        alt: label,
        className: ["custom-emoji"],
        ariaHidden: true,
      },
      children: [],
    };
  }

  function replaceCustomEmoji(match: string): false | Element {
    const shortcode = match.slice(1, -1);
    const src = options?.emoji[String(shortcode)];

    if (typeof src === "undefined") {
      return false;
    }

    const label = shortcode.replace(RE_PUNCT, " ") + " emoji";
    const emoji = image(src, label);

    return emoji;
  }

  const replacers: [Find, Replace][] = [[RE_EMOJI, replaceCustomEmoji]];

  function transformer(tree: Root): void {
    // We need to parse the tree again to turn "raw" nodes into
    // elements, but also to then replace the tree in-place.
    const reparsedTree = raw(tree) as Root;
    tree.children.splice(0, Infinity, ...reparsedTree.children);
    findAndReplace(tree, replacers, {
      ignore: function (element: Element) {
        // Ignore custom emoji inside tags that contain raw content
        return ["code", "kbd", "pre", "samp"].includes(element.tagName);
      },
    });
  }

  return transformer;
};

export default rehypeCustomEmoji;
