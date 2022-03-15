(function () {
    //console.log("sane", $);

    var currentPlayer = "player1";
    var defaultColorLeft = "red";
    var defaultColorRight = "blue";
    //var currentColor = defaultColorLeft;
    var allSlots = $(".slot");
    var gameClosed = false;
    var nameInput1 = "Player 1";
    var nameInput2 = "Player 2";
    var nameInput = false;
    var mousedown = false;
    var count = allSlots.length;

    $(".playerNameLeft").css({ textDecoration: "underline" });
    $("#restartContainer").hide();

    $("body").on("mousedown", function (evt) {
        if (!gameClosed) {
            evt.stopPropagation();
            mousedown = true;

            if (currentPlayer === "player1") {
                $(".checkerLeft").animate(
                    {
                        left: evt.clientX - 40 + "px",
                        top: evt.clientY - 40 + "px",
                    },
                    500
                );
            } else {
                $(".checkerRight").animate(
                    {
                        left: evt.clientX - 40 + "px",
                        top: evt.clientY - 40 + "px",
                    },
                    500
                );
            }
        }
    });

    $("body").on("mousemove", function (e) {
        if (mousedown) {
            if (currentPlayer === "player1") {
                $(".checkerLeft").css({
                    left: e.clientX - 40 + "px",
                    top: e.clientY - 40 + "px",
                });
            } else {
                $(".checkerRight").css({
                    left: e.clientX - 40 + "px",
                    top: e.clientY - 40 + "px",
                });
            }
        }
    });

    $(".inputText").on("focus", function () {
        nameInput = true;
    });

    $("body").on("mouseup", function (evt) {
        if (!gameClosed) {
            dropChecker(evt.clientX);
            mousedown = false;
        }
    });

    $(".restartGameBtn").on("click", function (evt) {
        evt.stopPropagation();
        $("#infoContainer").fadeIn(1000);
        allSlots.removeClass("player1 player2 matchFour");
        allSlots.removeClass(defaultColorLeft);
        allSlots.removeClass(defaultColorRight);
        gameClosed = false;
        count = allSlots.length;
        $("#drawCount").html(count);
        $("#restartContainer").hide();
        $("div#winner").hide();
    });

    $(".restartCountBtn").on("click", function (evt) {
        evt.stopPropagation();
        $(".winCount").html(0);
        $("#pointsLeft").html(0);
        $("#pointsRight").html(0);
    });

    $(".playerLeft .inputText").on("keydown", function (evt) {
        evt.stopPropagation();

        if (evt.which == 13) {
            evt.preventDefault();
            nameInput1 = $(".playerLeft .inputText").val();
            if (nameInput1 === "") {
                $(".playerNameLeft").html("Player 1");
            } else {
                $(".playerNameLeft").html(nameInput1);
            }
        }
    });

    $(".playerRight .inputText").on("keydown", function (evt) {
        evt.stopPropagation();

        if (evt.which == 13) {
            evt.preventDefault();
            nameInput2 = $(".playerRight .inputText").val();
            if (nameInput2 === "") {
                $(".playerNameRight").html("Player 2");
            } else {
                $(".playerNameRight").html(nameInput2);
            }
        }
    });
    /*
    for later

    $(".playerLeft .red").on("click", function () {
        console.log("red");
            });
    $(".playerLeft .green").on("click", function () {
        console.log("green");
               
    });

     $(".playerLeft .blue").on("click", function (evt) {
        console.log("blue", $(evt.target));
    });
    
    
    $(".playerLeft .random").on("click", function () {
        console.log("random");
    });
*/

    function changeColor() {}

    function drawCount() {
        count--;
        $("#drawCount").html(count);
        if (count == 0) {
            count = allSlots.length;
            $("#infoContainer").hide();
            $("#winner").html("OH NO! ITS A DRAW!");
            $("#winner").show();
        }
    }

    function switchPlayer() {
        if (currentPlayer === "player1") {
            //currentColor = defaultColorRight;
            currentPlayer = "player2";
            $(".playerNameRight").css({ textDecoration: "underline" });
            $(".playerNameLeft").css({ textDecoration: "" });
        } else {
            currentPlayer = "player1";
            currentColor = defaultColorLeft;
            $(".playerNameLeft").css({ textDecoration: "underline" });
            $(".playerNameRight").css({ textDecoration: "" });
        }
    }

    function checkForVictory(slots) {
        var count = 0;
        for (var i = 0; i < slots.length; i++) {
            if (slots.eq(i).hasClass(currentPlayer)) {
                count++;

                if (count === 4) {
                    //console.log(slots.eq(i));
                    return true;
                }
            } else {
                count = 0;
            }
        }
    }

    function dropChecker(arg) {
        for (var i = 0; i < $(".column").length; i++) {
            if (
                arg > $(".column").eq(i).offset().left &&
                arg < $(".column").eq(i).offset().left + 100
            ) {
                var dropSlot = $(".column").eq(i).children();

                for (var j = dropSlot.length - 1; j >= 0; j--) {
                    if (
                        !dropSlot.eq(j).hasClass("player1") &&
                        !dropSlot.eq(j).hasClass("player2")
                    ) {
                        drawCount();

                        if (currentPlayer === "player1") {
                            $(".checkerLeft").animate(
                                {
                                    left:
                                        dropSlot.eq(j).offset().left +
                                        10 +
                                        "px",
                                    top:
                                        dropSlot.eq(j).offset().top + 10 + "px",
                                },
                                500
                            );

                            setTimeout(() => {
                                $(".checkerLeft").animate(
                                    {
                                        left: "10px",
                                        top: "75%",
                                    },
                                    0
                                );
                            }, 500);
                        } else {
                            $(".checkerRight").animate(
                                {
                                    left:
                                        dropSlot.eq(j).offset().left +
                                        10 +
                                        "px",
                                    top:
                                        dropSlot.eq(j).offset().top + 10 + "px",
                                },
                                500
                            );
                            setTimeout(() => {
                                $(".checkerRight").animate(
                                    {
                                        left: "94%",
                                        top: "75%",
                                    },
                                    0
                                );
                            }, 500);
                        }

                        setTimeout(() => {
                            dropSlot.eq(j).addClass(currentPlayer);

                            var slotsInRow = $(".row" + j);
                            if (checkForVictory(dropSlot)) {
                                announceWinner(currentPlayer);
                            } else if (checkForVictory(slotsInRow)) {
                                announceWinner(currentPlayer);
                            } else if (diagWin5(allSlots)) {
                                announceWinner(currentPlayer);
                            } else if (diagWin7(allSlots)) {
                                announceWinner(currentPlayer);
                            }
                            switchPlayer();
                        }, 500);
                        break;
                    }
                }
            }
        }

        for (var k = 0; k < $(".column").length; k++) {
            if (
                arg < $(".column").eq(0).offset().left ||
                arg >
                    $(".column")
                        .eq($(".column").length - 1)
                        .offset().left +
                        100
            ) {
                if (currentPlayer === "player1") {
                    $(".checkerLeft").animate(
                        {
                            left: "10px",
                            top: "75%",
                        },
                        500
                    );
                } else {
                    $(".checkerRight").animate(
                        {
                            left: "94%",
                            top: "75%",
                        },
                        500
                    );
                }
                break;
            }
        }
        //console.log("yo!");
    }

    function diagWin7(slots) {
        for (var x = 0; x < slots.length; x++) {
            if (slots.eq(x).hasClass(currentPlayer)) {
                if (
                    slots.eq(x + 7).hasClass(currentPlayer) &&
                    slots
                        .eq(x + 7)
                        .parent()
                        .index() === slots.eq(x).parent().next().index()
                ) {
                    if (
                        slots.eq(x + 14).hasClass(currentPlayer) &&
                        slots
                            .eq(x + 14)
                            .parent()
                            .index() ===
                            slots.eq(x).parent().next().next().index()
                    ) {
                        if (
                            slots.eq(x + 21).hasClass(currentPlayer) &&
                            slots
                                .eq(x + 21)
                                .parent()
                                .index() ===
                                slots
                                    .eq(x)
                                    .parent()
                                    .next()
                                    .next()
                                    .next()
                                    .index()
                        ) {
                            slots.eq(x).addClass("matchFour");
                            slots.eq(x + 7).addClass("matchFour");
                            slots.eq(x + 14).addClass("matchFour");
                            slots.eq(x + 21).addClass("matchFour");
                            return true;
                        }
                    }
                }
            }
        }
    }

    function diagWin5(slots) {
        for (var x = 0; x < slots.length; x++) {
            if (slots.eq(x).hasClass(currentPlayer)) {
                if (
                    slots.eq(x + 5).hasClass(currentPlayer) &&
                    slots
                        .eq(x + 5)
                        .parent()
                        .index() === slots.eq(x).parent().next().index()
                ) {
                    if (
                        slots.eq(x + 10).hasClass(currentPlayer) &&
                        slots
                            .eq(x + 10)
                            .parent()
                            .index() ===
                            slots.eq(x).parent().next().next().index()
                    ) {
                        if (
                            slots.eq(x + 15).hasClass(currentPlayer) &&
                            slots
                                .eq(x + 15)
                                .parent()
                                .index() ===
                                slots
                                    .eq(x)
                                    .parent()
                                    .next()
                                    .next()
                                    .next()
                                    .index()
                        ) {
                            slots.eq(x).addClass("matchFour");
                            slots.eq(x + 5).addClass("matchFour");
                            slots.eq(x + 10).addClass("matchFour");
                            slots.eq(x + 15).addClass("matchFour");
                            return true;
                        }
                    }
                }
            }
        }
    }
    
    function announceWinner(currentPlayer) {
        $("div#winner").hide();
        $("#infoContainer").fadeOut(250);

        gameClosed = true;
        $("#restartContainer").show();
        if (currentPlayer === "player1") {
            $("div#winner").html("<h1> " + nameInput1 + " won! </h1>");
            $("div#winner").fadeIn(250);
            var count1 = $(".playerLeft .winCount").html();
            count1++;
            $(".playerLeft .winCount").html(count1);
            $("#pointsLeft").html(count1);
        } else if (currentPlayer === "player2") {
            $("div#winner").html("<h1> " + nameInput2 + " won! </h1>");
            $("div#winner").fadeIn(250);
            var count2 = $(".playerRight .winCount").html();
            count2++;
            $(".playerRight .winCount").html(count2);
            $("#pointsRight").html(count2);
        }
    }
})();
/*
KOMMENTS!
 


*/