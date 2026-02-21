using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace AuraIntima.Api.Filters;

/// <summary>
/// ActionFilter global que retorna 400 Bad Request automáticamente si la validación del modelo falla.
/// Elimina la necesidad de verificar ModelState.IsValid en cada controlador.
/// </summary>
public class ValidateModelAttribute : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (!context.ModelState.IsValid)
        {
            context.Result = new BadRequestObjectResult(context.ModelState);
        }
    }

    public void OnActionExecuted(ActionExecutedContext context) { }
}
