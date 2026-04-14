# Slack Bot - GoMyCode Checkpoint

A simple Slack bot built with Node.js and the Bolt framework.

## Features

- Responds to the `/hello` slash command
- Logs all messages received in channels
- Replies when someone says "hi"

## Tech Stack

- Node.js
- [@slack/bolt](https://slack.dev/bolt-js/)
- Socket Mode (used instead of Events API for local development)

## Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd TypeScript_Checkpoint
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file at the root of the project:

```
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_APP_TOKEN=xapp-your-app-token
PORT=3000
```

### 4. Run the bot

```bash
node bot.js
```

## Slack App Configuration

- **OAuth Scopes:** `chat:write`, `channels:history`, `commands`
- **Socket Mode:** enabled
- **Slash Commands:** `/hello`

## Note

Socket Mode was used instead of the Events API to avoid the need for a public URL during local development. The bot behavior is identical.
