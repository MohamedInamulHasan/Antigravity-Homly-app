import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // App Password
    }
});

export const sendPasswordResetEmail = async (email, resetUrl) => {
    try {
        const mailOptions = {
            from: `"Homly Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563EB;">Reset Your Password</h2>
                    <p>You requested a password reset. Please click the button below to reset your password:</p>
                    <a href="${resetUrl}" style="background-color: #2563EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Reset Password</a>
                    <p style="color: #666; font-size: 12px;">If you didn't request this, you can ignore this email.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Password reset email sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending password reset email:', error);
        throw new Error('Email sending failed');
    }
};

export const sendOrderNotificationEmail = async (order) => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

        // Format items for email
        const itemsListHtml = order.items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">x ${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price}</td>
            </tr>
        `).join('');

        const mailOptions = {
            from: `"Homly Orders" <${process.env.EMAIL_USER}>`,
            to: adminEmail, // Notify Admin
            subject: `New Order #${order._id.toString().slice(-6).toUpperCase()}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                    <div style="background-color: #2563EB; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">New Order Received! 📦</h1>
                    </div>
                    
                    <div style="padding: 24px;">
                        <p style="font-size: 16px; color: #374151;">Hello Admin,</p>
                        <p style="color: #4B5563;">You have received a new order from <strong>${order.user?.name || 'Guest'}</strong>.</p>
                        
                        <div style="background-color: #F3F4F6; padding: 16px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0; font-weight: bold; color: #1F2937;">Order ID: #${order._id}</p>
                            <p style="margin: 5px 0 0; color: #6B7280;">Date: ${new Date(order.createdAt).toLocaleString()}</p>
                        </div>

                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                            <thead>
                                <tr style="background-color: #F9FAFB; text-align: left;">
                                    <th style="padding: 10px; font-size: 14px; color: #6B7280;">Item</th>
                                    <th style="padding: 10px; font-size: 14px; color: #6B7280;">Qty</th>
                                    <th style="padding: 10px; font-size: 14px; color: #6B7280;">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsListHtml}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                                    <td style="padding: 10px; font-weight: bold; color: #2563EB;">₹${order.total}</td>
                                </tr>
                            </tfoot>
                        </table>

                        <div style="border-top: 1px solid #E5E7EB; padding-top: 20px;">
                            <h3 style="margin: 0 0 10px; color: #1F2937; font-size: 16px;">Delivery Details</h3>
                            <p style="margin: 0; color: #4B5563; line-height: 1.5;">
                                ${order.shippingAddress.name}<br>
                                ${order.shippingAddress.street}, ${order.shippingAddress.city}<br>
                                Mobile: ${order.shippingAddress.mobile}
                            </p>
                        </div>
                        
                         <div style="margin-top: 24px; text-align: center;">
                            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/orders/${order._id}" style="background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View Order Details</a>
                        </div>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Order notification email sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('❌ Error sending order notification email:', error);
        // Don't throw logic error to prevent blocking order creation flow
        return { success: false, error: error.message };
    }
};
