import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = async () => {
    // If Gmail credentials are provided, use Gmail
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    // Otherwise, use Ethereal (free testing email service)
    // This creates a temporary email account for testing
    const testAccount = await nodemailer.createTestAccount();

    console.log('📧 Using Ethereal test email service');
    console.log('📬 Preview emails at: https://ethereal.email');
    console.log('👤 Test account:', testAccount.user);

    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });
};

// Send order notification email to admin
export const sendOrderNotificationEmail = async (order) => {
    try {
        const transporter = await createTransporter();

        // Format order items
        const itemsList = order.items.map((item, index) =>
            `${index + 1}. ${item.name} x${item.quantity} - ₹${item.price}`
        ).join('\n');

        // Format delivery time
        const deliveryTime = order.scheduledDeliveryTime
            ? `\nScheduled Delivery: ${new Date(order.scheduledDeliveryTime).toLocaleString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })}`
            : '';

        // Email content
        const adminEmail = process.env.ADMIN_EMAIL || 'mohamedinamulhasan0@gmail.com';
        const fromEmail = process.env.EMAIL_USER || 'noreply@shopease.com';

        const mailOptions = {
            from: fromEmail,
            to: adminEmail, // Admin email to receive notifications
            subject: `🛒 New Order #${String(order._id).slice(-6).toUpperCase()} Received!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h1 style="color: #2563eb; margin-bottom: 20px;">🛒 New Order Received!</h1>
                        
                        <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                            <h2 style="color: #1e40af; margin: 0;">Order #${String(order._id).slice(-6).toUpperCase()}</h2>
                        </div>

                        <div style="margin-bottom: 20px;">
                            <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">👤 Customer Details</h3>
                            <p style="margin: 5px 0;"><strong>Name:</strong> ${order.shippingAddress.name}</p>
                            <p style="margin: 5px 0;"><strong>Mobile:</strong> ${order.shippingAddress.mobile}</p>
                            <p style="margin: 5px 0;"><strong>Address:</strong> ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.zip}</p>
                            ${deliveryTime ? `<p style="margin: 5px 0; color: #2563eb;"><strong>📅 ${deliveryTime}</strong></p>` : ''}
                        </div>

                        <div style="margin-bottom: 20px;">
                            <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">🛍️ Items Ordered</h3>
                            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px;">
                                <pre style="margin: 0; font-family: monospace; white-space: pre-wrap;">${itemsList}</pre>
                            </div>
                        </div>

                        <div style="background-color: #dcfce7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                            <h3 style="color: #166534; margin: 0 0 10px 0;">💰 Total Amount</h3>
                            <p style="margin: 5px 0; font-size: 24px; font-weight: bold; color: #15803d;">₹${order.total.toFixed(0)}</p>
                            <p style="margin: 5px 0; color: #166534; font-size: 14px;">
                                (Subtotal: ₹${order.subtotal.toFixed(0)} + Delivery: ₹${order.shipping.toFixed(0)})
                            </p>
                        </div>

                        <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
                            <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
                                ⏰ Order Time: ${new Date(order.createdAt).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })}
                            </p>
                        </div>

                        <div style="margin-top: 30px; text-align: center;">
                            <a href="${process.env.CLIENT_URL}/admin" 
                               style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                View in Admin Panel
                            </a>
                        </div>
                    </div>
                    
                    <p style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px;">
                        This is an automated notification from your ShopEase store.
                    </p>
                </div>
            `
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Order notification email sent:', info.messageId);

        // If using Ethereal, log preview URL
        if (nodemailer.getTestMessageUrl(info)) {
            console.log('📧 Preview email at:', nodemailer.getTestMessageUrl(info));
        }

        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('❌ Error sending order notification email:', error);
        return { success: false, error: error.message };
    }
};
