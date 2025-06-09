class Calculator {
  constructor(textInput, buttonParent) {
    this.input = textInput;
    this.buttonParent = buttonParent;

    this.onClickBound = this.onClick.bind(this);
  }

  run() {
    this.buttonParent.addEventListener("click", this.onClickBound);
  }

  delete() {
    const history = document.querySelector(".current_equal-history");

    if (history) {
      history.remove();
    }

    const value = this.input.value;

    if (!value) {
      return;
    }

    this.input.value = value.slice(0, value.length - 1);
  }

  clear() {
    if (this.input.value) {
      this.input.value = "";
      const history = document.querySelector(".current_equal-history");
      history.remove();
    }

    return;
  }

  showHistory() {
    console.log("showHistory");
  }

  calculate() {
    const value = this.input.value;

    this.input.value = "";
  }

  displayOnScreen(newValue) {
    const signs = ["+", "-", "×", "%", "^", "÷", "."];

    const prepareForCalculations = () => {
      const value = this.input.value;
      const lastInput = value[value.length - 1];

      if (lastInput == ".") {
        this.input.value = value + 0;
      } else if (signs.slice(0, signs.length - 1).includes(lastInput)) {
        this.input.value = value.slice(0, value.length - 1);
      }

      const history = `<span class='current_equal-history'>${this.input.value}</span>`;
      const screen = document.querySelector(".calculator_header");

      screen.insertAdjacentHTML("beforeend", history);

      this.calculate(this.input.value);
    };

    // don't move further if the it's = and the screen is empty
    // or if it's = and the input on the screen starts with = (shows the total result)
    // if not the above, then prepareForCalculations.
    if (newValue == "=" && this.input.value == "") {
      return;
    } else if (newValue == "=" && /^=/.test(this.input.value)) {
      return;
    } else if (newValue == "=") {
      prepareForCalculations();
    }

    // stop the improper adding of  Dot sign (eg. 12.3.5);
    if (newValue == "." && /\d+[.]\d+$/.test(this.input.value)) {
      return;
    }

    //   two signs can not be displayed together, replace old with the new sign.
    const replaceOldSignWithNewSign = () => {
      const value = this.input.value;

      if (signs.includes(value[value.length - 1])) {
        this.input.value = value.slice(0, value.length - 1);
      }
    };

    if (signs.includes(newValue)) {
      //   if sign is the first input on the screen add zero before the sign
      if (this.input.value.length == 0) {
        this.input.value = 0 + this.input.value;
      }

      replaceOldSignWithNewSign();
    }

    this.input.value = this.input.value + newValue;
  }

  onClick(event) {
    const button = event.target.closest("button");

    if (button == null) return;

    if (button.className == "delete") {
      this.delete();
      return;
    } else if (button.className == "clear") {
      this.clear();
      return;
    } else if (button.textContent == "History") {
      this.showHistory();
      return;
    }

    this.displayOnScreen(button.textContent);
  }
}

const textInput = document.querySelector(".input");
const calculator = document.querySelector(".content");

const calculatorObj = new Calculator(textInput, calculator);

calculatorObj.run();
