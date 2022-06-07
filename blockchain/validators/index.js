class Validators {
  constructor() {
    this.list = [];
  }

  update(transaction) {
    if (transaction.output.amount >= 25 && transaction.output.to == "0") {
      this.list.push(transaction.input.from);
      console.log("New Validator:", transaction.input.from);
      return true;
    }
    return false;
  }
}

module.exports = Validators;
