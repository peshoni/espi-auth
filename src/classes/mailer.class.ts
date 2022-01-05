import * as nodemailer from 'nodemailer';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as Mail from 'nodemailer/lib/mailer';
import * as dotenv from 'dotenv';
dotenv.config();

export class Mailer {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendEmail(
    config: Mail.Options
  ): Promise<SMTPTransport.SentMessageInfo | undefined> {
    return await this.transporter.sendMail(config).then(
      (ok: SMTPTransport.SentMessageInfo) => {
        return ok;
      },
      error => {
        console.log(error);

        return error;
      }
    );
  }
}
