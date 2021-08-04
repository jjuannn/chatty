// socket = this connection
const socket = io();

const $username_input = document.querySelector("#username");
const $message_input = document.querySelector("#message");
const $submit_button = document.querySelector("#submit-button");
const $messages_container = document.querySelector("#messages");
const $user_typing = document.querySelector("#user-typing");
const $chat_form = document.querySelector("#chat_form");
// listening for "new_message"
socket.on("new_message", ({ username, message, date }) => {
  $user_typing.innerHTML = "";
  $messages_container.innerHTML += `
    <div class="message">
          <strong class="message-date">${date.toUpperCase()}</strong>
          <p class="message-username">
            ${username}: <span class="message-content">${message}</span>
          </p>
        </div>
  `;
  $messages_container.scrollTop = $messages_container.scrollHeight;
});

socket.on("user_typing", (data) => {
  $user_typing.innerHTML = "";
  const userTyping = data;
  $user_typing.innerHTML += `
    <p class="message-username">
      ${userTyping} <span class="message-content">is typing...</span>
    </p>
  `;
});

socket.on("stop_typing", () => {
  $user_typing.innerHTML = "";
});

$message_input.addEventListener("keypress", () => {
  const userTyping = $username_input.value ? $username_input.value : "Someone";
  socket.emit("user_typing", userTyping);
});

$message_input.addEventListener("focusout", () => {
  socket.emit("stop_typing");
});

$chat_form.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValues = {
    username: $username_input.value,
    message: $message_input.value,
  };
  // emits "new_message" to the server
  socket.emit("new_message", inputValues);
  $message_input.value = "";
});
