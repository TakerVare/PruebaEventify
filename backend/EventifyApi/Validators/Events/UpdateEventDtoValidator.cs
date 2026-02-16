using EventifyApi.Models.DTOs.Events;
using FluentValidation;

namespace EventifyApi.Validators.Events;

/// <summary>
/// Validador para UpdateEventDto
/// </summary>
public class UpdateEventDtoValidator : AbstractValidator<UpdateEventDto>
{
    public UpdateEventDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("El título es requerido")
            .MaximumLength(200).WithMessage("El título no puede exceder 200 caracteres");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("La descripción es requerida")
            .MaximumLength(2000).WithMessage("La descripción no puede exceder 2,000 caracteres");

        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage("La fecha de inicio es requerida");

        RuleFor(x => x.EndDate)
            .NotEmpty().WithMessage("La fecha de fin es requerida")
            .GreaterThan(x => x.StartDate)
            .WithMessage("La fecha de fin debe ser posterior a la fecha de inicio");

        RuleFor(x => x.Capacity)
            .GreaterThan(0).WithMessage("La capacidad debe ser mayor a 0")
            .LessThanOrEqualTo(100000).WithMessage("La capacidad no puede exceder 100,000");

        RuleFor(x => x.ImageUrl)
            .MaximumLength(500).WithMessage("La URL de la imagen no puede exceder 500 caracteres")
            .When(x => !string.IsNullOrEmpty(x.ImageUrl));

        RuleFor(x => x.LocationId)
            .GreaterThan(0).WithMessage("Debe seleccionar una ubicación válida");

        RuleFor(x => x.CategoryId)
            .GreaterThan(0).WithMessage("Debe seleccionar una categoría válida");
    }
}
