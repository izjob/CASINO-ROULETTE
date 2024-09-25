//----------------------------------------------------------------------------FIRES--------------------------------------------------------------
import {login, logout} from "./auth.js"
import {start,getNPlayers,getPoints,getMaxpoints,updatePoints,updateMaxpoints,getRankingRT,getRankingAT} from "./firestore.js"
//----------------------------------------------------------------------------RANKING--------------------------------------------------------------

var nplayers=await getNPlayers()
$('.nplayers').text(nplayers)
var tbodyrt= $('#tbody-rt')
var tbodyat= $('#tbody-at')
setTimeout(() => {
    rankingRTUpdate()
rankingATUpdate()
}, 2000);


setInterval(() => {
    rankingRTUpdate()
}, 18000);

setInterval(() => {
    rankingRTAupdate()
}, 18000 );

async function rankingRTUpdate() {
    var nplayers=await getNPlayers()
    $('.nplayers').text(nplayers)   
    var ranking= await getRankingRT()
    tbodyrt.empty()
    ranking.forEach(user => {
    var username = user.email.split('@')[0]
    var row=`<tr><td>${username}</td><td>${user.points}</td></tr>`
    tbodyrt.append(row)
});
}

async function rankingATUpdate() {
    var nplayers=await getNPlayers()
    $('.nplayers').text(nplayers)
    var ranking= await getRankingAT()
    tbodyat.empty()
    ranking.forEach(user => {
    var username = user.email.split('@')[0]  
    var row=`<tr><td>${username}</td><td>${user.maxpoints}</td><td>${user.maxpointsDate}</td></tr>`
    tbodyat.append(row)
});
}

//----------------------------------------------------------------------------LOGIN Y OVERLAY--------------------------------------------------------------
var overlay = $('#overlay')
$('#overlay').on("click",() =>{
    alert('To play, you need to log in.')
})

var btnlogin = $('#btnlogin')
var btnlogout = $('#btnlogout')


var wallet = '???';
$(".Wallet").html('Wallet: ' + wallet +'<iconify-icon icon="ri:coins-line"></iconify-icon>')

var user
var maxpoints = 0
//LOGIN QUE EMPIEZA CON DETECTAR EL USUARIO Y SUS DATOS
btnlogin.on("click", async (e) => {
    try {     
        var currentUser= await login()
        user = currentUser
        start(user)

        //QUIERO VER SI ESTO FUNCIONA
        setTimeout(async () => {
            maxpoints=getMaxpoints(user)  
            var username = user.email.split('@')[0]
            $('#userdiv').text(username)
            btnlogin.hide()
            overlay.hide()
            wallet= await getPoints(user)
            maxpoints= await getMaxpoints(user)
            $(".Wallet").html('Wallet: ' + wallet +'<iconify-icon icon="ri:coins-line"></iconify-icon>')    
        }, 1000);


    } catch (error) {
        console.log(error)
    }
})
//EL BOTON DE DESCONECTARSE
btnlogout.on("click", async (e) => {
    try {
        await logout()
        btnlogin.show()
        overlay.show()
        wallet='???'
        $(".Wallet").html('Wallet: ' + wallet +'<iconify-icon icon="ri:coins-line"></iconify-icon>')
    } catch (error) {
        
    }
})


//----------------------------------------------------------------------------RULETA--------------------------------------------------------------

var roulette = "<span class='Green'>0</span>";

for (var i = 1; i < 37; i++) {

    if (i % 2 == 0) {
        roulette = roulette + "<span class='Red'>" + i + "</span>";
    } else {
        roulette = roulette + "<span class='Black'>" + i + "</span>";
    }
}

roulette = roulette + roulette + roulette + roulette + roulette;

document.getElementById('RollerContainer').innerHTML = roulette;

//----------------------------------------------------------------------------HISTORIAL--------------------------------------------------------------

for (var i = 0; i < 10; i++) {
    var emptyHistorial = $('<span></span>')
    emptyHistorial.addClass('numeroHistorial', '.enter-left')
    emptyHistorial.css({
        'background-color': 'yellow',
    })
    $("#NumList").prepend(emptyHistorial)
}

//--------------------------------------------------------------------------0 APUESTAS Y SPIN-------------------------------------------------------------

var greenBet = 0;
var redBet = 0;
var blackBet = 0;

var BtnSpin = $('.BtnSpin')
BtnSpin.on('click',()=>{
    if (greenBet + redBet + blackBet > wallet) {
        alert("Bet bigger than wallet");
    } else {
        
        var currentInput = parseInt($(".BetInput").val());

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

            $(".Wallet").html("Wallet: " + wallet + '<iconify-icon icon="ri:coins-line"></iconify-icon>');
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
            if (wallet>maxpoints) {
                updateMaxpoints(user,wallet)
            }
        }, 5000)

    }
})
$("#ClBets").click(function () {
    cLearBets()
})
//ESTO FALTA
function cLearBets() {
    $(".BlackBet, .GreenBet, .RedBet").html("0");
    redBet = greenBet = blackBet = 0;
}


//----------------------------------------------------------------------------BOTONES APUESTAS--------------------------------------------------------------

$(".BetRed").click(function () {
    if ($(".BetInput").val().match(/[a-z]/i) || $(".BetInput").val() == "") {
        alert("Please enter a bet and only enter numbers");
    }
    else if (greenBet +redBet + blackBet+ parseInt($(".BetInput").val())> wallet) {
        alert("Bet bigger than wallet"+wallet);
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
    }
    else {
        blackBet = blackBet + parseInt($(".BetInput").val());
        $(".BlackBet").html(blackBet);
    }
});



