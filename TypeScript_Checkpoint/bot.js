require('dotenv').config();
const { App } = require('@slack/bolt');

// Initialize the Slack app with Socket Mode
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

// Respond to the /hello slash command
app.command('/hello', async ({ command, ack, say }) => {
  await ack();
  console.log(`[COMMAND] /hello used by ${command.user_name}`);
  await say(`Hello <@${command.user_id}>! I'm your Slack bot 👋`);
});

// Log all messages received in channels
app.message(async ({ message, say }) => {
  console.log(`[MESSAGE] ${message.user}: ${message.text}`);

  // Optional: auto-reply when someone says "hi"
  if (message.text && message.text.toLowerCase().includes('hi')) {
    await say(`Hi <@${message.user}>! How can I help you?`);
  }
});

// Start the app
(async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(`Slack bot is running on port ${port}`);
})();
