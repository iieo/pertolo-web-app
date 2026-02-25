import { db } from '@/db';
import { bluffWordsTable } from '@/db/schema';
import { exit } from 'process';

const germanBluffWords = [
  {
    word: 'Petrichor',
    pronunciation: 'PE-tri-kor',
    definition: 'Der angenehme, erdige Geruch, der entsteht, wenn Regen auf trockenen Boden fällt.',
  },
  {
    word: 'Borborygmus',
    pronunciation: 'bor-bo-RIG-mus',
    definition:
      'Das grollende oder gurgelnde Geräusch, das durch die Bewegung von Flüssigkeit und Gas im Darm erzeugt wird.',
  },
  {
    word: 'Apricität',
    pronunciation: 'a-pri-tsi-TÄT',
    definition: 'Die Wärme der Sonne an einem kalten Wintertag.',
  },
  {
    word: 'Phosphene',
    pronunciation: 'FOS-fe:ne',
    definition:
      'Die ring- oder sternförmigen Leuchterscheinungen, die man bei geschlossenen Augen sieht, oft durch Druck auf die Augäpfel verursacht.',
  },
  {
    word: 'Limerenz',
    pronunciation: 'LI-me-renz',
    definition:
      'Ein unfreiwilliger Zustand intensiver romantischer Verliebtheit, gekennzeichnet durch obsessives Denken und ein verzweifeltes Bedürfnis nach Gegenliebe.',
  },
  {
    word: 'Logomachie',
    pronunciation: 'lo-go-ma-CHIE',
    definition:
      'Ein Wortstreit oder eine Debatte, bei der die Streitenden Wörter in verschiedenen Bedeutungen verwenden, ohne es zu merken.',
  },
  {
    word: 'Mumpsimus',
    pronunciation: 'MUMP-si-mus',
    definition:
      'Ein hartnäckiges Festhalten an einem falschen Glauben oder Brauch, selbst nachdem er widerlegt wurde.',
  },
  {
    word: 'Acnestis',
    pronunciation: 'ak-NES-tis',
    definition:
      'Der Teil des Rückens zwischen den Schulterblättern, den eine Person nicht erreichen kann, um sich zu kratzen.',
  },
  {
    word: 'Defenestration',
    pronunciation: 'de-fe-nes-tra-TSION',
    definition:
      'Der Hinauswurf einer Person oder eines Gegenstandes aus einem Fenster, oft im historischen Kontext als politische Tat.',
  },
  {
    word: 'Agnotologie',
    pronunciation: 'ag-no-to-lo-GIE',
    definition:
      'Die wissenschaftliche Erforschung von kulturell erschaffenem Unwissen oder Zweifeln, oft durch gezielte Desinformation.',
  },
  {
    word: 'Pareidolie',
    pronunciation: 'pa-rei-do-LIE',
    definition:
      'Das psychologische Phänomen, in abstrakten Dingen vermeintliche Gesichter oder vertraute Muster zu erkennen.',
  },
  {
    word: 'Ultracrepidarianismus',
    pronunciation: 'ul-tra-kre-pi-da-ria-NIS-mus',
    definition:
      'Die Angewohnheit, selbstbewusst Meinungen und Ratschläge zu Dingen abzugeben, von denen man eigentlich keine Ahnung hat.',
  },
  {
    word: 'Palimpsest',
    pronunciation: 'pa-limp-SEST',
    definition:
      'Eine antike Manuskriptseite, deren ursprünglicher Text abgeschabt oder abgewaschen wurde, um sie kostensparend neu zu beschreiben.',
  },
  {
    word: 'Dysania',
    pronunciation: 'dys-A-nia',
    definition:
      'Der chronische Zustand, bei dem es einer Person extrem schwerfällt, morgens aus dem Bett aufzustehen.',
  },
  {
    word: 'Apophänie',
    pronunciation: 'a-po-fä-NIE',
    definition:
      'Die Neigung, in völligen Zufallsdaten oder bedeutungslosen Phänomenen verborgene Muster und Zusammenhänge zu sehen.',
  },
  {
    word: 'Boustrophedon',
    pronunciation: 'bu-stro-fe-DON',
    definition:
      'Eine antike Schreibrichtung, bei der die Zeilen abwechselnd von links nach rechts und von rechts nach links geschrieben werden ("wie ein Ochse pflügt").',
  },
  {
    word: 'Myrmekologie',
    pronunciation: 'myr-me-ko-lo-GIE',
    definition:
      'Ein Teilgebiet der Entomologie, das sich speziell und ausschließlich mit der wissenschaftlichen Erforschung von Ameisen beschäftigt.',
  },
  {
    word: 'Hapaxlegomenon',
    pronunciation: 'ha-pax-le-GO-me-non',
    definition:
      'Ein Wort, das in einem bestimmten Text, in einem Korpus oder in der gesamten Sprache historisch nur ein einziges Mal nachweisbar ist.',
  },
  {
    word: 'Nychthemeron',
    pronunciation: 'nych-the-ME-ron',
    definition:
      'Ein Zeitraum von genau 24 Stunden, der einen vollen, ununterbrochenen Tag-Nacht-Zyklus umfasst.',
  },
  {
    word: 'Horripilation',
    pronunciation: 'hor-ri-pi-la-TSION',
    definition:
      'Der biologische und medizinische Fachbegriff für das Aufrichten der Körperhaare bei Kälte oder starker Emotion, gemeinhin "Gänsehaut".',
  },
  {
    word: 'Syzygie',
    pronunciation: 'sy-zy-GIE',
    definition:
      'Die exakte astronomische Ausrichtung dreier oder mehrerer Himmelskörper in einer geraden Linie, wie beispielsweise bei einer Sonnenfinsternis.',
  },
  {
    word: 'Epistaxis',
    pronunciation: 'e-pis-TAK-sis',
    definition: 'Der medizinische Fachausdruck für Nasenbluten.',
  },
  {
    word: 'Vexillologie',
    pronunciation: 'vek-sil-lo-lo-GIE',
    definition: 'Die historische und systematische Lehre von den Fahnen und Flaggen.',
  },
  {
    word: 'Krepitation',
    pronunciation: 'kre-pi-ta-TSION',
    definition:
      'Ein knisterndes, reibendes Geräusch, wie es oft im medizinischen Bereich beim Aneinanderreiben gebrochener Knochenteile vorkommt.',
  },
  {
    word: 'Koprolalie',
    pronunciation: 'ko-pro-la-LIE',
    definition:
      'Der zwanghafte, meist mit Tourette assoziierte Drang, unwillkürlich obszöne oder unflätige Wörter auszusprechen.',
  },
  {
    word: 'Misophonie',
    pronunciation: 'mi-so-fo-NIE',
    definition:
      'Eine neurologisch bedingte, stark verringerte Toleranz gegenüber spezifischen und repetitiven Alltagsgeräuschen anderer, wie etwa Kauen.',
  },
  {
    word: 'Pogonologie',
    pronunciation: 'po-go-no-lo-GIE',
    definition:
      'Die wissenschaftliche oder historische Untersuchung, Kulturgeschichte und Lehre von den Bärten.',
  },
  {
    word: 'Kallipygisch',
    pronunciation: 'kal-li-PY-gisch',
    definition:
      'Ein oft in der klassischen Kunstgeschichte verwendeter Ausdruck für eine Statur, die mit einem außergewöhnlich wohlgeformten Gesäß ausgestattet ist.',
  },
  {
    word: 'Oikophobie',
    pronunciation: 'oi-ko-fo-BIE',
    definition:
      'Die tief verwurzelte Abneigung, Furcht oder Skepsis gegenüber der eigenen Kultur, dem eigenen Land oder der häuslichen Umgebung.',
  },
  {
    word: 'Sesquipedalophobie',
    pronunciation: 'ses-kwi-pe-da-lo-fo-BIE',
    definition:
      'Bezeichnenderweise der psychiatrische Fachbegriff für die irrationale Angst vor außergewöhnlich langen Wörtern.',
  },
  {
    word: 'Somnambulismus',
    pronunciation: 'som-nam-bu-LIS-mus',
    definition:
      'Das Schlafwandeln; ein Zustand, in dem betroffene Personen im Schlaf komplexe Handlungen ausführen, ohne sich später daran zu erinnern.',
  },
  {
    word: 'Bruxismus',
    pronunciation: 'bruk-SIS-mus',
    definition:
      'Das meist stressbedingte, unbewusste und nächtliche Zähneknirschen oder Aufeinanderpressen der Kiefer.',
  },
  {
    word: 'Prosopagnosie',
    pronunciation: 'pro-so-pag-no-SIE',
    definition:
      'Eine neurologisch bedingte Schwäche oder völlige Unfähigkeit, die Gesichter von vertrauten Mitmenschen zu erkennen, auch Gesichtsblindheit genannt.',
  },
  {
    word: 'Ignoratio elenchi',
    pronunciation: 'ig-no-RA-tio e-LEN-chi',
    definition:
      'Ein klassischer logischer Fehlschluss, bei dem ein vorgebrachtes Argument an sich zwar gültig ist, aber gänzlich am Thema vorbeigeht.',
  },
  {
    word: 'Geotropismus',
    pronunciation: 'ge-o-tro-PIS-mus',
    definition:
      'Wachstumsbewegung von Pflanzen oder Pflanzenteilen als biologische Reaktion auf die Schwerkraft.',
  },
  {
    word: 'Anakoluth',
    pronunciation: 'a-na-ko-LUTH',
    definition:
      'Ein rhetorisches Stilmittel oder grammatischer Bruch, bei dem die begonnene syntaktische Struktur im Satzverlauf unfertig abreißt.',
  },
  {
    word: 'Spaghettifizierung',
    pronunciation: 'spa-ghet-ti-fi-ZIE-rung',
    definition:
      'Die theoretische extreme materielle Verformung von Objekten in die Länge, wenn sie dem massiven Gravitationsfeld eines Schwarzen Lochs ausgesetzt werden.',
  },
  {
    word: 'Orogenese',
    pronunciation: 'o-ro-ge-NE-se',
    definition:
      'Der langwierige geologische und tektonische Entstehungsprozess von Gebirgen, primär durch kollidierende Erdplatten.',
  },
  {
    word: 'Virga',
    pronunciation: 'VIR-ga',
    definition:
      'Meteorologischer Begriff für sichtbaren Niederschlag, der zwar aus Wolken fällt, aber auf dem Weg zum Boden vollständig verdunstet.',
  },
  {
    word: 'Triclinium',
    pronunciation: 'tri-KLI-ni-um',
    definition:
      'Das antike römische Speisezimmer, in dem die Gäste repräsentativ auf drei hufeisenförmig angeordneten Liegen speisten.',
  },
  {
    word: 'Fideikommiss',
    pronunciation: 'fi-de-i-kom-MISS',
    definition:
      'Ein juristisches Instrument zur Standessicherung, das den Familienbesitz unveräußerlich macht und nach fester Erbfolge weitergibt.',
  },
  {
    word: 'Akrasia',
    pronunciation: 'a-kra-SIA',
    definition:
      'Der philosophische Begriff für Willensschwäche; das Handeln wider besseres Wissen und Gewissen.',
  },
  {
    word: 'Alexithymie',
    pronunciation: 'a-lex-i-thy-MIE',
    definition:
      'Eine Persönlichkeitsausprägung, bei der es einer Person extrem schwerfällt, die eigenen Gefühle oder die anderer wahrzunehmen und zu beschreiben (Gefühlsblindheit).',
  },
  {
    word: 'Apoptose',
    pronunciation: 'a-pop-TO-se',
    definition:
      'Der biologisch programmierte und genetisch gesteuerte Zelltod, der im Gegensatz zur Nekrose nicht durch äußere Verletzungen entsteht.',
  },
  {
    word: 'Autopoiesis',
    pronunciation: 'au-to-poi-E-sis',
    definition:
      'Der in der Systemtheorie und Biologie verwendete Begriff für die Fähigkeit eines Systems, sich selbst aus seinen eigenen Bestandteilen immer wieder neu zu erschaffen und zu erhalten.',
  },
  {
    word: 'Eschatologie',
    pronunciation: 'es-cha-to-lo-GIE',
    definition:
      'Die theologische Lehre von den sogenannten "letzten Dingen", also dem Ende der Welt, dem Jüngsten Gericht oder dem Leben nach dem Tod.',
  },
  {
    word: 'Hypnagogie',
    pronunciation: 'hyp-na-go-GIE',
    definition:
      'Der neurologische Übergangszustand vom Wachsein zum Schlaf, im Zuge dessen oft visuelle, auditive oder taktile Halluzinationen auftreten können.',
  },
  {
    word: 'Idiosynkrasie',
    pronunciation: 'i-dio-syn-kra-SIE',
    definition:
      'Eine angeborene oder erworbene, extrem starke Überempfindlichkeit oder übersteigerte Abneigung gegenüber bestimmten Reizen, Stoffen oder Personen.',
  },
  {
    word: 'Klandestin',
    pronunciation: 'klan-des-TIN',
    definition:
      'Ein Attribut für etwas, das im Geheimen, Verborgenen oder im Untergrund stattfindet (oft im politischen oder geheimdienstlichen Kontext).',
  },
  {
    word: 'Liminalität',
    pronunciation: 'li-mi-na-li-TÄT',
    definition:
      'Der anthropologische Begriff für einen Schwellenzustand in einem Übergangsritual, bei dem eine Person eine alte soziale Rolle abgelegt, aber eine neue noch nicht vollständig eingenommen hat.',
  },
  {
    word: 'Myrmekochorie',
    pronunciation: 'myr-me-ko-cho-RIE',
    definition:
      'Die Ausbreitung von Pflanzensamen durch Ameisen, ein klassisches Beispiel für eine mutualistische Beziehung in der Ökologie.',
  },
  {
    word: 'Nosokomial',
    pronunciation: 'no-so-ko-MIAL',
    definition:
      'Ein medizinischer Fachausdruck für eine Infektion oder Erkrankung, die ein Patient oder eine Patientin unglücklicherweise im Zuge eines Krankenhausaufenthalts erworben hat.',
  },
  {
    word: 'Nystagmus',
    pronunciation: 'nys-TAG-mus',
    definition:
      'Die unkontrollierbaren, rhythmischen Zitterbewegungen der Augen, die krankhaft sein können oder bei Gesunden als Reaktion auf starke Drehung auftreten.',
  },
  {
    word: 'Obfuskation',
    pronunciation: 'ob-fus-ka-TSION',
    definition:
      'Das absichtliche und systematische Verschleiern der Bedeutung von Kommunikation oder (in der Informatik) von des Quellcodes eines Programms.',
  },
  {
    word: 'Onomasiologie',
    pronunciation: 'o-no-ma-sio-lo-GIE',
    definition:
      'Ein Teilbereich der Linguistik (Bezeichnungslehre), der nicht von einem Wort ausgeht, um dessen Bedeutung zu suchen, sondern von einem Konzept ausgehend nach der passenden sprachlichen Bezeichnung fragt.',
  },
  {
    word: 'Paroxysmus',
    pronunciation: 'pa-rox-YS-mus',
    definition:
      'Die krampfartige, anfallsweise Steigerung eines Krankheitssymptoms zu seinem absoluten Höhepunkt oder auch ein plötzlicher heftiger Gefühlsausbruch.',
  },
  {
    word: 'Phlebotomie',
    pronunciation: 'phle-bo-to-MIE',
    definition:
      'Der historisch gewachsene medizinische Begriff für einen Aderlass oder die chirurgische Eröffnung einer Vene, meist zur Blutentnahme.',
  },
  {
    word: 'Pseudologie',
    pronunciation: 'pseu-do-lo-GIE',
    definition:
      'Der psychiatrische Terminus für krankhaftes, zwanghaftes und oft übersteigertes Lügen, teils bis hin zur eigenen Überzeugung von den erdichteten Geschichten (Münchhausen-Syndrom).',
  },
  {
    word: 'Schediasmus',
    pronunciation: 'sche-di-AS-mus',
    definition:
      'Ein kunst- und literaturwissenschaftlicher Begriff für ein rasch, aus dem Stegreif und ohne tiefere Überarbeitung hingeworfenes Werk oder einen flüchtigen Entwurf.',
  },
  {
    word: 'Singultus',
    pronunciation: 'sin-GUL-tus',
    definition: 'Die klinische, medizinisch korrekte Bezeichnung für den gewöhnlichen Schluckauf.',
  },
  {
    word: 'Solipsismus',
    pronunciation: 'so-lip-SIS-mus',
    definition:
      'Die extreme philosophische und erkenntnistheoretische These, der zufolge einzig und allein das eigene (des Betrachters) Ich existiert.',
  },
  {
    word: 'Soteriologie',
    pronunciation: 'so-te-rio-lo-GIE',
    definition:
      'Der systematische Teilbereich der Theologie, der sich tiefgehend mit dem Konzept der Erlösung befasst und dieses analysiert.',
  },
  {
    word: 'Speläologie',
    pronunciation: 'spe-lä-o-lo-GIE',
    definition: 'Die interdisziplinäre Geowissenschaft der Höhlenforschung.',
  },
  {
    word: 'Tachyphylaxie',
    pronunciation: 'ta-chy-phy-la-XIE',
    definition:
      'Ein pharmakologisches Phänomen der schnellen, manchmal innerhalb von Minuten einsetzenden, Gewöhnung an ein Medikament.',
  },
  {
    word: 'Teleologie',
    pronunciation: 'te-leo-lo-GIE',
    definition:
      'Die philosophische Lehre, Auffassung und Weltsicht, wonach Handlungen, Entwicklungen oder die gesamte Natur auf ein ganz bestimmtes, vorherbestimmtes Ziel (Telos) ausgerichtet sind.',
  },
  {
    word: 'Theodizee',
    pronunciation: 'theo-di-ZEE',
    definition:
      'Die theologische und philosophische Verteidigung der Güte und Gerechtigkeit Gottes angesichts des massiven Vorhandenseins von Leid und Bösem in der Welt.',
  },
  {
    word: 'Ubiquitär',
    pronunciation: 'u-bi-kwi-TÄR',
    definition:
      'Ein oft in der Biologie und Informatik gebrauchtes Adjektiv zur Beschreibung von Dingen, die absolut allgegenwärtig sind und praktisch überall vorkommen.',
  },
  {
    word: 'Valetudinarier',
    pronunciation: 'va-le-tu-di-NA-rier',
    definition:
      'Eine zumeist kränkelnde Person und in der Psychologie ein Mensch, der sich übermäßig und krankhaft Sorgen um seine eigene Gesundheit macht (verwandt mit dem Hypochonder).',
  },
  {
    word: 'Xenobiotikum',
    pronunciation: 'xe-no-bio-TI-kum',
    definition:
      'Jede chemische Verbindung, die dem aktuellen biologischen System oder Organismus evolutionär völlig fremd ist, wie beispielsweise viele moderne Medikamente oder synthetische Umweltgifte.',
  },
  {
    word: 'Xylothek',
    pronunciation: 'xy-lo-THEK',
    definition:
      'Eine spezielle naturhistorische Sammlung, in der Holzarten zumeist systematisiert, oft auch originell in Form von Buchattrappen, aufbewahrt werden.',
  },
  {
    word: 'Zymologie',
    pronunciation: 'zy-mo-lo-GIE',
    definition:
      'Die Lehre von der Gärung; eine angewandte Wissenschaft, die sich insbesondere mit den biochemischen Prozessen des Bierbrauens und der Weinherstellung befasst.',
  },
];

async function seedBluffWords() {
  await db
    .insert(bluffWordsTable)
    .values(germanBluffWords)
    .onConflictDoNothing({ target: bluffWordsTable.word });
  console.log('Seeded German bluff words.');
  exit(0);
}

seedBluffWords();
