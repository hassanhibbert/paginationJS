/*jshint browser: true*/
var pagination = (function (options) {
    "use strict";

    var method = {},
        defaults,
        currentPage,
        utils = {
            // check if element has a class
            hasClass: function (element, className) {
                return element.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(element.className);
            },
            // add class to element
            addClass: function (element, classname) {
                var cn;
                cn = element.className;
                if (cn.indexOf(classname) != -1) {
                    return;
                }
                if (cn !== '') {
                    classname = ' ' + classname;
                }
                element.className += classname;
            },
            // remove class from element
            removeClass: function (element, classname) {
                var cn;
                cn = element.className;
                if (cn.indexOf(classname) != -1) {
                    var rxp = new RegExp('(\\s|^)' + classname + '(\\s|$)');
                    element.className = element.className.replace(rxp, ' ').trim();
                }
            },
            // extend default options
            extendDefaults: function (source, properties) {
                var property;
                for (property in properties) {
                    if (properties.hasOwnProperty(property)) {
                        source[property] = properties[property];
                    }
                }
                return source;
            }
        };

    function runPagination(el, options) {
        var elemItemList = el.children;

        // set the current page for corrisponding nav that has the class 'active-page'
        function setCurrentPage() {
            var navItemList = document.querySelector('.pagination-nav ul').children;
            for (var i = 0; i < navItemList.length; i++) {
                if (utils.hasClass(navItemList[i], 'active-page')) {
                    currentPage = navItemList[i].getAttribute('data-id');
                    showHide(currentPage);
                }
            }
        }
        
        // pagination nav handler
        // handle click events / showHide pages
        function NavHandler(e) {
            var navItemList = document.querySelector('.pagination-nav ul').children;
            currentPage = e.target.getAttribute('data-id');
            for (var i = 0; i < navItemList.length; i++) {
                if (utils.hasClass(navItemList[i], 'active-page')) {
                    utils.removeClass(navItemList[i], 'active-page');
                }
            }
            utils.addClass(e.target, 'active-page');
            showHide(currentPage);
        }

        // hide or show pages based on current page passed into function
        function showHide(currentPage) {
            for (var i = 0; i < elemItemList.length; i++) {
                if (!utils.hasClass(elemItemList[i], currentPage)) {
                    utils.addClass(elemItemList[i], 'hide');
                } else {
                    utils.removeClass(elemItemList[i], 'hide');
                }
            }
        }
        
        var pageCount = 1;
        // setup element classes for pagination control
        function setupPages() {
            for (var i = 0; i < elemItemList.length; i++) {
                if ((i < (pageCount * options.listLimit)) && (i >= (pageCount - 1) * options.listLimit)) {
                    utils.addClass(elemItemList[i], 'page' + pageCount);
                } else {
                    utils.addClass(elemItemList[i], 'page' + (pageCount + 1));
                    pageCount++;
                }
            }
        }

        // build out the nav menu
        function buildNav(currentPage) {
            setupPages();
            var numberOfPages = pageCount,
                navElem = document.querySelector('.pagination-nav'),
                docFrag = document.createDocumentFragment(),
                newUL = document.createElement('ul');
            // build out li tags
            for (var i = 1; i < (numberOfPages + 1); i++) {
                var newLI = document.createElement('li');
                newLI.setAttribute('data-id', 'page' + i);
                newLI.innerHTML = i;
                if (i === currentPage) {
                    newLI.setAttribute('class', 'active-page');
                }
                // append new li tags to ul
                newUL.appendChild(newLI);
            }
            docFrag.appendChild(newUL);
            navElem.appendChild(docFrag);
            navElem.addEventListener('click', NavHandler, false);
        }

        // build nav and pass the current page option
        buildNav(options.currentPage);
        
        // set current page
        setCurrentPage();
        
        // remove hide class once script is complete
        utils.removeClass(el, 'hide'); 
    }

    // public function exposed to start the pagination script
    method.init = function (el, obj) {
        utils.addClass(el, 'hide'); //  hide pagination until script is complete
        defaults = {
            listLimit: 5,
            currentPage: 1
        };
        if (obj && typeof obj === "object") {
            options = utils.extendDefaults(defaults, obj);
        } else {
            options = defaults;
        }
        
        // run pagination script
        runPagination(el, options);
    };
    return method;
})();