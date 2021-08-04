class Message {
  constructor({ username, message }, dateFormatter) {
    this.username = username;
    this.message = message;
    this.dateFormatter = dateFormatter;
    this.date = this.getDate();
  }

  getDate() {
    return this.dateFormatter().format("h:mm a");
  }
}

module.exports = Message;
