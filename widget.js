let totalMessages = 0,
  messagesLimit = 0,
  nickColor = "user",
  removeSelector,
  addition,
  customNickColor,
  channelName,
  provider,
  testMessage;
let animationIn = "bounceIn";
let animationOut = "bounceOut";
let hideAfter = 60;
let hideCommands = "no";
let ignoredUsers = [];

window.addEventListener("onWidgetLoad", function (obj) {
  const fieldData = obj.detail.fieldData;
  animationIn = fieldData.animationIn;
  animationOut = fieldData.animationOut;
  hideAfter = fieldData.hideAfter;
  messagesLimit = fieldData.messagesLimit;
  nickColor = fieldData.nickColor;
  customNickColor = fieldData.customNickColor;
  hideCommands = fieldData.hideCommands;
  channelName = obj.detail.channel.username;
  testMessage = fieldData.testMessage;
  fetch(
    "https://api.streamelements.com/kappa/v2/channels/" +
      obj.detail.channel.id +
      "/"
  )
    .then((response) => response.json())
    .then((profile) => {
      provider = profile.provider;
    });

  ignoredUsers = fieldData.ignoredUsers
    .toLowerCase()
    .replace(" ", "")
    .split(",");
});

window.addEventListener("onEventReceived", (obj) => {
  const { listener, event } = obj.detail;
  switch (listener) {
    case "message":
      onMessage(event);
      break;
    case "raid-latest":
      onRaid(event);
      break;
    case "delete-message":
      deleteMessage(event.msgId);
      break;
    case "delete-messages":
      deleteMessages(event.userId);
      break;
    case "event:test":
      onTestButton(event);
      break;
    default:
      return;
  }
});

function onMessage(event) {
  const { msgId, userId } = event;
  const { displayName, isAction, text } = event.data;
  if (isAction) return;
  const element = $.parseHTML(`
    <div data-sender="${userId}" data-msgid="${msgId}" class="message-row {animationIn} animated">
      <div class="chatWrapper">
        <div class="square"></div>
        <div class="user-message">
          <div class="msgDiv">${text}</div>
        </div>
        <div class="squares">
            <svg width="64" height="48" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="Pattern" x="0" y="0" width=".20" height=".25">
                    <rect x="0" y="0" width="4" height="4"/>
                    </pattern>
                </defs>
                <rect fill="url(#Pattern)" width="64" height="48"/>
            </svg>
        </div>
        <div class="user-box">
          <div class="nameDiv" style="color: white">${displayName}</div>
        </div>
      </div>
    </div>`);
  $(element).prependTo(".main-container");
}

function onTestButton(event) {
  let emulated = new CustomEvent("onEventReceived", {
    detail: {
      listener: "message",
      event: {
        service: "twitch",
        data: {
          time: Date.now(),
          tags: {
            "badge-info": "",
            badges: "moderator/1,partner/1",
            color: "#5B99FF",
            "display-name": "StreamElements",
            emotes: "25:46-50",
            flags: "",
            id: "43285909-412c-4eee-b80d-89f72ba53142",
            mod: "1",
            "room-id": "85827806",
            subscriber: "0",
            "tmi-sent-ts": "1579444549265",
            turbo: "0",
            "user-id": "100135110",
            "user-type": "mod",
          },
          nick: channelName,
          userId: "100135110",
          displayName: channelName,
          displayColor: customNickColor,
          badges: [
            {
              type: "partner",
              version: "1",
              url: "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3",
              description: "Verified",
            },
          ],
          channel: channelName,
          text: testMessage,
          isAction: !1,
          emotes: [
            {
              type: "twitch",
              name: "Kappa",
              id: "25",
              gif: !1,
              urls: {
                1: "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
                2: "https://static-cdn.jtvnw.net/emoticons/v1/25/2.0",
                4: "https://static-cdn.jtvnw.net/emoticons/v1/25/3.0",
              },
              start: 46,
              end: 50,
            },
          ],
          msgId: "43285909-412c-4eee-b80d-89f72ba53142",
        },
        renderedText:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer aliquam dapibus varius.",
      },
    },
  });
  window.dispatchEvent(emulated);
}