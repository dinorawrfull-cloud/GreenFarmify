var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
    policy.WithOrigins("http://localhost:5500", "http://127.0.0.1:5500")
          .AllowAnyHeader().AllowAnyMethod()));
var app = builder.Build();
app.UseCors();

var municipios = new List<Municipio>
{
    new("merida","Mérida",20.9674,-89.5926,30.2,67,72,6.8,12,3),
    new("tizimin","Tizimín",21.1428,-88.1512,29.1,61,76,7.1,18,3),
    new("valladolid","Valladolid",20.6896,-88.2010,28.7,70,79,6.5,22,3),
    new("tekax","Tekax",20.2028,-89.2847,29.8,58,68,7.0,8,3),
    new("muna","Muna",20.4830,-89.7130,29.5,65,71,6.7,10,3),
    new("motul","Motul",21.0960,-89.2830,30.0,63,74,6.9,16,3)
};

app.MapGet("/api/health", () => Results.Ok(new { status = "ok", environment = "demo", dataLabel = "Datos de prueba" }));
app.MapGet("/api/dashboard", () => Results.Ok(new
{
    municipiosMonitoreados = municipios.Count,
    sensoresInstalados = municipios.Sum(m => m.Sensores),
    temperaturaPromedio = Math.Round(municipios.Average(m => m.Temperatura), 1),
    humedadPromedioSuelo = (int)Math.Round(municipios.Average(m => m.HumedadSuelo)),
    precipitacionAcumulada = municipios.Sum(m => m.Precipitacion),
    dataLabel = "Datos de prueba"
}));
app.MapGet("/api/municipios", () => Results.Ok(municipios));
app.MapGet("/api/municipios/{id}", (string id) =>
    municipios.FirstOrDefault(m => m.Id.Equals(id, StringComparison.OrdinalIgnoreCase)) is { } m
        ? Results.Ok(m) : Results.NotFound(new { message = "Municipio no encontrado" }));
app.MapGet("/api/cultivos", () => Results.Ok(new[]
{
    new { nombre="Maíz", temperaturaIdeal="18–30 °C", humedad="Según etapa", suelo="Bien drenado", cosecha="90–120 días", compatibilidad="Orientativa" },
    new { nombre="Frijol", temperaturaIdeal="18–28 °C", humedad="Moderada", suelo="Drenaje adecuado", cosecha="75–100 días", compatibilidad="Orientativa" },
    new { nombre="Calabaza", temperaturaIdeal="20–30 °C", humedad="Regular", suelo="Franco / drenado", cosecha="90–120 días", compatibilidad="Orientativa" }
}));
app.MapGet("/api/calendario/{mes:int}", (int mes) => mes is >= 1 and <= 12
    ? Results.Ok(new { mes, dataLabel="Referencia demostrativa", nota="No es pronóstico meteorológico", precipitacionMm=new[]{35,22,18,20,55,145,160,155,190,125,48,30}[mes-1] })
    : Results.BadRequest(new { message = "El mes debe estar entre 1 y 12" }));

app.Run("http://localhost:5080");

record Municipio(string Id, string Nombre, double Latitud, double Longitud,
    double Temperatura, int HumedadSuelo, int HumedadAmbiente, double Ph,
    double Precipitacion, int Sensores);
