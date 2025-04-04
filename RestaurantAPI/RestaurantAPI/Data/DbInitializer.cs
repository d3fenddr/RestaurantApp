using System;
using System.Linq;
using RestaurantAPI.Models;

namespace RestaurantAPI.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            // Ensure the database is created.
            context.Database.EnsureCreated();

            // If there are any users, assume the DB is seeded.
            if (context.Users.Any())
            {
                return; // DB has been seeded
            }

            // 1. Seed Users
            var users = new User[]
            {
                new User
                {
                    FullName = "admin",
                    Email = "admin@mail.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    FullName = "Test Test",
                    Email = "test@mail.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("test123"),
                    Role = "User",
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    FullName = "Jane Smith",
                    Email = "jane@example.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("jane123"),
                    Role = "User",
                    CreatedAt = DateTime.UtcNow
                }
            };
            foreach (var user in users)
            {
                context.Users.Add(user);
            }
            context.SaveChanges();

            // 2. Seed Dish Categories (DishCategory)
            var categories = new DishCategory[]
            {
                new DishCategory { Name = "Appetizers", Description = "Light starters to begin your meal." },
                new DishCategory { Name = "Main Courses", Description = "Hearty and fulfilling main dishes." },
                new DishCategory { Name = "Desserts", Description = "Sweet treats to finish your meal." }
            };
            foreach (var category in categories)
            {
                context.Categories.Add(category);
            }
            context.SaveChanges();

            // 3. Seed Dishes (using a dummy test image URL)
            var dishes = new Dish[]
            {
                new Dish { Name = "Spring Rolls", Description = "Crispy vegetable spring rolls.", Price = 5.99M, DishCategoryId = categories[0].Id, ImageUrl = "https://example.com/test-image.jpg" },
                new Dish { Name = "Caesar Salad", Description = "Fresh Caesar salad.", Price = 7.99M, DishCategoryId = categories[0].Id, ImageUrl = "https://example.com/test-image.jpg" },
                new Dish { Name = "Grilled Chicken", Description = "Grilled chicken with herbs.", Price = 12.99M, DishCategoryId = categories[1].Id, ImageUrl = "https://example.com/test-image.jpg" },
                new Dish { Name = "Beef Steak", Description = "Juicy beef steak.", Price = 19.99M, DishCategoryId = categories[1].Id, ImageUrl = "https://example.com/test-image.jpg" },
                new Dish { Name = "Chocolate Cake", Description = "Decadent chocolate cake.", Price = 6.99M, DishCategoryId = categories[2].Id, ImageUrl = "https://example.com/test-image.jpg" }
            };
            foreach (var dish in dishes)
            {
                context.Dishes.Add(dish);
            }
            context.SaveChanges();

            // 4. Seed CartItems for Test (if Test exists)
            var test = context.Users.FirstOrDefault(u => u.Email == "test@mail.com");
            if (test != null)
            {
                var cartItems = new CartItem[]
                {
                    new CartItem { UserId = test.Id, DishId = dishes[0].Id, Quantity = 2 },
                    new CartItem { UserId = test.Id, DishId = dishes[2].Id, Quantity = 1 }
                };
                foreach (var cartItem in cartItems)
                {
                    context.CartItems.Add(cartItem);
                }
                context.SaveChanges();
            }

            // 5. Seed an Order (for Test) with an OrderItem
            if (test != null)
            {
                var order = new Order
                {
                    UserId = test.Id,
                    OrderDate = DateTime.UtcNow,
                    Total = dishes[0].Price * 2 // For example, the total equals the price of 2 Spring Rolls
                };
                context.Orders.Add(order);
                context.SaveChanges();

                var orderItem = new OrderItem
                {
                    OrderId = order.Id,
                    DishId = dishes[0].Id,
                    Quantity = 2,
                    Price = dishes[0].Price
                };
                context.OrderItems.Add(orderItem);
                context.SaveChanges();
            }
        }
    }
}
