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
        model.getSelf(result => {
            owner = result.displayName;
            console.log(`Presenter: Nutzer ${owner} hat sich angemeldet.`);

            model.getAllBlogs(blogs => {
                let firstBlog = blogs[0] || {};
                let {
                    id
                } = firstBlog;
                blogId = id;
                const headingData = {
                    owner,
                    blogs: blogs.map(({name, id, posts}) => ({
                        name,
                        url: '/blogOverview/' + id,
                        amount: posts.totalItems
                    }))
                };
                headingView.render(headingData);
                router.navigateToPage('/blogOverview/' + blogId);

            });
        });
    }

    function replace(page) {
        let main = document.getElementById('main-content');
        let content = main.firstElementChild;
        if (content)
            content.remove();
        if (page) {
            main.append(page);
        }
    }


    // Formatiert den Datum-String in date in zwei mögliche Datum-Strings:
    // long = false: 24.10.2018
    // long = true: Mittwoch, 24. Oktober 2018, 12:21
    function formatDate(date, long = false) {

        let longOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric'
        };
        let shortOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        };

        return long
            ? new Date(date).toLocaleDateString('de-DE', longOptions)
            : new Date(date).toLocaleDateString('de-DE', shortOptions)
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
                location.reload();







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
            model.getBlog(bid, ({name, published, updated, url}) => {
                    model.getAllPostsOfBlog(bid, data => {
                        let posts = [];
                        if (data) {
                            posts = data.map(post => {
                                return ({
                                    bid,
                                    postId: post.id,
                                    numberOfComments: post.replies.totalItems,
                                    published: formatDate(post.published),
                                    updated: formatDate(post.updated),
                                    title: post.title,
                                    delete: (event) => {
                                        event.preventDefault();
                                        const confirm = window.confirm(`Soll ${post.title} wirklich gelöscht werden?`);
                                        if (confirm) {
                                            model.deletePost(bid, post.id, (data) => {
                                                router.navigateToPage(`/blogOverview/${bid}`)
                                            });
                                        }
                                    }

                                });
                            });
                        }
                        const toRender = {
                            blogId,
                            name,
                            published: formatDate(published),
                            updated: formatDate(updated),
                            amountOfPosts: posts.length,
                            url: url,
                            posts,
                            addPost: (event) => {
                                event.preventDefault();
                                model.addNewPost(bid, 'Neuer Post', 'Hier kannst du was schreiben', (data) => {
                                    router.navigateToPage(`/blogOverview/${bid}`);
                                });

                            }
                        };
                        const page = blogOverView.render(toRender, bid);

                        replace(page);
                    });
                }
            );


        },

        // Wird vom Router aufgerufen, wenn eine Blog-Detailsicht angezeigt werden soll
        showBlogDetail(blogId, postId) {
            console.log("Presenter: Anzeige Post Detail mit Blog-ID " + blogId + "und Post-ID " + postId);

            model.getBlog(blogId, ({name}) => {
                model.getPost(blogId, postId, ({title, published, updated, content}) => {
                    model.getAllCommentsOfPost(blogId, postId, (data) => {
                        const commentaries = data ? data : [];
                        const toRender = {
                            blogId,
                            postId,
                            title,
                            name,

                            published: formatDate(published, true),
                            updated: formatDate(updated, true),
                            content,

                            delete: (event) => {
                                const confirm = window.confirm(`Soll dieser Post wirklich gelöscht werden?`);
                                if (confirm) {
                                    event.preventDefault();
                                    model.deletePost(blogId, postId, () => {
                                        router.navigateToPage(`/blogOverview/${blogId}`);
                                    });
                                }
                            },
                            commentaries: commentaries.map(({author, content, published, id}) => ({
                                name: author.displayName,
                                id,
                                content,
                                published: formatDate(published, true),

                                delete: (event) => {
                                    event.preventDefault();
                                    const confirm = window.confirm(`Soll der Kommentar wirklich gelöscht werden?`);
                                    if (confirm) {
                                        model.deleteComment(blogId, postId, id, (data) => {
                                            router.navigateToPage(`/blogOverview/${blogId}`);
                                        });
                                    }
                                }
                            }))
                        };
                        const page = detailView.render(toRender, blogId);
                        replace(page);
                    });
                });
            });
        }
        ,
        // Wird vom Router aufgerufen, wenn eine Blog-Editsicht angezeigt werden soll
        showBlogEdit(blogId, postId) {

            console.log("Presenter: Anzeige Post Edit mit Blog-ID " + blogId + "und Post-ID " + postId);
            model.getBlog(blogId, ({name}) => {
            model.getPost(blogId, postId, ({title, published, updated, content}) => {

                const toRender = {
                    blogId,
                    postId,
                    title,
                    name,
                    published: formatDate(published, true),
                    updated: formatDate(updated, true),
                    content
                };

                toRender.save = provider => event => {
                    event.preventDefault();
                    const data = provider.provide();
                    model.updatePost(blogId, postId, data.title, data.content, () => {
                        router.navigateToPage(`/postOverview/${postId}/blogOverview/${blogId}`);
                    });
                };

                const page = editView.render(toRender);
                replace(page);

            });
        });
        }
    };


})();
