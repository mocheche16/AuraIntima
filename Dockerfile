# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["Backend/AuraIntima.Api/AuraIntima.Api.csproj", "Backend/AuraIntima.Api/"]
COPY ["Backend/AuraIntima.Application/AuraIntima.Application.csproj", "Backend/AuraIntima.Application/"]
COPY ["Backend/AuraIntima.Domain/AuraIntima.Domain.csproj", "Backend/AuraIntima.Domain/"]
COPY ["Backend/AuraIntima.Infrastructure/AuraIntima.Infrastructure.csproj", "Backend/AuraIntima.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "Backend/AuraIntima.Api/AuraIntima.Api.csproj"

# Copy everything else
COPY . .

# Build and publish
WORKDIR "/src/Backend/AuraIntima.Api"
RUN dotnet publish "AuraIntima.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expose port (Railway uses PORT env var, but .NET follows 8080 by default in 8.0)
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "AuraIntima.Api.dll"]
