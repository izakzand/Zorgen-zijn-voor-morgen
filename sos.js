let active = true;
var itsRainingMan = chrome.extension.getURL('images/moneyrain-small.jpeg');

const observer = new MutationObserver(function (mutations) {
    mutations.map(item => {
        if (active) {
            // Verander de titel naar iets positiefs!
            if (item.target.id === "titel_mijnschulden") {
                item.target.innerText = "Studiegenot";
            }

            // Gris die controller
            if (item.target.getAttribute("ng-controller") === "mijnSchuldenNieuwController") {
                let isZorgenloos = false;
                let loaded = false;

                Array.from(item.target.querySelectorAll(":scope > div.row")).forEach(item => {
                    if (!item.id && item.id != "schulden_censuur") {
                        item.id = "schulden_censuur";
                        item.style.display = "none";
                        loaded = true;
                    }

                    if (item.id === "minder_zorgen") {
                        isZorgenloos = true;
                    }
                });

                // Verberg de schulden details button
                document.querySelectorAll('[analytics-category="open tile mijnSchulden"]').forEach(item => {
                    if (!item.classList.contains("schulden_button")) {
                        item.classList.add("schulden_button");
                        item.style.display = "none";
                    }
                });

                // Voeg het alleen toe als het zojuist geladen is en nog niet bestaat!
                if (!isZorgenloos && loaded) {
                    item.target.insertAdjacentHTML('beforeend', `                                       \
                                        <div id='minder_zorgen_img' style='text-align: center'>         \
                                            <img src='${itsRainingMan}' style='max-width: 75%'></img>   \                                                                \
                                        </div>                                                          \
                                        <div class='row' id='minder_zorgen'>                            \
                                            Zorgen zijn voor morgen!                                    \
                                            Geniet van ome DUO zolang het kan.                          \
                                            Toch je schulden bekijken?                                  \
                                            Klik <a id='levensmoe'>hier</a>.                            \
                                        </div>`);

                    // Intercept de de klikjes van mensen die levensmoe zijn.
                    document.getElementById('levensmoe').onclick = function () {
                        ikBenLevensMoe();
                    }
                }
            }
        }
    })
});

function ikBenLevensMoe() {
    let confirmed = window.confirm("Als u verdergaat kan het schadelijk zijn voor uw mentale gesteldheid. Verdergaan zonder medische bijstand is afgeraden. Weet u zeker dat u verder wilt gaan?");

    if (confirmed) {
        active = false;

        // Verander de tekst terug
        document.getElementById("titel_mijnschulden").innerText = "Studieschuld";

        // Verberg de zorgeloze motivatie
        document.getElementById("minder_zorgen_img").style.display = "none";
        document.getElementById("minder_zorgen").style.display = "none";

        // Laat de schulden zien
        document.getElementById("schulden_censuur").style.display = null;

        // Show details button
        document.querySelectorAll('.schulden_button').forEach(item => {
            item.style.display = null;
        });

    }
}

// Observe da data
observer.observe(document, { attributes: false, childList: true, characterData: false, subtree: true });