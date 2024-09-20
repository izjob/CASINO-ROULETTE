//ranking

var tbodyrt= $('#tbody-rt')
var tbodyat= $('#tbody-at')

    rankingRTUpdate()


async function rankingRTUpdate() {
    var ranking= await getRankingRT()
    tbodyrt.empty()
    ranking.forEach(user => {
    var row=`<tr><td>${user.displayName}</td><td>${user.points}</td></tr>`
    console.log(row)
    tbodyrt.append(row)
});
}

//overlay
$('#overlay').on("click",() =>{
    alert('To play, you need to log in.')
})


//login
import {login, logout} from "./auth.js"
import {start,getPoints,updatePoints,getRankingRT} from "./firestore.js"

var btnlogin = $('#btnlogin')
var overlay = $('#overlay')
var btnlogout = $('#btnlogout')


var wallet = '???';
$(".Wallet").html('Wallet: ' + wallet +'<iconify-icon icon="ri:coins-line"></iconify-icon>')

var user
btnlogin.on("click", async (e) => {
    try {     
        var currentUser= await login()
        user = currentUser
        start(user)
        //console.log('funciona')



        $('#userdiv').text(user.displayName)
        btnlogin.hide()
        overlay.hide()
        console.log(user.uid)
        console.log(await getPoints(user))
        wallet= await getPoints(user)
        $(".Wallet").html('Wallet: ' + wallet +'<iconify-icon icon="ri:coins-line"></iconify-icon>')


    } catch (error) {
        console.log(error)
    }
})


btnlogout.on("click", async (e) => {
    try {
        //console.log("funciona")
        await logout()
        btnlogin.show()
        overlay.show()
        wallet='???'
        $(".Wallet").html('Wallet: ' + wallet +'<iconify-icon icon="ri:coins-line"></iconify-icon>')
    } catch (error) {
        
    }
})




var currentInput = 0;

var greenBet = 0;
var redBet = 0;
var blackBet = 0;


//$(".Wallet").html('<span id="vcoins">Wallet: ' + wallet + '<iconify-icon icon="ri:coins-line"></iconify-icon></span><button><iconify-icon icon="icon-park-outline:video"></iconify-icon>=+50<iconify-icon icon="ri:coins-line"></iconify-icon></button>');
var roulette = "<span class='Green'>0</span>";

for (var i = 1; i < 37; i++) {

    if (i % 2 == 0) {
        roulette = roulette + "<span class='Red'>" + i + "</span>";
    } else {
        roulette = roulette + "<span class='Black'>" + i + "</span>";
    }
}

for (var i = 0; i < 10; i++) {
    var emptyHistorial = $('<span></span>')
    emptyHistorial.addClass('numeroHistorial', '.enter-left')
    emptyHistorial.css({
        'background-color': 'yellow',
    })
    $("#NumList").prepend(emptyHistorial)
}

roulette = roulette + roulette + roulette + roulette + roulette;

document.getElementById('RollerContainer').innerHTML = roulette;

var BtnSpin = $('.BtnSpin')
BtnSpin.on('click',()=>{
    if (greenBet + redBet + blackBet > wallet) {
        alert("Bet bigger than wallet");
        cLearBets();
    } else {

        currentInput = parseInt($(".BetInput").val());

        var ResultColor = "";

        var RanNum = Math.floor((Math.random() * 36) + 0);
        var SuspenceFactor = Math.floor(Math.random() * 8) - 4;
        // SOLO PARA PRUEBAS var RanNum = 0 
        if (RanNum == 0) {
            ResultColor = "Limegreen";
        } else if (RanNum % 2 == 0) {
            ResultColor = "Red";
        } else {
            ResultColor = "Black";
        }

        var SpinPro = ((RanNum - 4 + SuspenceFactor / 10) * 0.54054054054 + 60) * -1;

        $("#RollerContainer").css({ "transition": "none", "transform": "translate(0%, 0%)" });

        setTimeout(function () {

            $("#RollerContainer").css({ "transition": "transform 5s ease", "transform": "translate(" + SpinPro + "%, 0%)" });
        }, 100);

        $(".Bet, .BtnSpin").css("pointer-events", "none");

        setTimeout(function () {
            $(".Bet, .Btnspin").css("pointer-events", "auto");

            if (greenBet > 0 && ResultColor == "Limegreen") {
                wallet = wallet + greenBet * 35 - redBet - blackBet;
            } else if (redBet > 0 && ResultColor == "Red") {
                wallet = wallet + redBet - greenBet - blackBet;
            } else if (blackBet > 0 && ResultColor == "Black") {
                wallet = wallet + blackBet - redBet - greenBet;
            } else if (blackBet > 0 || redBet > 0 || greenBet > 0) {
                wallet = wallet - redBet - greenBet - blackBet;

                if (wallet < 50) {
                    wallet=50
                    $(".Wallet").html("Wallet: " + wallet);
                }
            }

            $(".Wallet").html("Wallet: " + wallet);
            $(".BlackBet, .GreenBet, .RedBet").html("0");
            redBet = greenBet = blackBet = 0;


            if ($("#NumList").children().length == 10) {
                $('#NumList').children().last().remove();
            }
            var numeroHistorial = $('<span></span>')
            numeroHistorial.text(RanNum)
            numeroHistorial.addClass('NumeroHistorial', '.enter-left')
            numeroHistorial.css({
                'background-color': ResultColor
            })

            $("#NumList").prepend(numeroHistorial)
            updatePoints(user,wallet)
            
        }, 5000)

    }
})

function cLearBets() {
    $(".BlackBet, .GreenBet, .RedBet").html("0");
    redBet = greenBet = blackBet = 0;
}

$(".BetRed").click(function () {
    if ($(".BetInput").val().match(/[a-z]/i) || $(".BetInput").val() == "") {
        alert("Please enter a bet and only enter numbers");
    }
    else if (greenBet +redBet + blackBet+ parseInt($(".BetInput").val())> wallet) {
        alert("Bet bigger than wallet"+wallet);
        cLearBets();
    }
    else{
        redBet = redBet + parseInt($(".BetInput").val());
        $(".RedBet").html(redBet);
    }
});

$(".BetGreen").click(function () {
    if ($(".BetInput").val().match(/[a-z]/i) || $(".BetInput").val() == "") {
        alert("Please enter a bet and only enter numbers");
    }
    else if (greenBet +redBet + blackBet+ parseInt($(".BetInput").val())> wallet) {
        alert("Bet bigger than wallet");
        cLearBets();
    } 
    else {
        greenBet = greenBet + parseInt($(".BetInput").val());
        $(".GreenBet").html(greenBet);
    }
});

$(".BetBlack").click(function () {
    if ($(".BetInput").val().match(/[a-z]/i) || $(".BetInput").val() == "") {
        alert("Please enter a bet and only enter numbers");
    } 
    else if (greenBet +redBet + blackBet+ parseInt($(".BetInput").val())> wallet) {
        alert("Bet bigger than wallet");
        cLearBets();
    }
    else {
        blackBet = blackBet + parseInt($(".BetInput").val());
        $(".BlackBet").html(blackBet);
    }
});



