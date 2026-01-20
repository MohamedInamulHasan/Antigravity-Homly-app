import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email service configuration error:', error);
    } else {
        console.log('✅ Email service is ready to send emails');
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
                    <h2 style="color: #2563eb;">Password Reset Request</h2>
                    <p>You requested to reset your password. Click the button below to reset it:</p>
                    <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">Reset Password</a>
                    <p>If you didn't request this, please ignore this email.</p>
                    <p style="color: #666; font-size: 12px;">This link will expire in 1 hour.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Password reset email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Failed to send password reset email:', error);
        throw error;
    }
};

export const sendOrderNotificationEmail = async (order) => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

        const mailOptions = {
            from: `"Homly Orders" <${process.env.EMAIL_USER}>`,
            to: adminEmail,
            subject: `New Order #${order._id}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">New Order Received!</h2>
                    <p><strong>Order ID:</strong> ${order._id}</p>
                    <p><strong>Customer:</strong> ${order.name}</p>
                    <p><strong>Mobile:</strong> ${order.mobile}</p>
                    <p><strong>Address:</strong> ${order.address}, ${order.city} - ${order.zip}</p>
                    <p><strong>Total:</strong> ₹${order.total}</p>
                    <p><strong>Delivery Date:</strong> ${order.deliveryDate || 'Not specified'}</p>
                    <p><strong>Delivery Time:</strong> ${order.deliveryTime || 'Not specified'}</p>
                    <h3>Items:</h3>
                    <ul>
                        ${order.items.map(item => `
                            <li>${item.title} - Qty: ${item.quantity} - ₹${item.price * item.quantity}</li>
                        `).join('')}
                    </ul>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Order notification email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Failed to send order notification email:', error);
        throw error;
    }
};

export const sendServiceRequestNotification = async (request) => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

        const mailOptions = {
            from: `"Homly Services" <${process.env.EMAIL_USER}>`,
            to: adminEmail,
            subject: `New Service Request: ${request.service.name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">New Service Request!</h2>
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #1f2937;">Service Details</h3>
                        <p><strong>Service:</strong> ${request.service.name}</p>
                        <p><strong>Description:</strong> ${request.service.description}</p>
                        <p><strong>Service Address:</strong> ${request.service.address}</p>
                        <p><strong>Service Mobile:</strong> ${request.service.mobile}</p>
                    </div>
                    <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #1f2937;">Customer Details</h3>
                        <p><strong>Name:</strong> ${request.user.name}</p>
                        <p><strong>Email:</strong> ${request.user.email}</p>
                        <p><strong>Mobile:</strong> ${request.user.mobile}</p>
                    </div>
                    <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Request ID:</strong> ${request._id}</p>
                        <p><strong>Status:</strong> ${request.status}</p>
                        <p><strong>Requested on:</strong> ${new Date(request.createdAt).toLocaleString()}</p>
                    </div>
                    <p style="margin-top: 30px;">Please contact the customer to confirm the service request.</p>
                    <a href="https://wa.me/${request.user.mobile.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(request.user.name)}%2C%20we%20received%20your%20request%20for%20${encodeURIComponent(request.service.name)}.%20We%20will%20contact%20you%20shortly." 
                       style="display: inline-block; padding: 12px 24px; background-color: #25D366; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
                        Contact via WhatsApp
                    </a>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Service request notification email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Failed to send service request notification email:', error);
        throw error;
    }
};
