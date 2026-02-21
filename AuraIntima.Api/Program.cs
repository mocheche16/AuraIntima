using AuraIntima.Infrastructure;
using AuraIntima.Infrastructure.Identity;
using AuraIntima.Infrastructure.Data;
using AuraIntima.Api.Filters;
using AuraIntima.Api.Middleware;
using AuraIntima.Application.Validators;
using FluentValidation;
using FluentValidation.AspNetCore;
using Mapster;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Serilog;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ───────────────────────────────────────────
// 0. Serilog Configuration
// ───────────────────────────────────────────
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("Logs/auraintima-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// ───────────────────────────────────────────
// 1. Infraestructura (EF Core + Identity + Repos)
// ───────────────────────────────────────────
builder.Services.AddInfrastructure(builder.Configuration);

// ───────────────────────────────────────────
// 2. JWT Authentication
// ───────────────────────────────────────────
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"]!;

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer           = true,
        ValidateAudience         = true,
        ValidateLifetime         = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer              = jwtSettings["Issuer"],
        ValidAudience            = jwtSettings["Audience"],
        IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

builder.Services.AddAuthorization();

// ───────────────────────────────────────────
// 3. Controllers + Swagger + FluentValidation
// ───────────────────────────────────────────
builder.Services.AddControllers(options =>
{
    // Global validation filter — auto-returns 400 if ModelState is invalid
    options.Filters.Add<ValidateModelAttribute>();
    // Suppress the default invalid model response behavior from ApiBehavior
    options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true;
});

// Suppress default ApiController's automatic 400 so our filter handles it
builder.Services.Configure<ApiBehaviorOptions>(options =>
    options.SuppressModelStateInvalidFilter = true);

// Register FluentValidation
builder.Services.AddFluentValidationAutoValidation()
                .AddFluentValidationClientsideAdapters()
                .AddValidatorsFromAssemblyContaining<CreateProductDtoValidator>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title       = "Aura Íntima API",
        Version     = "v1",
        Description = "API e-commerce para Aura Íntima. Usa JWT Bearer para acceder a los endpoints protegidos.",
        Contact     = new OpenApiContact { Name = "Equipo AuraIntima", Email = "admin@auraintima.com" }
    });

    // Incluir comentarios XML de los controladores en Swagger
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
        c.IncludeXmlComments(xmlPath);

    // Definición del esquema de seguridad JWT en Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name        = "Authorization",
        Type        = SecuritySchemeType.Http,
        Scheme      = "Bearer",
        BearerFormat = "JWT",
        In          = ParameterLocation.Header,
        Description = "Ingresa tu token JWT. Ejemplo: Bearer {token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id   = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ───────────────────────────────────────────
// 4. CORS (ajusta los orígenes según tu frontend)
// ───────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AuraIntimaPolicy", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddHealthChecks()
                .AddDbContextCheck<ApplicationDbContext>();

var app = builder.Build();

// ───────────────────────────────────────────
// 5. Seed de roles y usuario Admin por defecto
// ───────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await context.Database.MigrateAsync();
    await DbInitializer.SeedAsync(scope.ServiceProvider);
}

// ───────────────────────────────────────────
// 6. Pipeline HTTP
// ───────────────────────────────────────────
app.UseMiddleware<ExceptionMiddleware>();

app.UseSwagger();
app.UseSwaggerUI(c => {
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Aura Íntima API v1");
    c.RoutePrefix = "swagger"; 
});

app.UseHttpsRedirection();
app.UseCors("AuraIntimaPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/health");

app.Run();
