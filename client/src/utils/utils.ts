import marked from 'marked';
import DOMPurify from 'dompurify';
import { useState, useEffect, StateUpdater } from 'preact/hooks';
import { RefObject } from 'preact';

function isInViewPort(rect: DOMRect) {
  if (
    window.screen.height >= rect.bottom &&
    window.screen.width >= rect.right &&
    rect.top >= 0 &&
    rect.left >= 0
  )
    return true;
  return false;
}

export function useScreenEnter(ref: RefObject<HTMLElement>, callback: () => void) {
  const [entered, setEntered] = useState(false);

  const isInView = () => {
    return ref.current && isInViewPort(ref.current.getBoundingClientRect());
  };

  const activate = () => {
    if (isInView() && !entered) {
      callback();
      setEntered(true);
    }
  };
  useEffect(() => {
    document.addEventListener('scroll', activate);
    return () => document.removeEventListener('scroll', activate);
  });
  return setEntered;
}

export function Sanitize(text: string) {
  // return marked(text);
  return DOMPurify.sanitize(marked(text));
}

const htmlAttributes = [
  'alt',
  'id',
  'class',
  'align',
  'autoPlay',
  'capture',
  'checked',
  'cols',
  'colSpan',
  'content',
  'coords',
  'data',
  'dateTime',
  'default',
  'defer',
  'dir',
  'disabled',
  'disableRemotePlayback',
  'encType',
  'headers',
  'height',
  'hidden',
  'high',
  'href',
  'hrefLang',
  'integrity',
  'is',
  'keyParams',
  'keyType',
  'kind',
  'label',
  'lang',
  'list',
  'loop',
  'low',
  'manifest',
  'marginHeight',
  'marginWidth',
  'max',
  'maxLength',
  'media',
  'mediaGroup',
  'method',
  'min',
  'minLength',
  'multiple',
  'muted',
  'name',
  'nonce',
  'noValidate',
  'open',
  'optimum',
  'pattern',
  'placeholder',
  'playsInline',
  'poster',
  'preload',
  'radioGroup',
  'readOnly',
  'rel',
  'required',
  'role',
  'rows',
  'rowSpan',
  'sandbox',
  'scope',
  'scoped',
  'scrolling',
  'seamless',
  'selected',
  'shape',
  'size',
  'sizes',
  'slot',
  'span',
  'spellcheck',
  'src',
  'srcset',
  'srcDoc',
  'srcLang',
  'srcSet',
  'start',
  'step',
  'style',
  'summary',
  'tabIndex',
  'target',
  'title',
  'type',
  'useMap',
  'value',
  'volume',
  'width',
  'wrap',
];
const htmlTags = [
  'a',
  'abbr',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'bdi',
  'bdo',
  'blockquote',
  'body',
  'br',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hgroup',
  'hr',
  'i',
  'img',
  'ins',
  'kbd',
  'keygen',
  'label',
  'legend',
  'li',
  'link',
  'main',
  'map',
  'mark',
  'menu',
  'menuitem',
  'meta',
  'meter',
  'nav',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'param',
  'pre',
  'progress',
  'q',
  'rb',
  'rp',
  'rt',
  'rtc',
  'ruby',
  's',
  'samp',
  'section',
  'select',
  'small',
  'source',
  'span',
  'strong',
  'sub',
  'summary',
  'sup',
  'svg',
  'table',
  'tbody',
  'td',
  'template',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'u',
  'ul',
  'var',
  'video',
  'wbr',
  'path',
];

const allowedAttributes = htmlTags.reduce<{ [key: string]: string[] }>((acc, key) => {
  acc[key] = htmlAttributes;
  return acc;
}, {});
