# HW_Schedule-App
In this assignment, I created a tv schedule application that incorporates Firebase to host start and end data. The app retrieves and manipulates this information with Moment.js. This website provides up-to-date information about various tv shows, namely their start times and how many minutes remain until their next showing.

## Live Link (GitHub Pages)
- https://mz1387.github.io/HW_Schedule-App/


## Requirements

1. Input fields for show name, channel, first showing (in military time) and frequency (in minutes).
2. Code this app to calculate when the next show will start; this should be relative to the current time.
3. Users from many different machines must be able to view same show times.


## Concepts Implemented

- Dynamically updated HTML powered by Javascript and jQuery
- Manipulated HTML elements based on user input
- Set, retrieved, updated and removed data from a database
- Retrieved and manipulated time with Moment.js


## Code Explanation

- A user can input the name of a show, the channel it's on, its start time and its frequency to see all future showings of that program.
- When a user submits the data for a particular show that data is sent and set inside of a database and then used to create a new table row of information that the user can see.
- When the data is retrieved from the database it manipulates existing data with Moment.js to calculate a shows next showing and how many minutes remain until that showing.
- A user can then add another show or edit/remove existing data in the table.
