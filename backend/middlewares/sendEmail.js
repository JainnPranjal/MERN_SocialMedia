const nodeMailer=require("nodemailer");

exports.sendEmail = async (options) => {
    const  transporter = nodeMailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",//process.env.SMPT_HOST,
        port: 2525,
        auth: {
          user: "97b90b26385489",
          pass: "dd57d131e8d4e0"
        },
      });

    
    const mailOptions={
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    

    await transporter.sendMail(mailOptions);
};