import nodemailer from 'nodemailer';

// Create reusable transporter using existing Brevo SMTP configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Verify transporter configuration
// Verify transporter configuration
// transporter.verify((error, success) => {
//     if (error) {
//         console.warn('❌ Email service configuration error (Non-fatal):', error.message);
//     } else {
//         console.log('✅ Email service is ready to send emails');
//     }
// });

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

        // Extract shipping address fields
        const shippingAddr = order.shippingAddress || {};
        const customerName = shippingAddr.name || order.user?.name || 'Customer';
        const customerMobile = shippingAddr.mobile || 'N/A';
        const customerAddress = shippingAddr.street || 'N/A';
        const customerCity = shippingAddr.city || 'N/A';
        const customerZip = shippingAddr.zip || 'N/A';

        // Format phone number for WhatsApp (remove all non-digits, ensure it starts with country code)
        let whatsappNumber = customerMobile.replace(/[^0-9]/g, '');
        // If number doesn't start with country code and is 10 digits, assume India (+91)
        if (whatsappNumber.length === 10) {
            whatsappNumber = '91' + whatsappNumber;
        }

        const mailOptions = {
            from: `"Homly Orders" <${process.env.EMAIL_USER}>`,
            to: adminEmail,
            subject: `New Order #${order._id.toString().slice(-8).toUpperCase()}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2563eb; margin-bottom: 20px;">🎉 New Order Received!</h2>
                    
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="margin: 5px 0;"><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
                        <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                        <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #f59e0b;">${order.status}</span></p>
                    </div>
                    
                    <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="margin-top: 0; color: #1f2937;">Customer Details</h3>
                        <p style="margin: 5px 0;"><strong>Name:</strong> ${customerName}</p>
                        <p style="margin: 5px 0;"><strong>Mobile:</strong> ${customerMobile}</p>
                        <p style="margin: 5px 0;"><strong>Address:</strong> ${customerAddress}</p>
                        <p style="margin: 5px 0;"><strong>City:</strong> ${customerCity}</p>
                        <p style="margin: 5px 0;"><strong>ZIP Code:</strong> ${customerZip}</p>
                    </div>
                    
                    <h3 style="color: #1f2937; margin-top: 30px;">Order Items</h3>
                    <table style="width: 100%; border-collapse: separate; border-spacing: 0 10px; margin-bottom: 20px;">
                        <tbody>
                            ${order.items.map(item => `
                                <tr style="background-color: #f9fafb;">
                                    <td style="padding: 15px; border-radius: 8px 0 0 8px;">
                                        <div style="font-weight: bold; font-size: 16px; color: #111827;">${item.name || item.title || 'Product'}</div>
                                        <div style="color: #6b7280; font-size: 14px; margin-top: 4px;">Unit: ${item.unit || item.product?.unit || 'N/A'}</div>
                                        ${item.storeId?.name ? `<div style="color: #9ca3af; font-size: 12px; margin-top: 2px;">Store: ${item.storeId.name}</div>` : ''}
                                    </td>
                                    <td style="padding: 15px; text-align: center;">
                                        <div style="font-weight: bold; color: #4b5563;">x${item.quantity}</div>
                                    </td>
                                    <td style="padding: 15px; text-align: right; border-radius: 0 8px 8px 0; font-weight: bold; color: #111827;">
                                        ₹${(item.price * item.quantity).toFixed(0)}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                            <tr>
                                <td colspan="2" style="padding: 2px 0;"></td>
                            </tr>
                        </table>
                        
                        <div style="margin-left: auto; max-width: 250px;">
                            <table style="width: 100%;">
                                <tr>
                                    <td style="padding: 6px 0; color: #6b7280; text-align: right;">Subtotal:</td>
                                    <td style="padding: 6px 0; text-align: right; color: #111827; font-weight: 500;">₹${(order.subtotal || 0).toFixed(0)}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; color: #6b7280; text-align: right;">Delivery:</td>
                                    <td style="padding: 6px 0; text-align: right; color: #111827; font-weight: 500;">
                                        ${order.shipping === 0 ? '<span style="color: #10b981;">FREE</span>' : `₹${(order.shipping || 0).toFixed(0)}`}
                                    </td>
                                </tr>
                                ${order.discount > 0 ? `
                                <tr>
                                    <td style="padding: 6px 0; color: #10b981; text-align: right;">Discount:</td>
                                    <td style="padding: 6px 0; text-align: right; color: #10b981; font-weight: 500;">-₹${order.discount.toFixed(0)}</td>
                                </tr>
                                ` : ''}
                                <tr>
                                    <td colspan="2" style="padding: 8px 0;">
                                        <div style="border-top: 1px solid #e5e7eb;"></div>
                                    </td>
                                </tr>
                                <tr style="background-color: #2563eb; color: white;">
                                    <td style="padding: 10px 15px; text-align: right; border-radius: 6px 0 0 6px; font-weight: bold;">TOTAL:</td>
                                    <td style="padding: 10px 15px; text-align: right; border-radius: 0 6px 6px 0; font-weight: bold; font-size: 18px;">₹${order.total.toFixed(0)}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    
                    <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${order.paymentMethod?.type || 'Cash on Delivery'}</p>
                        <p style="margin: 5px 0;"><strong>Delivery Time:</strong> ${order.scheduledDeliveryTime ? new Date(order.scheduledDeliveryTime).toLocaleString() : 'Not specified'}</p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <p style="margin-bottom: 15px;"><strong>Contact Customer:</strong></p>
                        <a href="https://wa.me/${whatsappNumber}?text=Hello%20${encodeURIComponent(customerName)}%21%0A%0AYour%20order%20has%20been%20received%20from%20Homly.%0A%0A*Order%20Details%3A*%0AOrder%20ID%3A%20%23${order._id.toString().slice(-8).toUpperCase()}%0ATotal%20Amount%3A%20₹${order.total.toFixed(0)}%0ADelivery%20Charge%3A%20${order.shipping === 0 ? 'FREE%20(Coin%20Applied)' : `₹${(order.shipping || 0).toFixed(0)}`}%0APayment%3A%20${encodeURIComponent(order.paymentMethod?.type || 'Cash on Delivery')}%0A%0A*Delivery%20Address%3A*%0A${encodeURIComponent(customerAddress)}%2C%20${encodeURIComponent(customerCity)}%20-%20${customerZip}%0A%0A*Items%20Ordered%3A*%0A${order.items.map((item, idx) => `${idx + 1}.%20${encodeURIComponent(item.name || item.title || 'Product')}%20x${item.quantity}%20-%20₹${(item.price * item.quantity).toFixed(0)}`).join('%0A')}%0A%0AYour%20order%20is%20being%20processed%20and%20will%20be%20delivered%20soon.%20Thank%20you%20for%20shopping%20with%20Homly%21" 
                           style="display: inline-block; padding: 12px 24px; background-color: #25D366; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                            📱 Contact via WhatsApp
                        </a>
                    </div>
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

export const sendOrderConfirmationToUser = async (order) => {
    try {
        const userEmail = order.user?.email;
        if (!userEmail) {
            console.log('ℹ️ No user email found for order confirmation');
            return null;
        }

        const shippingAddr = order.shippingAddress || {};
        const customerName = shippingAddr.name || order.user?.name || 'Customer';

        const mailOptions = {
            from: `"Homly" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `Order Confirmation - #${order._id.toString().slice(-8).toUpperCase()}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #2563eb; margin: 0;">Homly</h1>
                        <p style="color: #6b7280; margin: 5px 0;">Your Home, Delivered.</p>
                    </div>

                    <h2 style="color: #1f2937;">Hi ${customerName},</h2>
                    <p style="color: #4b5563; line-height: 1.5;">Thank you for your order! We've received it and are getting it ready for you.</p>

                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
                        <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                    </div>

                    <h3 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Order Summary</h3>
                    
                    <table style="width: 100%; border-collapse: separate; border-spacing: 0 10px; margin-bottom: 20px;">
                        <tbody>
                            ${order.items.map(item => `
                                <tr style="background-color: #f9fafb;">
                                    <td style="padding: 15px; border-radius: 8px 0 0 8px;">
                                        <div style="font-weight: bold; font-size: 16px; color: #111827;">${item.name || item.title || 'Product'}</div>
                                        <div style="color: #6b7280; font-size: 14px; margin-top: 4px;">Unit: ${item.unit || item.product?.unit || 'N/A'}</div>
                                    </td>
                                    <td style="padding: 15px; text-align: center;">
                                        <div style="font-weight: bold; color: #4b5563;">x${item.quantity}</div>
                                    </td>
                                    <td style="padding: 15px; text-align: right; border-radius: 0 8px 8px 0; font-weight: bold; color: #111827;">
                                        ₹${(item.price * item.quantity).toFixed(0)}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                            <tr>
                                <td colspan="2" style="padding: 2px 0;"></td>
                            </tr>
                        </table>
                        
                        <div style="margin-left: auto; max-width: 250px;">
                            <table style="width: 100%;">
                                <tr>
                                    <td style="padding: 6px 0; color: #6b7280; text-align: right;">Subtotal:</td>
                                    <td style="padding: 6px 0; text-align: right; color: #111827; font-weight: 500;">₹${(order.subtotal || 0).toFixed(0)}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; color: #6b7280; text-align: right;">Delivery:</td>
                                    <td style="padding: 6px 0; text-align: right; color: #111827; font-weight: 500;">
                                        ${order.shipping === 0 ? '<span style="color: #10b981;">FREE</span>' : `₹${(order.shipping || 0).toFixed(0)}`}
                                    </td>
                                </tr>
                                ${order.discount > 0 ? `
                                <tr>
                                    <td style="padding: 6px 0; color: #10b981; text-align: right;">Discount:</td>
                                    <td style="padding: 6px 0; text-align: right; color: #10b981; font-weight: 500;">-₹${order.discount.toFixed(0)}</td>
                                </tr>
                                ` : ''}
                                <tr>
                                    <td colspan="2" style="padding: 8px 0;">
                                        <div style="border-top: 1px solid #e5e7eb;"></div>
                                    </td>
                                </tr>
                                <tr style="background-color: #2563eb; color: white;">
                                    <td style="padding: 10px 15px; text-align: right; border-radius: 6px 0 0 6px; font-weight: bold;">TOTAL:</td>
                                    <td style="padding: 10px 15px; text-align: right; border-radius: 0 6px 6px 0; font-weight: bold; font-size: 18px;">₹${order.total.toFixed(0)}</td>
                                </tr>
                            </table>
                        </div>
                    </div>

                    <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                        <h3 style="margin-top: 0; color: #1f2937; font-size: 16px;">Delivery Details</h3>
                        <p style="margin: 5px 0; color: #4b5563;">${customerName}</p>
                        <p style="margin: 5px 0; color: #4b5563;">${customerAddress}</p>
                        <p style="margin: 5px 0; color: #4b5563;">${customerCity} - ${customerZip}</p>
                        <p style="margin: 10px 0 0 0; color: #4b5563;"><strong>Mobile:</strong> ${customerMobile}</p>
                    </div>

                    <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px;">
                        Need help? Reply to this email or contact us at support@homly.com
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ User order confirmation email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Failed to send user confirmation email:', error);
        // Don't throw logic error here, just log it so other flows continue
        return { success: false, error };
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

export const sendServiceRequestConfirmationToUser = async (request) => {
    try {
        const userEmail = request.user?.email;
        if (!userEmail) {
            console.log('ℹ️ No user email found for service request confirmation');
            return null;
        }

        const mailOptions = {
            from: `"Homly Services" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `Service Request Received - ${request.service.name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2563eb;">Service Request Received</h2>
                    <p>Hi ${request.user.name},</p>
                    <p>We received your request for <strong>${request.service.name}</strong>.</p>
                    
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Service:</strong> ${request.service.name}</p>
                        <p><strong>Description:</strong> ${request.service.description}</p>
                        <p><strong>Status:</strong> <span style="color: #ea580c;">${request.status || 'Pending'}</span></p>
                    </div>

                    <p>Our team will review your request and contact you shortly at <strong>${request.user.mobile}</strong>.</p>
                    
                    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                    <p style="color: #6b7280; font-size: 14px;">If you have any questions, please reply to this email.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Service request confirmation email sent to user:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Failed to send service request user confirmation:', error);
        return { success: false, error };
    }
};
