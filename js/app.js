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

    const _getUser = async (token, userId) => {

        const result = await fetch(`https://api.spotify.com/v1/users/${userId}`, {
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
        getUser(token, userId) {
            return _getUser(token, userId);
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
        favoritPlaylists: '.favorit-playlists',
        //bottom alternative window elements
        tracksBody: '.tracks-body'
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

    function _formatAddedTime(time) {
        const newTime = time.split('-');
        let month;
        switch (newTime[1]) {
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
        return `${month} ${newTime[2].slice(0, 2)}, ${newTime[0]} `;
    }

    function _trackDuration(durationMs) {
        let durationTrack = durationMs;
        const trackDurationMin = Math.floor((durationMs / 1000) / 60).toFixed(0);
        durationTrack = durationTrack - ((trackDurationMin * 1000) * 60);
        if ((durationTrack / 1000) >= 1) {
            const trackDurationSec = Math.floor(durationTrack / 1000).toFixed(0);

            if (trackDurationSec > 9) {
                return `${trackDurationMin} : ${trackDurationSec}`
            } else {
                return `${trackDurationMin} : 0${trackDurationSec}`
            }
        } else {
            return `${trackDurationMin} : 00`
        }
    }

    function _formatName(newName, limit) {
        if (newName.length >= limit) {
            return newName.slice(0, limit) + '...';
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
                        <h3 id="playlist-name">${_formatName(name, 20)}</h3>
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
                        <h3 id="playlist-name">${_formatName(name, 20)}</h3>
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
                    <h3 id="artist-name">${_formatName(name, 20)}</h3>
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
                <h3 class="card-title">${_formatName(name, 20)}</h3>
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
                <h3 class="card-title">${_formatName(name, 20)}</h3>
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
                    <h3 class="card-title">${_formatName(artistName, 20)}</h3>
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
                    <h3 class="card-title">${_formatName(name, 20)}</h3>
                    <h4 class="card-artist">Playlist • ${ownerName}</h4>
                </div>
            </div>
            `
            document.querySelector(DOMElements.favoritPlaylists).insertAdjacentHTML('beforeend', html);
        },

        createPlaylistTrack(trackIndex, trackId, trackName, trackImg, trackArtistName, trackArtistId, trackAlbumName, trackAlbumId, trackAddedDate, trackDuration) {
            const html = `
                        <div class="track-row" id="${trackId}">
                                <div class="track-num track-item">
                                    <span class="track-number">${trackIndex + 1}</span>
                                    <svg role="img" height="16" width="16" aria-hidden="true" class="track-play" viewBox="0 0 24 24" data-encore-id="icon">
                                        <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                                        </path>
                                    </svg>
                                </div>
                                <div class="track-name track-item">
                                    <img src="${trackImg}" alt="">
                                    <div class="track-info">
                                        <p class="track-name-info">${_formatName(trackName, 30)}</p>
                                        <p class="track-author" id="${trackArtistId}">${_formatName(trackArtistName, 30)}</p>
                                    </div>
                                </div>
                                <div class="track-album track-item" id="${trackAlbumId}">${_formatName(trackAlbumName, 50)}</div>
                                <div class="track-added track-item">${_formatAddedTime(trackAddedDate)}</div>
                                <div class="track-time track-item">
                                    <div class="track-favorite">
                                    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" data-encore-id="icon" class="Svg-sc-ytk21e-0 haNxPq"><path d="M1.69 2A4.582 4.582 0 0 1 8 2.023 4.583 4.583 0 0 1 11.88.817h.002a4.618 4.618 0 0 1 3.782 3.65v.003a4.543 4.543 0 0 1-1.011 3.84L9.35 14.629a1.765 1.765 0 0 1-2.093.464 1.762 1.762 0 0 1-.605-.463L1.348 8.309A4.582 4.582 0 0 1 1.689 2zm3.158.252A3.082 3.082 0 0 0 2.49 7.337l.005.005L7.8 13.664a.264.264 0 0 0 .311.069.262.262 0 0 0 .09-.069l5.312-6.33a3.043 3.043 0 0 0 .68-2.573 3.118 3.118 0 0 0-2.551-2.463 3.079 3.079 0 0 0-2.612.816l-.007.007a1.501 1.501 0 0 1-2.045 0l-.009-.008a3.082 3.082 0 0 0-2.121-.861z"></path></svg>
                                    </div>
                                    <div class="track-timing">
                                       ${_trackDuration(trackDuration)}
                                    </div>
                                    <div class="track-menu track-item">
                                        <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" data-encore-id="icon" class="Svg-sc-ytk21e-0 haNxPq">
                                            <path d="M3 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM16 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z">
                                            </path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        `;
            document.querySelector(DOMElements.tracksBody).insertAdjacentHTML('beforeend', html);
        },

        createAlbumTrack(trackIndex, trackId, trackName, trackArtistName, trackArtistId, trackDuration) {
            const html = `
                        <div class="track-row" id="${trackId}">
                                <div class="track-num track-item">
                                    <span class="track-number">${trackIndex + 1}</span>
                                    <svg role="img" height="16" width="16" aria-hidden="true" class="track-play" viewBox="0 0 24 24" data-encore-id="icon">
                                        <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                                        </path>
                                    </svg>
                                </div>
                                <div class="track-name track-item">
                                    <div class="track-info">
                                        <p class="track-name-info">${_formatName(trackName, 30)}</p>
                                        <p class="track-author" id="${trackArtistId}">${_formatName(trackArtistName, 30)}</p>
                                    </div>
                                </div>
                                <div class="track-time track-item">
                                    <div class="track-favorite">
                                        <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" data-encore-id="icon" class="Svg-sc-ytk21e-0 haNxPq">
                                            <path d="M1.69 2A4.582 4.582 0 0 1 8 2.023 4.583 4.583 0 0 1 11.88.817h.002a4.618 4.618 0 0 1 3.782 3.65v.003a4.543 4.543 0 0 1-1.011 3.84L9.35 14.629a1.765 1.765 0 0 1-2.093.464 1.762 1.762 0 0 1-.605-.463L1.348 8.309A4.582 4.582 0 0 1 1.689 2zm3.158.252A3.082 3.082 0 0 0 2.49 7.337l.005.005L7.8 13.664a.264.264 0 0 0 .311.069.262.262 0 0 0 .09-.069l5.312-6.33a3.043 3.043 0 0 0 .68-2.573 3.118 3.118 0 0 0-2.551-2.463 3.079 3.079 0 0 0-2.612.816l-.007.007a1.501 1.501 0 0 1-2.045 0l-.009-.008a3.082 3.082 0 0 0-2.121-.861z">
                                            </path>
                                        </svg>
                                    </div>
                                    <div class="track-timing">
                                       ${_trackDuration(trackDuration)}
                                    </div>
                                    <div class="track-menu track-item">
                                        <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" data-encore-id="icon" class="Svg-sc-ytk21e-0 haNxPq">
                                            <path d="M3 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM16 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z">
                                            </path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        `;
            document.querySelector(DOMElements.tracksBody).insertAdjacentHTML('beforeend', html);
        },

        createSavedTrack(trackIndex, trackId, trackName, trackImg, trackArtistName, trackArtistId, trackAlbumName, trackAlbumId, trackAddedDate, trackDuration) {
            const html = `
                        <div class="track-row" id="${trackId}">
                                <div class="track-num track-item">
                                    <span class="track-number">${trackIndex + 1}</span>
                                    <svg role="img" height="16" width="16" aria-hidden="true" class="track-play" viewBox="0 0 24 24" data-encore-id="icon">
                                        <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                                        </path>
                                    </svg>
                                </div>
                                <div class="track-name track-item">
                                    <img src="${trackImg}" alt="">
                                    <div class="track-info">
                                        <p class="track-name-info">${_formatName(trackName, 30)}</p>
                                        <p class="track-author" id="${trackArtistId}">${_formatName(trackArtistName, 30)}</p>
                                    </div>
                                </div>
                                <div class="track-album track-item" id="${trackAlbumId}">${_formatName(trackAlbumName, 50)}</div>
                                <div class="track-added track-item">${_formatAddedTime(trackAddedDate)}</div>
                                <div class="track-time track-item">
                                    <div class="track-favorite">
                                       <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" data-encore-id="icon" class="Svg-sc-ytk21e-0 haNxPq"><path d="M15.724 4.22A4.313 4.313 0 0 0 12.192.814a4.269 4.269 0 0 0-3.622 1.13.837.837 0 0 1-1.14 0 4.272 4.272 0 0 0-6.21 5.855l5.916 7.05a1.128 1.128 0 0 0 1.727 0l5.916-7.05a4.228 4.228 0 0 0 .945-3.577z"></path></svg>
                                    </div>
                                    <div class="track-timing">
                                       ${_trackDuration(trackDuration)}
                                    </div>
                                    <div class="track-menu track-item">
                                        <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" data-encore-id="icon" class="Svg-sc-ytk21e-0 haNxPq">
                                            <path d="M3 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM16 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z">
                                            </path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        `;
            document.querySelector(DOMElements.tracksBody).insertAdjacentHTML('beforeend', html);
        },

    }
})()

//APP Controller Module
const APPController = (function (APICtrl, UICtrl) {

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
        musicBtn: '.music-btn',
        //top alternative window elements,
        playlistCover: '.playlist-cover',
        playlistType: '.playlist-type',
        playlistName: '.playlist-name',
        playlistUserImg: '#playlist-user-img',
        playlistDetail1: '.playlist-detail-1',
        playlistDetail3: '.playlist-detail-3',
        playlistDetail4: '.playlist-detail-4',
        playlistDetail5: '.playlist-detail-5',
        tracksBody: '.tracks-body',
        trackBodyRow: '.track-row',
        tracksHeader: '.tracks-header',
        albumFavorite: '#album-favorite',
        playlistMenu: '.playlist-menu',
        trackFavorite: '.track-favorite'
    }

    let changeHeaderFunction;

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
                document.querySelector(DOMElements.moveLeft).style.cursor = 'not-allowed';
                document.querySelector(DOMElements.moveLeft).style.backgroundColor = "rgba(0, 0, 0, 0.35)"
                document.querySelector(DOMElements.moveLeft).style.color = "#b3b3b3";
            }
        }

        // Change the Header color on scroll
        function changeHeaderOnScrollDefault() {
            document.querySelector(DOMElements.mainElement).removeEventListener("scroll", changeHeaderFunction);
            document.querySelector(DOMElements.mainHeader).style.background.color = "transparent";
            document.querySelector(DOMElements.playTrack).style.cursor = 'default';
            changeHeaderFunction = (event) => {
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
            }
            document.querySelector(DOMElements.mainElement).addEventListener('scroll', changeHeaderFunction)
        }

        nextWindow();
        showWindow();
        hideAlternativeWindow();
        changeHeaderOnScrollDefault();
    }

    function getAverageRGB(imgId, myFunction) {
        const img = document.querySelector(imgId)
        const image = new Image();
        image.crossOrigin = "Anonymous"; // Permite carregar imagens de diferentes domínios
        image.src = img.src;

        image.onload = function () {
            const colorThief = new ColorThief();
            const dominantColor = colorThief.getColor(image); // Obtém a cor predominante

            const RGB = `${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]}`;
            myFunction(RGB);
        };
    }

    async function alternativeWindow() {

        localStorage['hasAlternativeWindow'] = 'true';

        const midiaId = this;

        async function changeWindow() {

            function getMidiaPlaylistDuration(tracks) {
                let tracksDuration = 0;
                let durationHours = 0;
                let durationMinutes = 0;
                let durationSeconds = 0;
                tracks.items.forEach(element => {
                    tracksDuration += element.track.duration_ms;
                })
                if ((((tracksDuration / 1000) / 60) / 60) >= 1) {
                    durationHours = ((((tracksDuration / 1000) / 60) / 60)).toFixed(0);
                    return `about ${durationHours} hr`;
                }
                if (((tracksDuration / 1000) / 60) >= 1) {
                    durationMinutes = (((tracksDuration / 1000) / 60)).toFixed(0);
                    tracksDuration -= ((durationMinutes * 1000) * 60);
                }
                if ((tracksDuration / 1000) >= 1) {
                    durationSeconds = (tracksDuration / 1000).toFixed(0);
                }

                if (durationSeconds != 0) {
                    return `${durationMinutes} min ${durationSeconds} sec`
                }

                return `${durationMinutes} min`

            }

            function getMidiaAlbumDuration(tracks) {
                let tracksDuration = 0;
                let durationHours = 0;
                let durationMinutes = 0;
                let durationSeconds = 0;
                tracks.items.forEach(element => {
                    tracksDuration += element.duration_ms;
                })
                if ((((tracksDuration / 1000) / 60) / 60) >= 1) {
                    durationHours = ((((tracksDuration / 1000) / 60) / 60)).toFixed(0);
                    return `about ${durationHours} hr`;
                }
                if (((tracksDuration / 1000) / 60) >= 1) {
                    durationMinutes = (((tracksDuration / 1000) / 60)).toFixed(0);
                    tracksDuration -= ((durationMinutes * 1000) * 60);
                }
                if ((tracksDuration / 1000) >= 1) {
                    durationSeconds = (tracksDuration / 1000).toFixed(0);
                }

                if (durationSeconds != 0) {
                    return `${durationMinutes} min ${durationSeconds} sec`
                }

                return `${durationMinutes} min`

            }

            function changeWindowToPlaylist(playlistInfo, playlistTracks) {

                async function changeTopInfo() {
                    document.querySelector(DOMElements.playlistImg).src = playlistInfo.images[0].url;
                    document.querySelector(DOMElements.playlistType).innerHTML = "Playlist";
                    document.querySelector(DOMElements.playlistName).innerHTML = playlistInfo.name;

                    //get token
                    const token = localStorage['token'];
                    //get user Info
                    const userInfo = await APICtrl.getUser(token, playlistInfo.owner.id);
                    console.log(playlistTracks);


                    document.querySelector(DOMElements.playlistUserImg).src = userInfo.images[0].url;
                    document.querySelector(DOMElements.playlistUserName).innerHTML = userInfo.display_name;

                    document.querySelector(DOMElements.playlistDetail4).innerHTML = `${playlistInfo.tracks.total} songs,`;

                    document.querySelector(DOMElements.playlistDetail5).style.display = "initial";
                    document.querySelector(DOMElements.playlistDetail5).innerHTML = getMidiaPlaylistDuration(playlistTracks);

                    //change the playlist menu
                    document.querySelector(DOMElements.playlistMenu).style.display = 'flex';

                    //change tracks header
                    document.querySelector(DOMElements.trackHeader).style.gridTemplateColumns = "20px 6fr 4fr 4fr 2fr";
                    document.querySelectorAll(DOMElements.trackBodyRow).forEach(element => {
                        element.style.gridTemplateColumns = "20px 6fr 4fr 4fr 2fr;";
                    });
                    document.querySelector(DOMElements.albumFavorite).style.display = 'none';
                    document.querySelector(DOMElements.trackHeader).innerHTML = `
<div class="track-num-header">#</div>
                            <div class="track-name-header">Title</div>
                            <div class="track-album-header">Album</div>
                            <div class="track-added-header">Date Added</div>
                            <div class="track-time-header">
                                <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16"
                                    data-encore-id="icon" class="Svg-sc-ytk21e-0 haNxPq">
                                    <path
                                        d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z">
                                    </path>
                                    <path
                                        d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z">
                                    </path>
                                </svg>
                            </div>
`
                }

                function changeBottomInfo() {
                    document.querySelector(DOMElements.tracksBody).innerHTML = '';
                    playlistTracks.items.forEach((element, index) => {
                        UICtrl.createPlaylistTrack(index, element.track.id, element.track.name, element.track.album.images[0].url, element.track.artists[0].name, element.track.artists[0].id, element.track.album.name, element.track.album.id, element.added_at, element.track.duration_ms);
                    });

                    document.querySelectorAll(DOMElements.trackFavorite).forEach(element => {
                        element.style.visibility = 'hidden';
                        element.style.color = 'var(--grey-color)';

                    });
                }

                changeTopInfo();
                changeBottomInfo();

            }

            function changeWindowToAlbum(albumInfo, albumTracks) {

                async function changeTopInfo() {
                    console.log(albumInfo);
                    console.log(albumTracks);
                    document.querySelector(DOMElements.playlistImg).src = albumInfo.images[0].url;
                    document.querySelector(DOMElements.playlistType).innerHTML = "Album";
                    document.querySelector(DOMElements.playlistName).innerHTML = albumInfo.name;

                    //get token
                    const token = localStorage['token'];
                    //get user Info
                    const artistInfo = await APICtrl.getCurrentArtistInfo(token, albumInfo.artists[0].id);

                    console.log(artistInfo)

                    document.querySelector(DOMElements.playlistUserImg).src = artistInfo.images[0].url;
                    document.querySelector(DOMElements.playlistUserName).innerHTML = artistInfo.name;

                    document.querySelector(DOMElements.playlistDetail4).innerHTML = `${albumInfo.total_tracks} songs,`;

                    document.querySelector(DOMElements.playlistDetail5).style.display = "initial";
                    document.querySelector(DOMElements.playlistDetail5).innerHTML = getMidiaAlbumDuration(albumTracks);

                    //change the playlist menu
                    document.querySelector(DOMElements.playlistMenu).style.display = 'flex';

                    //change tracks header
                    document.querySelector(DOMElements.trackHeader).style.gridTemplateColumns = "20px 14fr 2fr";
                    console.log(document.querySelectorAll(DOMElements.trackBodyRow));
                    document.querySelectorAll(DOMElements.trackBodyRow).forEach(element => {
                        element.style.gridTemplateColumns = "20px 14fr 2fr";
                    });
                    document.querySelector(DOMElements.albumFavorite).style.display = 'flex';
                    document.querySelector(DOMElements.trackHeader).innerHTML = `
<div class="track-num-header">#</div>
                            <div class="track-name-header">Title</div>
                            <div class="track-time-header">
                                <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16"
                                    data-encore-id="icon" class="Svg-sc-ytk21e-0 haNxPq">
                                    <path
                                        d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z">
                                    </path>
                                    <path
                                        d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z">
                                    </path>
                                </svg>
                            </div>
                        </div>
`
                }

                function changeBottomInfo() {
                    document.querySelector(DOMElements.tracksBody).innerHTML = '';
                    albumTracks.items.forEach((element, index) => {
                        UICtrl.createAlbumTrack(index, element.id, element.name, element.artists[0].name, element.artists[0].id, element.duration_ms);
                    });

                    document.querySelectorAll(DOMElements.trackFavorite).forEach(element => {
                        element.style.visibility = 'hidden';
                        element.style.color = 'var(--grey-color)';

                    });
                }

                changeTopInfo();
                changeBottomInfo();
            }

            function changeWindowToSavedTracks(userInfo, playlistTracks) {

                async function changeTopInfo() {
                    document.querySelector(DOMElements.playlistImg).src = "../img/liked-songs.png";
                    document.querySelector(DOMElements.playlistType).innerHTML = "Playlist";
                    document.querySelector(DOMElements.playlistName).innerHTML = "Liked Songs";


                    document.querySelector(DOMElements.playlistUserImg).src = userInfo.images[0].url;
                    document.querySelector(DOMElements.playlistUserName).innerHTML = userInfo.display_name;

                    document.querySelector(DOMElements.playlistDetail4).innerHTML = `${playlistTracks.total} songs`;

                    document.querySelector(DOMElements.playlistDetail5).style.display = "none";

                    //change the playlist menu
                    document.querySelector(DOMElements.playlistMenu).style.display = 'none';



                    //change tracks header
                    document.querySelector(DOMElements.trackHeader).style.gridTemplateColumns = "20px 6fr 4fr 4fr 2fr";
                    document.querySelectorAll(DOMElements.trackBodyRow).forEach(element => {
                        element.style.gridTemplateColumns = "20px 6fr 4fr 4fr 2fr;";
                    });
                    document.querySelector(DOMElements.albumFavorite).style.display = 'none';
                    document.querySelector(DOMElements.trackHeader).innerHTML = `
                    <div class="track-num-header">#</div>
                    <div class="track-name-header">Title</div>
                    <div class="track-album-header">Album</div>
                    <div class="track-added-header">Date Added</div>
                    <div class="track-time-header">
                    <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16"
                    data-encore-id="icon" class="Svg-sc-ytk21e-0 haNxPq">
                    <path
                    d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z">
                    </path>
                    <path
                                        d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z">
                                        </path>
                                        </svg>
                                        </div>
                                        `
                }

                function changeBottomInfo() {
                    document.querySelector(DOMElements.tracksBody).innerHTML = '';
                    playlistTracks.items.forEach((element, index) => {
                        UICtrl.createSavedTrack(index, element.track.id, element.track.name, element.track.album.images[0].url, element.track.artists[0].name, element.track.artists[0].id, element.track.album.name, element.track.album.id, element.added_at, element.track.duration_ms);
                    });
                    document.querySelectorAll(DOMElements.trackFavorite).forEach(element => {
                        element.style.visibility = 'visible';
                        element.style.color = 'var(--text-bright-accent)';

                    });
                }

                changeTopInfo();
                changeBottomInfo();

            }


            if (midiaId.id != "") {
                document.querySelector(DOMElements.app).style.opacity = '0';
                document.querySelector(DOMElements.app).style.transition = '.3s';

                if (midiaId.classList.contains('playlist-item-1') == true || midiaId.classList.contains('playlist-cards') == true) {
                    //get token
                    const token = localStorage['token'];
                    //get playlist info
                    const playlistInfo = await APICtrl.getCurrentPlaylistInfo(token, midiaId.id);
                    //get playlist tracks
                    const playlistTracks = await APICtrl.getCurrentPlaylistTracks(token, midiaId.id, 20);
                    changeWindowToPlaylist(playlistInfo, playlistTracks);
                } else if (midiaId.classList.contains('album-item') == true || midiaId.classList.contains('album-card') == true) {
                    //get token
                    const token = localStorage['token'];
                    //get playlist info
                    const albumInfo = await APICtrl.getCurrentAlbumInfo(token, midiaId.id);
                    //get playlist tracks
                    const albumTracks = await APICtrl.getCurrentAlbumTracks(token, midiaId.id, 20);
                    changeWindowToAlbum(albumInfo, albumTracks);


                } else if (midiaId.id == "episodes") {

                } else if (midiaId.id == "favorits") {
                    document.querySelector(DOMElements.app).style.opacity = '0';
                    document.querySelector(DOMElements.app).style.transition = '.3s';

                    //get token
                    const token = localStorage['token'];
                    //get current user info
                    const userInfo = await APICtrl.getUserProfile(token);
                    //get playlist tracks
                    const playlistTracks = await APICtrl.getCurrentSavedTracks(token, 20);
                    changeWindowToSavedTracks(userInfo, playlistTracks);

                }
            }
        }

        //Show the Default Window
        function hideWindow() {
            document.querySelector(DOMElements.mixSection).style.display = 'none';
            document.querySelector(DOMElements.gradient1).style.display = 'none';
        }

        function showAlternativeWindow() {
            document.querySelector(DOMElements.app).style.opacity = '1';
            document.querySelector(DOMElements.playlistBand).style.display = 'flex';
            document.querySelector(DOMElements.playlistPlay).style.display = 'flex';
            document.querySelector(DOMElements.playlistTracks).style.display = 'grid';
        }

        function previousWindow() {
            document.querySelector(DOMElements.moveLeft).style.backgroundColor = "#000000B3";
            document.querySelector(DOMElements.moveLeft).style.color = "white";
            document.querySelector(DOMElements.moveLeft).style.cursor = "pointer";
            document.querySelector(DOMElements.moveRight).style.cursor = 'not-allowed';
            document.querySelector(DOMElements.moveRight).style.backgroundColor = "rgba(0, 0, 0, 0.35)"
            document.querySelector(DOMElements.moveRight).style.color = "#b3b3b3";
            document.querySelector(DOMElements.moveLeft).addEventListener('click', defaultWindow);
        }

        function changeHeaderOnScrollAlternative() {
            document.querySelector(DOMElements.mainElement).removeEventListener("scroll", changeHeaderFunction);
            document.querySelector(DOMElements.mainHeader).style.background.color = "transparent";
            changeHeaderFunction = (event) => {
                if (document.querySelector(DOMElements.mainElement).scrollTop >= 300) {
                    //Change The Header COlor
                    getAverageRGB(DOMElements.playlistImg, function (RGB) {
                        document.querySelector(DOMElements.mainHeader).style.backgroundColor = `rgb(${RGB}, 1)`;
                        document.querySelector(DOMElements.mainHeaderAlternative).style.backgroundColor = `rgb(${RGB}, 1)`;
                    });
                }

                if (document.querySelector(DOMElements.mainElement).scrollTop >= 400) {
                    getAverageRGB(DOMElements.playlistImg, function (RGB) {
                        document.querySelector(DOMElements.mainHeader).style.backgroundColor = `rgb(${RGB}, 1)`;
                        document.querySelector(DOMElements.mainHeaderAlternative).style.backgroundColor = `rgb(${RGB}, 1)`;
                    });
                    //Show Play Button
                    document.querySelector(DOMElements.playTrack).style.opacity = '1';
                    document.querySelector(DOMElements.playTrack).style.cursor = 'pointer';
                    //Fix Track Header
                    document.querySelector(DOMElements.trackHeader).style.backgroundColor = '#1a1a1a'
                    document.querySelector(DOMElements.trackHeader).style.margin = '0';
                    document.querySelector(DOMElements.trackHeader).style.padding = '0px 40px';
                    document.querySelector(DOMElements.trackHeader).style.borderBottom = '1px solid hsla(0, 0%, 100%, .1)';

                }

                if (document.querySelector(DOMElements.mainElement).scrollTop < 300) {
                    document.querySelector(DOMElements.mainHeader).style.backgroundColor = "transparent";
                    document.querySelector(DOMElements.mainHeaderAlternative).style.backgroundColor = 'transparent';
                } else if (document.querySelector(DOMElements.mainElement).scrollTop < 400) {
                    getAverageRGB(DOMElements.playlistImg, function (RGB) {
                        document.querySelector(DOMElements.mainHeader).style.backgroundColor = `rgb(${RGB}, 1)`;
                        document.querySelector(DOMElements.mainHeaderAlternative).style.backgroundColor = `rgb(${RGB}, 1)`;
                    });
                    //Hide Play Button
                    document.querySelector(DOMElements.playTrack).style.opacity = '0';
                    document.querySelector(DOMElements.playTrack).style.cursor = 'default';
                    //Remove Fix Track Header
                    document.querySelector(DOMElements.trackHeader).style.backgroundColor = 'transparent'
                    document.querySelector(DOMElements.trackHeader).style.margin = '0 24px';
                    document.querySelector(DOMElements.trackHeader).style.padding = '0px 16px';
                    document.querySelector(DOMElements.trackHeader).style.borderBottom = '1px solid hsla(0, 0%, 100%, .1)';

                }

            }
            document.querySelector(DOMElements.mainElement).addEventListener('scroll', changeHeaderFunction)
        }

        function changeBackgroundColor() {

            getAverageRGB(DOMElements.playlistImg, function (RGB) {
                //change band color
                document.querySelector(DOMElements.playlistBand).style.background = `linear-gradient(rgb(${RGB}) 0,rgb(${RGB}, 0.5) 100%),var(--background-noise)`;
                //change the play btn background color
                document.querySelector(DOMElements.gradient2).style.backgroundColor = `rgb(${RGB}, 1)`
            });
        }

        await changeWindow();
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