/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";

const presenter = (function () {
    // Private Variablen und Funktionen
    let init = false;
    let blogId = -1;
    let owner = undefined;

    // Initialisiert die allgemeinen Teile der Seite
    function initPage() {
        console.log("Presenter: Seite wird initialisiert");
        // Nutzer abfragen und Anzeigenamen als owner setzen
        model.getSelf((result) => {
            owner = result.displayName;
            console.log(`Presenter: Nutzer ${owner} hat sich angemeldet.`);
        });
        

        // Hier kommt Ihr Code hin   
        
        // Das muss an geeigneter Stelle in Ihren Code hinein.
        init = true;
        // ruft über den Router die Methode showBlogOverview() auf
        router.navigateToPage('/blogOverview/' + blogId);
    }

    // Formatiert den Datum-String in date in zwei mögliche Datum-Strings: 
    // long = false: 24.10.2018
    // long = true: Mittwoch, 24. Oktober 2018, 12:21
    function formatDate(long, date) {

        // hier kommt Ihr Code hin

    }

    // Liest aus einem HTML-Dokument mit Bildern nur den Text und die URLs in <img> aus
    function createPostContent(content) {
        let result = "";

        // Hier kommt Ihr Code hin

        return(result);
    }

    //Oeffentliche Methoden
    return {
        // Wird vom Router aufgerufen, wenn die Startseite betreten wird
        showStartPage() {
            if (model.loggedIn) { // Wenn der Nutzer eingeloggt ist
                console.log("Presenter: Nutzer ist angemeldet!");
                initPage();
            }
            if (!model.loggedIn) { // Wenn der Nuzter eingelogged war und sich abgemeldet hat
                console.log(`Presenter: Nutzer ${owner} hat sich abgemeldet.`);
                // ruft über den Router die Methode showLoginPage() auf
                router.navigateToPage('/login');
            }
        },
        // Wird vom Router aufgerufen, wenn der Nutzer sich abgemeldet hat
        showLoginPage() {
            blogId = -1;
            init = false;
            owner = undefined;
        },

        // Wird vom Router aufgerufen, wenn eine Blog-Übersicht angezeigt werden soll
        showBlogOverview(bid) {
            console.log("Presenter: Anzeige Blog Overview mit Blog-ID " + bid);
            // Hier kommt Ihr Code hin
        }
    };
})();
