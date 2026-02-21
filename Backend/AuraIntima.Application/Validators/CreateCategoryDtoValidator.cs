using AuraIntima.Application.DTOs;
using FluentValidation;

namespace AuraIntima.Application.Validators;

public class CreateCategoryDtoValidator : AbstractValidator<CreateCategoryDto>
{
    public CreateCategoryDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(50);
    }
}
