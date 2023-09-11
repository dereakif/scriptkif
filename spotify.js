// Name: spotify
// Shortcut: cmd shift o

// for spotify applescript docs
// open -a /System/Applications/Utilities/Script\ Editor.app /Applications/Spotify.app/Contents/Resources/Spotify.sdef

import "@johnlindquist/kit";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const api = SpotifyApi.withClientCredentials(clientId, clientSecret);

const market = "US";

const g59Script = `
tell application "Spotify"
	set shuffling to true
	play track "spotify:user:$nanceG59:playlist:6EUDFzlzNxHSQPLbtCpho3"
end tell
`;

const startScript = `
tell application "Spotify"
    play
end tell
`;

const pauseScript = `
tell application "Spotify"
    pause
end tell
`;

let searchScript = `
tell application "Spotify"
	set shuffling to true
    search
end tell
`;

const scriptMap = {
  G59: g59Script,
  start: startScript,
  pause: pauseScript,
};

const action = await arg("What do you want to do?", [
  "G59",
  "start",
  "pause",
  "search",
]);

if (action === "search") {
  let searchTopic = await arg("Search for what?", [
    {
      name: "artists",
      value: "artist",
    },
    // {
    //   name: "albums",
    //   value: "album",
    // },
    // {
    //   name: "tracks",
    //   value: "track",
    // },
  ]);
  const searchText = await arg(`Search for ${searchTopic}`);

  const searchResponse = await api.search(searchText, [searchTopic]);
  const searchResult = searchResponse[`${searchTopic}s`];

  if (searchTopic === "artist") {
    const sortedArtists = searchResult.items.sort(
      (a, b) => b.followers.total - a.followers.total
    );

    const artistName = await arg(
      "Which artist?",
      sortedArtists.map((item) => ({
        name: item.name,
        description: item.followers.total + " followers",
        value: item.name,
      }))
    );

    const artist = searchResult.items.find((item) => item.name === artistName);

    const allAlbums = await getAllItemsRecursively({
      itemId: artist.id,
      offset: 0,
      limit: 50,
      result: [],
      itemType: "albums",
    });

    const sortedArtistAlbums = allAlbums.sort(
      (a, b) => new Date(b.release_date) - new Date(a.release_date)
    );

    const album = await arg(
      "Which album?",
      sortedArtistAlbums.map((item) => ({
        name: item.name,
        description:
          item.total_tracks +
          " tracks" +
          " - " +
          item.album_group +
          " - " +
          item.album_type,
        value: item,
      }))
    );

    const shouldShuffle = await arg("Which album?", [
      { name: "Shuffle album", value: true },
      { name: "Select track", value: false },
    ]);

    if (shouldShuffle) {
      const { uri } = album;

      searchScript = `
    tell application "Spotify"
	    set shuffling to true
        play track "${uri}"
    end tell
    `;
    } else {
      const { id } = album;

      const allTracks = await getAllItemsRecursively({
        itemId: id,
        offset: 0,
        limit: 50,
        result: [],
        itemType: "tracks",
      });

      const { uri } = await arg(
        "Which track?",
        allTracks.map((item) => ({
          name: item.name,
          description: item.artists.map((artist) => artist.name).join(", "),
          value: item,
        }))
      );

      searchScript = `
    tell application "Spotify"
        play track "${uri}"
    end tell
    `;
    }

    scriptMap[action] = searchScript;
  } else if (searchTopic === "album") {
    // in progress
  } else if (searchTopic === "track") {
    // in progress
  }
}

scriptMap[action] && exec(`osascript -e '${scriptMap[action]}'`);

async function getAllItemsRecursively({
  itemId,
  offset = 0,
  limit = 50,
  result,
  itemType,
}) {
  let items = null;
  if (itemType === "tracks") {
    items = await api.albums.tracks(itemId, market, limit, offset);
  } else {
    items = await api.artists.albums(
      itemId,
      "album,single,appears_on,compilation",
      market,
      limit,
      offset
    );
  }
  return items.items.length !== limit
    ? result.concat(items.items)
    : await getAllItemsRecursively({
        itemId,
        offset: offset + limit,
        limit,
        result: result.concat(items.items),
        itemType,
      });
}
