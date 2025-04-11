using RestaurantAPI.Data;
using RestaurantAPI.DTO;
using RestaurantAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;
using RestaurantAPI.Services.Interfaces;

namespace RestaurantAPI.Services.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly ApplicationDbContext _context;

        public OrderService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    UserId = o.UserId,
                    OrderDate = o.OrderDate,
                    Total = o.Total,
                    OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                    {
                        DishId = oi.DishId,
                        Quantity = oi.Quantity,
                        Price = oi.Price
                    }).ToList()
                })
                .ToListAsync();
        }

        public async Task<OrderDto?> GetOrderByIdAsync(int id)
        {
            var order = await _context.Orders.Include(o => o.OrderItems)
                            .FirstOrDefaultAsync(o => o.Id == id);
            if (order == null)
                return null;

            return new OrderDto
            {
                Id = order.Id,
                UserId = order.UserId,
                OrderDate = order.OrderDate,
                Total = order.Total,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDto
                {
                    DishId = oi.DishId,
                    Quantity = oi.Quantity,
                    Price = oi.Price
                }).ToList()
            };
        }

        public async Task<OrderDto> CreateOrderAsync(OrderDto orderDto)
        {
            var order = new Order
            {
                UserId = orderDto.UserId,
                OrderDate = DateTime.UtcNow,
                Total = orderDto.Total,
                OrderItems = orderDto.OrderItems.Select(oi => new OrderItem
                {
                    DishId = oi.DishId,
                    Quantity = oi.Quantity,
                    Price = oi.Price
                }).ToList()
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            orderDto.Id = order.Id;
            orderDto.OrderDate = order.OrderDate;
            return orderDto;
        }

        public async Task<bool> UpdateOrderAsync(int id, OrderDto orderDto)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);
            if (order == null)
                return false;

            order.UserId = orderDto.UserId;
            order.Total = orderDto.Total;

            order.OrderItems.Clear();
            foreach (var item in orderDto.OrderItems)
            {
                order.OrderItems.Add(new OrderItem
                {
                    DishId = item.DishId,
                    Quantity = item.Quantity,
                    Price = item.Price
                });
            }

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteOrderAsync(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return false;

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
