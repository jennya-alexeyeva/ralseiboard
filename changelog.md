### 10/08/21
Set up Ralseiboard today! Didn't write any of my own commands, just followed the tutorial and thought about what I want to do in the 
future.

### 10/09/21
Deleted the tutorial commands and wrote some of my own. hug.js is just the user info commands with a twist. textbox.js was a lot easier
than I thought it would be; I originally had a Python script written before I realized that the URL of each image can easily be built if
you have all the info. I also fixed yummycakes.js from yesterday to have the buttons disabled once you press them after I saw people
abuse them when I deployed the bot to show it off.

### 10/10/21
Today I started work on the commands that will be the core of my dashboard with /mostactive. This took over 15 minutes when I ran it on 
the main server, which made me realize that I need a SQL database for each server to store this information (this is what Jake does for
his bot). I'll have to look into how to make that. I'll also look into writing a script similar to deploy-commands to initialize this
database and fill it with data once, so that future updates just increment the amount. For the script, I'll have to look into how to keep 
it running without repeatedly sending a message, because when I tried to delete the message sending feature, it would just fall asleep
occasionally, leading to me having to press enter to restart it (and then it restarts from the beginning lol). There are probably ways to
keep bots awake in these kinds of situations, maybe a keepawake ping? Not sure. Anyway, as it is, the command is unusable, but there is a
good foundation for my Discord dashboard of dreams.
