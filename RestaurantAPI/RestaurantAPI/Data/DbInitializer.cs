using Bogus;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using RestaurantAPI.Models;
using RestaurantAPI.Services.Interfaces;

namespace RestaurantAPI.Data
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(ApplicationDbContext context, IServiceProvider services)
        {
            context.Database.EnsureCreated();

            if (context.Users.Any())
            {
                Console.WriteLine("[INIT] Database already seeded. Skipping.");
                return;
            }

            var blobService = services.GetRequiredService<IBlobStorageService>();

            // --- USERS ---
            var userFaker = new Faker<User>()
                .RuleFor(u => u.FullName, f => f.Name.FullName())
                .RuleFor(u => u.Email, (f, u) => f.Internet.Email(u.FullName))
                .RuleFor(u => u.PasswordHash, f => BCrypt.Net.BCrypt.HashPassword("password"))
                .RuleFor(u => u.Role, f => "User")
                .RuleFor(u => u.CreatedAt, f => f.Date.Past(2));

            var users = userFaker.Generate(10);

            for (int i = 0; i < users.Count; i++)
            {
                var user = users[i];
                var avatarUrl = await blobService.UploadFileAsync(await DownloadRandomImage(), "users");
                // Console.WriteLine($"[USER {i}] Avatar uploaded: {avatarUrl}");

                user.AvatarUrl = avatarUrl;
                if (string.IsNullOrWhiteSpace(user.AvatarUrl))
                    Console.WriteLine($"[ERROR] Avatar URL not set for user {user.FullName}");
            }

            // Admin user
            users[0].FullName = "Admin User";
            users[0].Email = "admin@mail.com";
            users[0].PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123");
            users[0].Role = "Admin";

            // Test user
            users[1].FullName = "Test User";
            users[1].Email = "test@mail.com";
            users[1].PasswordHash = BCrypt.Net.BCrypt.HashPassword("test123");

            context.Users.AddRange(users);
            await context.SaveChangesAsync();

            // --- CATEGORIES ---
            var categoryFaker = new Faker<DishCategory>()
                .RuleFor(c => c.Name, f => f.Commerce.Categories(1).First())
                .RuleFor(c => c.Description, f => f.Lorem.Sentence());

            var categories = categoryFaker.Generate(3);
            categories[0].Name = "Appetizers";
            categories[0].Description = "Light starters to begin your meal.";
            categories[1].Name = "Main Courses";
            categories[1].Description = "Hearty and fulfilling main dishes.";
            categories[2].Name = "Desserts";
            categories[2].Description = "Sweet treats to finish your meal.";

            context.Categories.AddRange(categories);
            await context.SaveChangesAsync();

            // --- DISHES ---
            var savedCategories = context.Categories.ToList();

            var dishFaker = new Faker<Dish>()
                .RuleFor(d => d.NameEn, f => f.Commerce.ProductName())
                .RuleFor(d => d.DescriptionEn, f => f.Lorem.Sentence())
                .RuleFor(d => d.Price, f => decimal.Parse(f.Commerce.Price(5, 30)))
                .RuleFor(d => d.DishCategoryId, f => f.PickRandom(savedCategories).Id);

            var dishes = new List<Dish>();
            for (int i = 0; i < 10; i++)
            {
                var dish = dishFaker.Generate();
                var imageUrl = await blobService.UploadFileAsync(await DownloadRandomImage(), "dishes");
                // Console.WriteLine($"[DISH {i}] Image uploaded: {imageUrl}");

                dish.ImageUrl = imageUrl;
                if (string.IsNullOrWhiteSpace(dish.ImageUrl))
                    Console.WriteLine($"[ERROR] Dish ImageUrl not set for {dish.NameEn}");

                dishes.Add(dish);
            }

            context.Dishes.AddRange(dishes);
            await context.SaveChangesAsync();

            // --- CART ITEMS ---
            var testUser = context.Users.FirstOrDefault(u => u.Email == "test@mail.com");
            if (testUser != null)
            {
                var cartItemFaker = new Faker<CartItem>()
                    .RuleFor(ci => ci.UserId, testUser.Id)
                    .RuleFor(ci => ci.DishId, f => f.PickRandom(dishes).Id)
                    .RuleFor(ci => ci.Quantity, f => f.Random.Int(1, 5));

                var cartItems = cartItemFaker.Generate(3);
                context.CartItems.AddRange(cartItems);
                await context.SaveChangesAsync();
            }

            // --- ORDER + ORDER ITEMS ---
            if (testUser != null)
            {
                var order = new Order
                {
                    UserId = testUser.Id,
                    OrderDate = DateTime.UtcNow,
                    Total = 0
                };

                context.Orders.Add(order);
                await context.SaveChangesAsync();

                var orderItemFaker = new Faker<OrderItem>()
                    .RuleFor(oi => oi.OrderId, order.Id)
                    .RuleFor(oi => oi.DishId, f => f.PickRandom(dishes).Id)
                    .RuleFor(oi => oi.Quantity, f => f.Random.Int(1, 3))
                    .RuleFor(oi => oi.Price, (f, oi) =>
                        dishes.First(d => d.Id == oi.DishId).Price);

                var orderItems = orderItemFaker.Generate(3);
                context.OrderItems.AddRange(orderItems);
                await context.SaveChangesAsync();

                order.Total = orderItems.Sum(oi => oi.Quantity * oi.Price);
                context.Orders.Update(order);
                await context.SaveChangesAsync();
            }

            Console.WriteLine("[INIT] Database seeding completed.");
        }

        private static async Task<IFormFile> DownloadRandomImage()
        {
            var httpClient = new HttpClient();
            var stream = await httpClient.GetStreamAsync("https://picsum.photos/400/300");

            var memStream = new MemoryStream();
            await stream.CopyToAsync(memStream);
            memStream.Position = 0;

            return new FormFile(memStream, 0, memStream.Length, "file", "random.jpg")
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/jpeg"
            };
        }
    }
}
