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

    function runPaginate(el, options) {
        var elemItemList = el.children;

        // set the current page to be visible
        function setCurrentPage() {
            var navItemList = document.querySelector('.pagination-nav ul').children;
            for (var i = 0; i < navItemList.length; i++) {
                if (utils.hasClass(navItemList[i], 'active-page')) {
                    currentPage = navItemList[i].getAttribute('data-id');
                    showHide(currentPage);
                }
            }
        }
        
        // Event handler for nav click events.
        function NavHandler(e) {
            var navItemList = document.querySelectorAll('.pagination-nav ul');
            var currentPage = e.target.getAttribute('data-id');
            if (currentPage) {
                // if there's a single pagination-nav element or two, this applies the same action
                // for both nav elements if either one is clicked
                for (var j = 0; j < navItemList.length; j++) {
                    var navBoth = navItemList[j].children;
                    for (var i = 0; i < navBoth.length; i++) {
                        if (utils.hasClass(navBoth[i], 'active-page')) {
                            utils.removeClass(navBoth[i], 'active-page');
                        }
                        if (navBoth[i].getAttribute('data-id') == currentPage && navBoth[i].className !== 'active-page') {
                            utils.addClass(navBoth[i], 'active-page');
                        }
                    }
                }
                showHide(currentPage);
            }
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
        // setup page classes for pagination
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
            var navElem = document.querySelectorAll('.pagination-nav');
            setupPages();
            var numberOfPages = pageCount,
                docFrag = document.createDocumentFragment(),
                newUL = document.createElement('ul');
            // create list of pages
            for (var i = 1; i < (numberOfPages + 1); i++) {
                var newLI = document.createElement('li');
                newLI.setAttribute('data-id', 'page' + i);
                newLI.innerHTML = i;
                if (i === currentPage) {
                    newLI.setAttribute('class', 'active-page');
                }
                newUL.appendChild(newLI);
            }
            
            // append nav ul to document fragment
            docFrag.appendChild(newUL);
            
            // if there are two nav elements, then clone ul nav list to both elements
            if (navElem.length === 2) {
                var clone = newUL.cloneNode(true);
                for (var j = 0; j < navElem.length; ++j) {
                    navElem[j].appendChild(docFrag);
                    navElem[j].appendChild(clone);
                    navElem[j].addEventListener('click', NavHandler, false);
                }
            } else {
                navElem[0].appendChild(docFrag);
                navElem[0].addEventListener('click', NavHandler, false);
            }
        }

        // build nav and set current page
        buildNav(options.currentPage);
        
        // set the current page 
        setCurrentPage();
        
        // remove hide class once script is complete
        utils.removeClass(el, 'hide'); 
    }

    // public function exposed to start the pagination script
    method.init = function (el, obj) {
        defaults = {
            listLimit: 5,
            currentPage: 1
        };
        
        // extend defaults and assign it to 'options'
        if (obj && typeof obj === "object") {
            options = utils.extendDefaults(defaults, obj);
        } else {
            options = defaults;
        }
        
        // start paginate script
        runPaginate(el, options);
    };
    return method;
})();