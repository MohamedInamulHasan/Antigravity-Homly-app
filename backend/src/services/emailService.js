// import nodemailer from 'nodemailer';

// MOCK EMAIL SERVICE due to nodemailer dependency issues
// TODO: Re-enable nodemailer after fixing node_modules corruption

export const sendPasswordResetEmail = async (email, resetUrl) => {
    console.log('📧 (MOCK) Password Reset Email requested for:', email);
    console.log('🔗 (MOCK) Reset URL:', resetUrl);
    return { success: true };
};

export const sendOrderNotificationEmail = async (order) => {
    console.log('📧 (MOCK) Order Notification Email requested for Order #', order._id);
    return { success: true, messageId: 'MOCK_MESSAGE_ID' };
};
