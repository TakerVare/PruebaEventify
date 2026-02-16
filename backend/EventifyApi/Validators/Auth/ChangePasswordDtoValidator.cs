using EventifyApi.Models.DTOs.Auth;
using FluentValidation;

namespace EventifyApi.Validators.Auth;

/// <summary>
/// Validador para ChangePasswordDto
/// </summary>
public class ChangePasswordDtoValidator : AbstractValidator<ChangePasswordDto>
{
    public ChangePasswordDtoValidator()
    {
        RuleFor(x => x.CurrentPassword)
            .NotEmpty().WithMessage("La contraseña actual es requerida");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("La nueva contraseña es requerida")
            .MinimumLength(8).WithMessage("La contraseña debe tener al menos 8 caracteres")
            .Matches(@"[A-Z]").WithMessage("La contraseña debe contener al menos una mayúscula")
            .Matches(@"[a-z]").WithMessage("La contraseña debe contener al menos una minúscula")
            .Matches(@"[0-9]").WithMessage("La contraseña debe contener al menos un número")
            .Matches(@"[\!\@\#\$\%\^\&\*\(\)_\+\-\=\[\]\{\}\;\:\'\<\>\,\.\?\/]")
            .WithMessage("La contraseña debe contener al menos un carácter especial")
            .NotEqual(x => x.CurrentPassword).WithMessage("La nueva contraseña debe ser diferente a la actual");

        RuleFor(x => x.ConfirmNewPassword)
            .NotEmpty().WithMessage("Debe confirmar la nueva contraseña")
            .Equal(x => x.NewPassword).WithMessage("Las contraseñas no coinciden");
    }
}
