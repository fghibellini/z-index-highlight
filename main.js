
// highlightZIndexCtxs()
// ---------------------
// finds scans all the stylesheets applied to the document
// and finds the rules that set the CSS property z-index.
// It then highlights all the elements affected by those
// rules and displays the z-index number on top of the element.

const concatAll = xxs => [].concat(...xxs);

const zIndexSelectors = (document) => {
  const styleSheets = Array.from(document.styleSheets);
  const zIndexSelectors = concatAll(styleSheets.map(styleSheet => {
    const rules = Array.from(styleSheet.rules);
    return rules
        .filter(rule => {
          if (rule.type !== CSSRule.STYLE_RULE) return false; // TODO rules are a tree; traverse it!
          return Array.from(rule.style).some(s => s === 'z-index');
        })
        .map(rule => ({ selector: rule.selectorText, zIndex: rule.style.zIndex }));
  }));
  return zIndexSelectors;
}

const addCSSRule = (rule, document) => {
  const element = document.createElement('style');
  document.head.appendChild(element);
  const styleSheet = Array.from(document.styleSheets).find(ss => ss.ownerNode === element);
  styleSheet.insertRule(rule)
}

const highlightZIndexCtxs = document => {
  const selectors = zIndexSelectors(document);

  const normalSelectors = selectors.map(s => s.selector).join(', ');
  addCSSRule(`${normalSelectors} { border: 2px dashed red !important; }`, document);

  const beforeSelectors = selectors.filter(s => !s.selector.includes(':')).map(s => ({ selector: `${s.selector}::before`, zIndex: s.zIndex }));
  beforeSelectors.forEach(s => addCSSRule(`${s.selector} { content: '${s.zIndex}'; color: red; font-weight: bold; position: absolute; left: 0.3em; top: 0.1em; }`, document));
}

highlightZIndexCtxs(document);
