using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;
using RestaurantAPI.Services.Interfaces;
using System.Threading.Tasks;

namespace RestaurantAPI.Services.Implementations
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendResetPasswordEmailAsync(string toEmail, string resetLink)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Restaurant Support", _config["Smtp:Username"]));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = "Reset Your Password";

            var builder = new BodyBuilder
            {
                HtmlBody = $"""
                    <h2>Password Reset</h2>
                    <p>Click the button below to reset your password:</p>
                    <a style='padding:10px 20px;background:#b88b4a;color:#fff;text-decoration:none;border-radius:8px' href='{resetLink}'>Reset Password</a>
                    <p>This link will expire in 30 minutes.</p>
                """
            };

            message.Body = builder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(_config["Smtp:Host"], int.Parse(_config["Smtp:Port"]), false);
            await client.AuthenticateAsync(_config["Smtp:Username"], _config["Smtp:Password"]);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }

        public async Task SendVerificationEmailAsync(string toEmail, string verifyLink)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Restaurant Support", _config["Smtp:Username"]));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = "Verify Your Email";

            var builder = new BodyBuilder
            {
                HtmlBody = $"""
                    <h2>Confirm Your Email</h2>
                    <p>Click the button below to verify your email address:</p>
                    <a style='padding:10px 20px;background:#4CAF50;color:#fff;text-decoration:none;border-radius:8px' href='{verifyLink}'>Verify Email</a>
                    <p>This link will expire in 1 hour.</p>
                """
            };

            message.Body = builder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(_config["Smtp:Host"], int.Parse(_config["Smtp:Port"]), false);
            await client.AuthenticateAsync(_config["Smtp:Username"], _config["Smtp:Password"]);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}
