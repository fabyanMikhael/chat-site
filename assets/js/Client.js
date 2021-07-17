var socket = io();
var CLIENT_ID = null;
var MsgSendButton = $( "#MsgSendButton" );
var messages = document.getElementById('messages');
var form = document.getElementById('ActionBar');
var input = document.getElementById('MsgInput');
var emoji_button = document.getElementById('emoji-button');
var emoji_picker = document.getElementById('emoji-picker');

// EMOJI PICKER
document.querySelector('emoji-picker')
  .addEventListener('emoji-click', event => input.value += ' ' + event.detail.unicode);
  emoji_button.addEventListener('click', _ => {
    emoji_picker.style.display = emoji_picker.style.display == "none" ? "" : "none";
  });
//

var Users = {}
var CommandNames = [];

let SendOnEnter = true;

function GetUserInfo(UserId){
  if (! (UserId in Users) ){
    socket.emit('request user', UserId);
    return null;
  }

  return Users[UserId];
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function SendMessage(msg){
  socket.emit('chat message', msg);
}

function AppendMessageToHistory(msg, UserId){
  if (UserId == null){return;}
  let UserInfo = GetUserInfo(UserId);
  if(UserInfo == null){
    sleep(0.5).then(() => AppendMessageToHistory(msg, UserId));
    return;
  }

  let item = document.createElement('li');
  let UserImg = document.createElement('img');
  UserImg.classList.add('MessageAvatar');
  UserImg.setAttribute('src', UserInfo.avatar);
  item.appendChild(UserImg);
  let Username = document.createElement('span');
  Username.classList.add('Username');
  Username.textContent = UserInfo.name;
  item.appendChild(Username);
  item.appendChild(document.createElement('br'));
  item.appendChild(document.createElement('br'));
  item.appendChild(document.createElement('br'));

  item.innerHTML += markdown.toHTML(msg);
  if (UserId == socket.id){
    item.style.borderColor = "rgb(255,80,80)";
  }
  else if(UserId == 'server'){
    item.style.borderColor = "rgb(13,182,255)";
    item.style.fontWeight = "bolder";
    item.style.textShadow = "2px 2px black";
  }

  messages.appendChild(item);
  //window.scrollTo(0, document.body.scrollHeight);
  item.scrollIntoView();
  
  item.innerHTML = item.innerHTML.replace(/\\n/g, '<br/>');
  item.querySelectorAll('code').forEach(el => {
    //highlight each
    hljs.highlightElement(el);
  });
  // replace all [] with a link
  item.innerHTML = item.innerHTML.replace(/\[!([^\]]+)\]/g, `<a onclick="SetInput('!$1')">!$1</a>`);
}

function SendMsgFunc(e) {
  e.preventDefault();
  if (input.value && socket.id != null) {
    SendMessage(input.value);
    input.value = '';
  }
}

function AddUser(UserId, UserInfo){
  Users[UserId] = UserInfo;
}

function SetInput(inp){
  input.value = inp;
}

form.addEventListener('submit', SendMsgFunc);
MsgSendButton.on( "click", SendMsgFunc);
socket.on('chat message', AppendMessageToHistory);
socket.on('add user', AddUser);
socket.on('connect', () => {
  socket.emit("set username", sessionStorage.getItem("Username"));
  socket.emit("set avatar", sessionStorage.getItem("Avatar"));
  MsgSendButton.prop('disabled', false);
});
socket.on('clear messages', () => {
  messages.innerHTML = '';
});

socket.on('update command names', (NewCommandNames) => {
  CommandNames = NewCommandNames;
  }
);
