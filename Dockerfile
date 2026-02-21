# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["AuraIntima.Api/AuraIntima.Api.csproj", "AuraIntima.Api/"]
COPY ["AuraIntima.Application/AuraIntima.Application.csproj", "AuraIntima.Application/"]
COPY ["AuraIntima.Domain/AuraIntima.Domain.csproj", "AuraIntima.Domain/"]
COPY ["AuraIntima.Infrastructure/AuraIntima.Infrastructure.csproj", "AuraIntima.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "AuraIntima.Api/AuraIntima.Api.csproj"

# Copy everything else
COPY . .

# Build and publish
WORKDIR "/src/AuraIntima.Api"
RUN dotnet publish "AuraIntima.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expose port (Railway uses PORT env var, but .NET follows 8080 by default in 8.0)
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "AuraIntima.Api.dll"]
