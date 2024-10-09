//----------------------------------------------------------------------------FIRES--------------------------------------------------------------
import { login, logout } from "./auth.js"
import { getDateLastDay, getConsecutiveDays, start, getNPlayers, getPoints, getMaxpoints, updatePoints, updateMaxpoints, getRankingRT, getRankingAT } from "./firestore.js"
//----------------------------------------------------------------------------RANKING--------------------------------------------------------------

//prueba()

/*
var nplayers=await getNPlayers()
$('.nplayers').text(nplayers)
var tbodyrt= $('#tbody-rt')
var tbodyat= $('#tbody-at')
*/
var MenuButton = $('.menuButton')
var MenuCheck = $('.menuCheck')

MenuButton.prop('checked',false)


var wallet = '???';
//$('.menuDiv').hide()
$(".Wallet").html('WALLET: ' + wallet + '<iconify-icon icon="ri:coins-line"></iconify-icon>')

MenuButton.on("click", function(event) {
    event.stopPropagation(); // Detener la propagación del evento
    if (MenuCheck.prop('checked')) {
        $('.menuDiv').slideDown(500);
        MenuCheck.prop('checked', false)// Mostrar el menú si está seleccionado


    } else {
        $('.menuDiv').slideUp(500);
        MenuCheck.prop('checked',true)// Ocultar el menú si no está seleccionado

    
    }
});
var noloss = false;
var btnNoloss= $('.btnNoloss')

btnNoloss.on("click", () => {
    if (wallet<100) {
        alert(`you don't have 300`)
    }
    else{
        noloss = true
        btnNoloss.css("pointer-events", "none");
        wallet=wallet-100
        if (wallet < 50) {
            wallet = 50
        }
        updatePoints(user, wallet)
        $(".Wallet").html("WALLET: " + wallet + '<iconify-icon icon="ri:coins-line"></iconify-icon>');
    }
})

var noblock = false;
var btnNoblock= $('.btnNoblock')

btnNoblock.on("click", () => {
    if (wallet<400) {
        alert(`you don't have 400`)
    }
    else{
        noblock = true
        btnNoblock.css("pointer-events", "none");
        wallet=wallet-400
        if (wallet < 50) {
            wallet = 50
        }
        updatePoints(user, wallet)
        $(".Wallet").html("WALLET: " + wallet + '<iconify-icon icon="ri:coins-line"></iconify-icon>');
    }
})
var casino_music = document.getElementById('casino-music');
var coin_music = document.getElementById('coin-music');
var spin_music = document.getElementById('spin-music');
var win_music = document.getElementById('win-music');
var lose_music = document.getElementById('lose-music');

$('body').on("click", () => {
    playSoundWithSettings(casino_music, 0.5, 1000*60*60*24);
})

function playSoundWithSettings(audioElement, volume, duration) {
    audioElement.volume = volume;

    // Comenzar a reproducir el sonido
    audioElement.play().then(() => {
        // Después del tiempo especificado, pausar el audio
        setTimeout(function () {
            audioElement.pause();
            // Reiniciar el tiempo de reproducción a 0 (opcional, si quieres que comience desde el inicio la próxima vez)
            audioElement.currentTime = 0;
        }, duration); // Duración en milisegundos
    }).catch(function (error) {
        console.error("Error al reproducir el sonido:", error);
    });
}

var tbodyrt = $('#tbody-rt')
var tbodyat = $('#tbody-at')

setInterval(() => {
    rankingRTUpdate()
}, 1000 * 60);

setInterval(() => {
    rankingATUpdate()
}, 1000 * 60);

async function rankingRTUpdate() {
    var nplayers = await getNPlayers()
    $('.nplayers').text(nplayers)
    var ranking = await getRankingRT()
    tbodyrt.empty()
    ranking.forEach(user => {
        var username = user.email.split('@')[0]
        var row = `<tr><td>${username}</td><td>${user.points}</td></tr>`
        tbodyrt.append(row)
    });
}

async function rankingATUpdate() {
    var nplayers = await getNPlayers()
    $('.nplayers').text(nplayers)
    var ranking = await getRankingAT()
    tbodyat.empty()
    ranking.forEach(user => {
        var username = user.email.split('@')[0]
        var row = `<tr><td>${username}</td><td>${user.maxpoints}</td><td>${user.maxpointsDate}</td></tr>`
        tbodyat.append(row)
    });
}

//--------------------------------------------------------------------LOGIN, OVERLAY Y DIARIA--------------------------------------------------------------
var overlay = $('#overlay')
$('#overlay').on("click", () => {
    alert('To play, you need to log in.')
})

var btnlogin = $('#btnlogin')
var btnlogout = $('#btnlogout')

var consecutiveDays
var today = new Date()
var lastDay = getDateLastDay()
var btnDailyreward=$('.btnDailyReward')
btnDailyreward.hide()
btnDailyreward.on('click',async ()=>{
    var sonConsecutivos=sonDiasConsecutivos(today, lastDay)
    if (sonConsecutivos) {

        if (consecutiveDays==1) {
            wallet=wallet+100
        }else if (consecutiveDays==2) {
            wallet=wallet+200
        }else if (consecutiveDays>=3) {
            wallet=wallet+400
        }

        $(".Wallet").html('WALLET: ' + wallet + '<iconify-icon icon="ri:coins-line"></iconify-icon>')
        updatePoints(user,wallet)
    }

})




var user
var maxpoints = 0
//LOGIN QUE EMPIEZA CON DETECTAR EL USUARIO Y SUS DATOS
btnlogin.on("click", async (e) => {
    try {
        var currentUser = await login()
        user = currentUser
        start(user)

        $('#loader').show()
        //QUIERO VER SI ESTO FUNCIONA
        setTimeout(async () => {
            consecutiveDays= await getConsecutiveDays(user)
            console.log(consecutiveDays)
            var username = user.email.split('@')[0]
            $('#userdiv').text(username)
            btnlogin.hide()
            overlay.hide()
            wallet = await getPoints(user)
            maxpoints = await getMaxpoints(user)
            $(".Wallet").html('WALLET: ' + wallet + '<iconify-icon icon="ri:coins-line"></iconify-icon>')
            rankingATUpdate()
            rankingRTUpdate()
            $('#loader').hide()
        }, 3000);


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
        $('#loader').hide()
        $('.menuDiv').hide()
        MenuCheck.prop('checked', true)
        wallet = '???'
        $(".Wallet").html('WALLET: ' + wallet + '<iconify-icon icon="ri:coins-line"></iconify-icon>')
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
BtnSpin.on('click', () => {
    if (greenBet + redBet + blackBet > wallet) {
        alert("Bet bigger than wallet");
    } else {

        spin_music.play()
        playSoundWithSettings(spin_music, 1, 5000 )
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

        $(".BtnSpin").css("pointer-events", "none");

        if (noblock==false) {
            $(".Bet").css("pointer-events", "none");
        }
        


        setTimeout(function () {
            $(".Bet, .Btnspin").css("pointer-events", "auto");

            if (greenBet > 0 && ResultColor == "Limegreen") {
                wallet = wallet + greenBet * 35 - redBet - blackBet;
                playSoundWithSettings(win_music,1,4000)
                winConfetty()
            } else if (redBet > 0 && ResultColor == "Red") {
                wallet = wallet + redBet - greenBet - blackBet;
                playSoundWithSettings(win_music,1,4000)
                winConfetty()
            } else if (blackBet > 0 && ResultColor == "Black") {
                wallet = wallet + blackBet - redBet - greenBet;
                playSoundWithSettings(win_music,1,4000)
                winConfetty()
            } else if ((blackBet > 0 || redBet > 0 || greenBet > 0) && noloss==false) {
                playSoundWithSettings(lose_music,1,3000)
                wallet = wallet - redBet - greenBet - blackBet;

                if (wallet < 50) {
                    wallet = 50
                }
            }

            $(".Wallet").html("WALLET: " + wallet + '<iconify-icon icon="ri:coins-line"></iconify-icon>');
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
            updatePoints(user, wallet)
            if (wallet > maxpoints) {
                updateMaxpoints(user, wallet)
            }
            
            noloss=false
            noblock=false
            $(".btnNoloss, .btnNoblock").css("pointer-events", "auto");
        }, 5000)



        function winConfetty() {
            for (let posi = 0.3; posi <= 1.2; posi = posi + 0.3) {
                confetti({
                    particleCount: 200,
                    spread: 200,
                    origin: { y: posi }, // El confeti sube desde la parte inferior de la pantalla
                    startVelocity: 60, // Velocidad inicial
                    gravity: 0.5,
                    colors: ['#00ff00', '#ff0000', '#000000']
                });
            }
        }
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
    else if (greenBet + redBet + blackBet + parseInt($(".BetInput").val()) > wallet) {
        alert("Bet bigger than wallet" + wallet);
    }
    else {
        playSoundWithSettings(coin_music,1,1000)
        redBet = redBet + parseInt($(".BetInput").val());
        $(".RedBet").html(redBet);
    }
});

$(".BetGreen").click(function () {
    if ($(".BetInput").val().match(/[a-z]/i) || $(".BetInput").val() == "") {
        alert("Please enter a bet and only enter numbers");
    }
    else if (greenBet + redBet + blackBet + parseInt($(".BetInput").val()) > wallet) {
        alert("Bet bigger than wallet");
    }
    else {
        playSoundWithSettings(coin_music,1,1000)
        greenBet = greenBet + parseInt($(".BetInput").val());
        $(".GreenBet").html(greenBet);
    }
});

$(".BetBlack").click(function () {
    if ($(".BetInput").val().match(/[a-z]/i) || $(".BetInput").val() == "") {
        alert("Please enter a bet and only enter numbers");
    }
    else if (greenBet + redBet + blackBet + parseInt($(".BetInput").val()) > wallet) {
        alert("Bet bigger than wallet");

    }
    else {
        playSoundWithSettings(coin_music,1,1000)
        blackBet = blackBet + parseInt($(".BetInput").val());
        $(".BlackBet").html(blackBet);
    }
});




/*-------------------------------------------------------------------------DIAS CONSECUTIVOS... SI O NO--------------------------------------*/

function sonDiasConsecutivos(date1, date2) {
    // Obtener el año, mes y día de ambas fechas
    const año1 = date1.getFullYear();
    const mes1 = date1.getMonth();
    const dia1 = date1.getDate();

    const año2 = date2.getFullYear();
    const mes2 = date2.getMonth();
    const dia2 = date2.getDate();

    // Verificar si son del mismo año y mes
    if (año1 === año2 && mes1 === mes2) {
        return dia2 === dia1 + 1; // Mismo mes, solo verificar el día
    }

    // Verificar el caso del cambio de mes
    if (año1 === año2 && mes2 === mes1 + 1 && dia1 === 31) {
        return dia2 === 1; // Del 31 al 1 del siguiente mes
    }

    // Verificar el caso del cambio de año
    if (año2 === año1 + 1 && mes1 === 11 && dia1 === 31) {
        return dia2 === 1 && mes2 === 0; // Del 31 de diciembre al 1 de enero
    }

    return false; // No son días consecutivos
}