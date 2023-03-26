import nodemailer from "nodemailer";

export const emailAdapter = {
  async sendEmail(to: string, subject: string, html: string) {

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      },
    });
    
    let info = await transporter.sendMail({
      from: `Nikita <${process.env.NODE_MAILER_USER}.com>`,
      to,
      subject,
      html,
    });

    return info;
  },
};
