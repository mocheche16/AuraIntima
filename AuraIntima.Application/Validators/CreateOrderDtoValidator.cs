using AuraIntima.Application.DTOs;
using FluentValidation;

namespace AuraIntima.Application.Validators;

public class CreateOrderDtoValidator : AbstractValidator<CreateOrderDto>
{
    public CreateOrderDtoValidator()
    {
        RuleFor(x => x.OrderItems).NotEmpty().WithMessage("El pedido debe contener al menos un producto.");
        RuleFor(x => x).Custom((dto, context) => {
            if (string.IsNullOrWhiteSpace(dto.ShippingAddress)) {
                context.AddFailure("ShippingAddress", "La dirección de envío es obligatoria.");
            }
        });
    }
}
