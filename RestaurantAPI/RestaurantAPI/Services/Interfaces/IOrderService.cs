﻿using RestaurantAPI.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantAPI.Services.Interfaces
{
    public interface IOrderService
    {
        Task<IEnumerable<OrderDto>> GetAllOrdersAsync();
        Task<OrderDto?> GetOrderByIdAsync(int id);
        Task<OrderDto> CreateOrderAsync(OrderDto orderDto);
        Task<bool> UpdateOrderAsync(int id, OrderDto orderDto);
        Task<bool> DeleteOrderAsync(int id);
        Task<IEnumerable<OrderDto>> GetOrdersByUserIdAsync(int userId);
        Task<OrderDto?> GetLatestOrderByUserIdAsync(int userId);
        Task<bool> UpdateOrderStatusAsync(int id, string status);
    }
}
