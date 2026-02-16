using EventifyApi.Models.DTOs.Locations;
using FluentValidation;

namespace EventifyApi.Validators.Locations;

/// <summary>
/// Validador para CreateLocationDto
/// </summary>
public class CreateLocationDtoValidator : AbstractValidator<CreateLocationDto>
{
    public CreateLocationDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("El nombre es requerido")
            .MaximumLength(200).WithMessage("El nombre no puede exceder 200 caracteres");

        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("La dirección es requerida")
            .MaximumLength(500).WithMessage("La dirección no puede exceder 500 caracteres");

        RuleFor(x => x.Capacity)
            .GreaterThan(0).WithMessage("La capacidad debe ser mayor a 0")
            .LessThanOrEqualTo(100000).WithMessage("La capacidad no puede exceder 100,000");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("La descripción no puede exceder 1,000 caracteres")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.ImageUrl)
            .MaximumLength(500).WithMessage("La URL de la imagen no puede exceder 500 caracteres")
            .When(x => !string.IsNullOrEmpty(x.ImageUrl));

        RuleFor(x => x.ContactEmail)
            .EmailAddress().WithMessage("El email de contacto no es válido")
            .MaximumLength(255).WithMessage("El email de contacto no puede exceder 255 caracteres")
            .When(x => !string.IsNullOrEmpty(x.ContactEmail));

        RuleFor(x => x.ContactPhone)
            .MaximumLength(50).WithMessage("El teléfono de contacto no puede exceder 50 caracteres")
            .When(x => !string.IsNullOrEmpty(x.ContactPhone));

        RuleFor(x => x.Latitude)
            .InclusiveBetween(-90, 90).WithMessage("La latitud debe estar entre -90 y 90")
            .When(x => x.Latitude.HasValue);

        RuleFor(x => x.Longitude)
            .InclusiveBetween(-180, 180).WithMessage("La longitud debe estar entre -180 y 180")
            .When(x => x.Longitude.HasValue);
    }
}
