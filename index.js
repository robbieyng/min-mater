#! /usr/bin/env node
const readline = require("readline");
const notifier = require("node-notifier");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("close", () => {
  process.exit(0);
});

console.log("\n🍅 Min Mater\n------------");

const taskDuration = 25;
const breakDuration = 5;
const notifyConfig = { sound: "Hero", closeLabel: "No", actions: "Yes" };

function handleNotification(duration) {
  if (duration === 25) {
    notifier.notify(
      {
        title: "Task Over",
        message: "Start 5 minute break?",
        ...notifyConfig,
      },
      (err, response, metadata) => {
        if (metadata.activationValue === "Yes") {
          process.stdout.clearLine();
          process.stdout.write("Starting break...\n");
          handleTimer(breakDuration);
        } else {
          handleTimer(taskDuration);
        }
      }
    );
  } else {
    notifier.notify(
      {
        title: "Break Over",
        message: "Start new pomodoro?",
        ...notifyConfig,
      },
      (err, response, metadata) => {
        if (metadata.activationValue === "Yes") {
          process.stdout.clearLine();
          process.stdout.write("Starting new pomodoro...\n");
          handleTimer(taskDuration);
        } else {
          rl.close();
        }
      }
    );
  }
}

function handleTimer(duration) {
  let end = new Date();
  end.setMinutes(end.getMinutes() + duration);

  let timer = setInterval(() => {
    let current = new Date();
    if (current > end) {
      clearInterval(timer);
      process.stdout.clearLine();
      process.stdout.write(" ⏰ Time is up ⏰\n");
      handleNotification(duration);
    }
    let diff = end - current;
    let minutesDiff = Math.ceil(diff / 1000 / 60);
    process.stdout.clearLine();
    process.stdout.write(" ⏱️  " + minutesDiff + " minutes" + " remaining.\r");
  }, 1000);
}

const regex = /^$|y/i; // empty or case insensitve Y
rl.question("Start? (Y/n) ", (answer) => {
  if (regex.test(answer)) {
    handleTimer(taskDuration);
  } else {
    rl.close();
  }
});
