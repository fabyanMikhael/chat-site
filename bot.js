class Bot{
    constructor(chat){
        this.Chat = chat;
        this.Users = chat.Users;
        this.Prefix = "!";
        this.OnMessageListeners = [];
        this.Commands = [
            function help(User, _){
                let help = "Available Commands: ";
                this.Commands.forEach(
                    command =>{
                        help += "[" + this.Prefix + command.name + "]" + "  ";
                    }
                );
                User.Reply(help);
                },
            function rand(User, _){ User.SendMessage(`🤔...I choose number ${ Math.floor(Math.random() * 100 + 1 ) } ! 😄`);},,
        ];
    }

    AddMessageListener(listener){
        this.OnMessageListeners.push(listener);
    }

    OnUserConnect(User) {
        //User.ClearMessages();
        User.Reply("Welcome !"); //send them a welcome message

        //wait in case they set a new username
        setTimeout(() => {
            User.SendMessage( "User " + this.Users[User.id].name + " has joined!");
        }, 200);

        // sending the names of the current commands to the user
        let commandnames = [];
        this.Commands.forEach(
            command =>{
                commandnames.push(command.name);
            }
        );
        User.UpdateCommandNames(commandnames);
        
    }

    OnMessage(User, Message) {
        // go through each of the listeners and call them
        this.OnMessageListeners.forEach(
            listener =>{
                listener(User, Message);
            }
        );
        
        Message = Message.toLowerCase();
        if(Message.startsWith(this.Prefix)){
            this.processCommand(User, Message.slice(1));
        }
    }

    processCommand(User, Message){
        let CommandFound = false;
        this.Commands.forEach(
            command =>{
                if ( Message.startsWith(command.name) ){
                    command.call(this,User, Message.slice(command.name.length));
                    CommandFound = true;
                    return;
                }
            }
        );
        if (CommandFound){return;}
        User.Reply(`Command ${Message.split(" ")[0]} does not exist. ❌`);
    }

}

exports.Bot = Bot