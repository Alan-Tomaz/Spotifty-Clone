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
            window.location.href = localStorage['root-url'];
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
                window.location.href = localStorage['root-url']
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


    const _getCurrentUserPlaylists = async (token, limit) => {

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

    const _getCurrentSavedArtists = async (token, limit) => {


        const result = await fetch(`https://api.spotify.com/v1/me/following?type=artist&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        const data = await result.json();
        return data;

    }

    const _getCurrentSavedAlbums = async (token, limit) => {

        const offset = 0;

        const result = await fetch(`https://api.spotify.com/v1/me/albums?limit=${limit}&offset=${offset}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });


        const data = await result.json();
        return data;

    }

    const _getCurrentSavedEpisodes = async (token, limit) => {

        const offset = 0;

        const result = await fetch(`https://api.spotify.com/v1/me/episodes?limit=${limit}&offset=${offset}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });


        const data = await result.json();
        return data;

    }

    const _getCurrentSavedTracks = async (token, limit) => {

        const offset = 0;

        const result = await fetch(`https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });


        const data = await result.json();
        return data;
    }

    const _getCurrentPlayingTrack = async (token) => {

        const result = await fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (result.status == 204) {
            return false
        } else {
            const data = await result.json();
            return data;
        }

    }

    const _getTrack = async (token, trackId) => {

        const result = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });


        const data = await result.json();
        return data;
    }

    const _getEpisode = async (token, episodeId) => {

        const result = await fetch(`https://api.spotify.com/v1/episodes/${episodeId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });


        const data = await result.json();
        return data;
    }

    const _getCurrentPlaylistInfo = async (token, playlistId) => {

        const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });


        const data = await result.json();
        return data;
    }

    const _getCurrentAlbumInfo = async (token, albumId) => {

        const result = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });


        const data = await result.json();
        return data;
    }

    const _getCurrentArtistInfo = async (token, artistId) => {

        const result = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });


        const data = await result.json();
        return data;
    }

    const _getCurrentEpisodes = async (token, limit) => {

        const result = await fetch(`https://api.spotify.com/v1/episodes?limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });


        const data = await result.json();
        return data;
    }

    const _getCurrentPlaylistTracks = async (token, playlistId, limit) => {

        const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });


        const data = await result.json();
        return data;
    }

    const _getCurrentAlbumTracks = async (token, albumId, limit) => {

        const result = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks?limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });


        const data = await result.json();
        return data;
    }

    const _getCurrentArtistTopTracks = async (token, artistId) => {

        const result = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks`, {
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
        getCurrentUserPlaylists(token, limit) {
            return _getCurrentUserPlaylists(token, limit);
        },
        getCurrentSavedArtists(token, limit) {
            return _getCurrentSavedArtists(token, limit);
        },
        getCurrentSavedAlbums(token, limit) {
            return _getCurrentSavedAlbums(token, limit);
        },
        getCurrentSavedEpisodes(token, limit) {
            return _getCurrentSavedEpisodes(token, limit);
        },
        getCurrentSavedTracks(token, limit) {
            return _getCurrentSavedTracks(token, limit);
        },
        getCurrentPlayingTrack(token) {
            return _getCurrentPlayingTrack(token);
        },
        getTrack(token, trackId) {
            return _getTrack(token, trackId);
        },
        getEpisode(token, episodeId) {
            return _getEpisode(token, episodeId);
        },
        getCurrentPlaylistInfo(token, playlistId) {
            return _getCurrentPlaylistInfo(token, playlistId);
        },
        getCurrentAlbumInfo(token, albumId) {
            return _getCurrentAlbumInfo(token, albumId);
        },
        getCurrentArtistInfo(token, artistId) {
            return _getCurrentArtistInfo(token, artistId);
        },
        getCurrentEpisodes(token, limit) {
            return _getCurrentEpisodes(token, limit);
        },
        getCurrentPlaylistTracks(token, trackId, limit) {
            return _getCurrentPlaylistTracks(token, trackId, limit);
        },
        getCurrentAlbumTracks(token, trackId, limit) {
            return _getCurrentAlbumTracks(token, trackId, limit);
        },
        getCurrentArtistTopTracks(token, artistId) {
            return _getCurrentArtistTopTracks(token, artistId);
        }

    }
})();

//UI Controller Module
const UIController = (function () {

    const DOMElements = {
        playlistsDiv: '.playlists',
        mainEpisodes: '.main-episodes',
        mainFavorits: '.main-favorits',
        favoritArtists: '.favorit-artists',
        favoritAlbums: '.favorit-albums',
        favoritPlaylists: '.favorit-playlists'
    }

    function _formatTime(time) {
        let month;
        switch (time[1]) {
            case '01':
                month = 'Jan';
            case '02':
                month = 'Feb';
            case '03':
                month = 'Mar';
            case '04':
                month = 'Apr';
            case '05':
                month = 'May';
            case '06':
                month = 'Jun';
            case '07':
                month = 'Jul';
            case '08':
                month = 'Aug';
            case '09':
                month = 'Sep';
            case '10':
                month = 'Oct';
            case '11':
                month = 'Nov';
            case '12':
                month = 'Dec';
        }
        return month + " " + time[0];
    }

    function _formatName(newName) {
        if (newName.length >= 20) {
            return newName.slice(0, 20) + '...';
        } else {
            return newName;
        }
    }

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

        createPlaylist(id, name, imgUrl, userName) {
            const html = `
            <li class="playlist-item playlist-item-1" id="${id}">
                <div class="playlist">
                    <div class="playlist-img">
                        <img src="${imgUrl}" alt="playlist-img">
                    </div>
                    <div class="playlist-info">
                        <h3 id="playlist-name">${_formatName(name)}</h3>
                        <p id="left-card-type">
                            Playlist • ${userName} 
                        </p>
                    </div>
                </div>
            </li>
            `
            document.querySelector(DOMElements.playlistsDiv).insertAdjacentHTML('beforeend', html);
        },

        createAlbum(id, name, imgUrl, artist) {
            const html = `
            <li class="playlist-item album-item" id="${id}">
                <div class="playlist">
                    <div class="playlist-img">
                        <img src="${imgUrl}" alt="playlist-img">
                    </div>
                    <div class="playlist-info">
                        <h3 id="playlist-name">${_formatName(name)}</h3>
                        <p id="left-card-type">
                            Album • ${artist} 
                        </p>
                    </div>
                </div>
            </li>
            `
            document.querySelector(DOMElements.playlistsDiv).insertAdjacentHTML('beforeend', html);
        },

        createSavedArtist(id, name, imgUrl) {
            const html = `
            <li class="playlist-item artist-item" id="${id}">
                <div class="playlist artist">
                    <div class="playlist-img artist-img">
                    <img src="${imgUrl}" alt="artist-img">
                </div>
                <div class="playlist-info">
                    <h3 id="artist-name">${_formatName(name)}</h3>
                    <p id="left-card-type">
                        Artist
                    </p>
                </div>
                </div>
            </li>`
            document.querySelector(DOMElements.playlistsDiv).insertAdjacentHTML('beforeend', html);
        },

        createEpisodeCard(id, name, imgUrl, addDate) {
            const date = addDate.split('-');
            const html = `
            <div class="card card-1 episode-card" id="${id}">
                <div class="card-img">
                    <img src="${imgUrl}" alt="">
                        <button class="play-media">
                                <svg role="img" height="24" width="24" aria-hidden="true"
                                viewBox="0 0 24 24" data-encore-id="icon"
                                class="Svg-sc-ytk21e-0 haNxPq">
                                    <path
                                        d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                                    </path>
                                </svg>
                            </button>
                </div>
                <div class="card-info">
                <h3 class="card-title">${_formatName(name)}</h3>
                    <h4 class="card-artist">${_formatTime(date)}</h4>
                </div>
            </div>
            `
            document.querySelector(DOMElements.mainEpisodes).insertAdjacentHTML('beforeend', html);
        },

        createTrackCard(id, name, imgUrl, artist) {
            const html = `
            <div class="card card-1 track-card" id="${id}">
                <div class="card-img">
                    <img src="${imgUrl}" alt="">
                    <button class="play-media">
                        <svg role="img" height="24" width="24" aria-hidden="true"
                        viewBox="0 0 24 24" data-encore-id="icon"
                        class="Svg-sc-ytk21e-0 haNxPq">
                            <path
                            d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                            </path>
                        </svg>
                    </button>
                </div>
                <div class="card-info">
                <h3 class="card-title">${_formatName(name)}</h3>
                <h4 class="card-artist">${artist}</h4>
                </div>
            </div>
            `
            document.querySelector(DOMElements.mainFavorits).insertAdjacentHTML('beforeend', html);
        },

        createArtistCard(id, artistName, imgUrl) {
            const html = `
            <div class="card card-1 artist-card" id="${id}">
                <div class="card-img">
                    <img src="${imgUrl}" alt="">
                    <button class="play-media">
                        <svg role="img" height="24" width="24" aria-hidden="true"
                        viewBox="0 0 24 24" data-encore-id="icon"
                        class="Svg-sc-ytk21e-0 haNxPq">
                        <path
                            d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                        </path>
                        </svg>
                    </button>
                </div>
                <div class="card-info">
                    <h3 class="card-title">${_formatName(artistName)}</h3>
                    <h4 class="card-artist">Artist</h4>
                </div>
            </div>
            `
            document.querySelector(DOMElements.favoritArtists).insertAdjacentHTML('beforeend', html);
        },

        createAlbumCard(id, name, imgUrl, artist) {
            const html = `
            <div class="card card-1 album-card" id="${id}">
                <div class="card-img">
                    <img src="${imgUrl}" alt="">
                    <button class="play-media">
                        <svg role="img" height="24" width="24" aria-hidden="true"
                        viewBox="0 0 24 24" data-encore-id="icon"
                        class="Svg-sc-ytk21e-0 haNxPq">
                        <path
                            d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                        </path>
                        </svg>
                    </button>
                </div>
                <div class="card-info">
                        <h3 class="card-title">${_formatName(name)}</h3>
                        <h4 class="card-artist"> Album • ${artist}</h4>
                </div>
            </div>
            `
            document.querySelector(DOMElements.favoritAlbums).insertAdjacentHTML('beforeend', html);
        },

        createPlaylistCard(id, name, imgUrl, ownerName) {
            const html = `
            <div class="card card-1 playlist-cards" id="${id}">
                <div class="card-img">
                    <img src="${imgUrl}" alt="">
                    <button class="play-media">
                        <svg role="img" height="24" width="24" aria-hidden="true"
                        viewBox="0 0 24 24" data-encore-id="icon"
                        class="Svg-sc-ytk21e-0 haNxPq">
                        <path
                            d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                        </path>
                        </svg>
                    </button>
                </div>
                <div class="card-info">
                    <h3 class="card-title">${_formatName(name)}</h3>
                    <h4 class="card-artist">Playlist • ${ownerName}</h4>
                </div>
            </div>
            `
            document.querySelector(DOMElements.favoritPlaylists).insertAdjacentHTML('beforeend', html);
        }
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
        playlistUserName: '#playlist-user-name',
        //lateral bar items
        playlistItems: '.playlist-item',
        artistItems: '.artist-item',
        albumItems: '.album-item',
        //main content items
        episodeCards: '.episode-card',
        trackCards: '.track-card',
        artistCards: '.artist-card',
        albumCards: '.album-card',
        playlistCards: '.playlist-cards',
        favoritSongs: '#favorit-songs',
        //player elements
        musicPanel: '.music-panel',
        playerMusicImg: '#player-music-img',
        musicName: '.music-name',
        musicAuthor: '.music-author',
        actualTimeBar: '.actual-time-bar',
        actualVolume: '.actualVolume',
        pause: '.pause',
        resume: '.resume',
        musicBtn: '.music-btn'
    }

    /* Default Window with the Playlists and Artists */
    function defaultWindow() {
        //Show the Default Window
        function showWindow() {
            document.querySelector(DOMElements.mixSection).style.display = 'flex';
            document.querySelector(DOMElements.gradient1).style.display = 'flex';
            document.querySelector(DOMElements.playTrack).style.opacity = '0';
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
            document.querySelector(DOMElements.playTrack).style.cursor = 'default';

            document.querySelector(DOMElements.mainElement).addEventListener('scroll', (event) => {
                document.querySelector(DOMElements.mainHeader).style.backgroundColor = "#121212";
                if (document.querySelector(DOMElements.mainElement).scrollTop >= 100) {
                    document.querySelector(DOMElements.playTrack).style.opacity = '0';
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

        const midiaId = this;
        console.log(midiaId)
        async function changeWindow() {
            if (midiaId.id != "") {
                switch (midiaId) {
                    case (midiaId.classList.contains('playlist-item-1')):
                    case (midiaId.classList.contains('playlist-cards')):
                        //get token
                        const token = localStorage['token'];
                        //get tracks
                        const playlistInfo = await APICtrl.getCurrentPlaylistInfo(token, midiaId.id);
                        const playlistTracks = await APICtrl.getCurrentPlaylistTracks(token, midiaId.id, 20);
                        console.log(playlistInfo);
                        playlistTracks.items.forEach((element, index) => {
                            UICtrl.createTrack(index, element.id, element.name, element.album.images[0].url, element.artists[0].name, element.album.name, element.added_at, element.duration_ms);
                        });

                        break;
                }
            } else if (midiaId == "episodes") {

            } else if (midiaId != "favorits") {

            }
        }

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

        changeWindow();
        changeBackgroundColor();
        changeHeaderOnScrollAlternative();
        previousWindow();
        hideWindow();
        showAlternativeWindow();

    }

    // Store Token
    const storeToken = async () => {
        localStorage['token'] = await APICtrl.getToken(await APICtrl.checkCode());

        if (localStorage['token'] != undefined) {
            changeContentWithAPI().then(clarifyApp);
        }
    }

    //Change content with the data of the API
    const changeContentWithAPI = async () => {

        /* ================= LATERAL SIDEBAR ====================== */
        function _lateralSidebar() {
            //Get Profile Info
            async function _changeUserInfo() {
                //get token
                const token = localStorage['token'];
                //get user info
                const userProfileData = await APICtrl.getUserProfile(token);
                //change UI user info
                document.querySelector(DOMElements.userImg).src = userProfileData.images[0].url;
            }

            async function _getUserPlaylists() {
                //get token
                const token = localStorage['token'];
                //get user playlists
                const userPlaylists = await APICtrl.getCurrentUserPlaylists(token, 10);

                userPlaylists.items.forEach(element => {
                    UICtrl.createPlaylist(element.id, element.name, element.images[0].url, element.owner.display_name);
                });
                document.querySelectorAll(DOMElements.playlistItems).forEach(element => element.addEventListener('click', alternativeWindow));
            }

            async function _getUserAlbums() {
                //get token
                const token = localStorage['token'];
                //get user playlists
                const userAlbums = await APICtrl.getCurrentSavedAlbums(token, 10);
                userAlbums.items.forEach(element => {
                    UICtrl.createAlbum(element.album.id, element.album.name, element.album.images[0].url, element.album.artists[0].name);
                });
                document.querySelectorAll(DOMElements.albumItems).forEach(element => element.addEventListener('click', alternativeWindow));
            }

            async function _getSavedArtists() {
                //get token
                const token = localStorage['token'];
                //get user playlists
                const userArtists = await APICtrl.getCurrentSavedArtists(token, 10);

                userArtists.artists.items.forEach(element => {
                    UICtrl.createSavedArtist(element.id, element.name, element.images[0].url);
                });
                document.querySelectorAll(DOMElements.artistItems).forEach(element => element.addEventListener('click', alternativeWindow));
            }

            async function getCurrentPlayingTrack() {
                const token = localStorage['token'];
                //get user playlists
                const currentPlayingTrack = await APICtrl.getCurrentPlayingTrack(token);
            }

            getCurrentPlayingTrack()
            _getUserAlbums();
            _getSavedArtists();
            _changeUserInfo();
            _getUserPlaylists();
        }

        function _mainContent() {
            async function _getEpisodes() {
                //get token
                const token = localStorage['token'];
                //get episodes
                const userSavedEpisodes = await APICtrl.getCurrentSavedEpisodes(token, 5);
                userSavedEpisodes.items.forEach(element => {
                    UICtrl.createEpisodeCard(element.episode.id, element.episode.name, element.episode.images[0].url, element.episode.release_date);
                });
                document.querySelectorAll(DOMElements.episodeCards).forEach(element => element.addEventListener('click', alternativeWindow));
            }

            async function _getSavedTracks() {
                //get token
                const token = localStorage['token'];
                //get episodes
                const userSavedTracks = await APICtrl.getCurrentSavedTracks(token, 5);
                userSavedTracks.items.forEach(element => {
                    UICtrl.createTrackCard(element.track.id, element.track.name, element.track.album.images[0].url, element.track.artists[0].name);
                });
                document.querySelectorAll(DOMElements.trackCards).forEach(element => element.addEventListener('click', alternativeWindow));
                document.querySelector(DOMElements.favoritSongs).innerHTML = `Playlist • ${userSavedTracks.total} songs`
            }

            async function _getFavoritArtists() {
                //get token
                const token = localStorage['token'];
                //get episodes
                const userFavoritArtists = await APICtrl.getCurrentSavedArtists(token, 5);
                userFavoritArtists.artists.items.forEach(element => {
                    UICtrl.createArtistCard(element.id, element.name, element.images[0].url);
                });
                document.querySelectorAll(DOMElements.artistCards).forEach(element => element.addEventListener('click', alternativeWindow));
            }

            async function _getFavoritAlbums() {
                //get token
                const token = localStorage['token'];
                //get episodes
                const userFavoritAlbums = await APICtrl.getCurrentSavedAlbums(token, 5);
                userFavoritAlbums.items.forEach(element => {
                    UICtrl.createAlbumCard(element.album.id, element.album.name, element.album.images[0].url, element.album.artists[0].name);
                });
                document.querySelectorAll(DOMElements.albumCards).forEach(element => element.addEventListener('click', alternativeWindow));
            }

            async function _getFavoritPlaylists() {
                //get token
                const token = localStorage['token'];
                //get episodes
                const userFavoritPlaylists = await APICtrl.getCurrentUserPlaylists(token, 5);
                userFavoritPlaylists.items.forEach(element => {
                    UICtrl.createPlaylistCard(element.id, element.name, element.images[0].url, element.owner.display_name);
                });
                document.querySelectorAll(DOMElements.playlistCards).forEach(element => element.addEventListener('click', alternativeWindow));
            }

            _getFavoritPlaylists()
            _getFavoritAlbums();
            _getFavoritArtists();
            _getSavedTracks();
            _getEpisodes();
        }

        function _player() {
            async function getCurrentTrackPlaying() {
                //get token
                const token = localStorage['token'];
                //get episodes
                const trackPlaying = await APICtrl.getCurrentPlayingTrack(token);
                if (trackPlaying == false) {
                    document.querySelector(DOMElements.musicPanel).style.visibility = 'hidden';
                } else {
                    if (trackPlaying.is_playing == true) {
                        document.querySelector(DOMElements.pause).style.display = 'flex';
                        document.querySelector(DOMElements.resume).style.display = 'none';
                    }
                    document.querySelector(DOMElements.musicAuthor).innerHTML = trackPlaying.item.artists[0].name;
                    document.querySelector(DOMElements.musicName).innerHTML = trackPlaying.item.name;
                    document.querySelector(DOMElements.playerMusicImg).src = trackPlaying.item.album.images[0].url;

                    function setProgressBar(x, y) {
                        return (x / y) * 100;
                    }

                    document.querySelector(DOMElements.actualTimeBar).style.width = `${setProgressBar(trackPlaying.progress_ms, trackPlaying.item.duration_ms)}%`;

                }
            }

            getCurrentTrackPlaying();
        }

        _player();
        _mainContent();
        _lateralSidebar();
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
            storeToken();
        }
    }

})(APIController, UIController)

//start the APP;
APPController.init();