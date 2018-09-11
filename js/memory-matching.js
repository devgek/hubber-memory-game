var matchingGame = {
};

matchingGame.deck = []

function getFriends() {
    return ({hubbers: window.Friends});
}

// http://stackoverflow.com/a/2450976/1420197
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function selectCard() {
	if ($(".card-flipped").size() > 1) {
		return;
	}
	$(this).addClass("card-flipped");
	if ($(".card-flipped").size() == 2) {
		setTimeout(checkPattern,1400);
	}
}

function checkPattern() {
	if (isMatchPattern()) {
		$(".card-flipped").removeClass("card-flipped").addClass("card-removed");
		$(".card-removed").bind("webkitTransitionEnd",removeTookCards);
	} else {
		$(".card-flipped").removeClass("card-flipped");
	}
}

function isMatchPattern() {
	var cards = $(".card-flipped");
	var pattern = $(cards[0]).data("pattern");
	var anotherPattern = $(cards[1]).data("pattern");
	return (pattern == anotherPattern);
}

function removeTookCards() {
	$(".card-removed").remove();
	if ($(".card").length == 0) {
		gameover();
	}
}

function gameover() {
}

$(function(){

    var $cards = $("#cards");
    var $loader = $("#loader");

    $cards.hide();
    var friends = getFriends();

        for (var i = 0; i < friends.hubbers.length; ++i) {
            matchingGame.deck.push(friends.hubbers[i]);
        }
        shuffle(matchingGame.deck);
        for(var i=0;i<23;i++){
            $('.card:first-child').clone().appendTo($cards);
        }
        $cards.children().each(function(index) {
            var $this = $(this);
            $this.css({
                'left': ($this.width() + 23) * (index % 6),
                'top': ($this.height() + 23) * Math.floor(index / 6)
            });

            var Friend = matchingGame.deck.pop();

            // This is some shit - we are going to dynamically apply css to the card(s).
            $this
                .css("background", "#efefef url(" + Friend.picture_path + ")")
                .css("background-size", "128px 128px")

            $this.attr("data-pattern",Friend.pair_name);
            /*$this.addClass("card-flipped");*/

            if ($("[data-pattern="+Friend.pair_name+"] .name").text() == "" && Friend.name) {
                $this.find(".name").text(Friend.name);
            } else {
                $this.find(".pair_name").text(Friend.pair_name);
            }

            $this.click(selectCard);
        });
        $cards.fadeIn();
        $loader.fadeOut();
 });
