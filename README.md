# Spotify Script for Script Kit

This is a custom script for controlling Spotify using Script Kit, a productivity tool that lets you create and run scripts with ease on macOS. 
With this script, you can perform various actions in Spotify, such as playing specific tracks, starting playback, pausing, and searching for artists and albums. 
It's designed to enhance your Spotify experience by providing quick and convenient access to these functions.

## Installation
Before you can use this script with Script Kit, you need to set up the environment properly.

1. Install Script Kit: If you haven't already, install Script Kit from https://scriptkit.com/.

2. Clone or Download: Clone this repository to your local machine or download the script file.

3. Set Environment Variables: Navigate to the /.kenv directory and set your Spotify API credentials as environment variables:

4. Install Dependencies
```
export SPOTIFY_CLIENT_ID=your_client_id
export SPOTIFY_CLIENT_SECRET=your_client_secret
```
Replace your_client_id and your_client_secret with your actual Spotify API credentials.

## Additional Notes
- This script utilizes the Spotify Web API for searches and obtaining track information. Ensure your Spotify API credentials are correctly set in the environment variables.

- The script is designed for macOS and leverages AppleScript to control the Spotify application.

- You can extend and customize this script to add more functionality according to your preferences and needs.

## Credits
- This script was created by Akif DERE.

- Dependencies: [@johnlindquist/kit](https://github.com/johnlindquist/kit) for Script Kit integration and [Spotify Web API TS SDK](https://github.com/spotify/spotify-web-api-ts-sdk) for Spotify API interactions.

Enjoy controlling Spotify with this Script Kit script!
