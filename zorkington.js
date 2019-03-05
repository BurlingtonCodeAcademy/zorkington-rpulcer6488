// Program: zork.js
// Author:  Ron Pulcer
// Date:    March 4, 2019
// Version: Initial version

const readline = require('readline');

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

let rooms = {};

rooms["182 Main St."] = {
    description: "You are standing on Main Street between Church and South Winooski.\n" +
                 "There is a door here. A keypad sits on the handle.\n" +
                 "On the door is a handwritten sign.",
    inventory: {}
}
let currentRoom = "182 Main St."

rooms["182 Main St. - Foyer"] = {
    description: "You are in a foyer. Or maybe it's an antechamber. Or a vestibule. " +
                 "Or an entryway. Or an atrium. Or a narthex.\n" +
                 "But let's forget all that fancy flatlander vocabulary, and just call it a foyer. " +
                 "In Vermont, this is pronounced \"FO-ee-yurr\".\n" +
                 "A copy of Seven Days 'might be' lying in a corner.",
    inventory: {
        newspaper : "A copy of Seven Days, Vermont's Alt-Weekly"
    }
}

let playerInventory = {};

function roomPrompt(theRoom) {
    let prompt = theRoom + "\n" + rooms[theRoom].description;
    console.log(prompt);
}
roomPrompt(currentRoom);

start();

async function start() {
    while(true) {
        let answer = await ask("> ");
        answer = answer.toLowerCase().trim();

        if(answer == "exit" || answer == "quit") {
            process.exit(0);
        }

        else if(answer == "take paper" || answer == "take seven days") {
            if(rooms[currentRoom].inventory.newspaper) {
                console.log("You pick up the paper and leaf through it looking for comics " +
                            "and ignoring the articles, just like everybody else does.");
                playerInventory["newspaper"] = "A copy of Seven Days, Vermont's Alt-Weekly";
                delete rooms[currentRoom].inventory["newspaper"];
            }
            else {
                console.log("Sorry, the current room does not contain the Seven Days newspaper.");
            }
        }

        else if (answer == "drop paper" || answer == "drop seven days") {
            if(playerInventory.newspaper) {
                console.log("You are leaving the newspaper in this room: " + currentRoom + ".");
                rooms[currentRoom].inventory["newspaper"] = "A copy of Seven Days, Vermont's Alt-Weekly";
                delete playerInventory["newspaper"];
            }
            else {
                console.log("Sorry, you don't have Seven Days newspaper in your inventory.");
            }
    }

        else if (answer == "inventory" || answer == "i" || answer == "take inventory") {
            console.log("You are carrying these item(s):");
            console.log(playerInventory)
        }
    
        else if(currentRoom == "182 Main St.") {
            if(answer == "read sign") {
                console.log('The sign says "Welcome to Burlington Code Academy!\n' + 
                'Come on up to the third floor. If the door is locked, use the code 12345."');
            }
            else if(answer == "take sign") {
                console.log("That would be selfish. How will other students find their way?");
            }
            else if(answer == "blocked") {
                console.log("The door is locked. There is a keypad on the door handle.");
            }
            else if((answer.startsWith("enter code") || answer.startsWith("key in")) &&
                     ! answer.endsWith(" 12345")) {
                console.log("Bzzzzt! The door is still locked.");
            }
            else if(answer == "enter code 12345" || answer == "key in 12345") {
                console.log("Success! The door opens. " + 
                "You enter the foyer and the door shuts behind you.");
                // Entering new room
                currentRoom = "182 Main St. - Foyer";
                roomPrompt(currentRoom);
            }
            else {
                console.log("Sorry, I don't know how to " + answer + ".");
            }
        }

        else if(currentRoom == "182 Main St. - Foyer") {
            // TBD for later user messages
        }

        console.log("You are here: " + currentRoom);

        // For testing only
        console.log(rooms);
        console.log(playerInventory);
    }
}
