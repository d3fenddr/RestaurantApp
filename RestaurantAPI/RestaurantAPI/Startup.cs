using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RestaurantAPI.Data;
using RestaurantAPI.Services;
using System.Text;

public class Startup
{
    private readonly IConfiguration _configuration;

    public Startup(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(_configuration.GetConnectionString("DefaultConnection")));

        services.AddControllers();

        services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend",
                builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
        });

        services.AddScoped<IUserService, UserService>();

        services.AddScoped<IDishService, DishService>();

        services.AddScoped<IOrderService, OrderService>();

        services.AddScoped<IAuthService, AuthService>();

        // JWT Authentication
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

        services.AddAuthorization();

        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "RestaurantAPI", Version = "v1" });
        });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseCors("AllowFrontend");

        app.UseRouting();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseSwagger();

        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "RestaurantAPI v1");
            c.RoutePrefix = string.Empty;
        });

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}
