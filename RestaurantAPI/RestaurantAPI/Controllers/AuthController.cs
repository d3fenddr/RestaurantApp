using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Data;
using RestaurantAPI.DTO;
using RestaurantAPI.Models;
using RestaurantAPI.Services.Interfaces;
//using System;
//using System.Threading.Tasks;

namespace RestaurantAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        private readonly IEmailService _emailService;

        public AuthController(IAuthService authService, ApplicationDbContext context, IConfiguration configuration, IWebHostEnvironment env, IEmailService emailService)
        {
            _authService = authService;
            _context = context;
            _configuration = configuration;
            _env = env;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            try
            {
                var result = await _authService.RegisterAsync(request);
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (user == null) return BadRequest(new { message = "User creation failed." });

                var token = Guid.NewGuid().ToString();
                var expires = DateTime.UtcNow.AddHours(1);

                _context.EmailVerificationTokens.Add(new EmailVerificationToken
                {
                    UserId = user.Id,
                    Token = token,
                    ExpiresAt = expires
                });

                await _context.SaveChangesAsync();

                var frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:5173";
                var verifyLink = $"{frontendUrl}/verify-email?token={token}";
                await _emailService.SendVerificationEmailAsync(user.Email, verifyLink);

                return Ok(new { message = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromQuery] string token)
        {
            var entry = await _context.EmailVerificationTokens
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.Token == token && e.ExpiresAt > DateTime.UtcNow);

            if (entry == null)
                return BadRequest(new { message = "Invalid or expired token." });

            var user = entry.User;
            user.IsEmailConfirmed = true;
            _context.EmailVerificationTokens.Remove(entry);

            var accessToken = _authService.GenerateAccessToken(user);
            var refreshToken = _authService.GenerateRefreshToken();

            _context.RefreshTokens.Add(new RefreshToken
            {
                UserId = user.Id,
                Token = refreshToken,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            await _context.SaveChangesAsync();

            bool isDev = _env.IsDevelopment();

            Response.Cookies.Append("accessToken", accessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = !isDev,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddMinutes(15)
            });

            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = !isDev,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            Response.Cookies.Append("refreshTokenExpire", DateTime.UtcNow.AddDays(7).ToString("o"), new CookieOptions
            {
                HttpOnly = false,
                Secure = !isDev,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new
            {
                message = "Email confirmed successfully!",
                user = new
                {
                    id = user.Id,
                    fullName = user.FullName,
                    email = user.Email,
                    role = user.Role,
                    isEmailConfirmed = user.IsEmailConfirmed,
                    avatarUrl = user.AvatarUrl
                }
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            try
            {
                var authResponse = await _authService.LoginAsync(request);
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (user == null)
                    return Unauthorized("Invalid credentials.");

                bool isDev = _env.IsDevelopment();

                var accessTokenExpire = DateTime.UtcNow.AddMinutes(15);
                var refreshTokenExpire = DateTime.UtcNow.AddDays(7);

                Response.Cookies.Append("accessToken", authResponse.AccessToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = !isDev,
                    SameSite = SameSiteMode.Strict,
                    Expires = accessTokenExpire
                });

                Response.Cookies.Append("refreshToken", authResponse.RefreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = !isDev,
                    SameSite = SameSiteMode.Strict,
                    Expires = refreshTokenExpire
                });

                Response.Cookies.Append("refreshTokenExpire", refreshTokenExpire.ToString("o"), new CookieOptions
                {
                    HttpOnly = false,
                    Secure = !isDev,
                    SameSite = SameSiteMode.Strict,
                    Expires = refreshTokenExpire
                });

                return Ok(new
                {
                    user = new
                    {
                        id = user.Id,
                        fullName = user.FullName,
                        email = user.Email,
                        role = user.Role,
                        isEmailConfirmed = user.IsEmailConfirmed,
                        avatarUrl = user.AvatarUrl
                    }
                });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            if (!Request.Cookies.TryGetValue("refreshToken", out string refreshToken))
                return Unauthorized("Refresh token not found.");

            var storedToken = await _context.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

            if (storedToken == null || !storedToken.IsActive)
                return Unauthorized("Invalid or expired refresh token.");

            var newAccessToken = _authService.RefreshAccessToken(storedToken.User);
            bool isDev = _env.IsDevelopment();

            Response.Cookies.Append("accessToken", newAccessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = !isDev,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddMinutes(15)
            });

            return Ok(new { accessToken = newAccessToken });
        }

        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto request)
        {
            var user = await _context.Users.FindAsync(request.Id);
            if (user == null)
                return NotFound();

            user.FullName = request.FullName;
            user.Role = request.Role;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Profile updated." });
        }

        [HttpPost("request-reset")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return NotFound(new { message = "No user with this email." });

            var token = Guid.NewGuid().ToString();
            var expires = DateTime.UtcNow.AddMinutes(30);

            _context.PasswordResetTokens.Add(new PasswordResetToken
            {
                UserId = user.Id,
                Token = token,
                ExpiresAt = expires
            });

            await _context.SaveChangesAsync();

            var frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:5173";
            var resetLink = $"{frontendUrl}/reset-password?token={token}";
            await _emailService.SendResetPasswordEmailAsync(user.Email, resetLink);

            return Ok(new { message = "Reset link sent to email." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var tokenEntry = await _context.PasswordResetTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Token == request.Token && t.ExpiresAt > DateTime.UtcNow);

            if (tokenEntry == null)
                return BadRequest(new { message = "Invalid or expired token." });

            tokenEntry.User.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            _context.PasswordResetTokens.Remove(tokenEntry);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password has been reset." });
        }

        [HttpPost("resend-verification")]
        public async Task<IActionResult> ResendVerification([FromBody] ResendVerificationRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || user.IsEmailConfirmed)
                return BadRequest(new { message = "Email already confirmed or not found." });

            var token = Guid.NewGuid().ToString();
            _context.EmailVerificationTokens.Add(new EmailVerificationToken
            {
                UserId = user.Id,
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddHours(1)
            });

            await _context.SaveChangesAsync();

            var frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:5173";
            var verifyLink = $"{frontendUrl}/verify-email?token={token}";
            await _emailService.SendVerificationEmailAsync(user.Email, verifyLink);

            return Ok(new { message = "Verification email sent." });
        }
    }
}