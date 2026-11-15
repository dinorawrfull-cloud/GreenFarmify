package com.greenfarmify.api;

public record Municipio(
    String id, String nombre, double latitud, double longitud,
    double temperatura, int humedadSuelo, int humedadAmbiente,
    double ph, double precipitacion, int sensores
) {}
