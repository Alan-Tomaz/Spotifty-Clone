# Spotify Clone

### A spotify clone created using HTML, CSS and JavaScript (with Fetch API and Module Pattern) together with the **[Spotify API](https://developer.spotify.com/documentation/web-api)**.

![Main Page](https://i.imgur.com/gGPsF0n.png)

The site allows the user to log into their **Spotify** account and view their information in an interface that is extremely similar to that of **Spotify**. On the website it is possible:
- View your episodes;
- View your Favorite Songs;
- View your Saved Albums;
- View your Playlists;
- View your Favorite Artists;
- View the song that is currently playing on true spotify;
- Information from your profile, such as avatar and display name;


![Music Page](https://i.imgur.com/V6ceES9.png)

And in addition, it is also possible to view the songs related to albums, playlists and artists.

## How to access the website

To access the site you need developer credentials (Client ID and Client Secret) which can be obtained from **[Spotify For Developers](https://developer.spotify.com)**. In addition, it is also necessary to configure a redirect URI for the URL: https://alan-tomaz.github.io/Spotify-Clone/pages/app.html.

Once this is done, you must enter the credentials in the form on the home screen of the site. After that you will be redirected to a **Spotify** authentication screen, where you can log into your account. Once finished, you will be redirected to the main page of the site, where a token will be generated that will be collected by the site to be used in requests to the API endpoints.

![Initial Page](https://i.imgur.com/afWzJwd.png)

As soon as you are redirected, the site will load your playlists, your artists, among other things. By clicking on them you will have access to the songs and other related information.

The Module Pattern pattern was used to create the site. And the Fetch API was used to communicate with the API.