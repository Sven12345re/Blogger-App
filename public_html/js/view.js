/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";
let counter;
const headingView = {

    render: function (data) {

        // Account Name angeben
        console.log("View: render von headingView");

        //überprüfen ob Nutzername und Blogliste schon eingetragen sind
        let p = document.querySelector('body header div p');
        if (p === null) {

            const header = document.querySelector('body header div');
            let name = document.querySelector('body header p');
            name.append(document.createTextNode(data.owner));

            // Liste der Blogs angeben
            let ul = document.querySelector('body header ul');
            const links = data.blogs.map(({name, amount, url}) => {
                    const a = document.createElement('a');
                    const li = document.createElement('li');
                    a.append(document.createTextNode(`${name} (${amount})`));
                    a.setAttribute("href", url);
                    a.addEventListener('click', router.handleNavigationEvent.bind(router));
                    li.append(a);
                    return li;
                }
            );
            ul.append(...links);

            header.insertAdjacentElement('beforeend', name);
            header.insertAdjacentElement('afterend', ul);
        }

    }

};
const blogOverView = {

    render(data, bid) {

        //Gibt Daten an den Router weiter der zur entsprechenden View routet
        let handleEvent = function (event) {
            let li = event.target;
            let page = li.dataset.action;
            router.navigateToPage(page + "/" + li.id);
        };
        //Öffnet die Google-Blogansicht
        let handleBlogansicht = function (event) {
            let li = event.target;
            window.open(li.id);
        };

        console.log("View: render von overView");
        //setzt Blogüberschrift und Daten des Blogs
        let page = document.getElementById('overview').cloneNode(true);
        // Entfernen des Id-Attributs (keine Doubletten!)
        page.removeAttribute("id");
        helper.setDataInfo(page, data);

        let posts = document.getElementById('allBlogPosts').cloneNode(true);
        // Entfernen des Id-Attributs (keine Doubletten!)
        posts.removeAttribute("id");
        helper.setDataInfo(posts, data);


        let blogansicht = page.querySelector("button.blogansicht");
        blogansicht.id = data.url;
        blogansicht.addEventListener("click", handleBlogansicht);

        let addPostButton = page.querySelector("button.addPost");
        addPostButton.id = bid;
        addPostButton.addEventListener("click", data.addPost);

        //Setzt alle Posts mit den entsprechenden Daten
        let counter = 0;

        data.posts.forEach(post => {

            const postElement = document.getElementById('blogPost').cloneNode(true);
            postElement.removeAttribute('id');
            helper.setDataInfo(postElement, post);
            posts.appendChild(postElement);
            let button = posts.querySelectorAll("button.detailansicht")[counter];
            button.id = bid + "/" + data.posts[counter].postId;
            button.addEventListener("click", handleEvent);
            let buttonEdit = posts.querySelectorAll("button.editansicht")[counter];
            buttonEdit.id = bid + "/" + data.posts[counter].postId;
            buttonEdit.addEventListener("click", handleEvent);
            let buttonDelete = posts.querySelectorAll("button.loeschen")[counter];
            buttonDelete.id = bid;
            buttonDelete.addEventListener("click", post.delete);
            counter++;

        });

        page.appendChild(posts);
        // Aufruf zum Ersetzen der alten Seite

        return page;
    }
};

const detailView = {
    render(data, bid) {

        let handleEvent = function (event) {
            let li = event.target;
            let page = li.dataset.action;
            router.navigateToPage(page + "/" + li.id);
        };

        //setzt den Post mit allen Daten
        let page = document.getElementById('blogDetail').cloneNode(true);
        page.removeAttribute('id');
        helper.setDataInfo(page, data);
        const aside = page.querySelector('aside');
        let counter = 0;

        //Setzt alle Kommentare
        data.commentaries.forEach(commentary => {
            let commentElement = document.getElementById('commentary').cloneNode(true);
            helper.setDataInfo(commentElement, commentary);
            aside.appendChild(commentElement);
            let buttonDeleteComment = page.querySelectorAll("button.deleteComment")[counter];
            buttonDeleteComment.id = bid;
            buttonDeleteComment.addEventListener("click", commentary.delete);
            counter++;

        });



        let buttonEdit = page.querySelector(".editansichtDetail");
        console.log(buttonEdit);
        buttonEdit.id = bid + "/" + data.postId;
        buttonEdit.addEventListener("click", handleEvent);


        page.querySelector('.delete').addEventListener('click', data.delete);
        //page.querySelector('.edit').addEventListener('click', router.handleNavigationEvent.bind(router))
        page.querySelector('.backToOverview').addEventListener('click', router.handleNavigationEvent.bind(router));

        // Aufruf zum Ersetzen der alten Seite
        return page;
    }
};

// Formular fuer das Editieren und Anlegen eines neuen Person-Objekts
const editView = {

    render(data) {

        //setzt den Post mit allen Daten
        let page = document.getElementById('blogEdit').cloneNode(true);
        page.removeAttribute('id');
        helper.setDataInfo(page, data);

        //speichert alle Änderungen ab
        page.querySelector('.backToOverview').addEventListener('click', router.handleNavigationEvent.bind(router));
        const saveButton = page.querySelector('.save');
        const provider = {
            provide: () => ({
                title: page.querySelector('#title').value,
                content: page.querySelector('#content').value
            })
        };

        saveButton.addEventListener('click', data.save(provider));
        return page;
    }

};

// helper enthält Methoden, die in mehreren Views benötigt werden.
const helper = {
    // Ersetzt alle %bezeichner Texte in element durch die
    // gleichnamigen Attributwerte des Objekts
    setDataInfo(element, object) {

        let cont = element.innerHTML;


        for (let key in object) {

            let rexp = new RegExp("%" + key, "g");

            cont = cont.replace(rexp, object[key]);

        }
        element.innerHTML = cont;

    },

    // Setzt bei einer Auswahlliste die Optionen aus options
    setOptions(list, options) {
        for (let o of options) {
            let opt = new Option(o, o);
            list.append(opt);

        }
    }
};
