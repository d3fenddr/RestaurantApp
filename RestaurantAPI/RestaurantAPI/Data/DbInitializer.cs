using RestaurantAPI.Models;
using Bogus;

namespace RestaurantAPI.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            if (context.Users.Any())
            {
                return;
            }

            // Seed Users using Bogus
            var userFaker = new Faker<User>()
                .RuleFor(u => u.FullName, f => f.Name.FullName())
                .RuleFor(u => u.Email, (f, u) => f.Internet.Email(u.FullName))
                .RuleFor(u => u.PasswordHash, f => BCrypt.Net.BCrypt.HashPassword("password"))
                .RuleFor(u => u.Role, f => "User")
                .RuleFor(u => u.CreatedAt, f => f.Date.Past(2));
            // Generate 10 users
            var users = userFaker.Generate(10);
            // Override first user to be Admin
            users[0].FullName = "Admin User";
            users[0].Email = "admin@mail.com";
            users[0].PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123");
            users[0].Role = "Admin";
            // Override second user to be Test User
            users[1].FullName = "Test User";
            users[1].Email = "test@mail.com";
            users[1].PasswordHash = BCrypt.Net.BCrypt.HashPassword("test123");
            // Add users to the context
            context.Users.AddRange(users);
            context.SaveChanges();

            // 2. Seed Dish Categories using Bogus (3 categories)
            var categoryFaker = new Faker<DishCategory>()
                .RuleFor(c => c.Name, f => f.Commerce.Categories(1).First())
                .RuleFor(c => c.Description, f => f.Lorem.Sentence());
            var categories = categoryFaker.Generate(3);
            // Override with specific category names if desired
            categories[0].Name = "Appetizers";
            categories[0].Description = "Light starters to begin your meal.";
            categories[1].Name = "Main Courses";
            categories[1].Description = "Hearty and fulfilling main dishes.";
            categories[2].Name = "Desserts";
            categories[2].Description = "Sweet treats to finish your meal.";
            context.Categories.AddRange(categories);
            context.SaveChanges();

            // 3. Seed Dishes using Bogus (10 dishes)
            // Retrieve saved categories to ensure valid foreign keys
            var savedCategories = context.Categories.ToList();
            var dishFaker = new Faker<Dish>()
                .RuleFor(d => d.Name, f => f.Commerce.ProductName())
                .RuleFor(d => d.Description, f => f.Lorem.Sentence())
                .RuleFor(d => d.Price, f => decimal.Parse(f.Commerce.Price(5, 30)))
                .RuleFor(d => d.ImageUrl, f => "https://example.com/test-image.jpg")
                .RuleFor(d => d.DishCategoryId, f => f.PickRandom(savedCategories).Id);
            var dishes = dishFaker.Generate(10);
            context.Dishes.AddRange(dishes);
            context.SaveChanges();

            // 4. Seed CartItems for the Test User ("test@mail.com")
            var testUser = context.Users.FirstOrDefault(u => u.Email == "test@mail.com");
            if (testUser != null)
            {
                var cartItemFaker = new Faker<CartItem>()
                    .RuleFor(ci => ci.UserId, f => testUser.Id)
                    .RuleFor(ci => ci.DishId, f => f.PickRandom(dishes).Id)
                    .RuleFor(ci => ci.Quantity, f => f.Random.Int(1, 5));
                var cartItems = cartItemFaker.Generate(3);
                context.CartItems.AddRange(cartItems);
                context.SaveChanges();
            }

            // 5. Seed an Order (for the Test User) with OrderItems using Bogus
            if (testUser != null)
            {
                // Create an order for the Test User
                var order = new Order
                {
                    UserId = testUser.Id,
                    OrderDate = DateTime.UtcNow,
                    Total = 0 // Will recalc below
                };
                context.Orders.Add(order);
                context.SaveChanges();

                // Generate 3 order items for this order
                var orderItemFaker = new Faker<OrderItem>()
                    .RuleFor(oi => oi.OrderId, order.Id)
                    .RuleFor(oi => oi.DishId, f => f.PickRandom(dishes).Id)
                    .RuleFor(oi => oi.Quantity, f => f.Random.Int(1, 3))
                    .RuleFor(oi => oi.Price, (f, oi) =>
                    {
                        // Get the price of the dish associated with this order item
                        var dishPrice = dishes.First(d => d.Id == oi.DishId).Price;
                        return dishPrice;
                    });
                var orderItems = orderItemFaker.Generate(3);
                context.OrderItems.AddRange(orderItems);
                context.SaveChanges();

                // Calculate the order total based on the generated order items
                order.Total = orderItems.Sum(oi => oi.Quantity * oi.Price);
                context.Orders.Update(order);
                context.SaveChanges();
            }
        }
    }
}
