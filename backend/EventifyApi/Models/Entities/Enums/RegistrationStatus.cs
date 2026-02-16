namespace EventifyApi.Models.Entities.Enums;

/// <summary>
/// Estado de una inscripción a un evento
/// </summary>
public enum RegistrationStatus
{
    /// <summary>
    /// Pendiente - Esperando confirmación
    /// </summary>
    Pending = 0,

    /// <summary>
    /// Confirmada - Inscripción válida
    /// </summary>
    Confirmed = 1,

    /// <summary>
    /// Cancelada - Usuario canceló su inscripción
    /// </summary>
    Cancelled = 2,

    /// <summary>
    /// Asistió - Usuario confirmó asistencia al evento
    /// </summary>
    Attended = 3,

    /// <summary>
    /// No se presentó - Usuario no asistió al evento
    /// </summary>
    NoShow = 4
}
