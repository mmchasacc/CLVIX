import React, { useState, useEffect, useRef } from 'react'
import './App.css'

// ── SVG Icon Components (No external packages needed) ──
function QrIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="5" height="5" rx="1" />
      <rect x="11" y="2" width="5" height="5" rx="1" />
      <rect x="2" y="11" width="5" height="5" rx="1" />
      <rect x="11" y="11" width="5" height="5" rx="1" />
      <path d="M12 7h.01M15 7h.01M12 14h.01" />
    </svg>
  )
}

function BankIdIcon({ size = 26 }) {
  return (
    <svg width={size} height={size * 0.77} viewBox="0 0 52 40" fill="none">
      <circle cx="20" cy="20" r="19" fill="#193E8F" />
      <circle cx="20" cy="20" r="14" fill="white" />
      <text x="20" y="26" textAnchor="middle" fill="#193E8F" fontSize="17" fontWeight="bold" fontFamily="Georgia, serif">B</text>
      <text x="38" y="26" textAnchor="middle" fill="#193E8F" fontSize="13" fontWeight="bold" fontFamily="Arial, sans-serif">ID</text>
    </svg>
  )
}

function Tele2Logo() {
  return (
    <div className="tele2-logo">
      OPERATOR<span className="logo-2">ACADEMY</span>
    </div>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  )
}

function ShieldIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  )
}

function CheckCircleIcon({ color = '#10b981', size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  )
}

function XCircleIcon({ color = '#ef4444', size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  )
}

// ── Swedish Telecom Mock Datasets & Scenarios ──
const SCENARIOS = [
  {
    id: 'broadband-dispute',
    title: 'Fakturatvist: Utgången Rabatt',
    difficulty: 'Beginner',
    difficultyColor: '#10b981',
    customerName: 'Anna Berg',
    personnummer: '19840212-3456',
    phone: '+46 70 123 45 67',
    address: 'Sveavägen 44, 111 34 Stockholm',
    vipStatus: 'Standard',
    initialSentiment: 'Angry',
    description: 'Anna Berg är upprörd eftersom hennes bredbandsfaktura har fördubblats (från 299 kr till 599 kr). Hennes 12-månaders kampanjrabatt har löpt ut.',
    hiddenHint: 'TIPS: Kontrollera fakturafliken för att se historiken. Förklara pedagogiskt att bindningstiden och rabatten har löpt ut. Erbjuda en förlängning med 20% rabatt (Bredband 500 för 479 kr/mån) eller migrera henne till ett familjeabonnemang om hon vill spara pengar.',
    checklist: [
      { id: 'verify_id', label: 'Verifiera kundens identitet (Skatteverket/BankID)', checked: false },
      { id: 'check_invoices', label: 'Granska fakturahistorik och lokalisera utgången rabatt', checked: false },
      { id: 'explain_pricing', label: 'Förklara för kunden varför priset har höjts', checked: false },
      { id: 'apply_retention', label: 'Applicera lojalitetsrabatt (Retention 20%) eller uppgradera', checked: false },
      { id: 'write_log', label: 'Skriv en utförlig dokumentationslogg i CRM-historiken', checked: false }
    ],
    chatDialogues: [
      {
        id: 'start',
        text: 'Hej! Varför i hela friden har min bredbandsfaktura plötsligt dubblerats till 599 kr?! Jag kommer att säga upp allt direkt om ni försöker lura mig!',
        options: [
          { text: 'Hej Anna! Jag förstår din frustration. Låt mig kika på detta direkt. Kan jag först be dig identifiera dig via BankID?', next: 'verify_attempt', sentimentEffect: 'Neutral' },
          { text: 'Hej. Priserna har gått upp helt enkelt. Vill du säga upp eller betala?', next: 'angry_quit', sentimentEffect: 'Angry' },
          { text: 'Lugna ner dig lite. Det står i dina villkor att rabatten löper ut. Jag ska se om vi kan göra något.', next: 'verify_attempt_rude', sentimentEffect: 'Confused' }
        ]
      },
      {
        id: 'angry_quit',
        text: 'Vilket otroligt otrevligt bemötande! Jag vill prata med din chef och jag vill avsluta mitt abonnemang OMEDELBART! Ta bort mig ur era system!',
        options: [
          { text: 'Jag ber så hemskt mycket om ursäkt, det blev fel. Låt oss börja om. Kan vi göra en BankID-verifiering så jag kan hjälpa dig?', next: 'verify_attempt', sentimentEffect: 'Neutral' },
          { text: 'Okej, då avslutar jag det nu. Det kommer kosta en slutfaktura på 1200 kr.', next: 'churned', sentimentEffect: 'Angry' }
        ]
      },
      {
        id: 'verify_attempt_rude',
        text: 'Nåväl, men ni borde verkligen informera bättre. Ja ja, skicka BankID-förfrågan då så vi får detta överstökat.',
        options: [
          { text: '[Skicka BankID-verifiering]', action: 'send_bankid', next: 'verified_state', sentimentEffect: 'Neutral' }
        ]
      },
      {
        id: 'verify_attempt',
        text: 'Okej, det är väl rimligt att vi säkrar kontot. Jag har min BankID-app redo, skicka förfrågan.',
        options: [
          { text: '[Skicka BankID-verifiering]', action: 'send_bankid', next: 'verified_state', sentimentEffect: 'Neutral' }
        ]
      },
      {
        id: 'verified_state',
        text: 'Sådär, nu är det godkänt! Kan du förklara vad det är för extraavgifter på 599 kr nu då?',
        options: [
          { text: 'Tack Anna! Jag ser här på din senaste faktura att din 12-månaders välkomstrabatt på 300 kr har löpt ut, vilket gör att priset återgått till ordinarie 599 kr. Har du möjlighet att stanna kvar om vi lägger till en ny lojalitetsrabatt?', action: 'view_invoices', next: 'offer_retention', sentimentEffect: 'Happy' },
          { text: 'Det är bara ordinarie pris på 599 kr. Din rabatt är slut.', action: 'view_invoices', next: 'offer_retention_bad', sentimentEffect: 'Confused' }
        ]
      },
      {
        id: 'offer_retention_bad',
        text: 'Men 599 kr är alldeles för dyrt! Min kompis betalar bara 349 kr hos en annan operatör. Kan du ge mig ett bättre pris eller inte?',
        options: [
          { text: 'Jag förstår. Eftersom du varit en lojal kund kan jag erbjuda dig vår Lojalitetsrabatt på 20% vilket sänker kostnaden till 479 kr/mån utan extra bindningstid. Låter det bra?', next: 'accept_retention', sentimentEffect: 'Happy' },
          { text: 'Nej tyvärr, vi kan inte ge rabatter till alla som klagar.', next: 'churned', sentimentEffect: 'Angry' }
        ]
      },
      {
        id: 'offer_retention',
        text: 'Aha, så det var därför. Men 599 kr är alldeles för mycket för min budget just nu. Vad har du för förslag för att sänka det?',
        options: [
          { text: 'Jag kan lägga till en ny 20% Lojalitetsrabatt (Retention 20%) direkt på ditt Bredband 500, vilket sänker ditt pris till 479 kr/mån! Vill du att jag aktiverar detta?', next: 'accept_retention', sentimentEffect: 'Happy' },
          { text: 'Jag ser att du inte använder all din data. Om vi nedgraderar dig till Bredband 250 för 399 kr/mån och lägger till en lojalitetsrabatt på 20% hamnar du på endast 319 kr/mån! Låter det intressant?', next: 'accept_upgrade_family', sentimentEffect: 'Happy' }
        ]
      },
      {
        id: 'accept_retention',
        text: 'Det låter mycket bättre! 479 kr är helt okej. Kan du lägga in den rabatten på mitt abonnemang nu då?',
        options: [
          { text: 'Absolut! Gå till fliken "Abonnemang" i CRM-systemet och klicka på "Applicera Retention 20%" så verkställs det direkt.', next: 'waiting_for_crm_action', sentimentEffect: 'Happy' }
        ]
      },
      {
        id: 'accept_upgrade_family',
        text: 'Ja! 319 kr vore fantastiskt! Kan du ändra abonnemanget och lägga in det direkt?',
        options: [
          { text: 'Javisst! Vänligen vänta medan jag lägger in det i systemet. Gå till fliken "Abonnemang", välj Bredband 250 och applicera lojalitetsrabatten.', next: 'waiting_for_crm_action_change', sentimentEffect: 'Happy' }
        ]
      },
      {
        id: 'waiting_for_crm_action',
        text: 'Jag väntar på att du registrerar ändringen i systemet och bekräftar.',
        options: [
          { text: 'Det är nu registrerat i systemet Anna! Jag har även skrivit en utförlig logg om vårt samtal.', action: 'check_crm_applied', next: 'finish_scenario', sentimentEffect: 'Happy' }
        ]
      },
      {
        id: 'waiting_for_crm_action_change',
        text: 'Jag väntar på att du ändrar abonnemanget till Bredband 250 med rabatt i systemet.',
        options: [
          { text: 'Nu har jag uppdaterat ditt abonnemang till Bredband 250 med rabatten! Allt är klart.', action: 'check_crm_applied_change', next: 'finish_scenario', sentimentEffect: 'Happy' }
        ]
      },
      {
        id: 'finish_scenario',
        text: 'Perfekt, tack för jättebra hjälp! Nu känns det mycket bättre. Då vet jag vad som hände och är nöjd stolt kund hos er!',
        options: [
          { text: 'Tack själv Anna! Ha en underbar dag vidare. [Avsluta ärendet och skicka till AI-utvärdering]', action: 'trigger_submit', next: 'done', sentimentEffect: 'Happy' }
        ]
      },
      {
        id: 'churned',
        text: 'Detta var helt värdelöst. Jag kommer att ringa en annan operatör på en gång. Hejdå!',
        options: [
          { text: '[Avsluta misslyckat ärende och skicka till utvärdering]', action: 'trigger_submit_fail', next: 'done', sentimentEffect: 'Angry' }
        ]
      }
    ]
  },
  {
    id: 'porting-failure',
    title: 'Nummerportning: Misslyckad flytt',
    difficulty: 'Intermediate',
    difficultyColor: '#f59e0b',
    customerName: 'Sven Lindqvist',
    personnummer: '19750508-4321',
    phone: '+46 76 987 65 43',
    address: 'Kungsgatan 12, 411 19 Göteborg',
    vipStatus: 'Gold',
    initialSentiment: 'Angry',
    description: 'Sven är rasande eftersom hans mobilnummer skulle portföras från Telia idag kl 08.00, men hans gamla SIM-kort har dött och det nya fungerar fortfarande inte.',
    hiddenHint: 'TIPS: Kontrollera fliken "Nummerportning". Status visar "Avvisad av givande operatör (Felaktigt ICCID eller felaktig personuppgift)". Verifiera Svens personuppgifter mot Skatteverket i CRM-systemet, korrigera det felaktiga ICCID-numret (Svens SIM-kortnummer) och skicka en ny portningsförfrågan.',
    checklist: [
      { id: 'verify_id', label: 'Verifiera kundens identitet via BankID/Skatteverket', checked: false },
      { id: 'check_porting', label: 'Kontrollera portningsstatus i fliken "Nummerportning"', checked: false },
      { id: 'identify_iccid_error', label: 'Lokalisera felaktigt registrerat ICCID-nummer', checked: false },
      { id: 'retrigger_porting', label: 'Skicka ny portningsförfrågan med korrekt ICCID', checked: false },
      { id: 'write_log', label: 'Dokumentera ärendet och portningsfelet i CRM-historiken', checked: false }
    ],
    chatDialogues: [
      {
        id: 'start',
        text: 'Hej! Vad håller ni på med egentligen?! Mitt nummer skulle flyttas över till er klockan 08.00 imorse. Mitt gamla Telia-kort dog då, men mitt nya SIM-kort från er har fortfarande INGEN TÄCKNING! Jag är helt avskuren från omvärlden!',
        options: [
          { text: 'Hej Sven! Jag beklagar djupt att du hamnat i denna situation. Låt mig lösa detta direkt åt dig. Kan vi börja med en BankID-verifiering?', next: 'verify_attempt', sentimentEffect: 'Neutral' },
          { text: 'Det kan ta upp till 48 timmar ibland. Du får bara vänta.', next: 'angry_quit', sentimentEffect: 'Angry' }
        ]
      },
      {
        id: 'angry_quit',
        text: 'Vänta?! Jag driver ett eget företag och mina kunder kan inte nå mig! Detta är helt oacceptabelt, jag förlorar tusentals kronor varje timme! Avbryt allt och flytta tillbaka mitt nummer till Telia direkt!',
        options: [
          { text: 'Jag förstår verkligen allvaret, Sven. Låt mig göra en felsökning på stående fot. Om vi gör en snabb BankID-verifiering kan jag se exakt varför Telia avvisade flytten.', next: 'verify_attempt', sentimentEffect: 'Neutral' }
        ]
      },
      {
        id: 'verify_attempt',
        text: 'Okej, jag har BankID på min surfplatta som fungerar via Wi-Fi. Skicka förfrågan nu.',
        options: [
          { text: '[Skicka BankID-verifiering]', action: 'send_bankid', next: 'verified_state', sentimentEffect: 'Neutral' }
        ]
      },
      {
        id: 'verified_state',
        text: 'Godkänt. Vad ser du i dina system? Varför fungerar det inte?',
        options: [
          { text: 'Tack Sven. Jag kikar nu i fliken "Nummerportning". Jag ser att flytten har avvisats av Telia på grund av ett matchningsfel. Det verkar som att ICCID-numret (SIM-kortnumret) som är registrerat i vårt system inte matchar det fysiska SIM-kortet du har. Kan du läsa upp ditt SIM-kortnummer för mig?', action: 'view_porting', next: 'get_iccid', sentimentEffect: 'Neutral' }
        ]
      },
      {
        id: 'get_iccid',
        text: 'Jaha? SIM-kortnumret... Det står "894603 123456789 0" på det lilla plastkortet. Stämmer inte det?',
        options: [
          { text: 'Aha! I vårt system står det registrerat "894603 999999999 9". Det har blivit ett tryckfel vid beställningen. Jag kommer att korrigera detta till det korrekta numret 8946031234567890 direkt i CRM-systemet och skicka en ny förfrågan. Kan du öppna fliken "Nummerportning" och korrigera det?', action: 'reveal_iccid_correction', next: 'waiting_for_crm_iccid', sentimentEffect: 'Happy' }
        ]
      },
      {
        id: 'waiting_for_crm_iccid',
        text: 'Okej, har du korrigerat SIM-kortnumret och skickat om förfrågan i systemet än? Jag måste få igång telefonen snabbt!',
        options: [
          { text: 'Jag har nu sparat det korrekta ICCID-numret och skickat en ny akut portningsförfrågan! Telia har godkänt den direkt och din täckning bör hoppa igång inom 5 minuter.', action: 'check_iccid_applied', next: 'finish_scenario', sentimentEffect: 'Happy' }
        ]
      },
      {
        id: 'finish_scenario',
        text: 'Fantastiskt! Oj, nu dök det faktiskt upp täckningsstaplar på min telefon! Och där kom ett SMS! Det fungerar! Tack för en otroligt snabb och professionell lösning, du räddade min arbetsdag!',
        options: [
          { text: 'Det var otroligt skönt att höra, Sven! Jag har dokumenterat felet ordentligt. Ha en fortsatt fin dag! [Avsluta ärendet och skicka till AI-utvärdering]', action: 'trigger_submit', next: 'done', sentimentEffect: 'Happy' }
        ]
      }
    ]
  },
  {
    id: 'speed-dispute',
    title: 'Bredbandshastighet: Felsökning fiber',
    difficulty: 'Advanced',
    difficultyColor: '#3b82f6',
    customerName: 'Karin Larsson',
    personnummer: '19900918-7890',
    phone: '+46 73 555 12 34',
    address: 'Vasagatan 15, 722 15 Västerås',
    vipStatus: 'Standard',
    initialSentiment: 'Confused',
    description: 'Karin betalar för Bredband 500 (500 Mbps fiber) men upplever att det är extremt segt. Hastighetstester visar endast runt 50 Mbps över Wi-Fi.',
    hiddenHint: 'TIPS: Gå till "Abonnemang"-fliken och klicka på "Kör routerdiagnostik". Diagnostiken visar att routern har en gammal firmware-version och är ansluten via en felaktig LAN-port i medieomvandlaren (LAN 2 istället för LAN 1 för stadsnätet). Instruera kunden att flytta kabeln till LAN 1 och klicka på "Uppgradera Firmware".',
    checklist: [
      { id: 'verify_id', label: 'Verifiera kundens identitet via BankID/Skatteverket', checked: false },
      { id: 'run_diagnostics', label: 'Utför routerdiagnostik i abonnemangsfliken', checked: false },
      { id: 'identify_cable_port', label: 'Identifiera felaktig portanslutning (LAN 2 istället för LAN 1)', checked: false },
      { id: 'upgrade_firmware', label: 'Trigga firmware-uppgradering av routern', checked: false },
      { id: 'write_log', label: 'Dokumentera åtgärderna och routerbytet i CRM-historiken', checked: false }
    ],
    chatDialogues: [
      {
        id: 'start',
        text: 'Hej! Jag skaffade nyss ert Bredband 500 eftersom jag jobbar hemifrån och laddar ner mycket tunga filer. Men allt är superlångsamt! När jag mäter hastigheten får jag bara ut runt 50 Mbps. Vad är det för fel? Betalar jag för mycket för ingenting?',
        options: [
          { text: 'Hej Karin! Tråkigt att höra att din hastighet inte lever upp till förväntningarna. Låt oss köra en djupgående felsökning på din router. Kan du först verifiera dig med BankID?', next: 'verify_attempt', sentimentEffect: 'Neutral' }
        ]
      },
      {
        id: 'verify_attempt',
        text: 'Visst, inga problem. Jag öppnar BankID nu.',
        options: [
          { text: '[Skicka BankID-verifiering]', action: 'send_bankid', next: 'verified_state', sentimentEffect: 'Neutral' }
        ]
      },
      {
        id: 'verified_state',
        text: 'Sådär, nu är det klart. Vad kan vi göra för att mäta hastigheten i ert system?',
        options: [
          { text: 'Kanon, thank you Karin. Gå till CRM:s abonnemangsflik och kör en fullständig routerdiagnostik för att se signalstyrka och kabelstatus.', action: 'view_subscriptions', next: 'diagnostics_suggest', sentimentEffect: 'Neutral' }
        ]
      },
      {
        id: 'diagnostics_suggest',
        text: 'Okej, vad visar era mätningar? Är det fel på mitt bredband?',
        options: [
          { text: 'Jag har kört mätningen nu. Diagnostiken visar två saker: 1) Din router har en väldigt gammal mjukvara (firmware), och 2) kabeln från routern är inkopplad i LAN-port 2 på din fiberbox. För stadsnätet måste kabeln sitta i LAN-port 1. Kan du titta på din fiberbox på väggen och kontrollera vilken port kabeln sitter i?', action: 'run_router_diagnostics', next: 'check_cable_move', sentimentEffect: 'Confused' }
        ]
      },
      {
        id: 'check_cable_move',
        text: 'Oj, vänta... Ja, mycket riktigt! Den gula nätverkskabeln sitter i uttaget märkt "LAN 2". Ska jag flytta den till "LAN 1" alltså?',
        options: [
          { text: 'Ja, precis! Flytta kabeln från LAN 2 till LAN 1. Det är där stadsnätssignalen för ditt abonnemang skickas ut. Säg till när du har gjort det så uppgraderar jag routerns firmware samtidigt.', next: 'waiting_for_cable_move', sentimentEffect: 'Happy' }
        ]
      },
      {
        id: 'waiting_for_cable_move',
        text: 'Sådär! Nu har jag flyttat kabeln till LAN 1 och lamporna blinkar grönt. Har du uppdaterat routern också?',
        options: [
          { text: 'Härligt! Gå till fliken "Abonnemang" i CRM-systemet och klicka på "Uppgradera Firmware" för att skicka ut den senaste mjukvaran till routern.', action: 'reveal_firmware_upgrade', next: 'waiting_for_crm_firmware', sentimentEffect: 'Happy' }
        ]
      },
      {
        id: 'waiting_for_crm_firmware',
        text: 'Jag väntar på att du kör mjukvaruuppdateringen i systemet så routern startar om med rätt inställningar.',
        options: [
          { text: 'Nu har jag skickat ut uppdateringen till routern och den har startat om med den senaste stabila firmwaren. Kan du göra ett nytt hastighetstest nu?', action: 'check_diagnostics_applied', next: 'finish_scenario', sentimentEffect: 'Happy' }
        ]
      },
      {
        id: 'finish_scenario',
        text: 'Wow! Jag gjorde precis en ny mätning på Bredbandskollen. Nu får jag ut hela 510 Mbps! Det är ju helt fantastiskt, vilken enorm skillnad! Tack för en extremt kompetent och pedagogisk felsökning!',
        options: [
          { text: 'Underbart Karin! Det var precis det som var felet. Nu är ditt bredband optimerat. Jag dokumenterar lösningen här. [Avsluta ärendet och skicka till AI-utvärdering]', action: 'trigger_submit', next: 'done', sentimentEffect: 'Happy' }
        ]
      }
    ]
  },
  {
    id: 'esim-activation',
    title: 'Smartwatch eSIM: Aktiveringsfel',
    difficulty: 'Expert',
    difficultyColor: '#ef4444',
    customerName: 'Johan Andersson',
    personnummer: '19881122-1111',
    phone: '+46 72 222 33 44',
    address: 'Odengatan 52, 113 51 Stockholm',
    vipStatus: 'Standard',
    initialSentiment: 'Confused',
    description: 'Johan har köpt en ny Apple Watch Cellular och försöker aktivera eSIM via Apple Watch-appen, men får felkoden "SIM_PROVISIONING_FAILED_03" och klockan kan inte koppla upp sig.',
    hiddenHint: 'TIPS: Kontrollera "Nummerportning"-fliken. eSIM-statusen för klockan är "Pending Allocation". Du måste först kontrollera om Johan har ett aktivt primärabonnemang som stöder e-SIM-delning (Mobil Obegränsad). Sedan måste du ta bort den felaktiga gamla profilen, generera en ny eSIM-QR-kod och aktivera "Apple Watch Multicard" i CRM-systemet.',
    checklist: [
      { id: 'verify_id', label: 'Verifiera kundens identitet via BankID/Skatteverket', checked: false },
      { id: 'check_primary_plan', label: 'Kontrollera att primärabonnemanget stöder Multicard-delning', checked: false },
      { id: 'remove_failed_profile', label: 'Radera den blockerade eSIM-profilen i CRM-systemet', checked: false },
      { id: 'generate_esim', label: 'Generera en ny Apple Watch Multicard eSIM-profil', checked: false },
      { id: 'write_log', label: 'Skriv en utförlig felbeskrivning och åtgärdslogg i CRM-historiken', checked: false }
    ],
    chatDialogues: [
      {
        id: 'start',
        text: 'Hej! Jag köpte precis en ny Apple Watch med 4G så jag kan jogga utan min iPhone. Men när jag försöker parkoppla och aktivera abonnemanget i klockappen får jag bara ett konstigt felmeddelande som heter SIM_PROVISIONING_FAILED_03. Vad betyder det? Kan ni fixa det?',
        options: [
          { text: 'Hej Johan! Grattis till din nya Apple Watch! Felkoden tyder på att eSIM-aktiveringen har fastnat i nätverkets kösystem. Jag hjälper dig att rensa profilen och lägga upp en ny. Kan vi göra en snabb BankID-verifiering först?', next: 'verify_attempt', sentimentEffect: 'Neutral' }
        ]
      },
      {
        id: 'verify_attempt',
        text: 'Absolut, jag scannar BankID nu.',
        options: [
          { text: '[Skicka BankID-verifiering]', action: 'send_bankid', next: 'verified_state', sentimentEffect: 'Neutral' }
        ]
      },
      {
        id: 'verified_state',
        text: 'Godkänt! Vad ser du i systemet om min klocka?',
        options: [
          { text: 'Tack Johan. Jag ser i CRM under portning/SIM att din smartwatch-eSIM-beställning har fastnat i statusen "Pending Allocation" eftersom en gammal ogiltig profil ligger kvar och blockerar. Jag kommer att radera den blockerade profilen och lägga till ett nytt "Apple Watch Multicard" på ditt konto. Kan du klicka på portningsfliken i mitt CRM så jag kan rensa den?', action: 'view_porting', next: 'reveal_esim_actions', sentimentEffect: 'Neutral' }
        ]
      },
      {
        id: 'reveal_esim_actions',
        text: 'Okej, har du raderat den gamla profilen och lagt till klockan på nytt nu?',
        options: [
          { text: 'Jag har tagit bort den felaktiga profilen i CRM-systemet under "Nummerportning & SIM". Nu klickar jag på "Generera Apple Watch eSIM". Gå till fliken och klicka på "Ta bort låst eSIM" och sedan "Aktivera klock-eSIM" för att registrera det hos Apple.', action: 'reveal_esim_clicks', next: 'waiting_for_crm_esim', sentimentEffect: 'Happy' }
        ]
      },
      {
        id: 'waiting_for_crm_esim',
        text: 'Jag väntar på att du gör borttagningen och aktiverar den nya profilen i CRM-systemet.',
        options: [
          { text: 'Nu har jag raderat den gamla blockeringen och aktiverat din nya klock-eSIM-profil i systemet! Kan du starta om din klocka och iPhone nu och testa igen?', action: 'check_esim_applied', next: 'finish_scenario', sentimentEffect: 'Happy' }
        ]
      },
      {
        id: 'finish_scenario',
        text: 'Wow, jag startade precis om klockan. Nu står det "Tele2 Active" under mobilnät och den synkade direkt! Nu kan jag ta emot samtal direkt i klockan utan telefonen i närheten! Otroligt bra och proffsig hjälp, tack så jättemycket!',
        options: [
          { text: 'Underbart Johan! Apple Watch Multicard är nu helt aktivt och synkat. Jag har lagt in en utförlig dokumentation om aktiveringen här. [Avsluta ärendet och skicka till AI-utvärdering]', action: 'trigger_submit', next: 'done', sentimentEffect: 'Happy' }
        ]
      }
    ]
  },
  {
    id: 'elderly-billing',
    title: 'Äldre-support: Fakturaavgifter',
    difficulty: 'Beginner',
    difficultyColor: '#10b981',
    customerName: 'Birgitta Nilsson',
    personnummer: '19450303-2222',
    phone: '+46 70 888 77 66',
    address: 'Linnégatan 4, 114 47 Stockholm',
    vipStatus: 'Standard',
    initialSentiment: 'Confused',
    description: 'Birgitta (81 år) förstår inte varför hennes mobilabonnemang kostar 248 kr den här månaden istället för 199 kr som hon kommit överens om.',
    hiddenHint: 'TIPS: Gå till "Fakturor"-fliken. Birgittas senaste faktura innehåller en pappersfakturaavgift på 49 kr. Verifiera hennes identitet, förklara vänligt och tålmodigt att avgiften beror på pappersfakturan, och erbjud henne att byta till e-faktura eller e-postfaktura (vilket är kostnadsfritt). Ändra faktureringsmetod i CRM under "Översikt" till e-faktura och kreditera 49 kr som en engångsgest för kundnöjdhet.',
    checklist: [
      { id: 'verify_id', label: 'Verifiera kundens identitet (BankID eller ID-kortskontroll)', checked: false },
      { id: 'check_billing_fee', label: 'Leta upp pappersfakturaavgiften i fakturafliken', checked: false },
      { id: 'explain_paper_fee', label: 'Förklara pappersfakturaavgiften på 49 kr pedagogiskt', checked: false },
      { id: 'change_billing_method', label: 'Ändra fakturametod till E-faktura/Kivra i CRM', checked: false },
      { id: 'credit_invoice', label: 'Kreditera pappersfakturaavgiften på 49 kr', checked: false },
      { id: 'write_log', label: 'Skriv en respektfull och detaljerad logg i CRM-historiken', checked: false }
    ],
    chatDialogues: [
      {
        id: 'start',
        text: 'Hej lilla vän... Jag ringer för att jag är så bekymrad över mitt abonnemang. Vi kom ju överens om att det skulle kosta 199 kronor i månaden, men på min post kom en räkning på 248 kronor. Jag har väldigt liten pension så varje krona räknas. Kan du hjälpa en gammal dam att förstå varför det blivit så här?',
        options: [
          { text: 'Hej Birgitta! Självklart ska jag hjälpa dig att titta på detta på en gång, oroa dig inte. Vi kommer att lösa det. För att jag ska få öppna dina uppgifter, kan jag be dig verifiera dig? Om du inte har BankID kan jag verifiera din folkföringsadress.', next: 'verify_address_check', sentimentEffect: 'Happy' },
          { text: 'Hej. Det står på din faktura vad det är. Har du läst den?', next: 'angry_quit', sentimentEffect: 'Angry' }
        ]
      },
      {
        id: 'verify_address_check',
        text: 'Åh, vad rart av dig. Jag har tyvärr inget sånt där BankID på min telefon, jag tycker det är så svårt. Metoden att verifiera min folkbokföringsadress är mycket lättare! Min adress är Linnégatan 4 i Stockholm, och mitt personnummer är 19450303-2222. Räcker det?',
        options: [
          { text: 'Tack Birgitta! Det stämmer perfekt med mina uppgifter. Jag har nu godkänt din manuella legitimation mot folkbokföringen i CRM-systemet. Gå till fliken "Översikt" och klicka på "Godkänn ID-kort/Adress-kontroll".', action: 'allow_manual_verify', next: 'verified_state', sentimentEffect: 'Happy' }
        ]
      },
      {
        id: 'angry_quit',
        text: 'Men oj... det var ett väldigt bryskt svar. Jag ser faktiskt ganska dåligt på mina gamla dagar, så det är därför jag ringer. Om det ska vara så här otrevligt vill jag nog avsluta mitt abonnemang och gå till affären istället.',
        options: [
          { text: 'Jag beklagar verkligen Birgitta, jag menade inget illa. Låt oss kika på fakturan tillsammans. Kan jag verifiera din adress först så jag kan öppna ditt konto?', next: 'verify_address_check', sentimentEffect: 'Neutral' }
        ]
      },
      {
        id: 'verified_state',
        text: 'Tack för att du är så tålmodig med mig. Vad ser du för orsak till att räkningen är dyrare?',
        options: [
          { text: 'Jag har öppnat din faktura här i systemet, Birgitta. Ditt abonnemang kostar precis 199 kr som utlovat, men det har lagts till en pappersfakturaavgift på 49 kr eftersom räkningen skickas i ett papperskuvert på posten. Om vi ändrar till e-faktura via din bank blir det helt gratis och du slipper den extra avgiften framöver! Vill du att jag ändrar det åt dig?', action: 'view_invoices', next: 'offer_digital_billing', sentimentEffect: 'Happy' }
        ]
      },
      {
        id: 'offer_digital_billing',
        text: 'Jaha! Är det papperskuvertet som kostar 49 kronor?! Det var då hiskeligt dyrt för ett papper. Men e-faktura, hur gör jag det? Jag brukar logga in på min internetbank varje månad för att betala räkningar, går det där?',
        options: [
          { text: 'Ja, det blir jättesmidigt! Jag ställer in i CRM att du ska ha e-faktura. Nästa gång du loggar in på din bank kommer fakturan dyka upp där helt automatiskt med alla siffror färdigifyllda, och du sparar 49 kr varje månad! Dessutom ska jag kreditera (ta bort) pappersavgiften på 49 kr på den här fakturan som en trevlig gest, så du betalar bara 199 kr den här månaden också. Låter det bra?', next: 'accept_billing_changes', sentimentEffect: 'Happy' }
        ]
      },
      {
        id: 'accept_billing_changes',
        text: 'Åh, gud så snällt av dig! Tänk att jag slipper betala den där avgiften nu, och att du tar bort den på denna räkningen också. Det gör verkligen skillnad för mig. Hur gör du dessa ändringar i ditt system?',
        options: [
          { text: 'Jag gör det direkt Birgitta! Gå till fliken "Översikt" i CRM och ändra Faktureringsmetod till "E-faktura", och gå sedan till fliken "Fakturor" och klicka på "Kreditera pappersfakturaavgift 49 kr". Jag väntar tills du utfört det i CRM.', next: 'waiting_for_crm_billing_method', sentimentEffect: 'Happy' }
        ]
      },
      {
        id: 'waiting_for_crm_billing_method',
        text: 'Jag väntar här på linjen, min vän. Ta den tid du behöver för att ordna med systemet.',
        options: [
          { text: 'Nu har jag sparat ändringen till E-faktura och dragit av de 49 kronorna på din faktura! Allt är klart, Birgitta.', action: 'check_billing_applied', next: 'finish_scenario', sentimentEffect: 'Happy' }
        ]
      },
      {
        id: 'finish_scenario',
        text: 'Tack så otroligt mycket för din fantastiska hjälp, du är en riktig ängel! Nu kan jag känna mig helt lugn igen och slipper oroa mig för räkningarna. Ha en underbar dag och tack för ditt varma bemötande!',
        options: [
          { text: 'Det var ett rent nöje och hjälp Birgitta! Sköt om dig nu ordentligt. [Avsluta ärendet och skicka till AI-utvärdering]', action: 'trigger_submit', next: 'done', sentimentEffect: 'Happy' }
        ]
      }
    ]
  }
];

export default function App() {
  // ── Session & Trainee States ──
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginNumber, setLoginNumber] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [totalXp, setTotalXp] = useState(1250);
  const [unlockedBadges, setUnlockedBadges] = useState(['Teoretiker 📖']);

  // ── Active Simulation States ──
  const [activeTab, setActiveTab] = useState('oversikt');
  const [crmSearchQuery, setCrmSearchQuery] = useState('');
  const [crmSearchSuccess, setCrmSearchSuccess] = useState(false);
  const [customerVerified, setCustomerVerified] = useState(false);
  const [allowManualVerifyBtn, setAllowManualVerifyBtn] = useState(false);
  
  // Custom Dynamic Scenario Data
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);
  const [activeInvoices, setActiveInvoices] = useState([]);
  const [portingDetails, setPortingDetails] = useState({ iccid: '', status: '', errorText: '' });
  const [diagnosticsOutput, setDiagnosticsOutput] = useState(null);
  const [firmwareUpgradeAvailable, setFirmwareUpgradeAvailable] = useState(false);
  const [crmLogs, setCrmLogs] = useState([]);
  const [manualNote, setManualNote] = useState('');

  // Dialogue & Sentiment States
  const [activeDialogueId, setActiveDialogueId] = useState('start');
  const [chatMessages, setChatMessages] = useState([]);
  const [customerSentiment, setCustomerSentiment] = useState('Neutral');

  // Metrik tracking
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [checklist, setChecklist] = useState([]);
  
  // Scoring & Overlay
  const [evaluationReport, setEvaluationReport] = useState(null);
  const [showHintModal, setShowHintModal] = useState(false);

  const chatEndRef = useRef(null);

  // ── Timer Effect ──
  useEffect(() => {
    let interval = null;
    if (activeScenarioIdx !== null && !evaluationReport) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeScenarioIdx, evaluationReport]);

  // ── Scroll Chat To Bottom ──
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // ── Trigger Actions from Dialouge Options ──
  const handleActionTrigger = (action) => {
    setClickCount(prev => prev + 1);
    
    if (action === 'send_bankid') {
      // Trigger identity verification
      setCustomerVerified(true);
      updateChecklistItem('verify_id', true);
      addCrmLog('SYSTEM', 'Kund verifierad säkert via BankID.');
    }
    
    if (action === 'allow_manual_verify') {
      setAllowManualVerifyBtn(true);
    }
    
    if (action === 'view_invoices') {
      setActiveTab('fakturor');
      updateChecklistItem('check_invoices', true);
      updateChecklistItem('check_billing_fee', true);
      addCrmLog('SYSTEM', 'Trainee öppnade fakturafliken för kontroll.');
    }

    if (action === 'view_subscriptions') {
      setActiveTab('abonnemang');
      addCrmLog('SYSTEM', 'Trainee öppnade abonnemangsfliken.');
    }

    if (action === 'run_router_diagnostics') {
      // Prompt user to run router diagnostics
      setActiveTab('abonnemang');
    }

    if (action === 'reveal_firmware_upgrade') {
      setFirmwareUpgradeAvailable(true);
    }

    if (action === 'reveal_iccid_correction') {
      setActiveTab('portning');
      updateChecklistItem('check_porting', true);
      updateChecklistItem('identify_iccid_error', true);
    }

    if (action === 'reveal_esim_actions') {
      setActiveTab('portning');
      updateChecklistItem('check_primary_plan', true);
    }

    if (action === 'reveal_esim_clicks') {
      // allow eSIM remove and activations
      setActiveTab('portning');
    }
    
    if (action === 'check_crm_applied') {
      // Verify if the user actually clicked the retention button in the CRM
      const applied = activeSubscriptions.some(sub => sub.discountApplied && sub.discountApplied.includes('Retention 20%'));
      if (applied) {
        updateChecklistItem('apply_retention', true);
        updateChecklistItem('explain_pricing', true);
      } else {
        // Force the trainee to go click the button
        alert("Systemmeddelande: Du måste först applicera rabatten i abonnemangsfliken innan du bekräftar till kunden!");
        return false;
      }
    }

    if (action === 'check_crm_applied_change') {
      const changed = activeSubscriptions.some(sub => sub.planName === 'Bredband 250' && sub.discountApplied && sub.discountApplied.includes('Retention 20%'));
      if (changed) {
        updateChecklistItem('apply_retention', true);
        updateChecklistItem('explain_pricing', true);
      } else {
        alert("Systemmeddelande: Du måste först nedgradera abonnemanget och applicera rabatten i abonnemangsfliken!");
        return false;
      }
    }

    if (action === 'check_iccid_applied') {
      const corrected = portingDetails.iccid === '8946031234567890' && portingDetails.status === 'Godkänd';
      if (corrected) {
        updateChecklistItem('retrigger_porting', true);
      } else {
        alert("Systemmeddelande: Du måste först korrigera ICCID till 8946031234567890 och klicka på 'Skicka ny portningsförfrågan'!");
        return false;
      }
    }

    if (action === 'check_diagnostics_applied') {
      const cableFixed = diagnosticsOutput && diagnosticsOutput.port === 'LAN 1 (Stadsnät)';
      const firmwareFixed = diagnosticsOutput && diagnosticsOutput.firmware === 'V2.4.1 (Senaste)';
      if (cableFixed && firmwareFixed) {
        updateChecklistItem('upgrade_firmware', true);
      } else {
        alert("Systemmeddelande: Du måste se till att kabeln är flyttad till LAN 1 och att du kört firmware-uppgraderingen!");
        return false;
      }
    }

    if (action === 'check_esim_applied') {
      const esimReady = portingDetails.status === 'Aktiv Apple Watch Multicard';
      if (esimReady) {
        updateChecklistItem('generate_esim', true);
      } else {
        alert("Systemmeddelande: Du måste rensa den blockerade profilen och aktivera det nya Apple Watch eSIM-kortet!");
        return false;
      }
    }

    if (action === 'check_billing_applied') {
      const billingMethodChanged = activeInvoices.some(inv => inv.creditApplied) && activeInvoices.billingMethod === 'E-faktura';
      // Check if Kivra/E-faktura and 49kr credit is done
      const hasCredit = activeInvoices.some(inv => inv.creditApplied && inv.amount === 199);
      if (billingMethodChanged || hasCredit) {
        updateChecklistItem('change_billing_method', true);
        updateChecklistItem('credit_invoice', true);
        updateChecklistItem('explain_paper_fee', true);
      } else {
        alert("Systemmeddelande: Ändra först fakturametod till E-faktura under Översikt och kreditera fakturan under Fakturor!");
        return false;
      }
    }

    if (action === 'trigger_submit') {
      handleSubmitScoring(true);
    }

    if (action === 'trigger_submit_fail') {
      handleSubmitScoring(false);
    }

    return true;
  }

  // ── Helper to update Scenario Checklist Items ──
  const updateChecklistItem = (id, checked) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked } : item));
  }

  const addCrmLog = (author, text) => {
    setCrmLogs(prev => [
      ...prev,
      { author, text, timestamp: new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }) }
    ]);
  }

  // ── Login Action ──
  const handleBankIdLogin = (e) => {
    e.preventDefault();
    if (!loginNumber.trim() || loginNumber.length < 10) {
      alert("Ange ett giltigt svenskt personnummer (ÅÅÅÅMMDD-XXXX eller ÅÅÅÅMMDDXXXX).");
      return;
    }
    setLoginLoading(true);
    setTimeout(() => {
      setLoginLoading(false);
      setIsLoggedIn(true);
    }, 1500);
  }

  // ── Start Simulation Scenario ──
  const startScenario = (index) => {
    const sc = SCENARIOS[index];
    setActiveScenarioIdx(index);
    setTimeElapsed(0);
    setClickCount(0);
    setActiveTab('oversikt');
    setCrmSearchQuery('');
    setCrmSearchSuccess(false);
    setCustomerVerified(false);
    setAllowManualVerifyBtn(false);
    setManualNote('');
    setEvaluationReport(null);
    setDiagnosticsOutput(null);
    setFirmwareUpgradeAvailable(false);

    // Deep copy checklists and variables
    setChecklist(sc.checklist.map(ch => ({ ...ch, checked: false })));
    setCustomerSentiment(sc.initialSentiment);
    setActiveDialogueId('start');

    // Initialize dialogue
    const startDialogue = sc.chatDialogues.find(d => d.id === 'start');
    setChatMessages([
      { sender: 'customer', text: startDialogue.text, time: new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }) }
    ]);

    // Setup Scenario Specific CRM Data
    if (sc.id === 'broadband-dispute') {
      setActiveSubscriptions([
        { id: 'b500', planName: 'Bredband 500 Mbps', status: 'Aktiv', price: 599, contractPeriod: 'Utgått (Ingen bindningstid)', discountApplied: 'Ingen (Kampanj slut)' }
      ]);
      setActiveInvoices([
        { id: 'f102', month: 'Maj 2026', amount: 599, status: 'Obetald', notes: 'Rabatt utgått' },
        { id: 'f101', month: 'April 2026', amount: 299, status: 'Betald', notes: 'Välkomstrabatt -300 kr aktiv' },
        { id: 'f100', month: 'Mars 2026', amount: 299, status: 'Betald', notes: 'Välkomstrabatt -300 kr aktiv' }
      ]);
      setPortingDetails({ iccid: '894603 999999999 9', status: 'Slutförd', errorText: '' });
      setCrmLogs([
        { author: 'SYSTEM', text: 'Kundkort öppnat. Status: Ej verifierad.', timestamp: '00:00' }
      ]);
    } else if (sc.id === 'porting-failure') {
      setActiveSubscriptions([
        { id: 'mob-unl', planName: 'Mobil Obegränsad', status: 'Aktiv', price: 429, contractPeriod: '12 månader kvar', discountApplied: 'Ingen' }
      ]);
      setActiveInvoices([
        { id: 'f201', month: 'Maj 2026', amount: 429, status: 'Obetald', notes: 'Första faktura' }
      ]);
      setPortingDetails({ 
        iccid: '894603 999999999 9', 
        status: 'Avvisad av givande operatör', 
        errorText: 'Felaktigt ICCID (SIM-kort matchar inte Telia registerspecifikationer).' 
      });
      setCrmLogs([
        { author: 'SYSTEM', text: 'Kundkort öppnat. Nummerportningsfel loggat hos Telia.', timestamp: '00:00' }
      ]);
    } else if (sc.id === 'speed-dispute') {
      setActiveSubscriptions([
        { id: 'b500-fiber', planName: 'Bredband 500 (Fiber Stadsnät)', status: 'Aktiv', price: 449, contractPeriod: 'Löpande', discountApplied: 'Ingen' }
      ]);
      setActiveInvoices([
        { id: 'f301', month: 'Maj 2026', amount: 449, status: 'Betald', notes: 'Ordinarie pris' }
      ]);
      setPortingDetails({ iccid: 'Ej tillämpligt', status: 'Slutförd', errorText: '' });
      setCrmLogs([
        { author: 'SYSTEM', text: 'Kundkort öppnat. Hastighetsmätning ej utförd.', timestamp: '00:00' }
      ]);
    } else if (sc.id === 'esim-activation') {
      setActiveSubscriptions([
        { id: 'mob-unl-esim', planName: 'Mobil Obegränsad (Stöder Multicard)', status: 'Aktiv', price: 399, contractPeriod: 'Ingen', discountApplied: 'Ingen' }
      ]);
      setActiveInvoices([
        { id: 'f401', month: 'Maj 2026', amount: 399, status: 'Betald', notes: 'Ordinarie pris' }
      ]);
      setPortingDetails({ iccid: '894603 888888888 8', status: 'Pending Allocation', errorText: 'SIM_PROVISIONING_FAILED_03: Gammal klock-profil blockerar anslutningen.' });
      setCrmLogs([
        { author: 'SYSTEM', text: 'Kundkort öppnat. Apple Watch eSIM i blockerat läge.', timestamp: '00:00' }
      ]);
    } else if (sc.id === 'elderly-billing') {
      setActiveSubscriptions([
        { id: 'mob-199', planName: 'Mobil 10GB', status: 'Aktiv', price: 199, contractPeriod: 'Löpande', discountApplied: 'Ingen' }
      ]);
      setActiveInvoices([
        { id: 'f501', month: 'Maj 2026', amount: 248, status: 'Obetald', notes: 'Inkluderar pappersfakturaavgift 49 kr' }
      ]);
      setPortingDetails({ iccid: '894603 444555666 1', status: 'Slutförd', errorText: '' });
      setCrmLogs([
        { author: 'SYSTEM', text: 'Kundkort öppnat. Fakturametod inställd på: Pappersfaktura.', timestamp: '00:00' }
      ]);
      activeInvoices.billingMethod = 'Pappersfaktura';
    }
  }

  // ── Dialogue Interaction Engine ──
  const selectDialogueOption = (option) => {
    setClickCount(prev => prev + 1);
    
    // Check constraints/actions first
    if (option.action) {
      const allowed = handleActionTrigger(option.action);
      if (allowed === false) return; // Action blocked because CRM state isn't ready
    }

    // Add Trainee message
    const timestamp = new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [
      ...prev,
      { sender: 'trainee', text: option.text, time: timestamp }
    ]);

    // Handle Sentiment transition
    if (option.sentimentEffect) {
      setCustomerSentiment(option.sentimentEffect);
    }

    // Setup next Customer dialogue reply
    setTimeout(() => {
      const sc = SCENARIOS[activeScenarioIdx];
      const nextDialogue = sc.chatDialogues.find(d => d.id === option.next);
      
      if (nextDialogue) {
        setActiveDialogueId(option.next);
        setChatMessages(prev => [
          ...prev,
          { sender: 'customer', text: nextDialogue.text, time: new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }) }
        ]);
      }
    }, 1000);
  }

  // ── CRM Workspace Actions ──
  
  // 1. Customer Search Simulation
  const handleCrmSearchSubmit = (e) => {
    e.preventDefault();
    setClickCount(prev => prev + 1);
    const sc = SCENARIOS[activeScenarioIdx];
    if (crmSearchQuery.includes(sc.customerName) || crmSearchQuery.replace('-', '').includes(sc.personnummer.replace('-', ''))) {
      setCrmSearchSuccess(true);
      addCrmLog('SYSTEM', `Sökning lyckades för: ${sc.customerName}.`);
    } else {
      alert("Hittade inga träffar. Försök söka på kundens namn eller fullständiga personnummer.");
    }
  }

  // 2. Manual Folkbokföring Address verification (Elderly scenario)
  const handleManualAddressVerify = () => {
    setClickCount(prev => prev + 1);
    if (allowManualVerifyBtn) {
      setCustomerVerified(true);
      updateChecklistItem('verify_id', true);
      addCrmLog('SYSTEM', 'Kund manuellt verifierad via ID-kort och Skatteverket folkbokföring.');
    } else {
      alert("Du måste först be kunden berätta sin adress i chatten innan du godkänner kontrollen!");
    }
  }

  // 3. Subscriptions Tab Actions
  // Scenario 1: Apply discount
  const applyRetentionDiscount = () => {
    setClickCount(prev => prev + 1);
    if (!customerVerified) {
      alert("Säkerhetsvarning: Du får inte applicera rabatter eller modifiera tjänster utan att verifiera kundens identitet först!");
      return;
    }
    setActiveSubscriptions(prev => prev.map(sub => {
      if (sub.id === 'b500') {
        return {
          ...sub,
          price: 479,
          discountApplied: 'Lojalitetsrabatt (Retention 20%)',
          contractPeriod: 'Förlängt 12 månader'
        };
      }
      return sub;
    }));
    addCrmLog('TRAINEE', 'Applicerade Lojalitetsrabatt (Retention 20%) på Bredband 500.');
    updateChecklistItem('apply_retention', true);
  }

  // Scenario 1 Alt: Downgrade and Apply discount
  const downgradeAndApplyDiscount = () => {
    setClickCount(prev => prev + 1);
    if (!customerVerified) {
      alert("Säkerhetsvarning: Du får inte göra förändringar på kontot utan att verifiera kundens identitet!");
      return;
    }
    setActiveSubscriptions([
      { id: 'b250', planName: 'Bredband 250 Mbps', status: 'Aktiv', price: 319, contractPeriod: 'Förlängt 12 månader', discountApplied: 'Nedgradering + Retention 20%' }
    ]);
    addCrmLog('TRAINEE', 'Ändrade abonnemang till Bredband 250 Mbps och applicerade 20% rabatt.');
    updateChecklistItem('apply_retention', true);
  }

  // Scenario 3: Run router diagnostics
  const runRouterDiagnostics = () => {
    setClickCount(prev => prev + 1);
    setDiagnosticsOutput({
      status: 'Uppkopplad med varningar',
      firmware: 'V1.9.0 (Gammal - Sårbar)',
      port: 'LAN 2 (Felaktigt stadsnätsport)',
      bandwidth: '54 Mbps / 12 Mbps (Wi-Fi 2.4Ghz mätt)',
      uptime: '14 dagar'
    });
    updateChecklistItem('run_diagnostics', true);
    addCrmLog('SYSTEM', 'Routerdiagnostik utförd. Felaktigt kabelport och utdaterad firmware hittad.');
  }

  // Scenario 3: Cable swap simulation
  const simulateCableSwap = () => {
    setClickCount(prev => prev + 1);
    if (!diagnosticsOutput) {
      alert("Kör först routerdiagnostik för att lokalisera felet!");
      return;
    }
    setDiagnosticsOutput(prev => ({
      ...prev,
      port: 'LAN 1 (Stadsnät)'
    }));
    addCrmLog('SYSTEM', 'Fysisk kabel flyttad till LAN 1 av kund.');
    updateChecklistItem('identify_cable_port', true);
  }

  // Scenario 3: Upgrade Router Firmware
  const upgradeRouterFirmware = () => {
    setClickCount(prev => prev + 1);
    if (!diagnosticsOutput) {
      alert("Kör först routerdiagnostik!");
      return;
    }
    setDiagnosticsOutput(prev => ({
      ...prev,
      firmware: 'V2.4.1 (Senaste)'
    }));
    addCrmLog('TRAINEE', 'Triggade mjukvaruuppgradering till kundens router.');
    updateChecklistItem('upgrade_firmware', true);
  }

  // 4. Invoices Tab Actions
  // Scenario 5: Credit 49kr fee
  const creditInvoiceFee = () => {
    setClickCount(prev => prev + 1);
    if (!customerVerified) {
      alert("Säkerhetsvarning: Kund måste verifieras först!");
      return;
    }
    setActiveInvoices(prev => prev.map(inv => {
      if (inv.id === 'f501') {
        return {
          ...inv,
          amount: 199,
          notes: 'Pappersfakturaavgift 49 kr KREDITERAD',
          creditApplied: true
        };
      }
      return inv;
    }));
    addCrmLog('TRAINEE', 'Krediterade pappersfakturaavgiften på 49 kr på faktura f501.');
    updateChecklistItem('credit_invoice', true);
  }

  // 5. Porting Tab Actions
  // Scenario 2: Edit ICCID & Retrigger
  const handleIccidChange = (e) => {
    setPortingDetails(prev => ({
      ...prev,
      iccid: e.target.value
    }));
  }

  const retriggerPortingRequest = () => {
    setClickCount(prev => prev + 1);
    if (!customerVerified) {
      alert("Kundidentitet måste verifieras först!");
      return;
    }
    const cleanIccid = portingDetails.iccid.replace(/\s/g, '');
    if (cleanIccid === '8946031234567890') {
      setPortingDetails({
        iccid: '8946031234567890',
        status: 'Godkänd',
        errorText: 'Flytt schemalagd akut (Täckning aktiveras omgående)'
      });
      addCrmLog('TRAINEE', 'Korriregade ICCID till 8946031234567890 och re-triggade nummerportning.');
      updateChecklistItem('retrigger_porting', true);
    } else {
      alert("Det angivna ICCID-numret stämmer inte med kundens fysiska SIM-kort! Kontrollera dialogen med kunden.");
    }
  }

  // Scenario 4: Delete blocked eSIM
  const removeBlockedEsimProfile = () => {
    setClickCount(prev => prev + 1);
    setPortingDetails(prev => ({
      ...prev,
      status: 'Rensad profile',
      errorText: 'Ingen aktiv blockering.'
    }));
    addCrmLog('TRAINEE', 'Raderade blockerad Apple Watch eSIM-profil.');
    updateChecklistItem('remove_failed_profile', true);
  }

  // Scenario 4: Activate Apple Watch eSIM (Multicard)
  const activateWatchEsim = () => {
    setClickCount(prev => prev + 1);
    if (portingDetails.status !== 'Rensad profile') {
      alert("Du måste ta bort den blockerade klockprofilen först innan du aktiverar en ny!");
      return;
    }
    setPortingDetails({
      iccid: '894603888777666 2',
      status: 'Aktiv Apple Watch Multicard',
      errorText: 'Slutförd. eSIM synkat mot primärt mobilabonnemang.'
    });
    addCrmLog('TRAINEE', 'Skapade ny eSIM-profil för klockan och synkade Multicard.');
    updateChecklistItem('generate_esim', true);
  }

  // 6. Tickets & Log Tab
  const saveCrmManualLog = () => {
    setClickCount(prev => prev + 1);
    if (!manualNote.trim()) {
      alert("Skriv en textnotering först.");
      return;
    }
    addCrmLog('TRAINEE (DOKUMENTATION)', manualNote);
    updateChecklistItem('write_log', true);
    setManualNote('');
  }

  // ── Changing Billing Method (Scenario 5) ──
  const changeBillingMethod = (method) => {
    setClickCount(prev => prev + 1);
    activeInvoices.billingMethod = method;
    addCrmLog('TRAINEE', `Ändrade faktureringsmetod till: ${method}`);
    updateChecklistItem('change_billing_method', true);
  }

  // ── SUBMIT FOR AI EVALUATION & GRADING ──
  const handleSubmitScoring = (solvedCorrectly) => {
    // 1. Calculate Accuracy
    const accuracy = solvedCorrectly ? 100 : 20;

    // 2. Calculate Compliance (Did they verify ID before making active CRM modifications?)
    // In our case, check if customerVerified is true
    const compliance = customerVerified ? 100 : 0;

    // 3. Calculate Efficiency (Time and clicks)
    // base efficiency: 100, deduct points if too slow
    let efficiency = 100 - Math.max(0, Math.floor((timeElapsed - 60) / 3)) - Math.max(0, (clickCount - 12) * 2);
    efficiency = Math.max(30, Math.min(100, efficiency));

    // 4. Customer Handling (Final sentiment)
    let satisfaction = 50;
    if (customerSentiment === 'Happy') satisfaction = 100;
    else if (customerSentiment === 'Neutral') satisfaction = 75;
    else if (customerSentiment === 'Confused') satisfaction = 50;
    else if (customerSentiment === 'Angry') satisfaction = 20;

    // 5. Documentation Quality (CRM log check)
    // Check if the trainee saved any note under crmLogs with prefix "TRAINEE (DOKUMENTATION)"
    const docsLogs = crmLogs.filter(log => log.author.includes('DOKUMENTATION'));
    let docScore = 0;
    let missedDocTip = '';
    
    if (docsLogs.length === 0) {
      docScore = 0;
      missedDocTip = 'Du glömde helt att dokumentera fallet under fliken Support & Loggar!';
    } else {
      const combinedText = docsLogs.map(l => l.text).join(' ');
      if (combinedText.length < 20) {
        docScore = 40;
        missedDocTip = 'Din dokumentation är alldeles för kortfattad och saknar detaljer.';
      } else {
        docScore = 95;
        // Check for keywords
        const keywords = ['faktura', 'rabatt', 'portning', 'iccid', 'firmware', 'esim', 'digital', 'kivra', 'krediterad', 'skatteverket', 'adress'];
        const matches = keywords.filter(kw => combinedText.toLowerCase().includes(kw));
        if (matches.length >= 2) {
          docScore = 100;
        } else {
          docScore = 75;
          missedDocTip = 'Din dokumentation är välskriven men saknar specifika tekniska nyckelord som t.ex. ICCID eller fakturanummer.';
        }
      }
    }

    // Consolidated Total Score
    const totalScore = Math.floor((accuracy * 0.35) + (compliance * 0.25) + (satisfaction * 0.15) + (docScore * 0.15) + (efficiency * 0.10));
    
    // Determine letter grade
    let grade = 'F';
    if (totalScore >= 95) grade = 'A+';
    else if (totalScore >= 88) grade = 'A';
    else if (totalScore >= 80) grade = 'B';
    else if (totalScore >= 70) grade = 'C';
    else if (totalScore >= 60) grade = 'D';
    else if (totalScore >= 50) grade = 'E';

    // Earned XP
    const gainedXp = totalScore * 4;

    // Generate Personalized AI Coach feedback
    const currentSc = SCENARIOS[activeScenarioIdx];
    let coachFeedback = '';
    
    if (compliance === 0) {
      coachFeedback = `Högsta säkerhetsrisk! Du slutförde ärendet men glömde att genomföra identitetsverifiering mot BankID eller folkbokföringen i CRM. Det är ett grovt brott mot svensk GDPR och telekomlagstiftning, vilket leder till automatiskt underkänt betyg. Kom ihåg att ALLTID börja med legitimation!`;
    } else if (solvedCorrectly) {
      coachFeedback = `Utmärkt arbete! Du hanterade ${currentSc.customerName} på ett professionellt och pedagogiskt sätt. Du löste grundproblemet galant, säkerställde en god kundnöjdhet och sparade kunden från att lämna oss (churn). ${missedDocTip ? missedDocTip : 'Dokumentationen var fläckfri och innehöll alla viktiga detaljer!'}`;
    } else {
      coachFeedback = `Tyvärr nådde du inte hela vägen. Kunden avslutade samtalet i ilska och valde att byta operatör. Du måste visa mer empati för kundens situation, ställa rätt diagnosfrågor och erbjuda passande retentionlösningar i CRM-abonnemanget. Öva igen för att slipa på dina säljtekniker!`;
    }

    const report = {
      totalScore,
      grade,
      gainedXp,
      metrics: {
        accuracy,
        compliance,
        efficiency,
        satisfaction,
        documentation: docScore
      },
      coachFeedback
    };

    setEvaluationReport(report);

    // Apply XP progress
    setTotalXp(prev => {
      const nextXp = prev + gainedXp;
      // level calculation: every 1000 XP is a level
      const newLvl = Math.floor(nextXp / 1000) + 1;
      if (newLvl > currentLevel) {
        setCurrentLevel(newLvl);
      }
      return nextXp;
    });

    // Award scenario badge
    if (solvedCorrectly && compliance === 100) {
      setUnlockedBadges(prev => {
        const badgeName = `${currentSc.title.split(':')[0]} Mästare 🏆`;
        if (!prev.includes(badgeName)) {
          return [...prev, badgeName];
        }
        return prev;
      });
    }
  }

  // Return to scenario selection
  const handleExitScenario = () => {
    setActiveScenarioIdx(null);
    setEvaluationReport(null);
  }

  // ── RENDER ROOT SCREEN ──
  
  // 1. BankID Portal Screen (Sweden Auth Mockup)
  if (!isLoggedIn) {
    return (
      <div className="login-screen">
        <div className="login-glass-card">
          <div className="login-header">
            <div className="tele2-logo">
              OPERATOR<span className="logo-2">ACADEMY</span>
            </div>
            <p className="login-sub">Utbildningsplattform & CRM-Simulator för Kundtjänst</p>
          </div>

          <form onSubmit={handleBankIdLogin} className="login-form">
            <div className="bankid-header">
              <BankIdIcon size={36} />
              <h3>Legitimering</h3>
            </div>
            
            <p className="bankid-desc">Ange ditt trainee-personnummer för att ansluta säkert till simuleringsmiljön.</p>

            <div className="form-group">
              <label htmlFor="pnr">Personnummer (12 siffror):</label>
              <input 
                id="pnr" 
                type="text" 
                maxLength="13"
                placeholder="YYYYMMDD-XXXX" 
                value={loginNumber}
                onChange={(e) => setLoginNumber(e.target.value)}
                disabled={loginLoading}
                required
              />
            </div>

            <button type="submit" className="login-btn btn-bankid-auth" disabled={loginLoading}>
              {loginLoading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <BankIdIcon size={20} />
                  <span>Starta BankID</span>
                </>
              )}
            </button>
          </form>

          <div className="divider">eller</div>

          <button onClick={() => { setLoginNumber('19990520-1234'); setIsLoggedIn(true); }} className="demo-btn">
            Snabbinloggning som Trainee
          </button>

          <footer className="login-footer">
            <p>© 2026 Operator Academy Europe. All rights reserved.</p>
            <p>Godkänd för GDPR CRM-träningscertifikat i Sverige.</p>
          </footer>
        </div>
      </div>
    )
  }

  // 2. Scenario Selection Menu Screen (Trainee Dashboard)
  if (activeScenarioIdx === null) {
    return (
      <div className="dashboard-container">
        {/* Top Header */}
        <header className="dashboard-header">
          <div className="header-branding">
            <Tele2Logo />
            <span className="badge-live">TRAINING ENVIRONMENT (LIVE)</span>
          </div>

          <div className="trainee-profile">
            <div className="xp-container">
              <span className="level-badge">Nivå {currentLevel}</span>
              <div className="xp-progress-bar">
                <div className="xp-fill" style={{ width: `${(totalXp % 1000) / 10}%` }}></div>
                <span className="xp-text">{totalXp % 1000} / 1000 XP</span>
              </div>
              <span className="xp-total">Totalt {totalXp} XP</span>
            </div>

            <div className="badges-list">
              {unlockedBadges.map((bg, i) => (
                <span key={i} className="badge-item" title="Låst upp under träning">{bg}</span>
              ))}
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <main className="dashboard-main">
          <section className="welcome-banner">
            <h1>Välkommen tillbaka, Trainee!</h1>
            <p>Välj ett av de realistiska telecom-scenarierna nedan för att börja träna i CRM-simulatorn. Lös kundernas problem, följ säkerhetsrutiner och tjäna poäng!</p>
          </section>

          <section className="scenarios-section">
            <h2>Aktiva Utbildningsscenarier ({SCENARIOS.length})</h2>
            
            <div className="scenarios-grid">
              {SCENARIOS.map((sc, index) => (
                <div key={sc.id} className="scenario-card">
                  <div className="scenario-card-header">
                    <span className="difficulty-badge" style={{ backgroundColor: sc.difficultyColor }}>
                      {sc.difficulty}
                    </span>
                    <span className="scenario-id">#CASE-{index + 1}</span>
                  </div>

                  <h3>{sc.title}</h3>
                  <p className="scenario-desc">{sc.description}</p>
                  
                  <div className="scenario-meta">
                    <div>
                      <strong>Kund:</strong> {sc.customerName}
                    </div>
                    <div>
                      <strong>Mål:</strong> Lösa tvisten på ett korrekt & säkert sätt.
                    </div>
                  </div>

                  <button className="start-btn" onClick={() => startScenario(index)}>
                    Starta CRM-Simulering
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    )
  }

  // 3. MAIN CRM SIMULATOR SCREEN
  const currentScenario = SCENARIOS[activeScenarioIdx];

  return (
    <div className="simulator-shell">
      
      {/* Active Header */}
      <header className="simulator-header">
        <button className="exit-btn" onClick={handleExitScenario}>
          ← Avsluta Träning
        </button>

        <div className="scenario-active-info">
          <h3>Aktivt Fall: {currentScenario.title}</h3>
          <span className="difficulty-badge" style={{ backgroundColor: currentScenario.difficultyColor }}>
            {currentScenario.difficulty}
          </span>
        </div>

        <div className="simulator-metrics">
          <div className="metric-box">
            <span className="lbl">Tid:</span>
            <span className="val">{Math.floor(timeElapsed / 60)}m {timeElapsed % 60}s</span>
          </div>
          <div className="metric-box">
            <span className="lbl">Klick:</span>
            <span className="val">{clickCount}</span>
          </div>
          <button className="hint-btn" onClick={() => setShowHintModal(true)}>
            💡 Tips
          </button>
        </div>
      </header>

      {/* Simulator Workspace Grid */}
      <div className="simulator-workspace">
        
        {/* LEFT PANEL: Scenario Guidelines & Checklist */}
        <aside className="panel scenario-panel">
          <div className="panel-header">
            <h2>Instruktioner & Mål</h2>
          </div>
          
          <div className="panel-body">
            <div className="target-profile-card">
              <h3>Kunduppgifter</h3>
              <p><strong>Namn:</strong> {currentScenario.customerName}</p>
              <p><strong>Personnummer:</strong> {currentScenario.personnummer}</p>
              <p><strong>Mobilnummer:</strong> {currentScenario.phone}</p>
              <p><strong>Adress:</strong> {currentScenario.address}</p>
            </div>

            <div className="scenario-brief">
              <h4>Ärendebeskrivning:</h4>
              <p>{currentScenario.description}</p>
            </div>

            <div className="checklist-container">
              <h4>CRM Checklista (Realtid):</h4>
              <ul className="checklist">
                {checklist.map((item) => (
                  <li key={item.id} className={item.checked ? 'checked' : ''}>
                    {item.checked ? <CheckCircleIcon size={18} /> : <div className="unchecked-dot"></div>}
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="compliance-warning-card">
              <ShieldIcon className="shield-ic" />
              <div>
                <strong>Säkerhet & GDPR</strong>
                <p>Du får aldrig lämna ut abonnemangsdetaljer eller genomföra ändringar utan att verifiera kundens identitet först.</p>
              </div>
            </div>
          </div>
        </aside>

        {/* MIDDLE PANEL: THE CRM WORKSPACE */}
        <main className="panel crm-panel">
          <div className="crm-bar">
            <div className="crm-brand">SimCRM v4.8</div>
            
            {/* SEARCH PANEL */}
            <form onSubmit={handleCrmSearchSubmit} className="crm-search-form">
              <input 
                type="text" 
                placeholder="Sök kund via personnummer eller namn..." 
                value={crmSearchQuery}
                onChange={(e) => setCrmSearchQuery(e.target.value)}
              />
              <button type="submit" className="crm-search-btn">
                <SearchIcon />
                <span>Sök</span>
              </button>
            </form>
          </div>

          {!crmSearchSuccess ? (
            <div className="crm-placeholder">
              <div className="crm-lock-illustration">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3>CRM-Systemet är Låst</h3>
              <p>För att visa kundens profil och utföra ändringar måste du söka efter kunden i sökfältet ovan med deras personnummer <strong>({currentScenario.personnummer})</strong> eller fullständiga namn.</p>
            </div>
          ) : (
            <div className="crm-active-workspace">
              {/* Customer Profile Banner */}
              <div className="crm-profile-banner">
                <div className="avatar">{currentScenario.customerName.charAt(0)}</div>
                
                <div className="profile-details">
                  <div className="name-row">
                    <h2>{currentScenario.customerName}</h2>
                    <span className={`vip-tag ${currentScenario.vipStatus.toLowerCase()}`}>{currentScenario.vipStatus} Kund</span>
                  </div>
                  <p>{currentScenario.personnummer} | {currentScenario.phone}</p>
                </div>

                <div className="verification-state-badge">
                  {customerVerified ? (
                    <span className="verified-badge">
                      <CheckCircleIcon size={14} color="#ffffff" />
                      <span>IDENTITET VERIFIERAD</span>
                    </span>
                  ) : (
                    <span className="unverified-badge">
                      <XCircleIcon size={14} color="#ffffff" />
                      <span>EJ VERIFIERAD</span>
                    </span>
                  )}
                </div>
              </div>

              {/* CRM Navigation Tabs */}
              <nav className="crm-tabs">
                <button className={`crm-tab ${activeTab === 'oversikt' ? 'active' : ''}`} onClick={() => { setClickCount(c=>c+1); setActiveTab('oversikt'); }}>
                  Översikt
                </button>
                <button className={`crm-tab ${activeTab === 'abonnemang' ? 'active' : ''}`} onClick={() => { setClickCount(c=>c+1); setActiveTab('abonnemang'); }}>
                  Abonnemang
                </button>
                <button className={`crm-tab ${activeTab === 'fakturor' ? 'active' : ''}`} onClick={() => { setClickCount(c=>c+1); setActiveTab('fakturor'); }}>
                  Fakturor
                </button>
                <button className={`crm-tab ${activeTab === 'portning' ? 'active' : ''}`} onClick={() => { setClickCount(c=>c+1); setActiveTab('portning'); }}>
                  {currentScenario.id === 'esim-activation' ? 'eSIM & SIM' : 'Nummerportning & SIM'}
                </button>
                <button className={`crm-tab ${activeTab === 'historik' ? 'active' : ''}`} onClick={() => { setClickCount(c=>c+1); setActiveTab('historik'); }}>
                  Support & Loggar
                </button>
              </nav>

              {/* CRM Tab Content Areas */}
              <div className="crm-tab-content">
                
                {/* 1. ÖVERSIKT */}
                {activeTab === 'oversikt' && (
                  <div className="tab-pane-view animate-fade">
                    <div className="info-grid">
                      <div className="info-card">
                        <h3>Basinformation (Folkbokföring)</h3>
                        <p><strong>Namn:</strong> {currentScenario.customerName}</p>
                        <p><strong>Personnummer:</strong> {currentScenario.personnummer}</p>
                        <p><strong>Adress:</strong> {currentScenario.address}</p>
                        <p><strong>Källa:</strong> Skatteverket Folkbokföringsregister</p>
                      </div>

                      <div className="info-card">
                        <h3>Säkerhet & Behörighet</h3>
                        <p>Kontrollera kundens identitet innan du utför några ändringar.</p>
                        
                        <div className="verification-actions">
                          <button className="crm-action-btn crm-btn-green" onClick={() => handleActionTrigger('send_bankid')}>
                            <BankIdIcon size={16} />
                            <span>Trigga BankID-legitimering</span>
                          </button>

                          {allowManualVerifyBtn && (
                            <button className="crm-action-btn crm-btn-blue" onClick={handleManualAddressVerify}>
                              <span>Godkänn ID-kort/Adress-kontroll</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="billing-settings-card">
                      <h3>Faktureringsinställningar</h3>
                      <div className="setting-row">
                        <span>Aktiv Faktureringsmetod:</span>
                        <span className="billing-method-badge">{activeInvoices.billingMethod || 'E-faktura'}</span>
                      </div>
                      
                      {currentScenario.id === 'elderly-billing' && (
                        <div className="billing-method-change-btns">
                          <p>Ändra faktureringsmetod för att spara avgifter:</p>
                          <div className="btn-group-row">
                            <button className="crm-action-btn" onClick={() => changeBillingMethod('E-faktura')}>Byt till E-faktura</button>
                            <button className="crm-action-btn" onClick={() => changeBillingMethod('Kivra')}>Byt till Kivra</button>
                            <button className="crm-action-btn" disabled>Pappersfaktura (Avgift 49 kr)</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. ABONNEMANG */}
                {activeTab === 'abonnemang' && (
                  <div className="tab-pane-view animate-fade">
                    <h3>Aktiva Abonnemang och Tjänster</h3>
                    
                    <div className="subscriptions-list">
                      {activeSubscriptions.map((sub) => (
                        <div key={sub.id} className="sub-item-card">
                          <div className="sub-card-left">
                            <h4>{sub.planName}</h4>
                            <p>Pris: <strong>{sub.price} kr/mån</strong></p>
                            <p>Status: <span className="active-tag">{sub.status}</span></p>
                          </div>

                          <div className="sub-card-right">
                            <p>Bindningstid: <strong>{sub.contractPeriod}</strong></p>
                            <p>Rabatt: <strong style={{ color: '#10b981' }}>{sub.discountApplied}</strong></p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Scenario 1: Discount Options */}
                    {currentScenario.id === 'broadband-dispute' && (
                      <div className="offers-section">
                        <h3>Tillgängliga Retention-kampanjer</h3>
                        <div className="offers-grid">
                          <div className="offer-card">
                            <h4>Lojalitetsrabatt: 20% Rabatt</h4>
                            <p>Applicerar 20% rabatt på befintligt abonnemang. Priset sänks till 479 kr/mån. Bindningstid förlängs med 12 månader.</p>
                            <button className="crm-action-btn crm-btn-green" onClick={applyRetentionDiscount}>
                              Applicera Retention 20%
                            </button>
                          </div>

                          <div className="offer-card">
                            <h4>Nedgradera & Behåll (Bredband 250)</h4>
                            <p>Byter till Bredband 250 (399 kr/mån) med 20% rabatt. Slutpris 319 kr/mån. Utmärkt budgetalternativ.</p>
                            <button className="crm-action-btn crm-btn-blue" onClick={downgradeAndApplyDiscount}>
                              Byt till Bredband 250 + Rabatt
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Scenario 3: Broadband Speeds */}
                    {currentScenario.id === 'speed-dispute' && (
                      <div className="diagnostics-section">
                        <h3>Teknisk Routerdiagnostik</h3>
                        
                        <button className="crm-action-btn crm-btn-blue" onClick={runRouterDiagnostics}>
                          Kör Routerdiagnostik (Realtidstest)
                        </button>

                        {diagnosticsOutput && (
                          <div className="diagnostics-output-box animate-fade">
                            <h4>Routerdiagnostik Resultat:</h4>
                            
                            <table className="diagnostics-table">
                              <tbody>
                                <tr>
                                  <td><strong>Router Status:</strong></td>
                                  <td><span className="warning-text">{diagnosticsOutput.status}</span></td>
                                </tr>
                                <tr>
                                  <td><strong>Ansluten Port på Fiberbox:</strong></td>
                                  <td>
                                    <span className={diagnosticsOutput.port.includes('LAN 2') ? 'warning-text' : 'success-text'}>
                                      {diagnosticsOutput.port}
                                    </span>
                                    {diagnosticsOutput.port.includes('LAN 2') && (
                                      <button className="tiny-crm-btn" onClick={simulateCableSwap}>
                                        Flytta kabel till LAN 1
                                      </button>
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td><strong>Firmware version:</strong></td>
                                  <td>
                                    <span className={diagnosticsOutput.firmware.includes('Gammal') ? 'warning-text' : 'success-text'}>
                                      {diagnosticsOutput.firmware}
                                    </span>
                                    {firmwareUpgradeAvailable && diagnosticsOutput.firmware.includes('Gammal') && (
                                      <button className="tiny-crm-btn" onClick={upgradeRouterFirmware}>
                                        Uppgradera firmware
                                      </button>
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td><strong>Bandbredd:</strong></td>
                                  <td>{diagnosticsOutput.bandwidth}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. FAKTUROR */}
                {activeTab === 'fakturor' && (
                  <div className="tab-pane-view animate-fade">
                    <h3>Fakturagranskning & Reskontra</h3>
                    
                    <table className="crm-table">
                      <thead>
                        <tr>
                          <th>Fakturanummer</th>
                          <th>Period</th>
                          <th>Belopp (SEK)</th>
                          <th>Status</th>
                          <th>Noteringar</th>
                          <th>Åtgärd</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeInvoices.map((inv) => (
                          <tr key={inv.id}>
                            <td>#{inv.id}</td>
                            <td>{inv.month}</td>
                            <td className="bold-price">{inv.amount} kr</td>
                            <td>
                              <span className={`status-badge ${inv.status.toLowerCase()}`}>
                                {inv.status}
                              </span>
                            </td>
                            <td>{inv.notes}</td>
                            <td>
                              {currentScenario.id === 'elderly-billing' && inv.id === 'f501' && !inv.creditApplied ? (
                                <button className="crm-action-btn tiny-btn" onClick={creditInvoiceFee}>
                                  Kreditera pappersfakturaavgift (49 kr)
                                </button>
                              ) : (
                                <span className="disabled-text">Inga tillgängliga åtgärder</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 4. PORTNING & SIM */}
                {activeTab === 'portning' && (
                  <div className="tab-pane-view animate-fade">
                    <h3>{currentScenario.id === 'esim-activation' ? 'eSIM Profiler & Multicard' : 'Nummerportning & SIM-Administration'}</h3>

                    <div className="porting-status-container">
                      <div className="porting-meta-row">
                        <div>
                          <strong>ICCID (SIM-kortnummer):</strong>
                          {currentScenario.id === 'porting-failure' ? (
                            <div className="iccid-input-group">
                              <input 
                                type="text" 
                                value={portingDetails.iccid}
                                onChange={handleIccidChange}
                              />
                              <small>Skriv in korrekta 16 siffror utan mellanslag.</small>
                            </div>
                          ) : (
                            <span> {portingDetails.iccid}</span>
                          )}
                        </div>

                        <div>
                          <strong>Portningsstatus:</strong>
                          <span className={`status-badge ${portingDetails.status.includes('Avvisad') ? 'unpaid' : 'paid'}`}>
                            {portingDetails.status}
                          </span>
                        </div>
                      </div>

                      {portingDetails.errorText && (
                        <div className="porting-error-box">
                          <strong>Nätverkssvar/Felkod:</strong>
                          <p>{portingDetails.errorText}</p>
                        </div>
                      )}

                      <div className="porting-actions">
                        {currentScenario.id === 'porting-failure' && (
                          <button className="crm-action-btn crm-btn-blue" onClick={retriggerPortingRequest}>
                            Skicka ny portningsförfrågan till Telia
                          </button>
                        )}

                        {currentScenario.id === 'esim-activation' && (
                          <div className="esim-actions-grid">
                            <button className="crm-action-btn crm-btn-red" onClick={removeBlockedEsimProfile}>
                              Ta bort blockerande / låst eSIM-profil
                            </button>

                            <button className="crm-action-btn crm-btn-green" onClick={activateWatchEsim}>
                              Aktivera klock-eSIM (Multicard)
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. HISTORIK & LOGGAR */}
                {activeTab === 'historik' && (
                  <div className="tab-pane-view animate-fade">
                    <h3>Ärendehistorik & Samtalsloggar</h3>
                    
                    <div className="history-logs-list">
                      {crmLogs.map((log, i) => (
                        <div key={i} className="log-entry">
                          <div className="log-meta">
                            <span className="log-author"><strong>{log.author}</strong></span>
                            <span className="log-time">{log.timestamp}</span>
                          </div>
                          <p className="log-text">{log.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="add-log-box">
                      <h4>Dokumentera Samtal (Obligatoriskt för slutbetyg):</h4>
                      <textarea 
                        placeholder="Skriv en tydlig notering om vad kunden ville, vad du kommit överens om och vilka åtgärder du utfört..."
                        value={manualNote}
                        onChange={(e) => setManualNote(e.target.value)}
                      />
                      <button className="crm-action-btn crm-btn-blue" onClick={saveCrmManualLog}>
                        Spara Logg & Ärende
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}
        </main>

        {/* RIGHT PANEL: CUSTOMER LIVE CHAT */}
        <aside className="panel chat-panel">
          <div className="panel-header chat-header-row">
            <h2>Kunddialog (Telefon/Chatt)</h2>
            <div className="sentiment-tracker">
              <span>Sentiment:</span>
              <span className={`sentiment-badge ${customerSentiment.toLowerCase()}`}>
                {customerSentiment === 'Happy' && 'Nöjd 😊'}
                {customerSentiment === 'Neutral' && 'Neutral 😐'}
                {customerSentiment === 'Confused' && 'Förvirrad orig 😟'}
                {customerSentiment === 'Angry' && 'Upprörd 😡'}
              </span>
            </div>
          </div>

          <div className="panel-body chat-body">
            <div className="messages-container">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.sender}`}>
                  <div className="chat-bubble">
                    <p>{msg.text}</p>
                    <span className="time">{msg.time}</span>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef}></div>
            </div>

            {/* Trainee Dialogue Options Selection */}
            <div className="dialogue-options-box">
              {activeDialogueId === 'done' ? (
                <div className="chat-finished-notice">
                  <h4>Samtalet har Avslutats</h4>
                  <p>Du har klickat på att skicka in ärendet till AI-utvärdering. Klicka på knappen nedan för att se ditt slutbetyg.</p>
                </div>
              ) : (
                <>
                  <h4>Välj ditt svar till kunden:</h4>
                  <div className="options-list">
                    {currentScenario.chatDialogues
                      .find(d => d.id === activeDialogueId)
                      ?.options.map((opt, i) => (
                        <button key={i} className="option-item-btn" onClick={() => selectDialogueOption(opt)}>
                          {opt.text}
                        </button>
                      ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>

      </div>

      {/* ── HINT MODAL POPUP ── */}
      {showHintModal && (
        <div className="modal-overlay animate-fade">
          <div className="modal-content">
            <h3>Coach AI Tips & Ledtråd</h3>
            <p>{currentScenario.hiddenHint}</p>
            <button className="close-modal-btn" onClick={() => setShowHintModal(false)}>
              Stäng tips
            </button>
          </div>
        </div>
      )}

      {/* ── AI EVALUATION OVERLAY REPORT ── */}
      {evaluationReport && (
        <div className="evaluation-overlay">
          <div className="report-glass-card animate-zoom">
            <header className="report-header">
              <h2>UTVÄRDERINGSRAPPORT: SLUTBETYG</h2>
              <div className="final-grade-badge">{evaluationReport.grade}</div>
            </header>

            <main className="report-body">
              <div className="score-summary-row">
                <div className="overall-score-box">
                  <span className="score-num">{evaluationReport.totalScore}</span>
                  <span className="score-lbl">Totalpoäng</span>
                </div>

                <div className="gained-xp-box">
                  <span className="xp-num">+{evaluationReport.gainedXp} XP</span>
                  <span className="xp-lbl">Erfarenhetspoäng Gained</span>
                </div>
              </div>

              {/* Metrics Breakdown Bars */}
              <div className="metrics-breakdown">
                <h3>Analys och Betyg per Kategori</h3>
                
                <div className="metric-row-bar">
                  <div className="bar-labels">
                    <span>Noggrannhet (Accuracy)</span>
                    <span>{evaluationReport.metrics.accuracy}%</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${evaluationReport.metrics.accuracy}%`, backgroundColor: '#10b981' }}></div>
                  </div>
                </div>

                <div className="metric-row-bar">
                  <div className="bar-labels">
                    <span>Säkerhet & GDPR (Compliance)</span>
                    <span style={{ color: evaluationReport.metrics.compliance < 50 ? '#ef4444' : '#10b981' }}>
                      {evaluationReport.metrics.compliance}%
                    </span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${evaluationReport.metrics.compliance}%`, backgroundColor: evaluationReport.metrics.compliance < 50 ? '#ef4444' : '#10b981' }}></div>
                  </div>
                </div>

                <div className="metric-row-bar">
                  <div className="bar-labels">
                    <span>Navigation & Effektivitet</span>
                    <span>{evaluationReport.metrics.efficiency}%</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${evaluationReport.metrics.efficiency}%`, backgroundColor: '#3b82f6' }}></div>
                  </div>
                </div>

                <div className="metric-row-bar">
                  <div className="bar-labels">
                    <span>Kundhantering & Bemötande</span>
                    <span>{evaluationReport.metrics.satisfaction}%</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${evaluationReport.metrics.satisfaction}%`, backgroundColor: '#f59e0b' }}></div>
                  </div>
                </div>

                <div className="metric-row-bar">
                  <div className="bar-labels">
                    <span>Dokumentationskvalitet</span>
                    <span>{evaluationReport.metrics.documentation}%</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${evaluationReport.metrics.documentation}%`, backgroundColor: '#8b5cf6' }}></div>
                  </div>
                </div>
              </div>

              {/* Coach Feedback Box */}
              <div className="coach-feedback-box">
                <h4>Utlåtande från Coach AI:</h4>
                <p>"{evaluationReport.coachFeedback}"</p>
              </div>
            </main>

            <footer className="report-footer">
              <button className="next-scenario-btn" onClick={handleExitScenario}>
                Tillbaka till instrumentpanelen
              </button>
            </footer>
          </div>
        </div>
      )}

    </div>
  )
}
