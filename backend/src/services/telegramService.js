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

        // Format delivery charge
        const deliveryCharge = order.shipping || 0;
        const deliveryText = deliveryCharge === 0 ? 'FREE (🪙 Coin Applied)' : `₹${deliveryCharge}`;

        // Format scheduled delivery time
        let deliveryTimeText = 'Not specified';
        if (order.scheduledDeliveryTime) {
            const deliveryDate = new Date(order.scheduledDeliveryTime);
            deliveryTimeText = deliveryDate.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }

        const discountText = order.discount > 0 ? `<b>Discount:</b> -₹${order.discount.toFixed(0)}\n` : '';

        // Construct the message with MarkdownV2 or HTML
        // Using HTML for simpler bolding usually
        const message = `
🔔 <b>NEW ORDER #${order._id.toString().slice(-8).toUpperCase()}</b>

👤 ${customerName} | 📞 ${phone}
📍 ${shippingAddr.city || 'City'}, ${shippingAddr.zip || 'Zip'}

👇 <b>ORDER DETAILS</b> 👇
${order.items.map((item, index) => `
${index + 1}. <b>${item.name || item.product?.title || 'Item'} (${item.unit || item.product?.unit || 'unit'})</b>
   QTY: ${item.quantity}  |  🏪 ${item.storeId?.name || 'Homly'}`).join('\n')}

💵 <b>BILLING</b>
Subtotal: ₹${(order.subtotal || 0).toFixed(0)}
Delivery: ${deliveryText}
${discountText}<b>TOTAL: ₹${order.total.toFixed(0)}</b> (${order.paymentMethod?.type || 'COD'})
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

/**
 * Sends a Telegram notification for service requests
 * @param {Object} serviceRequest - The service request object
 * @returns {Promise<boolean>} - True if successful
 */
export const sendServiceRequestTelegramNotification = async (serviceRequest) => {
    try {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!token || !chatId || token === 'REPLACE_TOKEN' || chatId === 'REPLACE_ID') {
            console.warn('⚠️ Telegram notification skipped: Missing credentials in .env');
            return false;
        }

        const service = serviceRequest.service;
        const user = serviceRequest.user;
        const customerName = user?.name || 'Customer';
        const customerEmail = user?.email || 'N/A';
        const customerPhone = user?.mobile || 'N/A';

        const message = `
🔧 <b>New Service Request!</b>
------------------------
<b>Request ID:</b> #${serviceRequest._id.toString().slice(-8).toUpperCase()}
<b>Service:</b> ${service?.name || 'Unknown Service'}
<b>Status:</b> ${serviceRequest.status || 'Pending'}

👤 <b>Customer Details:</b>
<b>Name:</b> ${customerName}
📧 ${customerEmail}
📞 ${customerPhone}

📍 <b>Service Location:</b>
${service?.address || 'N/A'}

------------------------
<i>Homly Service Request Alert</i>
`.trim();

        const url = `https://api.telegram.org/bot${token}/sendMessage`;

        console.log(`📱 Sending Telegram alert for Service Request #${serviceRequest._id}...`);

        await axios.post(url, {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        });

        console.log('✅ Service request Telegram notification sent successfully.');
        return true;
    } catch (error) {
        console.error('❌ Failed to send service request Telegram notification:', error.response?.data || error.message);
        return false;
    }
};
