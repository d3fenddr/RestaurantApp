﻿using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Models;
//using System.ComponentModel.DataAnnotations.Schema;

namespace RestaurantAPI.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Dish> Dishes { get; set; }
    public DbSet<DishCategory> Categories { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
    public DbSet<EmailVerificationToken> EmailVerificationTokens { get; set; }
    public DbSet<DeliveryAddress> DeliveryAddresses { get; set; }  



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();

        modelBuilder.Entity<Order>()
            .Property(o => o.Status)
            .HasConversion<string>();

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.OrderItems)
            .HasForeignKey(oi => oi.OrderId);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Dish)
            .WithMany()
            .HasForeignKey(oi => oi.DishId);
    }
}
