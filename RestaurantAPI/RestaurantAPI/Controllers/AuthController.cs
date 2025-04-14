using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using RestaurantAPI.Data;
using RestaurantAPI.DTO;
using RestaurantAPI.Models;
using RestaurantAPI.Services.Interfaces;
using System;
using System.Threading.Tasks;

namespace RestaurantAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        // Optionally, inject IWebHostEnvironment if you want dynamic Secure flag.
        private readonly IWebHostEnvironment _env;

        public AuthController(IAuthService authService, ApplicationDbContext context, IConfiguration configuration, IWebHostEnvironment env)
        {
            _authService = authService;
            _context = context;
            _configuration = configuration;
            _env = env;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            try
            {
                var result = await _authService.RegisterAsync(request);
                return Ok(new { message = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            try
            {
                var authResponse = await _authService.LoginAsync(request);
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (user == null)
                {
                    return Unauthorized("Invalid credentials.");
                }

                bool isDev = _env.IsDevelopment();

                // Set the HTTP-only token cookies.
                var accessTokenCookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = !isDev,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddMinutes(1)
                };
                Response.Cookies.Append("accessToken", authResponse.AccessToken, accessTokenCookieOptions);

                var refreshTokenCookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = !isDev,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddMinutes(1)
                };
                Response.Cookies.Append("refreshToken", authResponse.RefreshToken, refreshTokenCookieOptions);

                // Also set a non-HTTP-only cookie for the refresh token expiration time.
                var refreshTokenExpireCookieOptions = new CookieOptions
                {
                    HttpOnly = false, // Make it accessible via JavaScript.
                    Secure = !isDev,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddMinutes(1)
                };
                // Send the expiration timestamp as ISO string (or any agreed format).
                Response.Cookies.Append("refreshTokenExpire", DateTime.UtcNow.AddMinutes(1).ToString("o"), refreshTokenExpireCookieOptions);

                return Ok(new
                {
                    user = new
                    {
                        id = user.Id,
                        fullName = user.FullName,
                        email = user.Email,
                        role = user.Role
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
            // Read refresh token from cookie.
            if (!Request.Cookies.TryGetValue("refreshToken", out string refreshToken))
            {
                return Unauthorized("Refresh token not found.");
            }

            var storedToken = await _context.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

            if (storedToken == null || !storedToken.IsActive)
            {
                return Unauthorized("Invalid or expired refresh token.");
            }

            var newAccessToken = _authService.RefreshAccessToken(storedToken.User);
            bool isDev = _env.IsDevelopment();
            var accessTokenCookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = !isDev,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddMinutes(1)
            };
            Response.Cookies.Append("accessToken", newAccessToken, accessTokenCookieOptions);

            return Ok(new { accessToken = newAccessToken });
        }
    }
}
