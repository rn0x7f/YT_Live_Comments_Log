# YT_Live_Comments_Log
This is a simple project that logs the comments of a live stream on Youtube. It uses a get request to the chat url of the live stream and logs the comments in a file. It receives a HTML file with the comments and a JSON file with the comments inside a script tag with a unique identifier. that allows us to extract the comments using regex.

## Installation

```bash
git clone https://github.com/rn0x7f/YT_Live_Comments_Log
cd YT_Live_Comments_Log
```
### Install dependencies
You must have node.js installed in your system. If you don't have it installed, you can download it from [here](https://nodejs.org/en/download/).
```bash
npm install axios
npm install express
```

# Usage
```bash
node yt_live_chat.js 
```
The program will ask you for the URL of the comment section of the live stream. You can get this URL by going to the live stream and clicking on the three dots on the right side of the screen and then clicking on "Open chat in a new window". The URL will be something like this: https://www.youtube.com/live_chat?is_popout=1&v=VIDEO_ID  

Then the program will ask you for the name of the file where you want to save the comments. The comments will be saved in a file with the name you provide in the same directory where the program is located.
