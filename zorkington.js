// Program: zorkington.js
// Author:  Ron Pulcer
// Date:    March 5, 2019
// Version: Initial version (refactored)

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

// Constants for room names
const sidewalk = "182 Main St.";
const foyer    = "182 Main St. - Foyer";
const stairs   = "182 Main St. - Stairs";
let verbose = true;
let rooms = {};

// Valid paths through building can be derived from validExit and validEntry array properties
rooms[sidewalk] = {
    description: "You are standing on Main Street between Church and South Winooski.\n" +
                 "There is a door here. A keypad sits on the handle.\n" +
                 "On the door is a handwritten sign.",
    inventory: {},
    validExit: [foyer],
    validEntry: [foyer]
}
let currentRoom = sidewalk;

rooms[foyer] = {
    description: "You are in a foyer. Or maybe it's an antechamber. Or a vestibule. " +
                 "Or an entryway. Or an atrium. Or a narthex.\n" +
                 "But let's forget all that fancy flatlander vocabulary, and just call it a foyer. " +
                 "In Vermont, this is pronounced \"FO-ee-yurr\".\n" +
                 "A copy of Seven Days 'might be' lying in a corner.",
    inventory: {
        newspaper : "A copy of Seven Days, Vermont's Alt-Weekly",
    },
    validExit: [sidewalk, stairs],
    validEntry: [sidewalk, stairs]
}

let playerInventory = {};

function roomPrompt(theRoom) {
    let prompt = theRoom + "\n" + rooms[theRoom].description;
    console.log(prompt);
}

function sidewalkHandler(userReq) {
    if(userReq == "read sign") {
        console.log('The sign says "Welcome to Burlington Code Academy!\n' + 
        'Come on up to the third floor. If the door is locked, use the code 12345."');
    }
    else if(userReq == "take sign") {
        console.log("That would be selfish. How will other students find their way?");
    }
    else if(userReq == "blocked") {
        console.log("The door is locked. There is a keypad on the door handle.");
    }
    else if((userReq.startsWith("enter code") || userReq.startsWith("key in")) &&
             ! userReq.endsWith(" 12345")) {
        console.log("Bzzzzt! The door is still locked.");
    }
    else if(userReq == "enter code 12345" || userReq == "key in 12345") {
        console.log("Success! The door opens. " + 
        "You enter the foyer and the door shuts behind you.");
        // Entering new room
        currentRoom = foyer;
        roomPrompt(currentRoom);
    }
    else if(! userReq.startsWith("take") && ! userReq.startsWith("drop")) {
        console.log("Sorry, I don't know how to " + userReq + ".");
    }
}

function foyerHandler(userReq) {
    // TBD for later: user messages when in Foyer
    if(userReq == "leave building" || userReq == "outside") {
        console.log("Success! The door opens. " + 
        "You enter the sidewalk on Main St. and the door for BCA shuts behind you.");
        // Entering new room
        currentRoom = sidewalk;
        roomPrompt(currentRoom);
    }
    else if(! userReq.startsWith("take") && ! userReq.startsWith("drop")) {
        console.log("Sorry, I don't know how to " + userReq + ".");
    }
}

function takeInventoryHandler(userReq) { console.log("in function takeInventoryHandler()");
    if(userReq == "take paper" || userReq == "take seven days") {
        if(rooms[currentRoom].inventory.newspaper) {
            console.log("You pick up the paper and leaf through it looking for comics " +
                        "and ignoring the articles, just like everybody else does.");
            playerInventory["newspaper"] = "A copy of Seven Days, Vermont's Alt-Weekly";
            delete rooms[currentRoom].inventory["newspaper"];
        }
        else if(playerInventory.newspaper) {
            console.log("You already have the newspaper in your hand (inventory).")
        }
        else {
            console.log("Sorry, the current room does not contain the Seven Days newspaper.");
        }
    }
}

function dropInventoryHandler(userReq) { console.log("in function dropInventoryHandler()");
    if (userReq == "drop paper" || userReq == "drop seven days") {
        if(playerInventory.newspaper) {
            console.log("You are leaving the newspaper in this room: " + currentRoom + ".");
            rooms[currentRoom].inventory["newspaper"] = "A copy of Seven Days, Vermont's Alt-Weekly";
            delete playerInventory["newspaper"];
        }
        else {
            console.log("Sorry, you don't have Seven Days newspaper in your inventory.");
        }
    }
}

roomPrompt(currentRoom);

start();

async function start() {
    while(true) {
        // Get user command and process valid requests according to game state
        let answer = await ask("> ");
        answer = answer.toLowerCase().trim();

        if(answer == "exit" || answer == "quit") {
            process.exit(0);
        }

        if (answer == "verbose") {
            verbose = ! verbose;
            console.log("Toggling verbose mode to " + verbose);
        }

        // Inventory related handlers
        else if (answer == "inventory" || answer == "i" || answer == "take inventory") {
            console.log("You are carrying these item(s):");
            console.log(playerInventory)
        }

        // Two exceptions to the "take ..." rule for inventory purposes:
        // "take inventory" (from anywhere) and "take sign" (from sidewalk only).
        // By putting this "take [item]" block after "take inventory", it avoids the first exception
        else if(answer.startsWith("take") && answer != "take sign") {
            takeInventoryHandler(answer);
        }

        else if (answer.startsWith("drop")) {
            dropInventoryHandler(answer);
        }


        // Room handlers
        else if(currentRoom == sidewalk) {
            sidewalkHandler(answer);
        }

        else if(currentRoom == foyer) {
            foyerHandler(answer);
        }


        console.log("You are here: " + currentRoom);

        // For testing only: Show current game state
        if(verbose) {
            console.log(rooms);
            console.log(playerInventory);
        }

    // End of 'infinite' while loop
    }
}
