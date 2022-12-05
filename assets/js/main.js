var dealer = {name: 'dealer', cards:[], number:[], point: 0, hasA: false, isDealer: true};
var player = {name: 'player', cards:[], number:[], point: 0, hasA: false, isDealer: false};
var player1 = {name: 'player1', cards:[], number:[], point: 0, hasA: false, isDealer: false};
var game_status = {focus_card: 'player', insurance: false, split: false, dobule: false, double_s: false};
var billrecord = [];
var askedInsuracne = false;

function start(){
    dealer.cards.push($('#card-dealer').val());
    player.cards.push($('#card-player').val());
    player.cards.push($('#card-player1').val());
    
    $('.start-button').addClass('d-none');
    $('.start').removeClass('d-none');

    controllerChecker();
    updateCard();

    if (dealer.cards[0] !== "A") {
        standChecker(player);
    }
}

function controllerChecker() {
    if (dealer.cards[0] == "A" && !askedInsuracne) {
        $('.insurance-controller').removeClass('d-none');
        $('.default-controller').addClass('d-none');
    } else {
        $('.insurance-controller').addClass('d-none');
        $('.default-controller').removeClass('d-none');
    }
    
    $('.default-controller button').prop('disabled', false);

    if (player.cards[0] !== player.cards[1]) {
        $('#split').prop('disabled', true);
    }
}

// Bet Area
// Bet
function bet(e){
    $(e).prop('disabled', true);
    $('.default-card').removeClass('d-none');
        addRecord('Bet', $('#betamount').val());
};

// Insurance
function insurance(){
    game_status.insurance = true;
    askedInsuracne = true;

    addRecord('Insurance', $('#betamount').val() / 2);

    standChecker(player);
    controllerChecker();
};

function noInsurance(){
    askedInsuracne = true;
    controllerChecker();
};


// Hit
function hit(){
    if (game_status.focus_card == 'player') {
        player.cards.push($('#hit-card').val());
    } else {
        player1.cards.push($('#hit-card').val());
    }

    updateCard();
    standChecker(game_status.focus_card == 'player' ? player : player1);
};

// Stand
function stand(){
    if (game_status.split && game_status.focus_card == 'player') {
        game_status.focus_card = 'player1';
        $('.player').removeClass('focus');
        $('.player1').addClass('focus');
    }
};

// Split
function split(){
    let tem_cards = player.cards;
    player.cards = [];
    player1.cards = [];
    game_status.split = true;

    addRecord('Split', $('#betamount').val());
    $(this).prop('disabled', true);

    player.cards.push(tem_cards[0]);
    player1.cards.push(tem_cards[1]);
    player.cards.push($('#split-card-player').val());
    player1.cards.push($('#split-card-player1').val());

    $('.player').addClass('focus');
    $('.player1').removeClass('d-none');

    updateCard();
    standChecker(player);
};

// Double
function double(){
    game_status.dobule = true;

    if (game_status.focus_card == 'player') {
        addRecord('Double', $('#betamount').val());
        game_status.focus_card = 'player1';
    } else {
        addRecord('Double(S)', $('#betamount').val());
    }
};

function addRecord(type, betamount){
    billrecord.push(
        {
            playtype: type,
            bet_amount: betamount
        }
    );
    $(".billrecord tbody").last().append('<tr class="' + type + '"><td>' + type + '</td>' + '<td>Unsettlement</td>' + '<td>' + betamount + '</td><td></<td><td></<td><td></<td></tr>');
} 

 function updateCard() {
    counter(dealer);
    counter(player);
    counter(player1);
 }

 // counter card number
 function counter(array) {
    let cardValue = 0;
    let cardValue1 = 0;
    let countA = false;
    array.number = [];

    $.each(array.cards, function(index, value){
        switch(value) {
            case "A":
                cardValue = cardValue + 1;
                cardValue1 = cardValue1 + (countA ? 1 : 11);
                array.hasA = true;
                countA = true;
                break;
            case "J":
            case "Q":
            case "K":
                cardValue = cardValue + 10;
                cardValue1 = cardValue1 + 10;
                break;
            default:
                cardValue = cardValue + parseInt(value);
                cardValue1 = cardValue1 + parseInt(value);
        }
    });

    array.number.push(cardValue, cardValue1);
    array.point = cardValue1 > cardValue && cardValue1 <=21 ? cardValue1 : cardValue;

    console.log(array.number);

    showCardNumber(array);
    initCard($('.' + array.name + ' .card-item'), array);
}

// Show Card Number
function showCardNumber(array){
    html =  '(' + array.number[0];
    
    if(array.hasA && array.number[1] < 22) {
        html += ', ' + array.number[1];
    }

    $('.' + array.name + ' .counter').text(html + ')');

}

// Show Cards
function initCard(item, values){
    // empty cards
    $(item).html('');

    // init cards
    $.each(values.cards, function(index, value){
        $(item).append('<div class="poker">' + value + '</div>');
    })

    if (values.isDealer && values.cards.length < 2) {
        $(item).append('<div class="poker empty"></div>');   
    }
 }


function standChecker(card){
    if((card.point >= 21 && game_status.split && game_status.focus_card == 'player') || dealer.bj) {
        stand();
    } else {
        console.log('settle');
    }
}