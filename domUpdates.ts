export function updateDOM(e: string, val: any): void {
  function updateTextContent(e: Element, text: string) {
    e.textContent = text;
  }
  function updateLastElementChild(e: Element, text: string) {
    let lastChild = e.lastElementChild;
    if (!lastChild) return;
    lastChild.textContent = text;
  }
  const elements = {
    trialsTotal: document.querySelector("b[id='trials-total']"),
    trialsCompleted: document.querySelector("b[id='trials-completed']"),
    mean: document.querySelector("p[id='mean']"),
    stdDev: document.querySelector("p[id='stdDev']"),
  };
  const table = {
    trialsTotal: updateTextContent,
    trialsCompleted: updateTextContent,
    trials: updateLastElementChild,
    mean: updateLastElementChild,
    stdDev: updateLastElementChild,
  };
  return table[e](elements[e], String(val));
}
