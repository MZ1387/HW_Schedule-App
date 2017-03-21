$(document).ready(function() {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDidLwAMXOqYHFyRSMOeqNXGzkh4uBAJUM",
        authDomain: "schedule-app-f58ff.firebaseapp.com",
        databaseURL: "https://schedule-app-f58ff.firebaseio.com",
        storageBucket: "schedule-app-f58ff.appspot.com",
        messagingSenderId: "1030077270966"
    };

    firebase.initializeApp(config);

    var database = firebase.database();

    // Initial Values
    var showName = "";
    var channel = "";
    var firstShowing = "";
    var frequency = "";

    // capitalize the show name when input
    function capitalize(showName) {

        var capitalized = showName.toLowerCase().split(' ');

        for (var i = 0; i < capitalized.length; i++) {
            capitalized[i] = capitalized[i].charAt(0).toUpperCase() + capitalized[i].substring(1);
        }
        return showName = capitalized.join(' ');
    }

    // create a new table row when a show is entered
    function newShow(showKey, showName, channel, firstShowing, frequency) {

        // manipulate firstShowing and frequency values to set future showings and minutes untill next showing using moment js
        var now = moment();
        var nextShowing = moment(firstShowing, "HH:mm").add(parseInt(frequency), 'm').format("HH:mm");

        while (moment(nextShowing, "HH:mm").isBefore(now)) {
            nextShowing = moment(nextShowing, "HH:mm").add(parseInt(frequency), 'm').format("HH:mm");
        }

        var minutesAway = moment(nextShowing, "HH:mm").subtract(now.format("H"), "H").subtract(now.format("m"), "m").format("m");

        // sets the values for the table row cells
        var newRow = $("<tr>");
        var showTableCell = $("<td>").text(showName).attr("data-showName", showKey);
        var channelTableCell = $("<td>").text(channel).attr("data-channel", showKey);
        var frequencyTableCell = $("<td>").text(frequency).attr("data-frequency", showKey);
        var nextShowingTableCell = $("<td>").text(nextShowing);
        var minutesAwayTableCell = $("<td>").text(minutesAway);
        var editTableCell = $("<td>");
        // key is put inside edit and remove icons as references when they're clicked
        var editIcon = $("<i>").attr({
            "data-showKey": showKey,
            "class": "glyphicon glyphicon-edit",
            "data-toggle": "modal",
            "data-target": "#editModal"
        });
        var removeTableCell = $("<td>");
        var removeIcon = $("<i>").attr({
            "id": showKey,
            "class": "glyphicon glyphicon-remove"
        });
        //icons added to table cell
        editTableCell.append(editIcon);
        removeTableCell.append(removeIcon);
        // appends created table cells new table row
        newRow.append(showTableCell);
        newRow.append(channelTableCell);
        newRow.append(frequencyTableCell);
        newRow.append(nextShowingTableCell);
        newRow.append(minutesAwayTableCell);
        newRow.append(editTableCell);
        newRow.append(removeTableCell);
        // appends new row to the watchlist table
        $("#shows-table").append(newRow);
        $("#" + showKey).on("click", removeRow);
    }

    // removes value based on the key of the row
    function removeRow() {
        database.ref().child($(this).attr("id")).remove();
    }

    // function childAdded() {
        $("#shows-table").html("");
        // when child is added values are taken from snapshot to create a new row
        database.ref().on("child_added", function(snapshot) {

            var showKey = snapshot.getKey();
            var showName = snapshot.val().showName;
            var channel = snapshot.val().channel;
            var firstShowing = snapshot.val().firstShowing;
            var frequency = snapshot.val().frequency;

            newShow(showKey, showName, channel, firstShowing, frequency);

        }, function(errorObject) {
            console.log("ERROR:", errorObject.code);
        });
    // }

    // function childRemoved() {
        // when a child has been removed remove the table row with that key
        database.ref().on("child_removed", function(snapshot) {

            $("#" + snapshot.getKey()).closest('tr').remove();

        }, function(errorObject) {
            console.log("ERROR:", errorObject.code);
        });

    // }


    // when a child has been changed update the shows values on the front end
    database.ref().on("child_changed", function(snapshot) {

        $("#" + snapshot.getKey()).closest('tr').remove();

        var showKey = snapshot.getKey();
        var showName = snapshot.val().showName;
        var channel = snapshot.val().channel;
        var firstShowing = snapshot.val().firstShowing;
        var frequency = snapshot.val().frequency;

        newShow(showKey, showName, channel, firstShowing, frequency);

    }, function(errorObject) {
        console.log("ERROR:", errorObject.code);
    });

    // submitting a new value
    $("#submit").on("click", function(event) {

        event.preventDefault();

        // user input values
        showName = $("#showNameInput").val().trim();
        channel = $("#channelInput").val().trim();
        firstShowing = $("#firstShowingInput").val().trim();
        frequency = $("#frequencyInput").val().trim();

        // console.log(showName);
        // console.log(channel);
        // console.log(firstShowing);
        // console.log(frequency);

        console.log(Boolean(showName === ""));
        console.log(Boolean(firstShowing === ""));
        console.log(Boolean(frequency === ""));

        // if statement for empty inputs
        if (showName === "" || firstShowing === "" || frequency === "") {
            if (showName === "") {
                $("#showNameModal").text("• 'Show Name' is required");
            }
            if (firstShowing === "") {
                $("#firstShowingModal").text("• 'First Showing' is required");;
            }
            if (frequency === "") {
                $("#frequencyModal").text("• 'Frequency' is required");;
            }
            //     // bring up modal with missing inputs
            $("#submit").attr("data-target", "#missingInputsModal");
        } else {
            $("#submit").attr("data-target", "");
            showName = capitalize(showName);
            // push new values to database
            database.ref().push({
                showName: showName,
                channel: channel,
                firstShowing: firstShowing,
                frequency: frequency,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });
            // clear inputs after new values pushed
            $("#showNameInput").val("");
            $("#firstShowingInput").val("");
            $("#frequencyInput").val("");
        }
    });

    // edit table row values when edit is clicked
    $(document).on("click", ".glyphicon-edit", function() {
        // update button holds child key to update the values when pressed
        $("#update").attr("data-showKey", $(this).attr("data-showKey"));

        var showName;
        var channel;
        var firstShowing;
        var frequency;

        // retrieves database values at key once
        database.ref($(this).attr("data-showKey")).once("value", function(snapshot) {
            showName = snapshot.val().showName;
            channel = snapshot.val().channel;
            firstShowing = snapshot.val().firstShowing;
            frequency = snapshot.val().frequency;
        });

        // set modal input values to values sent from database at key
        $("#showNameUpdate").val(showName);
        $("#channelUpdate").val(channel);
        $("#firstShowingUpdate").val(firstShowing);
        $("#frequencyUpdate").val(frequency);
    });

    // update firebase with new values when update is pressed on the modal
    $("#update").on("click", function(event) {
        // sets database values at key to modal input values edited
        var showName = $("#showNameUpdate").val().trim();
        var channel = $("#channelUpdate").val().trim();
        var firstShowing = $("#firstShowingUpdate").val().trim();
        var frequency = $("#frequencyUpdate").val().trim();

        showName = capitalize(showName);

        database.ref().child($(this).attr("data-showKey")).update({
            showName: showName,
            channel: channel,
            firstShowing: firstShowing,
            frequency: frequency,
        })
    });

    // childAdded();
    // childRemoved();
    // setInterval(childAdded, 60 * 1000);
});
