# chillbot.js
> a pretty chill discord bot

<img src="https://soundplate.com/wp-content/uploads/Chill.jpg" height="250" alt="credit: https://soundplate.com/electro-chill-house-debut-de-soiree-spotify-playlist-user-submitted/" />

## Dependencies
* [NodeJS](https://nodejs.org/en/download/)
* [FFmpeg](https://ffmpeg.org/)

## How to Install:

### config.js
> Create a file named `config.js` in the root directory\
> Format:

```
module.exports = {
    tokens: {
        discord: "DISCORD_BOT_TOKEN",
        youtube: "YOUTUBE_API_KEY"
    }
};
```

### via release
* [Download latest release](https://github.com/bct8925/chillbot.js/releases/latest)
* Extract downloaded zip
* Navigate to extracted directory (ex: chillbot.js-#.#)
* Open cmd/terminal
* `npm i`

### via GIT
* `git clone https://github.com/bct8925/chillbot.js`
* `cd ./chillbot.js`
* `npm i`

## How to Start:
* `npm start`

## How to Stop:
`^C` (CTRL+C)