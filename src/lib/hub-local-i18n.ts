import type { Locale } from "./i18n";
import type { CityHub } from "./morocco-data";

type LocalTips = { parking: string; traps: string; taxi: string };

// Traductions du savoir-terrain de chaque hub (la source FR reste dans morocco-data.ts).
const TIPS: Record<string, Record<Exclude<Locale, "fr">, LocalTips>> = {
    marrakech: {
        en: {
            parking: "Never try to drive into the Medina maze. Leave the car at the guarded car parks at Bab Doukkala, Bab Nkob or Koutoubia (20 to 30 MAD for 24h, with a uniformed official attendant).",
            traps: "Mobile speed cameras are very common on Avenue Mohammed VI and the Ourika road (P2017). At the old roundabouts, watch the priority signs: they can be reversed.",
            taxi: "An airport taxi to Gueliz or the Medina is negotiated at 100 to 150 MAD by day (200 MAD at night). With two rides a day, a ZwinCar rental from 340 MAD/day pays for itself at once, with full freedom to visit Agafay or the Ourika valley.",
        },
        es: {
            parking: "No intente nunca entrar en coche en el laberinto de la Medina. Deje el vehículo en los aparcamientos vigilados de Bab Doukkala, Bab Nkob o Koutoubia (20 a 30 MAD por 24 h, con vigilante oficial con chaleco).",
            traps: "Radares móviles muy frecuentes en la Avenida Mohammed VI y la carretera del Ourika (P2017). En las rotondas antiguas, atención a las señales de prioridad, que pueden estar invertidas.",
            taxi: "Un taxi del aeropuerto a Gueliz o la Medina se negocia entre 100 y 150 MAD de día (200 MAD de noche). Con dos trayectos al día, alquilar con ZwinCar desde 340 MAD/día se amortiza enseguida, con total libertad para visitar Agafay o el Ourika.",
        },
        nl: {
            parking: "Rijd nooit de doolhof van de Medina in. Laat de auto achter op de bewaakte parkings van Bab Doukkala, Bab Nkob of Koutoubia (20 tot 30 MAD per 24 uur, met officiële bewaker in hesje).",
            traps: "Zeer vaak mobiele flitsers op de Avenue Mohammed VI en de weg naar Ourika (P2017). Let op de oude rotondes: de voorrangsborden kunnen omgekeerd zijn.",
            taxi: "Een luchthaventaxi naar Gueliz of de Medina kost overdag 100 tot 150 MAD (200 MAD 's nachts). Met twee ritten per dag is een ZwinCar-huurauto vanaf 340 MAD/dag meteen terugverdiend, met volledige vrijheid om Agafay of de Ourika-vallei te bezoeken.",
        },
    },
    agadir: {
        en: {
            parking: "Parking is very easy along the seafront and the Marina. In Taghazout and Anchor Point, use the guarded clifftop lots (10 to 20 MAD for the whole day).",
            traps: "Near-daily laser speed checks at the start of the Agadir-Taghazout expressway (80 km/h limit) and at the A3 motorway toll towards Marrakech.",
            taxi: "The official grand taxi from Al Massira airport to central Agadir or Taghazout costs 220 to 350 MAD one way. A ZwinCar rental from €22/day (240 MAD) pays off from the moment you land.",
        },
        es: {
            parking: "Aparcar es muy fácil a lo largo del paseo marítimo y la Marina. En Taghazout y Anchor Point, use las explanadas vigiladas de los acantilados (10 a 20 MAD el día completo).",
            traps: "Control de radar láser casi diario a la entrada de la vía rápida Agadir-Taghazout (limitada a 80 km/h) y en el peaje de la autopista A3 hacia Marrakech.",
            taxi: "El gran taxi oficial del aeropuerto Al Massira al centro de Agadir o a Taghazout cuesta entre 220 y 350 MAD por trayecto. Un alquiler ZwinCar desde 22 €/día (240 MAD) sale rentable desde el aterrizaje.",
        },
        nl: {
            parking: "Parkeren is heel makkelijk langs de boulevard en de Marina. In Taghazout en Anchor Point kiest u de bewaakte terreinen op de kliffen (10 tot 20 MAD voor de hele dag).",
            traps: "Bijna dagelijks lasercontroles bij de oprit van de expresweg Agadir-Taghazout (max. 80 km/u) en bij de tol van de A3 richting Marrakech.",
            taxi: "De officiële grand taxi van luchthaven Al Massira naar Agadir-centrum of Taghazout kost 220 tot 350 MAD enkele reis. Een ZwinCar-huurauto vanaf €22/dag (240 MAD) is vanaf de landing rendabel.",
        },
    },
    casablanca: {
        en: {
            parking: "Heavy traffic: use the guarded underground car parks (Place des Nations Unies, Triangle d'Or, Marina Shopping). Official street attendants wear yellow vests (5 MAD by day, 10 MAD at night).",
            traps: "New-generation fixed speed cameras on the southern ring road (urban A1 motorway, 80 km/h limit) and camera-monitored traffic lights in Maarif.",
            taxi: "The white grand taxi from Mohammed V airport to Maarif or Gauthier is a fixed 300 MAD by day (350 MAD at night). For €26/day (280 MAD), your own car is handed over without queuing right after customs.",
        },
        es: {
            parking: "Tráfico denso: use los aparcamientos subterráneos vigilados (Place des Nations Unies, Triangle d'Or, Marina Shopping). Vigilantes de calle oficiales con chaleco amarillo (5 MAD de día, 10 MAD de noche).",
            traps: "Radares fijos de nueva generación en la circunvalación sur (autopista urbana A1 limitada a 80 km/h) y semáforos vigilados por cámaras en Maarif.",
            taxi: "El gran taxi blanco del aeropuerto Mohammed V a Maarif o Gauthier cuesta 300 MAD fijos de día (350 MAD de noche). Por 26 €/día (280 MAD), su coche se entrega sin colas a la salida de la aduana.",
        },
        nl: {
            parking: "Druk verkeer: kies de bewaakte ondergrondse parkings (Place des Nations Unies, Triangle d'Or, Marina Shopping). Officiële straatbewakers dragen een geel hesje (5 MAD overdag, 10 MAD 's nachts).",
            traps: "Vaste flitspalen van de nieuwe generatie op de zuidelijke ringweg (stedelijke A1, max. 80 km/u) en verkeerslichten met camera's in Maarif.",
            taxi: "De witte grand taxi van luchthaven Mohammed V naar Maarif of Gauthier kost vast 300 MAD overdag (350 MAD 's nachts). Voor €26/dag (280 MAD) krijgt u uw eigen auto zonder wachtrij direct na de douane.",
        },
    },
    tanger: {
        en: {
            parking: "Guarded car parks around the Grand Socco and the Malabata Corniche (15 to 20 MAD/day). Avoid the Marshan district at school closing times.",
            traps: "Frequent speed cameras on the RN2 towards Tetouan and on the Cap Spartel coast road. Strict 60 km/h speed checks near the Rif villages.",
            taxi: "An airport taxi to the centre or the port costs 120 to 150 MAD. To explore Cap Spartel, the Caves of Hercules and Chefchaouen, a rental car from 270 MAD/day gives you unmatched independence.",
        },
        es: {
            parking: "Aparcamientos vigilados alrededor del Gran Zoco y de la Cornisa de Malabata (15 a 20 MAD/día). Evite el barrio de Marshan a la hora de salida de los colegios.",
            traps: "Radares frecuentes en la RN2 hacia Tetuán y en la carretera costera del Cabo Espartel. Controles de velocidad estrictos a 60 km/h cerca de los pueblos del Rif.",
            taxi: "El taxi del aeropuerto al centro o al puerto cuesta 120 a 150 MAD. Para explorar el Cabo Espartel, las Grutas de Hércules y Chefchaouen, un coche desde 270 MAD/día ofrece una independencia incomparable.",
        },
        nl: {
            parking: "Bewaakte parkings rond de Grand Socco en de Corniche van Malabata (15 tot 20 MAD/dag). Vermijd de wijk Marshan wanneer de scholen uitgaan.",
            traps: "Vaak flitsers op de RN2 richting Tétouan en op de kustweg naar Kaap Spartel. Strenge snelheidscontroles op 60 km/u bij de dorpen in de Rif.",
            taxi: "Een luchthaventaxi naar het centrum of de haven kost 120 tot 150 MAD. Om Kaap Spartel, de Grotten van Hercules en Chefchaouen te verkennen, geeft een huurauto vanaf 270 MAD/dag ongeëvenaarde vrijheid.",
        },
    },
    fes: {
        en: {
            parking: "Always park at the large car parks outside the Medina: Bab Boujloud or Ain Zleten. Do not try to drive into the pedestrian Medina.",
            traps: "High unmarked speed bumps on the Meknes road (N8) and regular mobile gendarmerie checks on the climb to Ifrane.",
            taxi: "A grand taxi from Saiss airport to Bab Boujloud costs 120 to 150 MAD. Renting at €23/day (250 MAD) lets you explore Meknes, Volubilis and Moulay Idriss easily without negotiating every ride.",
        },
        es: {
            parking: "Aparque siempre en los grandes aparcamientos exteriores de la Medina: Bab Boujloud o Ain Zleten. No intente entrar en la Medina peatonal.",
            traps: "Badenes altos sin señalizar en la carretera de Mequinez (N8) y controles móviles de la gendarmería frecuentes en la subida a Ifrane.",
            taxi: "El gran taxi del aeropuerto de Saiss a Bab Boujloud cuesta 120-150 MAD. Alquilar a 23 €/día (250 MAD) le permite recorrer Mequinez, Volubilis y Mulay Idrís sin negociar cada trayecto.",
        },
        nl: {
            parking: "Parkeer altijd op de grote parkings buiten de Medina: Bab Boujloud of Ain Zleten. Probeer de voetgangersmedina niet in te rijden.",
            traps: "Hoge, niet aangegeven verkeersdrempels op de weg naar Meknes (N8) en regelmatig mobiele controles van de gendarmerie op de klim naar Ifrane.",
            taxi: "Een grand taxi van luchthaven Saïss naar Bab Boujloud kost 120 tot 150 MAD. Huren voor €23/dag (250 MAD) laat u makkelijk Meknes, Volubilis en Moulay Idriss bezoeken zonder over elke rit te onderhandelen.",
        },
    },
    rabat: {
        en: {
            parking: "Paid street parking is strictly enforced in Rabat (Rabat Parking): pay at the meter or in the app. The Bab El Had and Agdal underground car parks are very secure.",
            traps: "Always give way to pedestrians and respect traffic lights (city cameras active on Avenue Mohammed V). Speed cameras on the Hassan II bridge between Rabat and Sale.",
            taxi: "Airport taxi from Sale to central Rabat: 150 to 200 MAD. For €25/day (270 MAD), you have a clean car for business trips or for the Marina.",
        },
        es: {
            parking: "El estacionamiento regulado es muy estricto en Rabat (Rabat Parking): pague en el parquímetro o con la aplicación. Los aparcamientos subterráneos de Bab El Had y Agdal son muy seguros.",
            traps: "Respeto absoluto de la prioridad peatonal y de los semáforos (cámaras urbanas activas en la Avenida Mohammed V). Radares en el puente Hassan II entre Rabat y Salé.",
            taxi: "Taxi del aeropuerto de Salé al centro de Rabat: 150 a 200 MAD. Por 25 €/día (270 MAD), dispone de un coche limpio para sus desplazamientos de trabajo o hacia la Marina.",
        },
        nl: {
            parking: "Betaald parkeren wordt in Rabat streng gecontroleerd (Rabat Parking): betaal bij de parkeermeter of via de app. De ondergrondse parkings Bab El Had en Agdal zijn zeer veilig.",
            traps: "Geef altijd voorrang aan voetgangers en respecteer de verkeerslichten (stadscamera's actief op de Avenue Mohammed V). Flitsers op de Hassan II-brug tussen Rabat en Salé.",
            taxi: "Luchthaventaxi van Salé naar Rabat-centrum: 150 tot 200 MAD. Voor €25/dag (270 MAD) hebt u een schone auto voor zakenritten of naar de Marina.",
        },
    },
    ouarzazate: {
        en: {
            parking: "Parking is very easy and free throughout town. In Ait Benhaddou, use the official car park facing the river (10 MAD with an attendant).",
            traps: "Crossing the Tizi n'Tichka pass (N9, 2,260 m) means tight bends: strictly respect the solid lines. Never overtake without full visibility.",
            taxi: "Taxis refuse long dirt tracks or charge 1,000 to 1,500 MAD a day with a driver. Renting a Duster 4x4 from ZwinCar from €35/day (380 MAD) gives you full freedom on the southern tracks.",
        },
        es: {
            parking: "Aparcar es muy fácil y gratuito en toda la ciudad. En Ait Benhaddou, use el aparcamiento oficial frente al río (10 MAD con vigilante).",
            traps: "El paso del Tizi n'Tichka (N9, 2260 m) tiene curvas cerradas: respete estrictamente las líneas continuas. No adelante nunca sin visibilidad total.",
            taxi: "Los taxis rechazan las pistas largas o piden 1000 a 1500 MAD al día con conductor. Alquilar un Duster 4x4 con ZwinCar desde 35 €/día (380 MAD) garantiza total libertad en las pistas del sur.",
        },
        nl: {
            parking: "Parkeren is overal in de stad heel makkelijk en gratis. In Aït Benhaddou gebruikt u de officiële parking tegenover de rivier (10 MAD met bewaker).",
            traps: "De Tizi n'Tichka-pas (N9, 2260 m) heeft scherpe bochten: respecteer de doorgetrokken strepen strikt. Haal nooit in zonder volledig zicht.",
            taxi: "Taxi's weigeren lange onverharde wegen of vragen 1000 tot 1500 MAD per dag met chauffeur. Een Duster 4x4 huren bij ZwinCar vanaf €35/dag (380 MAD) geeft volledige vrijheid op de pistes in het zuiden.",
        },
    },
    nador: {
        en: {
            parking: "Easy parking along the Marchica lagoon. At Beni Ensar port, guarded car parks are available if you take the foot-passenger ferry.",
            traps: "Frequent gendarmerie checks on the N19 and the Mediterranean coastal road to Ras El Ma and Al Hoceima. Mobile speed cameras on the long straights near Al Aroui.",
            taxi: "A taxi from Al Aroui airport to the centre or Beni Ensar port costs 200 to 300 MAD. At €27/day (290 MAD), you have your car right from the tarmac.",
        },
        es: {
            parking: "Aparcamiento fácil a lo largo de la laguna de Marchica. En el puerto de Beni Ensar hay aparcamientos vigilados si toma el ferry de pasajeros.",
            traps: "Controles frecuentes de la gendarmería en la N19 y en la carretera mediterránea hacia Ras El Ma y Alhucemas. Radares móviles en las largas rectas de Al Aroui.",
            taxi: "El taxi del aeropuerto de Al Aroui al centro o al puerto de Beni Ensar cuesta entre 200 y 300 MAD. A 27 €/día (290 MAD), dispone de su coche desde la pista.",
        },
        nl: {
            parking: "Makkelijk parkeren langs de Marchica-lagune. In de haven van Beni Ensar zijn bewaakte parkings als u de voetgangersferry neemt.",
            traps: "Vaak controles van de gendarmerie op de N19 en de Middellandse Zeekustweg naar Ras El Ma en Al Hoceima. Mobiele flitsers op de lange rechte stukken bij Al Aroui.",
            taxi: "Een taxi van luchthaven Al Aroui naar het centrum of de haven van Beni Ensar kost 200 tot 300 MAD. Voor €27/dag (290 MAD) hebt u uw auto direct vanaf de landingsbaan.",
        },
    },
    essaouira: {
        en: {
            parking: "The Medina is completely pedestrian. Leave your car at the large guarded Bab El Marsa port parking lot or Bab Sbaa (20 MAD per 24 hours with a sworn attendant).",
            traps: "Frequent crosswinds (trade winds) on the coastal R301 and regular herds of goats or donkeys on the Argana road towards Marrakech (R207/N8).",
            taxi: "A grand taxi from Mogador airport to the historic medina costs 150 MAD by day (200 MAD at night). At €28/day (300 MAD), your car pays for itself to explore Sidi Kaouki and Imsouane freely.",
        },
        es: {
            parking: "La Medina es 100% peatonal. Deje el coche en el gran aparcamiento vigilado del Puerto Bab El Marsa o en Bab Sbaa (20 MAD por 24 horas con vigilante jurado).",
            traps: "Viento lateral frecuente (alisios) en la carretera costera R301 y cruces regulares de rebaños de cabras o burros en la carretera de Argana hacia Marrakech (R207/N8).",
            taxi: "El gran taxi del aeropuerto de Mogador a la medina histórica cuesta 150 MAD de día (200 MAD de noche). A 28 €/día (300 MAD), su coche se amortiza para explorar Sidi Kaouki e Imsouane con total libertad.",
        },
        nl: {
            parking: "De Medina is 100% autovrij. Laat uw auto achter op de grote bewaakte parking van de haven Bab El Marsa of bij Bab Sbaa (20 MAD per 24 uur met officiële bewaker).",
            traps: "Vaak zijwind (passaatwind) op de R301 langs de kust en overstekende kuddes geiten of ezels op de Argana-weg richting Marrakech (R207/N8).",
            taxi: "Een grand taxi van de luchthaven Mogador naar de historische medina kost 150 MAD overdag (200 MAD 's nachts). Voor €28/dag (300 MAD) is een huurauto meteen rendabel om Sidi Kaouki en Imsouane te ontdekken.",
        },
    },
    tetouan: {
        en: {
            parking: "Easy parking around Place Feddan and along Avenue Hassan II. In Cabo Negro and Martil, guarded beachside lots are readily available (10 MAD/day).",
            traps: "Speed cameras are active on the Tetouan - Martil expressway (N16) and strict speed checks apply along the mountainous curves of the N2 to Chefchaouen.",
            taxi: "A taxi from Sania Ramel airport to Martil or Cabo Negro costs 80 to 120 MAD, and a trip to Chefchaouen exceeds 400 MAD. Renting with ZwinCar from €26/day (280 MAD) is the most economical way to tour the Rif coastline.",
        },
        es: {
            parking: "Aparcamiento fácil alrededor de la Plaza Feddan y a lo largo de la Avenida Hassan II. En Cabo Negro y Martil hay aparcamientos vigilados junto a las playas (10 MAD/día).",
            traps: "Radares activos en la autovía Tetuán - Martil (N16) y controles estrictos de velocidad en las curvas montañosas de la N2 hacia Chefchaouen.",
            taxi: "Un taxi de Sania Ramel a Martil o Cabo Negro cuesta 80 a 120 MAD, y un viaje a Chefchaouen supera los 400 MAD. Alquilar con ZwinCar desde 26 €/día (280 MAD) es la forma más económica de recorrer el litoral.",
        },
        nl: {
            parking: "Makkelijk parkeren rond Place Feddan en langs de Avenue Hassan II. In Cabo Negro en Martil zijn bewaakte strandparkings aanwezig (10 MAD/dag).",
            traps: "Flitspalen op de snelweg Tetouan - Martil (N16) en strenge snelheidscontroles in de bochten van de N2 richting Chefchaouen.",
            taxi: "Een taxi van Sania Ramel naar Martil of Cabo Negro kost 80 tot 120 MAD, en een rit naar Chefchaouen meer dan 400 MAD. Huren bij ZwinCar vanaf €26/dag (280 MAD) is de voordeligste manier om de Rif-kust te verkennen.",
        },
    },
    oujda: {
        en: {
            parking: "Convenient parking in the city center along Boulevard Mohammed V and at the main ONCF train station lot. Guarded night attendants (10 MAD).",
            traps: "Long straight stretches on the Oujda - Saidia expressway (A3/N60) with frequent Royal Gendarmerie mobile speed cameras: strictly observe the 100 and 80 km/h limits.",
            taxi: "The grand taxi from Les Angads airport to central Oujda costs 100-150 MAD, and to the Saidia resort over 350 MAD. At €27/day (290 MAD), a ZwinCar car gives you complete freedom.",
        },
        es: {
            parking: "Aparcamiento cómodo en el centro a lo largo del Boulevard Mohammed V y en el aparcamiento de la estación ONCF. Vigilantes nocturnos oficiales (10 MAD).",
            traps: "Largas rectas en la autovía Oujda - Saidia (A3/N60) con radares móviles frecuentes de la Gendarmería Real: respete rigurosamente los 100 y 80 km/h.",
            taxi: "El gran taxi del aeropuerto Les Angads al centro de Oujda cuesta 100-150 MAD, y a la estación de Saidia más de 350 MAD. A 27 €/día (290 MAD), un coche ZwinCar le da total libertad.",
        },
        nl: {
            parking: "Prettig parkeren in het centrum langs Boulevard Mohammed V en op het stationsterrein van de ONCF. Bewaakte nachtparkeerders (10 MAD).",
            traps: "Lange rechte stukken op de snelweg Oujda - Saidia (A3/N60) met regelmatige mobiele flitsers van de Gendarmerie: respecteer de limieten van 100 en 80 km/u.",
            taxi: "De grand taxi van luchthaven Les Angads naar het centrum van Oujda kost 100-150 MAD, en naar de badplaats Saidia meer dan 350 MAD. Voor €27/dag (290 MAD) hebt u volledige vrijheid.",
        },
    },
    dakhla: {
        en: {
            parking: "Free and very safe parking everywhere across the peninsula and kite camps. Avoid parking on loose sand outside the packed designated tracks.",
            traps: "Wind-blown sandbanks on the N1 highway running along the lagoon. Slow down in windy conditions and never leave the paved road without a high-clearance SUV.",
            taxi: "A 4x4 shuttle or taxi to lagoon camps (PK25/PK28) costs 200 to 300 MAD per trip. Renting an SUV from €38/day (410 MAD) immediately covers daily transfers to surf spots and the White Dune.",
        },
        es: {
            parking: "Aparcamiento libre, gratuito y muy seguro en toda la península y los campamentos de kite. Evite aparcar sobre arena blanda fuera de los caminos marcados.",
            traps: "Bancos de arena movidos por el viento en la carretera nacional N1 a lo largo de la laguna. Reduzca la velocidad con viento y nunca salga del asfalto sin un SUV alto.",
            taxi: "Un traslado en 4x4 o taxi a los campamentos de la laguna (PK25/PK28) cuesta 200 a 300 MAD por trayecto. Alquilar un SUV desde 38 €/día (410 MAD) amortiza los traslados diarios a los spots y a la Duna Blanca.",
        },
        nl: {
            parking: "Vrij, gratis en zeer veilig parkeren op het hele schiereiland en bij de kitecamps. Parkeer niet op los zand buiten de verharde paden.",
            traps: "Zandbanken door de wind op de N1-weg langs de lagune. Matig uw snelheid bij wind en verlaat het asfalt nooit zonder een verhoogde SUV.",
            taxi: "Een 4x4-shuttle of taxi naar de lagunecamps (PK25/PK28) kost 200 tot 300 MAD per rit. Een SUV huren vanaf €38/dag (410 MAD) dekt direct uw dagelijkse transfers naar de surfspots en het Witte Duin.",
        },
    },
};

export function hubLocalTips(hub: CityHub, locale: Locale): LocalTips | null {
    if (locale === "fr") return { parking: hub.parkingAdvice, traps: hub.localRoadTraps, taxi: hub.taxiComparisonText };
    return TIPS[hub.slug]?.[locale] ?? null;
}
