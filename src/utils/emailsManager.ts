import { emailAdapter } from "../adapters/emailAdapter";

export const emailsManager = {
  async sendRegistrationConfirmationEmail(to: string, code: string) {
    const subject = "Thank for your registration";
    const html = `
    <h1>Thank for your registration</h1>
    <p>To finish registration please follow the link below:
        <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
    </p>   
    `;

    await emailAdapter.sendEmail(to, subject, html);
  },

  async sendPasswordRecoveryEmail(to: string, code: string) {
    const subject = "Password recovery";
    const html = `
      <h1>Password recovery</h1>
      <p>To finish password recovery please follow the link below:
        <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
      </p>   
    `;

    await emailAdapter.sendEmail(to, subject, html);
  },
};
