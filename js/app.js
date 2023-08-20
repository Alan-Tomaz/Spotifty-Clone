//Reset the Window
localStorage['hasAlternativeWindow'] = false;

// ------------------ MODULE PATTERN -------------------
//IIFE
//API Controler Module
const APIController = (function () {

    //APP CREDENTIALS
    const redirectUri = localStorage['redirect-uri'];
    const clientId = localStorage['client-id'];
    const clientSecret = localStorage['client-secret'];


    // private methods
    const _checkCode = async () => {
        const queryString = window.location.search;
        if (queryString.length > 0) {
            const urlParams = new URLSearchParams(queryString);
            const code = urlParams.get('code');
            localStorage['code'] = code;
            return code;
        } else {
            window.location.href = "http://127.0.0.1:5500"
        }
    }

    const _getToken = async (code) => {

        //request a new token
        if (localStorage['refresh-token'] != undefined || localStorage['token'] != undefined) {
            const refreshToken = localStorage['refresh-token'];
            const params = new URLSearchParams();
            params.append("grant_type", "refresh_token");
            params.append('refresh_token', refreshToken);
            params.append('client_id', clientId);

            const result = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
                },
                body: params
            });

            const data = await result.json();
            console.log(data);
            if (data.error != undefined) {
                window.location.href = "http://127.0.0.1:5500"
            } else {
                localStorage['refresh-token'] = data.refresh_token != undefined ? data.refreshToken : localStorage['refresh-token'];
                return data.access_token;
            }
        }
        //request a new token to 0
        else {
            //request body
            const params = new URLSearchParams();
            params.append("grant_type", "authorization_code");
            params.append('code', code);
            params.append('redirect_uri', encodeURI(redirectUri));
            params.append('client_id', clientId);
            params.append('client_secret', clientSecret);

            console.log(params.toString())

            const result = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
                },
                body: params
            });

            const data = await result.json();
            console.log(data);
            localStorage['refresh-token'] = data.refresh_token;
            return data.access_token;
        }
    }


    const _getUserProfile = async (token) => {

        const result = await fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        const data = await result.json();
        return data;
    }


    const _getCurrentUserPlaylists = async (token) => {

        const limit = 10;
        const offset = 0;

        const result = await fetch(`https://api.spotify.com/v1/me/playlists?offset=${offset}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        const data = await result.json();
        return data;

    }

    return {
        checkCode() {
            return _checkCode();
        },
        getToken(code) {
            return _getToken(code);
        },
        getUserProfile(token) {
            return _getUserProfile(token);
        },
        getCurrentUserPlaylists(token) {
            return _getCurrentUserPlaylists(token);
        }
    }
})();

//UI Controller Module
const UIController = (function () {

    return {

        /* Iniciate The Dropdown Menus */
        startDropdowns() {
            /* DROPDOWN */
            const dropdowns = document.querySelectorAll('.dropdown');

            //LOOP THROUGH ALL DROPDOWN ELEMENTS
            dropdowns.forEach(dropdown => {
                //get dropdown location
                const dropdownLocation = dropdown.getBoundingClientRect();
                //change the location of the menu
                document.getElementById(`menu-${dropdown.dataset.dropdown}`).style.top = (dropdownLocation.top + 145) + "px";
                document.getElementById(`menu-${dropdown.dataset.dropdown}`).style.left = (dropdownLocation.left + 40) + "px";

                //get other elements
                const menu = dropdown.querySelector('.menu');
                const dropdownHideIcon = dropdown.querySelector(`#dropdown-hide-${dropdown.dataset.dropdown}`);
                const dropdownShowIcon = dropdown.querySelector(`#dropdown-show-${dropdown.dataset.dropdown}`);
                const options = dropdown.querySelectorAll('.option');
                const selected = dropdown.querySelector('.selected span');
                const select = dropdown.querySelector('.select');


                let isOpen = false;

                document.querySelector('main').onclick = () => {
                    dropdowns.forEach(dropdown => {
                        menu.style.display = "none";
                        dropdownHideIcon.style.display = "none"
                        dropdownShowIcon.style.display = "inline-block";
                        isOpen = false;
                    })
                }
                //create the click event
                select.addEventListener('click', () => {
                    if (isOpen == false) {
                        setTimeout(() => {
                            menu.style.display = "block";
                            dropdownHideIcon.style.display = "inline-block"
                            dropdownShowIcon.style.display = "none";
                            isOpen = true;
                        }, 50);
                    } else {
                        menu.style.display = "none";
                        dropdownHideIcon.style.display = "none"
                        dropdownShowIcon.style.display = "inline-block";
                        isOpen = false;
                    }
                })


                options.forEach(option => option.addEventListener('click', () => {
                    let activeElement = dropdown.querySelector('.menu .active');
                    activeElement.className = "option";
                    option.classList.add("active");
                    menu.style.display = "none";
                    dropdownHideIcon.style.display = "none"
                    dropdownShowIcon.style.display = "inline-block";
                    selected.innerHTML = option.querySelector("span").innerHTML;
                    isOpen = false;
                }))
            })
        },
    }
})()

//APP Controller Module
const APPController = (function (APICtrl, UICtrl) {

    localStorage['hasAlternativeWindow'] = true;

    //Main elements in the APP
    const DOMElements = {
        //app element
        app: '#app-main',
        //main element
        mainElement: '.main',
        //main content header
        mainHeader: '.main-content',
        mainHeaderAlternative: '#main-content-alternative',
        playTrack: '.play-track',
        //Default Window Elements
        gradient1: '.gradient-1',
        mixSection: '.mix-section',
        //Alternative Window Elements
        playlistBand: '.playlist-band',
        playlistPlay: '.playlist-play',
        playlistTracks: '.playlist-tracks',
        gradient2: '.gradient-2',
        //Change Window Buttons
        moveLeft: '.move-left',
        moveRight: '.move-right',
        //Track list
        playlistImg: '#playlist-img',
        trackHeader: '#track-header',
        //user elements
        userImg: '#profile-img',
        forMe: '#for-me',
        playlistUserImg: '#playlist-user-img',
        playlistUserName: '#playlist-user-name'
    }

    /* Default Window with the Playlists and Artists */
    function defaultWindow() {
        //Show the Default Window
        function showWindow() {
            document.querySelector(DOMElements.mixSection).style.display = 'flex';
            document.querySelector(DOMElements.gradient1).style.display = 'flex';
        }

        function hideAlternativeWindow() {
            document.querySelector(DOMElements.playlistBand).style.display = 'none';
            document.querySelector(DOMElements.playlistPlay).style.display = 'none';
            document.querySelector(DOMElements.playlistTracks).style.display = 'none';
        }

        function nextWindow() {
            if (localStorage['hasAlternativeWindow'] == 'true') {
                document.querySelector(DOMElements.moveRight).style.backgroundColor = "#000000B3";
                document.querySelector(DOMElements.moveRight).style.color = "white";
                document.querySelector(DOMElements.moveRight).style.cursor = "pointer";
                document.querySelector(DOMElements.moveRight).addEventListener('click', alternativeWindow);
            }
        }

        // Change the Header color on scroll
        function changeHeaderOnScrollDefault() {
            document.querySelector(DOMElements.mainHeader).style.background.color = "transparent";
            document.querySelector(DOMElements.playTrack).style.opacity = '0';
            document.querySelector(DOMElements.playTrack).style.cursor = 'default';

            document.querySelector(DOMElements.mainElement).addEventListener('scroll', (event) => {
                document.querySelector(DOMElements.mainHeader).style.backgroundColor = "#121212";
                if (document.querySelector(DOMElements.mainElement).scrollTop >= 100) {
                    document.querySelector(DOMElements.mainHeader).style.backgroundColor = "#121212";
                    document.querySelector(DOMElements.mainHeaderAlternative).style.backgroundColor = 'transparent';
                }
                if (document.querySelector(DOMElements.mainElement).scrollTop < 100) {
                    document.querySelector(DOMElements.mainHeader).style.backgroundColor = "transparent";
                    document.querySelector(DOMElements.mainHeaderAlternative).style.backgroundColor = 'transparent';
                }

            })
        }

        nextWindow();
        showWindow();
        hideAlternativeWindow();
        changeHeaderOnScrollDefault();
    }

    function getAverageRGB(imgEl) {

        var blockSize = 5, // only visit every 5 pixels
            defaultRGB = {
                r: 0,
                g: 0,
                b: 0
            }, // for non-supporting envs
            canvas = document.createElement('canvas'),
            context = canvas.getContext && canvas.getContext('2d'),
            data, width, height,
            i = -4,
            length,
            rgb = {
                r: 0,
                g: 0,
                b: 0
            },
            count = 0;

        if (!context) {
            return defaultRGB;
        }

        height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
        width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

        context.drawImage(imgEl, 0, 0);

        try {
            data = context.getImageData(0, 0, width, height);
        } catch (e) {
            /* security error, img on diff domain */
            return defaultRGB;
        }

        length = data.data.length;

        while ((i += blockSize * 4) < length) {
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i + 1];
            rgb.b += data.data[i + 2];
        }

        // ~~ used to floor values
        rgb.r = ~~(rgb.r / count);
        rgb.g = ~~(rgb.g / count);
        rgb.b = ~~(rgb.b / count);

        return rgb;

    }

    function alternativeWindow() {
        //Show the Default Window
        function hideWindow() {
            document.querySelector(DOMElements.mixSection).style.display = 'none';
            document.querySelector(DOMElements.gradient1).style.display = 'none';
        }

        function showAlternativeWindow() {
            document.querySelector(DOMElements.playlistBand).style.display = 'flex';
            document.querySelector(DOMElements.playlistPlay).style.display = 'flex';
            document.querySelector(DOMElements.playlistTracks).style.display = 'grid';
        }

        function previousWindow() {
            document.querySelector(DOMElements.moveLeft).style.backgroundColor = "#000000B3";
            document.querySelector(DOMElements.moveLeft).style.color = "white";
            document.querySelector(DOMElements.moveLeft).style.cursor = "pointer";
            document.querySelector(DOMElements.moveLeft).addEventListener('click', defaultWindow);
        }

        function changeHeaderOnScrollAlternative() {
            document.querySelector(DOMElements.mainHeader).style.background.color = "transparent";
            document.querySelector(DOMElements.mainElement).addEventListener('scroll', (event) => {
                document.querySelector(DOMElements.mainHeader).style.backgroundColor = "#121212";
                if (document.querySelector(DOMElements.mainElement).scrollTop >= 300) {
                    //Change The Header COlor
                    const RGB = getAverageRGB(document.querySelector(DOMElements.playlistImg));
                    document.querySelector(DOMElements.mainHeader).style.backgroundColor = `#121212`;
                    document.querySelector(DOMElements.mainHeaderAlternative).style.backgroundColor = `rgb(${RGB.r}, ${RGB.g}, ${RGB.b}, 0.5)`;
                }
                if (document.querySelector(DOMElements.mainElement).scrollTop < 300) {
                    document.querySelector(DOMElements.mainHeader).style.backgroundColor = "transparent";
                    document.querySelector(DOMElements.mainHeaderAlternative).style.backgroundColor = 'transparent';
                }

                if (document.querySelector(DOMElements.mainElement).scrollTop >= 400) {
                    //Show Play Button
                    document.querySelector(DOMElements.playTrack).style.opacity = '1';
                    document.querySelector(DOMElements.playTrack).style.cursor = 'pointer';
                    //Fix Track Header
                    document.querySelector(DOMElements.trackHeader).style.backgroundColor = '#1a1a1a'
                    document.querySelector(DOMElements.trackHeader).style.margin = '0';
                    document.querySelector(DOMElements.trackHeader).style.padding = '0px 40px';
                    document.querySelector(DOMElements.trackHeader).style.borderBottom = '1px solid hsla(0, 0%, 100%, .1)';
                }

                if (document.querySelector(DOMElements.mainElement).scrollTop < 400) {
                    //Hide Play Button
                    document.querySelector(DOMElements.playTrack).style.opacity = '0';
                    document.querySelector(DOMElements.playTrack).style.cursor = 'default';
                    //Remove Fix Track Header
                    document.querySelector(DOMElements.trackHeader).style.backgroundColor = 'transparent'
                    document.querySelector(DOMElements.trackHeader).style.margin = '0 24px';
                    document.querySelector(DOMElements.trackHeader).style.padding = '0px 16px';
                    document.querySelector(DOMElements.trackHeader).style.borderBottom = '1px solid hsla(0, 0%, 100%, .1)';
                }

            })
        }

        function changeBackgroundColor() {

            const RGB = getAverageRGB(document.querySelector(DOMElements.playlistImg));
            //change band color
            document.querySelector(DOMElements.playlistBand).style.background = `linear-gradient(rgb(${RGB.r}, ${RGB.g}, ${RGB.b}) 0,rgb(${RGB.r}, ${RGB.g}, ${RGB.b}, 0.5) 100%),var(--background-noise)`;
            //change the play btn background color
            document.querySelector(DOMElements.gradient2).style.backgroundColor = `rgb(${RGB.r}, ${RGB.g}, ${RGB.b}, 0.5)`
        }

        changeBackgroundColor();
        changeHeaderOnScrollAlternative();
        previousWindow();
        hideWindow();
        showAlternativeWindow();

    }

    // Store Token
    const storeToken = async () => {
        localStorage['token'] = await APICtrl.getToken(await APICtrl.checkCode());
    }

    //Change content with the data of the API
    const changeContentWithAPI = async () => {


        //Get Profile Info
        async function _changeUserInfo() {
            //get token
            const token = localStorage['token'];
            //get user info
            const userProfileData = await APICtrl.getUserProfile(token);
            //change UI user info
            document.querySelector(DOMElements.userImg).src = userProfileData.images[0].url;
            document.querySelector(DOMElements.playlistUserImg).src = userProfileData.images[0].url;
            document.querySelector(DOMElements.playlistUserName).innerHTML = userProfileData.display_name;
            document.querySelector(DOMElements.forMe).innerHTML = `Made For ${userProfileData.display_name}`;
        }

        async function _getUserPlaylists() {
            //get token
            const token = localStorage['token'];
            //get user playlists
            const userPlaylists = await APICtrl.getCurrentUserPlaylists(token);
            console.log(userPlaylists);
        }

        _changeUserInfo();
        _getUserPlaylists();
    }

    //remove black screen
    function clarifyApp() {
        setTimeout(() => {
            document.querySelector(DOMElements.app).style.opacity = '1';
        }, 300);
    }

    return {

        init() {
            console.log("App Is Running")
            UICtrl.startDropdowns();
            defaultWindow();
            //get and store token and initiate the API interaction
            storeToken().then(changeContentWithAPI().then(clarifyApp));
        }
    }

})(APIController, UIController)

//start the APP;
APPController.init();