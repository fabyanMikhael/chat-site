// LOADING BOT
const { Bot } = require("./bot.js");
// DONE!

function Message(User, Message){
  return {text: Message, id: User.id};
}

class Chat {
    constructor(io) {
      this.history = [];
      this.io = io;
      this.Users = {server : {name : 'Arrodes', avatar: 'https://cdn.discordapp.com/avatars/783510984039858178/6f1b5b0f79d3ecb51487761aa5908709.webp?size=1024'}};
      this.bot = new Bot(this);
    }
    
    OnMessage(User, msg){
      this.AddToHistory( Message(User, msg) );
      this.io.emit('chat message', msg, User.id);
      this.bot.OnMessage(User, msg);
    }

    OnRequestUser(Requester, UserId){
      if (UserId in this.Users){
        Requester.emit('add user', UserId, this.Users[UserId]);
      }
    }

    SetUsername(User, NewName){
      // check if name is empty after trimming
      // if it is empty, generate "base user" and random numbers at the end
      if (NewName == "null" || NewName == null || NewName.trim() == ""){
        NewName = "base user";
        NewName += " " + Math.floor(Math.random()*100);
      }


      this.Users[User.id].name = NewName;
      this.io.emit('add user', User.id, this.Users[User.id]);
    }

    SetAvatar(User, avatar){
      this.Users[User.id].avatar = avatar;
      this.io.emit('add user', User.id, this.Users[User.id]);
    }


    OnUserConnect(User){
      // Attaching Helper Methods to the User
      User.SendMessage = (msg) => {
        this.io.emit("chat message", msg, "server");
        this.AddToHistory( Message({id: null}, msg) );
      };
      User.Reply = (msg) => {User.emit("chat message", msg, "server")};
      User.ClearMessages = () => {
        User.emit("clear messages");
      };

      User.UpdateCommandNames = (CommandNames) => {
        User.emit("update command names", CommandNames);
      };
      // DONE!

      // Sending User any previous messages
      // this.SendHistoryTo(User); //ill consider it
      // DONE!

      // need to connect this user to this particular chat now!
      User.on('chat message', (msg) => {
        this.OnMessage(User, msg);
      });
      User.on('request user', (UserId) => {
        this.OnRequestUser(User, UserId);
      });
      User.on('set username', (NewName) => {
        this.SetUsername(User, NewName);
      });
      User.on('set avatar', (avatar) => {
        this.SetAvatar(User, avatar);
      });
      // DONE!

      // Gotta add user to list of users so i can keep track of their information like name and avatar
      this.Users[User.id] = { name : "base user", avatar : "https://d3h0owdjgzys62.cloudfront.net/images/6745/live_cover_art/thumb2x/pattern__2_.png"};
      User.emit('add user', User.id, this.Users[User.id]);
      // DONE!

      this.bot.OnUserConnect(User); // letting the bot do what it wants now when user connects
    }

    SendHistoryTo(User){
      this.history.forEach(
        msg => {
          User.emit("chat message", msg.text, msg.id);
        }
      );
    }

    AddToHistory(msg){
      this.history.push(msg);
      if (this.history.length > 50 ){this.history.shift();}
    }

  }

exports.Chat = Chat