/*----- constants -----*/
const vReel = ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', '$1', '$1', '$1', '$1', '$1', '$1', '$1', '$1', '$1', '$1', '$2', '$2', '$2', '$2', '$2', '$2', '$2', '$3', '$3', '$3', '$3', 'L7', 'L7', 'L7', 'GB', 'GB', 'JP'];
const imgLookup = {
    X: '<img src="visual/X.png">',
    C: '<img src="visual/cherries.png">',
    $1: '<img src="visual/1$.png">',
    $2: '<img src="visual/2$$.png">',
    $3: '<img src="visual/3$$$.png">',
    L7: '<img src="visual/lucky7.png">',
    GB: '<img src="visual/goldbar.png">',
    JP: '<img src="visual/moneybags.png">',
}
const payouts = {
    'JP': 1000,
    'GB': 500,
    'L7': 250,
    '$3': 50,
    '$2': 25,
    '$1': 10,
    'C': 10,
    'X': 0,
};

/*----- app's state (variables) -----*/
let credits, wager, reelArr;

/*----- cached element references -----*/
const rDisp1 = document.getElementById('r1');
const rDisp2 = document.getElementById('r2');
const rDisp3 = document.getElementById('r3');
const credDisp = document.getElementById('c-amount');
const betDisp = document.getElementById('w-amount');
const rFlash = `${'<img src="visual/spinningreel.gif">'}`;
const leverCtrl = document.getElementById('lever');
const betSnd = new Audio('audio/Bet1.mp3');
const betAll = new Audio('audio/BetMax.mp3');
const leverSnd = new Audio('audio/leverPull.mp3');
const reelSnd = new Audio('audio/reelSpin.mp3');
const bannerMsg = document.getElementById('banner');

/*----- event listeners -----*/
document.getElementById('betup').addEventListener('click', bet1);
document.getElementById('betmax').addEventListener('click', betMax);
document.getElementById('lever').addEventListener('click', leverPull);
document.getElementById('reset').addEventListener('click', init);

/*----- functions -----*/
init();

function init() { //Only initiate tracked variables here
    credits = 3;
    wager = 0;
    bannerMsg.innerText = "⦿ The One-Armed Bandit ⦿";
    reelArr = ["L7", "L7", "L7"];
    render();
}

function render() { //Anything that goes on the PAGE goes here instead
    rDisp1.innerHTML = imgLookup[reelArr[0]];
    rDisp2.innerHTML = imgLookup[reelArr[1]];
    rDisp3.innerHTML = imgLookup[reelArr[2]];
    credDisp.innerHTML = `${credits}`;
    betDisp.innerHTML = `${wager}`;
    leverCtrl.style.cursor = wager ? 'grab' : 'not-allowed';
}

function bet1() { // Add 1 Credit wager (to 3 max)
    if (wager < 3 && credits > 0) {
        credits--;
        wager++;
        betSnd.play();
    } else { return };
    render();
}

function betMax() { // Bet maximum 3 Credits
    if (credits >= 3)
        while (wager < 3) {
            credits--;
            wager++;
            betAll.play();
        }
    render();
}

function leverPull() {
    if (wager === 0) return;
    reelArr = [];
    leverSnd.play();
    rDisp1.innerHTML = rFlash;
    rDisp2.innerHTML = rFlash;
    rDisp3.innerHTML = rFlash;
    setTimeout(function() {
        rDisp1.innerHTML = `${Math.floor(Math.random()*vReel.length)}`;
    }, 750);
    setTimeout(function() {
        rDisp2.innerHTML = `${Math.floor(Math.random()*vReel.length)}`;
    }, 1500);
    setTimeout(function() {
        rDisp3.innerHTML = `${Math.floor(Math.random()*vReel.length)}`;
    }, 2250);
    setTimeout(function() {
        reelSnd.play();
        reelArr.push(vReel[rDisp1.innerHTML], vReel[rDisp2.innerHTML], vReel[rDisp3.innerHTML]);
        checkReels();
        wager = 0;
        if (credits === 0) {
            bannerMsg.innerText = "⦿ Better Luck Next Time! ⦿";
        }
        render();
    }, 2251);
}

function checkReels() {
    let foundWinner = false;
    console.log(foundWinner);
    let reelCount = reelArr.reduce(function(total, sym) {
						console.log(reelArr);
						total[sym] = total[sym] ? ++total[sym] : 1;
      console.log(sym);
      console.log(total)
						return total;
    }, {});
    for (let sym in reelCount) {
        if (reelCount[sym] === 3 && reelCount.X === 0) {
            credits += wager * payouts[sym];
            foundWinner = true;
            break;
        }
    }
    if (!foundWinner && reelCount.C === 1 && reelCount.X === 0) {
        if (Object.keys(reelCount).length === 2) {
            credits += wager * 5;
        } else {
            credits += wager * 2;
        }
    }
    if (!foundWinner &&
        ((reelCount.$1 === 1 && reelCount.$2 === 2) ||
            (reelCount.$1 === 2 && reelCount.$2 === 1) ||
            (reelCount.$1 === 1 && reelCount.$3 === 2) ||
            (reelCount.$1 === 2 && reelCount.$3 === 1) ||
            (reelCount.$2 === 1 && reelCount.$3 === 2) ||
            (reelCount.$2 === 2 && reelCount.$3 === 1) ||
            (reelCount.$1 === 1 && reelCount.$2 === 1 && reelCount.$3 === 1)
        )) {
        credits += wager + wager * 100;
    }

}