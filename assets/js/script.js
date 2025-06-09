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
    const value = this.input.value;

    if (!value) {
      return;
    }

    this.input.value = value.slice(0, value.length - 1);
  }

  clear() {
    if (this.input.value) {
      this.input.value = "";
    }

    return;
  }

  showHistory() {
    console.log("showHistory");
  }

  displayOnScreen(newValue) {
    // stop the improper adding of  Dot sign (eg. 12.3.5);
    if (newValue == "." && /\d+[.]\d+$/.test(this.input.value)) {
      return;
    }

    const signs = ["+", "-", "×", "%", "^", "÷", "."];

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
