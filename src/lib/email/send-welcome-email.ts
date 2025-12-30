import { resend, EMAIL_FROM } from './index';
import { WelcomeEmail } from './templates/WelcomeEmail';

interface SendWelcomeEmailParams {
  to: string;
  userName: string;
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendWelcomeEmail({
  to,
  userName,
}: SendWelcomeEmailParams): Promise<SendEmailResult> {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn('[Email] RESEND_API_KEY not configured, skipping welcome email');
      return {
        success: false,
        error: 'Email service not configured',
      };
    }

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [to],
      subject: 'Welcome to NaviR - Your Minimalist Bookmark Navigator',
      react: WelcomeEmail({ userName }),
    });

    if (error) {
      console.error('[Email] Failed to send welcome email:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log(`[Email] Welcome email sent successfully to ${to}, messageId: ${data?.id}`);
    return {
      success: true,
      messageId: data?.id,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Email] Exception while sending welcome email:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
