namespace RestaurantAPI.Services.Interfaces
{
    public interface IEmailService
    {
        Task SendResetPasswordEmailAsync(string toEmail, string resetLink);
        Task SendVerificationEmailAsync(string toEmail, string verifyLink);
    }
}