class Calculator {
  constructor(textInput, buttonParent) {
    this.input = textInput;
    this.buttonParent = buttonParent;

    this.onClickBound = this.onClick.bind(this);
    this.inputBound = this.onInput.bind(this);
  }

  add(val1, val2) {
    return val1 + val2;
  }

  subtrate(val1, val2) {
    return val1 - val2;
  }

  divide(val1, val2) {
    return val1 / val2;
  }

  multiple(val1, val2) {
    return val1 * val2;
  }

  power(base, exp) {
    return Math.pow(base, exp);
  }

  getSubtration(value) {
    value = value.match(/\d+\.\d+|\d+/g);
    return this.subtrate(Number(value[0]), Number(value[1]));
  }

  getDivision(value) {
    value = value.match(/\d+\.\d+|\d+/g);
    return this.divide(Number(value[0]), Number(value[1]));
  }

  getMultiplication(value) {
    value = value.match(/\d+\.\d+|\d+/g);
    return this.multiple(Number(value[0]), Number(value[1]));
  }

  getAdditionRegEx(value) {
    value = value.match(/\d+\.\d+|\d+/g);
    return this.add(Number(value[0]), Number(value[1]));
  }

  getPercentage(value) {
    const number = Number(value.slice(0, value.length - 1));

    if (typeof number != "number") return;

    return (number * 1) / 100;
  }

  getRaiseToPower(value) {
    value = value.match(/\d+\.\d+|\d+/g);
    return this.power(Number(value[0]), Number(value[1]));
  }

  run() {
    this.buttonParent.addEventListener("click", this.onClickBound);
    this.input.addEventListener("input", this.inputBound);
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

  calculate(input) {
    let value = input;

    const solve = () => {
      const mathsWork = (mathsRegEx, mathsFunction) => {
        const solution = this[mathsFunction](value.match(mathsRegEx)[0]);
        value = value.replace(mathsRegEx, `${solution}`);
        solve();
      };

      const raiseToPowerRegEx =
        /\d+\.\d+\^\d+\.\d+|\d+\.\d+\^\d+|\d+\^\d+\.\d+|\d+\^\d+/;
      const divisionRegEx =
        /\d+\.\d+÷\d+\.\d+|\d+\.\d+÷\d+|\d+÷\d+\.\d+|\d+÷\d+/;
      const multiplicationRegEx =
        /\d+\.\d+\×\d+\.\d+|\d+\.\d+\×\d+|\d+\×\d+\.\d+|\d+\×\d+/;
      const additionRegEx =
        /\d+\.\d+\+\d+\.\d+|\d+\.\d+\+\d+|\d+\+\d+\.\d+|\d+\+\d+/;

      const subtrationRegEx =
        /\d+\.\d+\-\d+\.\d+|\d+\.\d+\-\d+|\d+\-\d+\.\d+|\d+\-\d+/;

      if (raiseToPowerRegEx.test(value)) {
        mathsWork(raiseToPowerRegEx, "getRaiseToPower");
      } else if (divisionRegEx.test(value)) {
        mathsWork(divisionRegEx, "getDivision");
      } else if (multiplicationRegEx.test(value)) {
        mathsWork(multiplicationRegEx, "getMultiplication");
      } else if (additionRegEx.test(value)) {
        mathsWork(additionRegEx, "getAdditionRegEx");
      } else if (subtrationRegEx.test(value)) {
        mathsWork(subtrationRegEx, "getSubtration");
      }
    };

    solve();

    this.input.value = "";
    this.input.value = "=" + value;
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
      this.input.value = "";
      newValue = "";
      const screen = document.querySelector(".calculator_header");

      screen.insertAdjacentHTML("beforeend", history);

      this.calculate(value);
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

    // calling onInput method to check if there is a percent value
    // so that is can get the result.
    this.onInput();
  }

  onInput() {
    const value = this.input.value;
    let percent = value.match(/\d+%|\d+[.]\d+%/);

    if (percent) {
      percent = this.getPercentage(percent[0]);
      this.input.value = this.input.value.replace(
        /\d+%|\d+[.]\d+%/,
        `${percent}`
      );
    }
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
