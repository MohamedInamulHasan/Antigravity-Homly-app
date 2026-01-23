import axios from 'axios';

/**
 * Sends a Telegram notification via Bot API
 * @param {Object} order - The order object
 * @returns {Promise<boolean>} - True if successful
 */
export const sendOrderTelegramNotification = async (order) => {
    try {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!token || !chatId || token === 'REPLACE_TOKEN' || chatId === 'REPLACE_ID') {
            console.warn('⚠️ Telegram notification skipped: Missing credentials in .env');
            return false;
        }

        const shippingAddr = order.shippingAddress || {};
        const customerName = shippingAddr.name || order.user?.name || 'Customer';
        const phone = shippingAddr.mobile || 'N/A';
        const address = `${shippingAddr.street || ''}, ${shippingAddr.city || ''}, ${shippingAddr.zip || ''}`;

        // Construct the message with MarkdownV2 or HTML
        // Using HTML for simpler bolding usually
        const message = `
📦 <b>New Order Received!</b>
------------------------
<b>Order ID:</b> #${order._id.toString().slice(-8).toUpperCase()}
<b>Amount:</b> ₹${order.total.toFixed(0)}
<b>Payment:</b> ${order.paymentMethod?.type || 'COD'}

👤 <b>Customer:</b>
${customerName}
📞 ${phone}
📍 ${address}

🛒 <b>Items:</b>
${order.items.map(item => `- ${item.quantity}x ${item.name || item.product?.title || 'Item'}\n  🏪 Store: ${item.storeId?.name || 'Homly'}`).join('\n\n')}

------------------------
<i>Homly Order Alert</i>
`.trim();

        // Telegram API URL
        const url = `https://api.telegram.org/bot${token}/sendMessage`;

        console.log(`📱 Sending Telegram alert for Order #${order._id}...`);

        await axios.post(url, {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        });

        console.log('✅ Telegram notification sent successfully.');
        return true;
    } catch (error) {
        console.error('❌ Failed to send Telegram notification:', error.response?.data || error.message);
        return false;
    }
};
