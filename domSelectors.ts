const userOptions = document.querySelector("div[id='userOptions']");

// Use the radio button 'change' event to update the state tracking the ticked radio button.
// Then use that to determine which simulation mode to use.
export const synchronous = document.querySelector("input[id='synchronous']");
export const asynchronous = document.querySelector("input[id='asynchronous']");

export const startButton = document.querySelector(
  "button[id='startSimulationButton']"
);
export const stopButton = document.querySelector(
  "button[id='stopSimulationButton']"
);

export const presets: HTMLSelectElement = document.querySelector(
  "select[id='presets']"
);

export const animationSpeed: HTMLInputElement = document.querySelector(
  "input[id='animationSpeed']"
);

export const animationSpeedLabel: HTMLLabelElement = document.querySelector(
    "label[for='animationSpeed']"
);

export const colourTheme: HTMLButtonElement = document.querySelector(
    "button[id='colourThemeButton']"
);
