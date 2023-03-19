  const elements = {
    trialsTotal: document.querySelector("b[id='trials-total']"),
    trialsCompleted: document.querySelector("b[id='trials-completed']"),
    mean: document.querySelector("p[id='mean']"),
    stdDev: document.querySelector("p[id='stdDev']"),
    startButton: document.querySelector("button[id='startSimulationButton']"), 
    stopButton: document.querySelector("button[id='stopSimulationButton']"),
    colourTheme: document.querySelector("button[id='colourThemeButton']"),
  };

  const table = {
    updateLastChildText: updateLastChildTextContent,
    updateText: updateTextContent,
    disableButton: toggleButton,
  };

  function toggleButton(e: Element, disable: boolean) {
      if (disable) {
          e.setAttribute("disabled", "true");
      } else {
          e.removeAttribute("disabled");
      }
  }
  function updateTextContent(e: Element, text: any) {
    if (typeof text === "string") {
        e.textContent = text;
        return;
    } 
    e.textContent = String(text);
  }
  function updateLastChildTextContent(e: Element, text: string) {
    let lastChild = e.lastElementChild;
    if (!lastChild) return;
    updateTextContent(lastChild, text);
  }

export function updateDOM(args: any[]): void {
    if (args.length === 3) {
      const [e, action, val] = args;
      return table[action](elements[e], val); 
    }
}

