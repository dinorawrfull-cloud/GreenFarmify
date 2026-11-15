package com.greenfarmify.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5500", "http://127.0.0.1:5500"})
public class ApiController {
    private final List<Municipio> municipios = List.of(
        new Municipio("merida","Mérida",20.9674,-89.5926,30.2,67,72,6.8,12,3),
        new Municipio("tizimin","Tizimín",21.1428,-88.1512,29.1,61,76,7.1,18,3),
        new Municipio("valladolid","Valladolid",20.6896,-88.2010,28.7,70,79,6.5,22,3),
        new Municipio("tekax","Tekax",20.2028,-89.2847,29.8,58,68,7.0,8,3),
        new Municipio("muna","Muna",20.4830,-89.7130,29.5,65,71,6.7,10,3),
        new Municipio("motul","Motul",21.0960,-89.2830,30.0,63,74,6.9,16,3)
    );

    @GetMapping("/health")
    public Map<String,Object> health() {
        return Map.of("status","ok","environment","demo","dataLabel","Datos de prueba");
    }

    @GetMapping("/dashboard")
    public Map<String,Object> dashboard() {
        double temp = municipios.stream().mapToDouble(Municipio::temperatura).average().orElse(0);
        int humidity = (int)Math.round(municipios.stream().mapToInt(Municipio::humedadSuelo).average().orElse(0));
        return Map.of("municipiosMonitoreados",municipios.size(),"sensoresInstalados",municipios.stream().mapToInt(Municipio::sensores).sum(),
            "temperaturaPromedio",Math.round(temp*10.0)/10.0,"humedadPromedioSuelo",humidity,
            "precipitacionAcumulada",municipios.stream().mapToDouble(Municipio::precipitacion).sum(),"dataLabel","Datos de prueba");
    }

    @GetMapping("/municipios")
    public List<Municipio> getMunicipios() { return municipios; }

    @GetMapping("/municipios/{id}")
    public ResponseEntity<?> getMunicipio(@PathVariable String id) {
        return municipios.stream().filter(m -> m.id().equalsIgnoreCase(id)).findFirst()
            .<ResponseEntity<?>>map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/cultivos")
    public List<Map<String,String>> getCultivos() {
        return List.of(
            Map.of("nombre","Maíz","temperaturaIdeal","18–30 °C","humedad","Según etapa","suelo","Bien drenado","cosecha","90–120 días","compatibilidad","Orientativa"),
            Map.of("nombre","Frijol","temperaturaIdeal","18–28 °C","humedad","Moderada","suelo","Drenaje adecuado","cosecha","75–100 días","compatibilidad","Orientativa"),
            Map.of("nombre","Calabaza","temperaturaIdeal","20–30 °C","humedad","Regular","suelo","Franco / drenado","cosecha","90–120 días","compatibilidad","Orientativa")
        );
    }

    @GetMapping("/calendario/{mes}")
    public ResponseEntity<?> calendario(@PathVariable int mes) {
        int[] lluvia = {35,22,18,20,55,145,160,155,190,125,48,30};
        if (mes < 1 || mes > 12) return ResponseEntity.badRequest().body(Map.of("message","El mes debe estar entre 1 y 12"));
        return ResponseEntity.ok(Map.of("mes",mes,"dataLabel","Referencia demostrativa","nota","No es pronóstico meteorológico","precipitacionMm",lluvia[mes-1]));
    }
}
