using AuraIntima.Application.DTOs;
using AuraIntima.Application.Interfaces;
using AuraIntima.Domain.Entities;
using AuraIntima.Domain.Interfaces;
using AuraIntima.Domain.Common;
using AuraIntima.Infrastructure.Services;
using FluentAssertions;
using Moq;
using Xunit;

namespace AuraIntima.Tests.Services;

public class ProductServiceTests
{
    private readonly Mock<IProductRepository> _productRepoMock;
    private readonly ProductService _productService;

    public ProductServiceTests()
    {
        _productRepoMock = new Mock<IProductRepository>();
        _productService = new ProductService(_productRepoMock.Object);
    }

    [Fact]
    public async Task GetProductByIdAsync_ShouldReturnProductDto_WhenProductExists()
    {
        // Arrange
        var productId = 1;
        var product = new Product 
        { 
            Id = productId, 
            Name = "Test Product", 
            Price = 100, 
            Category = new Category { Name = "Test Category" } 
        };
        _productRepoMock.Setup(repo => repo.GetByIdAsync(productId)).ReturnsAsync(product);

        // Act
        var result = await _productService.GetProductByIdAsync(productId);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(productId);
        result.Name.Should().Be(product.Name);
        result.CategoryName.Should().Be("Test Category");
    }
}
