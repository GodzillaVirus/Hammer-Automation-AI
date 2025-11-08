import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';

const BOT_TOKEN = '8563563429:AAGLW_hCpbeC2-JfStd_bveMWiBsaTaOh-E';
const ADMIN_CHAT_ID = 5328767896;

const userSessions: Map<number, string> = new Map();

export function initTelegramBot(apiUrl: string) {
  const bot = new TelegramBot(BOT_TOKEN, { polling: true });

  const getMainMenu = () => {
    return {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🆕 𝘾𝙧𝙚𝙖𝙩𝙚 𝙎𝙚𝙨𝙨𝙞𝙤𝙣', callback_data: 'create_session' },
            { text: '❌ 𝘾𝙡𝙤𝙨𝙚 𝙎𝙚𝙨𝙨𝙞𝙤𝙣', callback_data: 'close_session' }
          ],
          [
            { text: '🌐 𝙉𝙖𝙫𝙞𝙜𝙖𝙩𝙚 𝙐𝙍𝙇', callback_data: 'navigate' },
            { text: '📸 𝙎𝙘𝙧𝙚𝙚𝙣𝙨𝙝𝙤𝙩', callback_data: 'screenshot' }
          ],
          [
            { text: '🖱️ 𝘾𝙡𝙞𝙘𝙠 𝘼𝙩', callback_data: 'click_at' },
            { text: '✍️ 𝙏𝙮𝙥𝙚 𝙏𝙚𝙭𝙩', callback_data: 'type_text' }
          ],
          [
            { text: '⬆️ 𝙎𝙘𝙧𝙤𝙡𝙡 𝙐𝙥', callback_data: 'scroll_up' },
            { text: '⬇️ 𝙎𝙘𝙧𝙤𝙡𝙡 𝘿𝙤𝙬𝙣', callback_data: 'scroll_down' }
          ],
          [
            { text: '◀️ 𝙂𝙤 𝘽𝙖𝙘𝙠', callback_data: 'go_back' },
            { text: '▶️ 𝙂𝙤 𝙁𝙤𝙧𝙬𝙖𝙧𝙙', callback_data: 'go_forward' }
          ],
          [
            { text: '⏸️ 𝙒𝙖𝙞𝙩 5𝙨', callback_data: 'wait_5s' },
            { text: '⚙️ 𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙅𝙎', callback_data: 'execute_js' }
          ],
          [
            { text: '🤖 𝘼𝙄 𝘾𝙤𝙢𝙢𝙖𝙣𝙙', callback_data: 'ai_command' },
            { text: '📄 𝙂𝙚𝙩 𝘾𝙤𝙣𝙩𝙚𝙣𝙩', callback_data: 'get_content' }
          ],
          [
            { text: '💚 𝙃𝙚𝙖𝙡𝙩𝙝 𝘾𝙝𝙚𝙘𝙠', callback_data: 'health_check' },
            { text: '📊 𝙎𝙩𝙖𝙩𝙪𝙨', callback_data: 'status' }
          ]
        ]
      }
    };
  };

  bot.onText(/\/start/, async (msg: any) => {
    if (msg.chat.id !== ADMIN_CHAT_ID) {
      bot.sendMessage(msg.chat.id, '❌ 𝙐𝙣𝙖𝙪𝙩𝙝𝙤𝙧𝙞𝙯𝙚𝙙 𝙖𝙘𝙘𝙚𝙨𝙨');
      return;
    }

    const welcomeText = `🔨 𝙃𝘼𝙈𝙈𝙀𝙍 𝘼𝙐𝙏𝙊𝙈𝘼𝙏𝙄𝙊𝙉 𝘼𝙄

⚡ 𝙋𝙧𝙤𝙛𝙚𝙨𝙨𝙞𝙤𝙣𝙖𝙡 𝘼𝙄-𝙋𝙤𝙬𝙚𝙧𝙚𝙙 𝘽𝙧𝙤𝙬𝙨𝙚𝙧 𝘼𝙪𝙩𝙤𝙢𝙖𝙩𝙞𝙤𝙣 ⚡

𝙐𝙨𝙚 𝙩𝙝𝙚 𝙗𝙪𝙩𝙩𝙤𝙣𝙨 𝙗𝙚𝙡𝙤𝙬 𝙩𝙤 𝙘𝙤𝙣𝙩𝙧𝙤𝙡 𝙩𝙝𝙚 𝙗𝙧𝙤𝙬𝙨𝙚𝙧:`;
    
    bot.sendMessage(msg.chat.id, welcomeText, getMainMenu());
  });

  bot.on('callback_query', async (query: any) => {
    if (!query.message || query.from.id !== ADMIN_CHAT_ID) {
      bot.answerCallbackQuery(query.id, { text: '❌ 𝙐𝙣𝙖𝙪𝙩𝙝𝙤𝙧𝙞𝙯𝙚𝙙' });
      return;
    }

    bot.answerCallbackQuery(query.id);
    const action = query.data;
    const userId = query.from.id;
    const chatId = query.message.chat.id;

    try {
      if (action === 'create_session') {
        const response = await axios.post(`${apiUrl}/api/automation`, { action: 'create' });
        const data = response.data;

        if (data.success) {
          const sessionId = data.sessionId;
          userSessions.set(userId, sessionId);
          bot.editMessageText(
            `✅ 𝙎𝙚𝙨𝙨𝙞𝙤𝙣 𝘾𝙧𝙚𝙖𝙩𝙚𝙙!\n\n🆔 𝙎𝙚𝙨𝙨𝙞𝙤𝙣 𝙄𝘿: ${sessionId.substring(0, 20)}...`,
            { chat_id: chatId, message_id: query.message.message_id, ...getMainMenu() }
          );
        } else {
          bot.editMessageText('❌ 𝙁𝙖𝙞𝙡𝙚𝙙 𝙩𝙤 𝙘𝙧𝙚𝙖𝙩𝙚 𝙨𝙚𝙨𝙨𝙞𝙤𝙣', 
            { chat_id: chatId, message_id: query.message.message_id, ...getMainMenu() });
        }
      } else if (action === 'close_session') {
        if (!userSessions.has(userId)) {
          bot.editMessageText('❌ 𝙉𝙤 𝙖𝙘𝙩𝙞𝙫𝙚 𝙨𝙚𝙨𝙨𝙞𝙤𝙣', 
            { chat_id: chatId, message_id: query.message.message_id, ...getMainMenu() });
          return;
        }

        const sessionId = userSessions.get(userId)!;
        await axios.post(`${apiUrl}/api/automation`, { action: 'close', sessionId });
        userSessions.delete(userId);
        bot.editMessageText('✅ 𝙎𝙚𝙨𝙨𝙞𝙤𝙣 𝙘𝙡𝙤𝙨𝙚𝙙', 
          { chat_id: chatId, message_id: query.message.message_id, ...getMainMenu() });
      } else if (action === 'navigate') {
        bot.sendMessage(chatId, '🌐 𝙋𝙡𝙚𝙖𝙨𝙚 𝙨𝙚𝙣𝙙 𝙩𝙝𝙚 𝙐𝙍𝙇:');
        bot.once('message', async (msg: any) => {
          if (msg.from?.id === userId && msg.text) {
            const sessionId = userSessions.get(userId);
            if (sessionId) {
              await axios.post(`${apiUrl}/api/automation`, { 
                action: 'navigate', 
                sessionId, 
                url: msg.text 
              });
              bot.sendMessage(chatId, `✅ 𝙉𝙖𝙫𝙞𝙜𝙖𝙩𝙚𝙙 𝙩𝙤: ${msg.text}`, getMainMenu());
            }
          }
        });
      } else if (action === 'screenshot') {
        const sessionId = userSessions.get(userId);
        if (sessionId) {
          const response = await axios.post(`${apiUrl}/api/automation`, { 
            action: 'screenshot', 
            sessionId, 
            fullPage: true 
          });
          if (response.data.success && response.data.screenshot) {
            const buffer = Buffer.from(response.data.screenshot, 'base64');
            bot.sendPhoto(chatId, buffer, { caption: '📸 𝙎𝙘𝙧𝙚𝙚𝙣𝙨𝙝𝙤𝙩' });
          }
        }
      } else if (action === 'click_at') {
        bot.sendMessage(chatId, '🖱️ 𝙎𝙚𝙣𝙙 𝙘𝙤𝙤𝙧𝙙𝙞𝙣𝙖𝙩𝙚𝙨 (𝙭,𝙮):');
        bot.once('message', async (msg: any) => {
          if (msg.from?.id === userId && msg.text) {
            const [x, y] = msg.text.split(',').map((n: string) => parseInt(n.trim()));
            const sessionId = userSessions.get(userId);
            if (sessionId && !isNaN(x) && !isNaN(y)) {
              await axios.post(`${apiUrl}/api/automation`, { 
                action: 'click_at', 
                sessionId, 
                x, 
                y 
              });
              bot.sendMessage(chatId, `✅ 𝘾𝙡𝙞𝙘𝙠𝙚𝙙 𝙖𝙩 (${x}, ${y})`, getMainMenu());
            }
          }
        });
      } else if (action === 'type_text') {
        bot.sendMessage(chatId, '✍️ 𝙎𝙚𝙣𝙙 𝙘𝙤𝙤𝙧𝙙𝙞𝙣𝙖𝙩𝙚𝙨 𝙖𝙣𝙙 𝙩𝙚𝙭𝙩 (𝙭,𝙮,𝙩𝙚𝙭𝙩):');
        bot.once('message', async (msg: any) => {
          if (msg.from?.id === userId && msg.text) {
            const parts = msg.text.split(',');
            const x = parseInt(parts[0].trim());
            const y = parseInt(parts[1].trim());
            const text = parts.slice(2).join(',').trim();
            const sessionId = userSessions.get(userId);
            if (sessionId && !isNaN(x) && !isNaN(y)) {
              await axios.post(`${apiUrl}/api/automation`, { 
                action: 'type_at', 
                sessionId, 
                x, 
                y, 
                text 
              });
              bot.sendMessage(chatId, `✅ 𝙏𝙮𝙥𝙚𝙙 𝙖𝙩 (${x}, ${y})`, getMainMenu());
            }
          }
        });
      } else if (action === 'scroll_up' || action === 'scroll_down') {
        const sessionId = userSessions.get(userId);
        if (sessionId) {
          await axios.post(`${apiUrl}/api/automation`, { 
            action: 'scroll', 
            sessionId, 
            direction: action === 'scroll_up' ? 'up' : 'down' 
          });
          bot.editMessageText(`✅ 𝙎𝙘𝙧𝙤𝙡𝙡𝙚𝙙 ${action === 'scroll_up' ? '⬆️' : '⬇️'}`, 
            { chat_id: chatId, message_id: query.message.message_id, ...getMainMenu() });
        }
      } else if (action === 'go_back') {
        const sessionId = userSessions.get(userId);
        if (sessionId) {
          await axios.post(`${apiUrl}/api/automation`, { action: 'go_back', sessionId });
          bot.editMessageText('✅ 𝙒𝙚𝙣𝙩 𝙗𝙖𝙘𝙠', 
            { chat_id: chatId, message_id: query.message.message_id, ...getMainMenu() });
        }
      } else if (action === 'go_forward') {
        const sessionId = userSessions.get(userId);
        if (sessionId) {
          await axios.post(`${apiUrl}/api/automation`, { action: 'go_forward', sessionId });
          bot.editMessageText('✅ 𝙒𝙚𝙣𝙩 𝙛𝙤𝙧𝙬𝙖𝙧𝙙', 
            { chat_id: chatId, message_id: query.message.message_id, ...getMainMenu() });
        }
      } else if (action === 'wait_5s') {
        const sessionId = userSessions.get(userId);
        if (sessionId) {
          await axios.post(`${apiUrl}/api/automation`, { action: 'wait', sessionId });
          bot.editMessageText('✅ 𝙒𝙖𝙞𝙩𝙚𝙙 5 𝙨𝙚𝙘𝙤𝙣𝙙𝙨', 
            { chat_id: chatId, message_id: query.message.message_id, ...getMainMenu() });
        }
      } else if (action === 'execute_js') {
        bot.sendMessage(chatId, '⚙️ 𝙎𝙚𝙣𝙙 𝙅𝙖𝙫𝙖𝙎𝙘𝙧𝙞𝙥𝙩 𝙘𝙤𝙙𝙚:');
        bot.once('message', async (msg: any) => {
          if (msg.from?.id === userId && msg.text) {
            const sessionId = userSessions.get(userId);
            if (sessionId) {
              const response = await axios.post(`${apiUrl}/api/automation`, { 
                action: 'execute', 
                sessionId, 
                script: msg.text 
              });
              bot.sendMessage(chatId, `✅ 𝙀𝙭𝙚𝙘𝙪𝙩𝙚𝙙\n\n𝙍𝙚𝙨𝙪𝙡𝙩: ${JSON.stringify(response.data.result)}`, getMainMenu());
            }
          }
        });
      } else if (action === 'ai_command') {
        bot.sendMessage(chatId, '🤖 𝙎𝙚𝙣𝙙 𝘼𝙄 𝙘𝙤𝙢𝙢𝙖𝙣𝙙:');
        bot.once('message', async (msg: any) => {
          if (msg.from?.id === userId && msg.text) {
            const sessionId = userSessions.get(userId);
            if (sessionId) {
              bot.sendMessage(chatId, '⏳ 𝙋𝙧𝙤𝙘𝙚𝙨𝙨𝙞𝙣𝙜 𝘼𝙄 𝙘𝙤𝙢𝙢𝙖𝙣𝙙...');
              const response = await axios.post(`${apiUrl}/api/automation`, { 
                action: 'ai_command', 
                sessionId, 
                text: msg.text 
              });
              const result = response.data;
              bot.sendMessage(chatId, 
                `${result.success ? '✅' : '❌'} 𝘼𝙄 𝙍𝙚𝙨𝙪𝙡𝙩:\n\n${result.finalMessage || result.summary || 'No result'}`, 
                getMainMenu()
              );
            }
          }
        });
      } else if (action === 'get_content') {
        const sessionId = userSessions.get(userId);
        if (sessionId) {
          const response = await axios.post(`${apiUrl}/api/automation`, { 
            action: 'get_content', 
            sessionId 
          });
          if (response.data.success) {
            const content = response.data.content.substring(0, 4000);
            bot.sendMessage(chatId, `📄 𝙋𝙖𝙜𝙚 𝘾𝙤𝙣𝙩𝙚𝙣𝙩:\n\n${content}`, getMainMenu());
          }
        }
      } else if (action === 'health_check') {
        const response = await axios.get(`${apiUrl}/api/health`);
        const stats = response.data;
        bot.editMessageText(
          `💚 𝙃𝙚𝙖𝙡𝙩𝙝 𝘾𝙝𝙚𝙘𝙠\n\n📊 𝘼𝙘𝙩𝙞𝙫𝙚 𝙎𝙚𝙨𝙨𝙞𝙤𝙣𝙨: ${stats.activeSessions}\n🚀 𝙑𝙚𝙧𝙨𝙞𝙤𝙣: ${stats.version}\n✅ 𝘽𝙧𝙤𝙬𝙨𝙚𝙧: ${stats.browserRunning ? '𝙊𝙣𝙡𝙞𝙣𝙚' : '𝙊𝙛𝙛𝙡𝙞𝙣𝙚'}`,
          { chat_id: chatId, message_id: query.message.message_id, ...getMainMenu() }
        );
      } else if (action === 'status') {
        const sessionId = userSessions.get(userId);
        bot.editMessageText(
          `📊 𝙎𝙩𝙖𝙩𝙪𝙨\n\n${sessionId ? `✅ 𝘼𝙘𝙩𝙞𝙫𝙚 𝙎𝙚𝙨𝙨𝙞𝙤𝙣: ${sessionId.substring(0, 20)}...` : '❌ 𝙉𝙤 𝙖𝙘𝙩𝙞𝙫𝙚 𝙨𝙚𝙨𝙨𝙞𝙤𝙣'}`,
          { chat_id: chatId, message_id: query.message.message_id, ...getMainMenu() }
        );
      }
    } catch (error: any) {
      bot.sendMessage(chatId, `❌ 𝙀𝙧𝙧𝙤𝙧: ${error.message}`, getMainMenu());
    }
  });

  console.log('🤖 Telegram bot initialized');
  return bot;
}
