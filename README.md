# Analog Music Player

## Structure
```
├── assets                     // static resource
│   ├── favicon.png            // favicon
│   ├── main.css               // theme style
│   ├── main.html              // main page
├── src                        // source
│   ├── class                  // class
│         ├── bar.js           // bar class
│         ├── playArea.js      // play area class
│         ├── playButtons.js   // play operate button
│         ├── playList.js      // play list class
│         ├── song.js          // single song class
│         ├── title.js         // title class for song info
│   ├── data.js                // song info array
│   ├── index.js               // entry
├── webpack.config.js          // webpack config file
├── .gitignore                 // git ignore file
└── package.json               // package.json


```
## Features

```
1. Refresh the page and randomly generate 20 audios
2. Audio time 10-70 seconds
3. Operation:
  [prev][play/pause][stop][next]
4. Generate a custom playlist, the directory name can be modified
5. Play directory, music list, can drag and drop position
6. Music list can be sorted by preference
7. Double click on the music to play
8. hot key:
  [Up] prev song
  [Down] next song
  [Space] play/pause song
```

## Shortcoming

```
When playing music, if the currently playing music is at the bottom, need to scroll to see it.
Improvements will be made in the future!
```

## Build

```bash
# install and run server & open page
npm ins

# run server & open page
npm start

# build for production environment
npm run build
```

## Browsers support

[<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)
