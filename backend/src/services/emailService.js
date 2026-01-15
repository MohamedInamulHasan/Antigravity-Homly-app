import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = async () => {
    // If Gmail credentials are provided, use Gmail
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        console.log('📧 API: Creating Gmail transporter with User:', process.env.EMAIL_USER);
        console.log('📧 API: Creating Gmail transporter with User:', process.env.EMAIL_USER);
        return nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465, // Use 465 for secure connection (SSL/TLS)
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            },
            family: 4, // Force IPv4
            logger: true, // Log SMTP details
            debug: true, // Show debug info
            connectionTimeout: 10000, // Fail after 10s if cannot connect
            greetingTimeout: 5000,
            socketTimeout: 10000
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

// Generate HTML content for the email
const generateEmailHtml = (order, isForAdmin) => {
    // Format order items with Store Name
    const itemsList = order.items.map((item, index) => {
        const storeName = item.storeId?.name ? `(Store: ${item.storeId.name})` : '';
        return `${index + 1}. ${item.name} ${storeName} x${item.quantity} - ₹${item.price}`;
    }).join('\n');

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

    // WhatsApp Button Logic (Only for Admin)
    let actionButton = '';
    if (isForAdmin) {
        const customerMobile = order.shippingAddress.mobile || '';
        // Basic order summary for WhatsApp message - concise and clean
        const message = encodeURIComponent(
            `Hi ${order.shippingAddress.name}, thank you for your order #${String(order._id).slice(-6).toUpperCase()} on ShopEase!\n\n` +
            `Items:\n${order.items.map(i => `${i.name} x${i.quantity}`).join('\n')}\n` +
            `Total: ₹${order.total.toFixed(0)}\n\n` +
            `We'll update you when it ships!`
        );
        // Use international format if possible, but assuming local +91 for now based on context
        const whatsappUrl = `https://wa.me/91${customerMobile}?text=${message}`;

        actionButton = `
            <div style="margin-top: 30px; text-align: center;">
                <a href="${whatsappUrl}" 
                   style="display: inline-block; background-color: #25D366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px;">
                    <span style="vertical-align: middle; margin-right: 5px;">💬</span> Chat on WhatsApp
                </a>
                <p style="color: #6b7280; font-size: 11px; margin-top: 10px;">Click to send order details to customer</p>
            </div>
        `;
    } else {
        // Customer View: "Visit Store"
        actionButton = `
            <div style="margin-top: 30px; text-align: center;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" 
                   style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Visit Store
                </a>
            </div>
        `;
    }

    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h1 style="color: #2563eb; margin-bottom: 20px;">${isForAdmin ? '🛒 New Order Received!' : '✅ Order Confirmed'}</h1>
                
                <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="color: #1e40af; margin: 0;">Order #${String(order._id).slice(-6).toUpperCase()}</h2>
                    <p style="margin: 5px 0 0 0; color: #1e40af;">${isForAdmin ? 'A new order has been placed.' : 'Thank you for your order! We have received it.'}</p>
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

                ${actionButton}
            </div>
            
            <p style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px;">
                This is an automated notification from your ShopEase store.
            </p>
        </div>
    `;
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetUrl) => {
    try {
        const transporter = await createTransporter();
        const fromEmail = process.env.EMAIL_USER || 'noreply@shopease.com';

        const mailOptions = {
            from: fromEmail,
            to: email,
            subject: '🔑 Password Reset Request - ShopEase',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h1 style="color: #2563eb; margin-bottom: 20px;">Password Reset Request</h1>
                        
                        <p style="color: #374151; font-size: 16px;">
                            You are receiving this email because you (or someone else) has requested the reset of a password.
                        </p>
                        
                        <div style="margin: 30px 0; text-align: center;">
                            <a href="${resetUrl}" 
                               style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                Reset Password
                            </a>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px;">
                            Or verify using this link: <br>
                            <a href="${resetUrl}" style="color: #2563eb; word-break: break-all;">${resetUrl}</a>
                        </p>
                        
                        <div style="background-color: #fee2e2; padding: 15px; border-radius: 8px; margin-top: 20px;">
                            <p style="margin: 0; color: #991b1b; font-size: 14px;">
                                ⚠️ If you did not request this, please ignore this email and your password will remain unchanged.
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Password reset email sent:', info.messageId);

        if (nodemailer.getTestMessageUrl(info)) {
            console.log('📧 Preview reset email at:', nodemailer.getTestMessageUrl(info));
        }

        return { success: true };
    } catch (error) {
        console.error('❌ Error sending password reset email:', error);
        throw error; // Throw original error to see the real cause (e.g. ETIMEDOUT, EAUTH)
    }
};

// Send order notification email to admin and customer
export const sendOrderNotificationEmail = async (order) => {
    console.log('🔹 sendOrderNotificationEmail called for Order #', order._id);
    try {
        const transporter = await createTransporter();
        const fromEmail = process.env.EMAIL_USER || 'noreply@shopease.com';
        const adminEmail = process.env.ADMIN_EMAIL || 'mohamedinamulhasan0@gmail.com';
        const customerEmail = order.user?.email || order.shippingAddress?.email; // Fallback to shipping email if available

        console.log('🔹 Email Config:', {
            from: fromEmail,
            admin: adminEmail,
            customer: customerEmail,
            hasUser: !!process.env.EMAIL_USER,
            hasPass: !!process.env.EMAIL_PASS
        });

        // 1. Send to Admin
        console.log('📧 Sending Admin Notification with WhatsApp Button...');
        const adminMailOptions = {
            from: fromEmail,
            to: adminEmail,
            priority: 'high', // Mark as High Priority to trigger phone alerts
            subject: `🛒 New Order #${String(order._id).slice(-6).toUpperCase()} (WhatsApp Ready)`,
            html: generateEmailHtml(order, true) // isForAdmin = true
        };
        const adminInfo = await transporter.sendMail(adminMailOptions);
        console.log('✅ Admin email sent:', adminInfo.messageId);

        // 2. Send to Customer (if email exists)
        if (customerEmail) {
            console.log('📧 Sending Customer Confirmation to:', customerEmail);
            const customerMailOptions = {
                from: fromEmail,
                to: customerEmail,
                subject: `✅ Order Confirmation #${String(order._id).slice(-6).toUpperCase()}`,
                html: generateEmailHtml(order, false) // isForAdmin = false
            };
            await transporter.sendMail(customerMailOptions);
            console.log('✅ Customer email sent');
        } else {
            console.log('⚠️ No customer email found, skipping customer notification');
        }

        return { success: true, messageId: adminInfo.messageId };

    } catch (error) {
        console.error('❌ Error sending order notification email:', error);
        return { success: false, error: error.message };
    }
};
