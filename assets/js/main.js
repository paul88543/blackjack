var dealer = {cards:[], number:[]};
var split;
var player = {cards:[], number:[], operate:[]};
var player1 = {cards:[], number:[], operate:[]};
var game_status = {focus_card: 'player', insurance: false, split: false, dobule: false, double_s: false};
var billrecord = [];

function start(){
    dealer.cards.push($('#card-dealer').val());
    dealer.cards.push($('#card-dealer1').val());
    player.cards.push($('#card-player').val());
    player.cards.push($('#card-player1').val());
    
    $('.start-button').addClass('d-none');
    $('.start').removeClass('d-none');

    controller_checker();
    update_card();
}

function controller_checker() {
    if (dealer[0] == "A") {
        $('.insurance-controller').removeClass('d-none');
        $('.default-controller').addClass('d-none');
    } else {
        $('.default-controller button').prop('disabled', false);

        if (player[0] !== player[1]) {
            $('#split').prop('disabled', true);
        }
    }
    
}

// Bet Area
// Bet
function bet(){
    $(this).prop('disabled', true);
    $('.default-card').removeClass('d-none');
        add_record('Bet', $('#betamount').val());
};

// Insurance
function insurance(){
    add_record('Insurance', $('#betamount').val() / 2);
};

// Hit
function hit(){
    if (game_status.focus_card == 'player') {
        player.cards.push($('#hit-card').val());
    } else {
        player1.cards.push($('#hit-card').val());
    }

    update_card();
};

// Stand
function stand(){
    if (focus_card == 'player') {
        player.cards.push($('#hit-card').val());
    } else {
        player1.cards.push($('#hit-card').val());
    }

    if (game_status.split && game_status.focus_card == 'player') {
        game_status.focus_card == 'player1';
        $('.player').removeClass('focus');
        $('.player1').addClass('focus');
    }
};

// Split
function split(){
    let tem_cards = player.cards;
    player.cards = [];
    player1.cards = [];

    add_record('Split', $('#betamount').val());
    $(this).prop('disabled', true);

    player.cards.push(tem_cards[0]);
    player1.cards.push(tem_cards[1]);
    player.cards.push($('#split-card-player').val());
    player1.cards.push($('#split-card-player1').val());

    update_card();

    $('.player').addClass('focus');
    $('.player1').removeClass('d-none');
};

// Double
function double(){
    add_record('Double', $('#betamount').val());
};

function add_record(type, betamount){
    billrecord.push(
        {
            playtype: type,
            bet_amount: betamount
        }
    );
    $(".billrecord tbody").last().append('<tr class="' + type + '"><td>' + type + '</td>' + '<td>Unsettlement</td>' + '<td>' + betamount + '</td><td></<td><td></<td><td></<td></tr>');
} 

 function update_card() {
    counter(dealer);
    counter(player);
    counter(player1);

    // show card number
    $('.dealer-counter').text("(" + dealer.number[0] + (dealer.number[1] < 22 && dealer.cards[0] == 'A' ? ", " + dealer.number[1] :"") + ")");
    $('.player-counter').text("(" + player.number[0] + (player.number[1] < 22 && player.cards[0] == 'A' ? ", " + player.number[1] :"") + ")");
    $('.player1-counter').text("(" + player1.number[0] + (player1.number[1] < 22 && player1.cards[0] == 'A' ? ", " + player1.number[1] :"") + ")");

    // show cards
    init_card($('.dealer .card-item'), dealer, true);
    init_card($('.player .card-item'), player, false);
    init_card($('.player1 .card-item'), player1, false);
 }

 // counter card number
 function counter(array) {
    array.number = [];
    let card_value = 0;
    let card_value1 = 0;
    let hasA = false;

    console.log(array);

    $.each(array.cards, function(index, value){
        switch(value) {
            case "A":
                card_value = card_value + 1;
                card_value1 = card_value1 + 11;
                hasA = true;
                break;
            case "J":
            case "Q":
            case "K":
                card_value = card_value + 10;
                card_value1 = card_value1 + 10;
                break;
            default:
                card_value = card_value + parseInt(value);
                card_value1 = card_value1 + parseInt(value);
            console.log(card_value, card_value1);
        }
    });

    array.number.push(card_value, card_value1);
}

 function init_card(item, values, is_dealer){
    // empty cards
    $(item).html('');

    // init cards
    $.each(values.cards, function(index, value){
        if (index == 1 && is_dealer) {
            $(item).append('<div class="poker empty"></div>');
        } else {
            $(item).append('<div class="poker">' + value + '</div>');
        }
        
    })
 }