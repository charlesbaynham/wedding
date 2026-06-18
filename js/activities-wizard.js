// Activities wizard — Option C: one question at a time
// Runs after jQuery and main.js are loaded.
(function ($) {
  if (!$('#activities-wizard').length) return;

  // ── Replace this with your Google Apps Script endpoint for the activities form ──
  var ACTIVITIES_ENDPOINT = 'https://script.google.com/macros/s/AKfycbz6LfmACs2rzJSugkVec1RCWtwV1unlVmbTYCESk_lVH07o97tjDyN-BaHq9sPtbuvRQQ/exec';
  var RECAPTCHA_SITE_KEY = '6LcGajwsAAAAAId2rBkCEIPZO5qhVmbi9i_NkQQf';

  // ── Step definitions ──────────────────────────────────────────────────────────
  var STEPS = [
    { id: 'intro' },
    { id: 'peopleCount',   kind: 'count' },
    { id: 'people',        kind: 'people' },
    { id: 'email',         kind: 'text' },
    { id: 'arrival',       kind: 'date' },
    { id: 'staying',       kind: 'text' },
    { id: 'welcomeDrinks', kind: 'activity' },
    { id: 'xelha',         kind: 'activity' },
    { id: 'scuba',         kind: 'activity' },
    { id: 'scubaType',     kind: 'subchoice', showIf: function () { return attendees('scuba').length > 0; } },
    { id: 'cocktails',     kind: 'activity' },
    { id: 'chichen',       kind: 'activity' },
    { id: 'rideCeremony',  kind: 'transport' },
    { id: 'rideReception', kind: 'transport' },
    { id: 'rideHome',      kind: 'transport' },
    { id: 'review' },
  ];

  // Activity steps record per-person attendance; these are the activity ids.
  var ACTIVITY_IDS = ['welcomeDrinks', 'xelha', 'scuba', 'cocktails', 'chichen'];

  var FIELDS = {
    email:   { en: 'What\'s your email?', es: '¿Tu correo electrónico?',
               helpEn: 'So we can reach you about bookings and transport.', helpEs: 'Para poder contactarte sobre reservas y transporte.',
               phEn: 'you@example.com', phEs: 'tu@ejemplo.com', type: 'email' },
    arrival: { en: 'When do you land in México?', es: '¿Cuándo llegas a México?',
               helpEn: 'Roughly is fine — helps us plan the early activities.', helpEs: 'Aproximado está bien — nos ayuda a planear las primeras actividades.',
               date: true },
    staying: { en: 'Where are you staying?', es: '¿Dónde te hospedas?',
               helpEn: 'Hotel, AirBnB, or town — so we can plan pick-ups.', helpEs: 'Hotel, AirBnB o pueblo — para planear el transporte.',
               phEn: 'Hotel, AirBnB, town…', phEs: 'Hotel, AirBnB, pueblo…' },
  };

  var ACT = {
    welcomeDrinks: {
      emoji: '🌅',
      en: 'Welcome drinks & early-birds luau', es: 'Copas de bienvenida y luau',
      whenEn: 'Wed 21 Oct · 5:00 PM · Puerto Morelos beach', whenEs: 'Mié 21 oct · 17:00 · playa de Puerto Morelos',
      descEn: 'A relaxed evening on the sand at Casa Brisa y Mar to kick things off and meet everyone before the big day.',
      descEs: 'Una velada relajada en la arena en Casa Brisa y Mar para arrancar y conocernos antes del gran día.',
      priceEn: 'BYOB · bring your own drinks', priceEs: 'BYOB · trae tus propias bebidas',
      yesEn: 'Yes, I\'ll be there', yesEs: 'Sí, estaré ahí',
      noEn: 'Not this one', noEs: 'Me la salto',
    },
    xelha: {
      emoji: '🐠',
      en: 'Xel-Há day trip', es: 'Excursión a Xel-Há',
      whenEn: 'Thu 22 Oct · full day', whenEs: 'Jue 22 oct · día completo',
      descEn: 'A full day at the natural water park — snorkel the inlet, float the lazy river and swim in cenotes. Food and drinks are included in the ticket.',
      descEs: 'Un día completo en el parque acuático natural — snorkel en la caleta, río flotante y cenotes. Comida y bebidas incluidas en el boleto.',
      priceEn: 'Please book your own tickets', priceEs: 'Reserva tus propios boletos',
      yesEn: 'Yes, count me in', yesEs: 'Sí, apúntame',
      noEn: 'Not this one', noEs: 'Me la salto',
    },
    scuba: {
      emoji: '🤿',
      en: 'Scuba & snorkeling', es: 'Buceo y snorkel',
      whenEn: 'Fri 23 Oct · morning or afternoon', whenEs: 'Vie 23 oct · mañana o tarde',
      descEn: 'Head out over the Puerto Morelos reef — part of the second-largest barrier reef in the world. Certified dives, beginner dives and snorkel trips all on offer.',
      descEs: 'Salimos sobre el arrecife de Puerto Morelos — parte del segundo arrecife más grande del mundo. Hay buceo certificado, para principiantes y snorkel.',
      priceEn: 'Prices on the next step', priceEs: 'Precios en el siguiente paso',
      yesEn: 'Yes, I\'m in', yesEs: 'Sí, me apunto',
      noEn: 'Not this one', noEs: 'Me lo salto',
    },
    cocktails: {
      emoji: '🍹',
      en: 'Welcome cocktails at sunset', es: 'Cócteles de bienvenida al atardecer',
      whenEn: 'Fri 23 Oct · 5:00 PM · Puerto Morelos beach', whenEs: 'Vie 23 oct · 17:00 · playa de Puerto Morelos',
      descEn: 'The official start of the celebrations — cocktails on the beach as the sun goes down. This is the one not to miss!',
      descEs: 'El inicio oficial de la celebración — cócteles en la playa mientras se pone el sol. ¡Esta es la que no te puedes perder!',
      priceEn: 'Free entry · paid bar', priceEs: 'Entrada libre · barra de pago',
      yesEn: 'Yes, I\'ll be there', yesEs: 'Sí, estaré ahí',
      noEn: 'Not this one', noEs: 'Me la salto',
    },
    chichen: {
      emoji: '🏛️',
      en: 'Chichén Itzá trip', es: 'Excursión a Chichén Itzá',
      whenEn: 'Sat 24 Oct · full day', whenEs: 'Sáb 24 oct · día completo',
      descEn: 'A trip to the great Mayan pyramid, one of the New Seven Wonders. Charles & Gaby won\'t make this one (wedding prep!) but we\'ll help the group organise it.',
      descEs: 'Una excursión a la gran pirámide maya, una de las Nuevas Siete Maravillas. Charles y Gaby no irán a esta (¡preparativos!) pero ayudaremos al grupo a organizarla.',
      priceEn: '≈ $40 USD per person (to be confirmed)', priceEs: '≈ $40 USD por persona (por confirmar)',
      yesEn: 'Yes, count me in', yesEs: 'Sí, apúntame',
      noEn: 'Not this one', noEs: 'Me la salto',
    },
  };

  var SCUBA_TYPES = [
    { value: 'certified', en: 'Certified diver',  es: 'Buzo certificado',    price: '$2,200 MXN', group: '$1,700 MXN' },
    { value: 'snorkeler', en: 'Snorkeler',         es: 'Snorkel',             price: '$700 MXN',   group: '$400 MXN' },
    { value: 'beginner',  en: 'Beginner diver',    es: 'Buzo principiante',   price: '$2,800 MXN', group: '$2,100 MXN' },
  ];

  var TRANSPORT = {
    rideCeremony:  { routeEn: 'Puerto Morelos → Cenote Agua Verde', routeEs: 'Puerto Morelos → Cenote Agua Verde',
                     legEn: 'Ride to the ceremony', legEs: 'Transporte a la ceremonia',
                     descEn: 'We\'ll organise shared transport from Puerto Morelos to the ceremony venue.', descEs: 'Organizaremos transporte compartido desde Puerto Morelos hasta la ceremonia.' },
    rideReception: { routeEn: 'Cenote Agua Verde → Casa Tattva', routeEs: 'Cenote Agua Verde → Casa Tattva',
                     legEn: 'On to the reception', legEs: 'A la recepción',
                     descEn: 'A short ride from the ceremony to the reception venue.', descEs: 'Un breve traslado de la ceremonia a la recepción.' },
    rideHome:      { routeEn: 'Casa Tattva → Puerto Morelos', routeEs: 'Casa Tattva → Puerto Morelos',
                     legEn: 'Home at the end of the night', legEs: 'De regreso al final de la noche',
                     descEn: 'A late-night ride back to Puerto Morelos after the party.', descEs: 'Regreso nocturno a Puerto Morelos después de la fiesta.' },
  };

  // ── State ─────────────────────────────────────────────────────────────────────
  // answers.peopleCount → number, answers.people → array of name strings.
  // Each activity id in answers holds an array of attending person indices.
  var answers = {};
  var history = ['intro'];  // stack of step ids visited
  // Transient per-person activity states ('1'|'0'|'' undecided) preserved across
  // an in-place re-render (e.g. language toggle) before the step is completed.
  var activityDraft = null;  // { id: stepId, states: [...] }

  // ── Helpers ───────────────────────────────────────────────────────────────────
  // Names of the people attending a given activity. Reconciles stored indices
  // against the current people list so removing a person can't dangle.
  function attendees(stepId) {
    var people = answers.people || [];
    var sel = answers[stepId] || [];
    var out = [];
    sel.forEach(function (i) { if (people[i]) out.push(people[i]); });
    return out;
  }

  function isES() {
    try { return (localStorage.getItem('siteLang') || 'en') === 'es'; } catch (e) { return false; }
  }

  function t(enStr, esStr) { return isES() ? esStr : enStr; }

  // Native date inputs store their value as YYYY-MM-DD. Render that for humans
  // in the viewer's own locale (UK sees DD/MM/YYYY, US sees MM/DD/YYYY, etc.) —
  // the same default the native picker uses to display the field.
  function formatDateLocale(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return iso || '';
    var d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    try { return d.toLocaleDateString(); } catch (e) { return iso; }
  }

  function visibleSteps() {
    return STEPS.filter(function (s) { return !s.showIf || s.showIf(answers); });
  }

  function stepIndex(id) {
    var vs = visibleSteps();
    for (var i = 0; i < vs.length; i++) { if (vs[i].id === id) return i; }
    return -1;
  }

  function currentStep() { return history[history.length - 1]; }

  function progressableSteps() {
    // exclude intro and review from "answerable" count for progress display
    return visibleSteps().filter(function (s) { return s.id !== 'intro' && s.id !== 'review'; });
  }

  function answeredCount() {
    var ps = progressableSteps();
    var count = 0;
    ps.forEach(function (s) { if (answers[s.id] !== undefined) count++; });
    return count;
  }

  function updateProgress() {
    var sid = currentStep();
    var step = STEPS.find(function (s) { return s.id === sid; });
    if (!step || sid === 'intro') {
      $('#wiz-progress-wrap').hide();
      return;
    }
    var ps = progressableSteps();
    var total = ps.length;
    var current = 0;
    for (var i = 0; i < ps.length; i++) {
      if (ps[i].id === sid) { current = i + 1; break; }
    }
    if (sid === 'review') { current = total; }
    var pct = total > 0 ? Math.round((current / total) * 100) : 0;
    $('#wiz-progress-wrap').show();
    $('#wiz-progress-fill').css('width', pct + '%');
    $('#wiz-progress-text').text(current + ' / ' + total);
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  var BTN_YES  = 'display:block; width:100%; padding:17px 18px; border-radius:11px; border:2px solid #afa63d; background:#afa63d; color:#1c1a17; font-family:Raleway,"Helvetica Neue",Helvetica,Arial,sans-serif; font-weight:800; text-transform:uppercase; letter-spacing:1px; font-size:15px; cursor:pointer; margin-bottom:12px;';
  var BTN_NO   = 'display:block; width:100%; padding:17px 18px; border-radius:11px; border:2px solid rgba(255,255,255,0.5); background:transparent; color:#fff; font-family:Raleway,"Helvetica Neue",Helvetica,Arial,sans-serif; font-weight:700; text-transform:uppercase; letter-spacing:1px; font-size:15px; cursor:pointer;';
  var BTN_NEXT = 'display:inline-block; padding:14px 32px; border-radius:9px; border:2px solid #afa63d; background:#afa63d; color:#1c1a17; font-family:Raleway,"Helvetica Neue",Helvetica,Arial,sans-serif; font-weight:800; text-transform:uppercase; letter-spacing:1px; font-size:14px; cursor:pointer;';
  var INPUT    = 'display:block; width:100%; padding:14px 16px; border-radius:8px; border:2px solid rgba(255,255,255,0.3); background:rgba(0,0,0,0.3); color:#fff; font-family:Cardo,"Helvetica Neue",Helvetica,Arial,sans-serif; font-size:18px; outline:none; margin-bottom:20px; -webkit-appearance:none;';

  function renderStep(id) {
    var $c = $('#wiz-content');
    $c.empty();
    $('#wiz-back-wrap').toggle(history.length > 1);
    updateProgress();

    if (id === 'intro') {
      $c.html(
        '<h1 style="font-size:clamp(28px,5vw,42px);">' +
          t('Activities & transport', 'Actividades y transporte') +
        '</h1>' +
        '<p>' +
          t('To help us plan numbers, bookings and transport for the pre-wedding activities, please take a couple of minutes to fill in this form.',
            'Para ayudarnos a planear el número de personas, las reservas y el transporte para las actividades previas a la boda, por favor tómate un par de minutos para llenar este formulario.') +
        '</p>' +
        '<p>' +
          t('It\'s quick — we\'ll ask you about each activity one at a time.',
            'Es rápido — te preguntaremos sobre cada actividad de una en una.') +
        '</p>' +
        '<button type="button" id="wiz-start-btn" style="' + BTN_YES + '">' +
          t('Let\'s go →', '¡Empecemos →') +
        '</button>'
      );
      $('#wiz-start-btn').on('click', function () { advance('intro'); });
      return;
    }

    if (id === 'review') {
      renderReview($c);
      return;
    }

    var step = STEPS.find(function (s) { return s.id === id; });
    if (!step) return;

    if (step.kind === 'count') {
      renderCount($c);
    } else if (step.kind === 'people') {
      renderPeople($c);
    } else if (step.kind === 'text' || step.kind === 'date') {
      renderTextField($c, step);
    } else if (step.kind === 'activity') {
      renderActivity($c, step);
    } else if (step.kind === 'subchoice') {
      renderScubaType($c);
    } else if (step.kind === 'transport') {
      renderTransport($c, step);
    }
  }

  function renderCount($c) {
    var val = answers.peopleCount || 1;
    var btnStep = 'width:52px; height:52px; border-radius:10px; border:2px solid rgba(255,255,255,0.4); background:rgba(0,0,0,0.3); color:#fff; font-size:26px; font-weight:700; line-height:1; cursor:pointer;';
    $c.html(
      '<h2 style="font-size:22px; margin-bottom:8px;">' +
        t('How many people are you responding for?', '¿Para cuántas personas respondes?') + '</h2>' +
      '<p style="font-size:15px; color:rgba(255,255,255,0.75); margin-bottom:24px;">' +
        t('Including yourself — you\'ll enter everyone\'s name on the next step.',
          'Incluyéndote a ti — escribirás el nombre de cada persona en el siguiente paso.') + '</p>' +
      '<div style="display:flex; align-items:center; justify-content:center; gap:18px; margin-bottom:26px;">' +
        '<button type="button" id="wiz-count-minus" style="' + btnStep + '">−</button>' +
        '<input id="wiz-count" type="number" min="1" inputmode="numeric" value="' + val + '" style="' + INPUT + 'width:90px; text-align:center; margin-bottom:0; font-size:28px; font-weight:700;" />' +
        '<button type="button" id="wiz-count-plus" style="' + btnStep + '">+</button>' +
      '</div>' +
      '<button type="button" id="wiz-next-btn" style="' + BTN_NEXT + '">' + t('Next →', 'Siguiente →') + '</button>'
    );
    function clampVal() {
      var n = parseInt($('#wiz-count').val(), 10);
      if (isNaN(n) || n < 1) n = 1;
      return n;
    }
    $('#wiz-count-minus').on('click', function () { $('#wiz-count').val(Math.max(1, clampVal() - 1)); });
    $('#wiz-count-plus').on('click', function () { $('#wiz-count').val(clampVal() + 1); });
    $('#wiz-count').on('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); $('#wiz-next-btn').click(); }
    });
    $('#wiz-next-btn').on('click', function () {
      answers.peopleCount = clampVal();
      advance('peopleCount');
    });
  }

  function renderPeople($c) {
    var count = answers.peopleCount || 1;
    var people = answers.people || [];
    var rowsHtml = '';
    for (var i = 0; i < count; i++) {
      var v = people[i] || '';
      rowsHtml += peopleRow(i, v);
    }
    $c.html(
      '<h2 style="font-size:22px; margin-bottom:8px;">' +
        t('Who\'s coming?', '¿Quiénes vienen?') + '</h2>' +
      '<p style="font-size:15px; color:rgba(255,255,255,0.75); margin-bottom:20px;">' +
        t('Enter the full name of everyone in your party.', 'Escribe el nombre completo de cada persona de tu grupo.') + '</p>' +
      '<div id="wiz-people-rows">' + rowsHtml + '</div>' +
      '<button type="button" id="wiz-add-person" style="background:none; border:none; color:#afa63d; font-family:Raleway,sans-serif; font-size:14px; font-weight:700; cursor:pointer; padding:4px 2px; margin-bottom:18px;">' +
        t('+ Add another person', '+ Agregar otra persona') + '</button>' +
      '<button type="button" id="wiz-next-btn" style="' + BTN_NEXT + ' display:block;">' + t('Next →', 'Siguiente →') + '</button>'
    );

    function reindex() {
      $('#wiz-people-rows .wiz-person').each(function (idx) {
        $(this).attr('data-idx', idx);
        $(this).find('input').attr('placeholder', t('Person ', 'Persona ') + (idx + 1));
      });
    }
    // Delegate on the freshly-created container (not #wiz-content, which
    // persists across renders and would accumulate handlers).
    $('#wiz-people-rows').on('click', '.wiz-person-remove', function () {
      if ($('#wiz-people-rows .wiz-person').length <= 1) return;
      $(this).closest('.wiz-person').remove();
      reindex();
    });
    $('#wiz-add-person').on('click', function () {
      var idx = $('#wiz-people-rows .wiz-person').length;
      $('#wiz-people-rows').append(peopleRow(idx, ''));
    });
    setTimeout(function () { $('#wiz-people-rows input').first().focus(); }, 80);
    $('#wiz-next-btn').on('click', function () {
      var names = collectPeople();
      if (!names.length) {
        alert(t('Please enter at least one name.', 'Por favor ingresa al menos un nombre.'));
        return;
      }
      answers.people = names;
      answers.peopleCount = names.length;
      advance('people');
    });
  }

  function peopleRow(idx, val) {
    return '<div class="wiz-person" data-idx="' + idx + '" style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">' +
      '<input type="text" style="' + INPUT + 'margin-bottom:0; flex:1;" placeholder="' + t('Person ', 'Persona ') + (idx + 1) + '" value="' + $('<div>').text(val).html() + '" />' +
      '<button type="button" class="wiz-person-remove" title="' + t('Remove', 'Quitar') + '" style="background:none; border:none; color:rgba(255,255,255,0.55); font-size:22px; line-height:1; cursor:pointer; padding:6px 8px;">✕</button>' +
      '</div>';
  }

  // Read the people-name inputs currently in the DOM (trimmed, non-empty).
  function collectPeople() {
    var names = [];
    $('#wiz-people-rows .wiz-person input').each(function () {
      var v = $.trim($(this).val());
      if (v) names.push(v);
    });
    return names;
  }

  function renderTextField($c, step) {
    var f = FIELDS[step.id];
    if (!f) return;
    var label = t(f.en, f.es);
    var help  = t(f.helpEn, f.helpEs);
    var ph    = t(f.phEn || '', f.phEs || '');
    var val   = answers[step.id] || '';
    var inputHtml;
    if (f.area) {
      inputHtml = '<textarea id="wiz-field" rows="3" style="' + INPUT + 'resize:vertical;" placeholder="' + ph + '">' + $('<div>').text(val).html() + '</textarea>';
    } else if (f.date) {
      // Plain native date input: the browser displays and parses it in the
      // viewer's own locale automatically. The value is stored as YYYY-MM-DD.
      inputHtml = '<input id="wiz-field" type="date" style="' + INPUT + '" value="' + $('<div>').text(val).html() + '" />';
    } else {
      var type = f.type || 'text';
      inputHtml = '<input id="wiz-field" type="' + type + '" style="' + INPUT + '" placeholder="' + ph + '" value="' + $('<div>').text(val).html() + '" />';
    }
    $c.html(
      '<h2 style="font-size:22px; margin-bottom:8px;">' + label + '</h2>' +
      '<p style="font-size:15px; color:rgba(255,255,255,0.75); margin-bottom:20px;">' + help + '</p>' +
      inputHtml +
      '<button type="button" id="wiz-next-btn" style="' + BTN_NEXT + '">' + t('Next →', 'Siguiente →') + '</button>'
    );
    // Focus field after paint
    setTimeout(function () { $('#wiz-field').focus(); }, 80);
    // Allow Enter key (except textarea)
    if (!f.area) {
      $('#wiz-field').on('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); doNext(step); }
      });
    }
    $('#wiz-next-btn').on('click', function () { doNext(step); });
  }

  function doNext(step) {
    var val = $.trim($('#wiz-field').val());
    if (!val && step.id === 'email') {
      alert(t('Please enter your email.', 'Por favor ingresa tu correo electrónico.'));
      return;
    }
    answers[step.id] = val;
    advance(step.id);
  }

  // Per-person "sliding switch": one segmented control with both labels always
  // visible. A pill slides over the chosen side (gold = attending, white = not
  // attending) and is hidden entirely while undecided. Capped width so it does
  // not stretch across the column on desktop.
  // NOTE: font-family is deliberately left unquoted — a quoted "Helvetica Neue"
  // inside an inline style="" string truncates the attribute when injected via
  // jQuery .html(), silently dropping every property after it.
  var SW_MAXW  = 460;
  var SW_TRACK = 'position:relative; height:54px; border-radius:27px; background:rgba(0,0,0,0.28); border:1px solid rgba(255,255,255,0.18); overflow:hidden;';

  // The sliding highlight, by state ('1' attending | '0' not | '' undecided).
  function switchPillStyle(state) {
    var s = 'position:absolute; top:4px; bottom:4px; width:calc(50% - 4px); margin:0 4px; border-radius:23px; transition:left 0.18s ease, background 0.18s ease;';
    if (state === '1') return s + ' left:50%; background:#afa63d;';
    if (state === '0') return s + ' left:0; background:#fff;';
    return s + ' left:0; background:transparent; display:none;';
  }
  // A label/half of the switch. which is 'yes' (right) or 'no' (left).
  function switchLabelStyle(which, state) {
    var active = (which === 'yes' && state === '1') || (which === 'no' && state === '0');
    return 'position:absolute; ' + (which === 'no' ? 'left:0;' : 'right:0;') +
      ' top:0; height:54px; width:50%; z-index:1; border:none; background:transparent; padding:0; margin:0;' +
      ' font-family:Raleway,Helvetica,Arial,sans-serif; font-weight:800; font-size:13px; line-height:54px;' +
      ' letter-spacing:0.5px; text-transform:uppercase; text-align:center; cursor:pointer;' +
      ' color:' + (active ? '#1c1a17' : 'rgba(255,255,255,0.5)') + ';';
  }

  function renderActivity($c, step) {
    var a = ACT[step.id];
    if (!a) return;
    var people = answers.people || [];
    // Per-person state: '1' attending, '0' not attending, '' undecided. No
    // default — the respondent must choose for everyone (validated on Next).
    var states;
    if (activityDraft && activityDraft.id === step.id) {
      states = activityDraft.states;          // restore an in-progress edit
      activityDraft = null;
    } else if (answers[step.id] !== undefined) {
      var selSet = {};                         // step already completed: rebuild
      answers[step.id].forEach(function (i) { selSet[i] = true; });
      states = people.map(function (_, i) { return selSet[i] ? '1' : '0'; });
    } else {
      states = people.map(function () { return ''; });  // first visit: undecided
    }

    var rowsHtml = '';
    people.forEach(function (name, i) {
      rowsHtml += personChoiceRow(i, name, states[i] || '');
    });

    $c.html(
      '<div style="text-align:center; padding:0 4px; margin-bottom:24px;">' +
        '<div style="font-size:52px; line-height:1.1; margin-bottom:14px;">' + a.emoji + '</div>' +
        '<h2 style="font-size:clamp(18px,4vw,24px); margin-bottom:6px;">' + t(a.en, a.es) + '</h2>' +
        '<p style="font-size:14px; color:rgba(255,255,255,0.65); margin-bottom:12px; font-family:Raleway,sans-serif; text-transform:uppercase; letter-spacing:0.5px;">' + t(a.whenEn, a.whenEs) + '</p>' +
        '<p style="font-size:16px; line-height:1.55; color:rgba(255,255,255,0.9); margin-bottom:4px;">' + t(a.descEn, a.descEs) + '</p>' +
        (a.priceEn ? '<p style="font-size:13px; font-family:Raleway,sans-serif; text-transform:uppercase; letter-spacing:1px; font-weight:700; color:#afa63d; margin:14px 0 0;">' + t(a.priceEn, a.priceEs) + '</p>' : '') +
      '</div>' +
      '<p style="font-size:13px; color:rgba(255,255,255,0.6); margin-bottom:14px; font-family:Raleway,sans-serif; text-transform:uppercase; letter-spacing:0.5px;">' +
        t('Mark whether each person is attending.', 'Indica si cada persona asiste.') + '</p>' +
      '<div id="wiz-people-toggles">' + rowsHtml + '</div>' +
      '<button type="button" id="wiz-next-btn" style="' + BTN_NEXT + ' display:block; margin-top:8px;">' + t('Next →', 'Siguiente →') + '</button>'
    );

    // Delegate on the freshly-created container, not #wiz-content (persistent).
    $('#wiz-people-toggles').on('click', '.wiz-choice', function () {
      var $block = $(this).closest('.wiz-person-choice');
      $block.attr('data-attending', $(this).attr('data-choice') === 'yes' ? '1' : '0');
      styleChoice($block);
    });
    $('#wiz-next-btn').on('click', function () {
      var chosen = [];
      var undecided = false;
      $('#wiz-people-toggles .wiz-person-choice').each(function () {
        var st = $(this).attr('data-attending');
        if (st === '1') chosen.push(parseInt($(this).attr('data-idx'), 10));
        else if (st !== '0') undecided = true;
      });
      if (undecided) {
        alert(t('Please choose Attending or Not attending for everyone.',
                'Por favor elige Asiste o No asiste para cada persona.'));
        return;
      }
      answers[step.id] = chosen;
      advance(step.id);
    });
  }

  // state: '1' attending, '0' not attending, '' undecided (pill hidden).
  function personChoiceRow(idx, name, state) {
    return '<div class="wiz-person-choice" data-idx="' + idx + '" data-attending="' + state + '" style="margin-bottom:18px; max-width:' + SW_MAXW + 'px;">' +
      '<p style="font-size:16px; font-weight:600; color:#fff; margin:0 0 9px 2px;">' + $('<div>').text(name).html() + '</p>' +
      '<div class="wiz-switch" style="' + SW_TRACK + '">' +
        '<span class="wiz-switch-pill" style="' + switchPillStyle(state) + '"></span>' +
        '<button type="button" class="wiz-choice" data-choice="no" style="' + switchLabelStyle('no', state) + '">' + t('Not attending', 'No asiste') + '</button>' +
        '<button type="button" class="wiz-choice" data-choice="yes" style="' + switchLabelStyle('yes', state) + '">' + t('Attending', 'Asiste') + '</button>' +
      '</div>' +
    '</div>';
  }

  // Restyle a person's switch (pill + both labels) for its data-attending state.
  function styleChoice($block) {
    var st = $block.attr('data-attending');
    $block.find('.wiz-switch-pill').attr('style', switchPillStyle(st));
    $block.find('.wiz-choice[data-choice="no"]').attr('style', switchLabelStyle('no', st));
    $block.find('.wiz-choice[data-choice="yes"]').attr('style', switchLabelStyle('yes', st));
  }

  function renderScubaType($c) {
    var html = '<h2 style="font-size:clamp(18px,4vw,22px); margin-bottom:8px;">' +
      t('Which kind of dive?', '¿Qué tipo de buceo?') + '</h2>' +
      '<p style="font-size:15px; color:rgba(255,255,255,0.75); margin-bottom:22px;">' +
        t('Group price applies if 10+ people sign up for the same type.', 'El precio de grupo aplica si 10 o más personas se inscriben al mismo tipo.') +
      '</p>';
    SCUBA_TYPES.forEach(function (st) {
      html += '<button type="button" class="scuba-type-btn" data-val="' + st.value + '" style="display:flex; align-items:center; justify-content:space-between; width:100%; padding:16px 18px; border-radius:11px; border:2px solid rgba(255,255,255,0.3); background:rgba(0,0,0,0.25); color:#fff; font-family:Raleway,sans-serif; cursor:pointer; margin-bottom:10px; text-align:left;">' +
        '<span style="font-size:15px; font-weight:700;">' + t(st.en, st.es) + '</span>' +
        '<span style="text-align:right; font-size:13px; line-height:1.5; color:rgba(255,255,255,0.75);">' +
          st.price + '<br />' +
          '<span style="color:#afa63d;">' + t('Group: ', 'Grupo: ') + st.group + '</span>' +
        '</span>' +
      '</button>';
    });
    $c.html(html);
    $('.scuba-type-btn').on('click', function () {
      answers.scubaType = $(this).data('val');
      advance('scubaType');
    });
  }

  function renderTransport($c, step) {
    var tr = TRANSPORT[step.id];
    if (!tr) return;
    $c.html(
      '<div style="text-align:center; padding:0 4px; margin-bottom:28px;">' +
        '<div style="font-size:48px; line-height:1.1; margin-bottom:14px;">🚐</div>' +
        '<h2 style="font-size:clamp(18px,4vw,22px); margin-bottom:8px;">' + t(tr.legEn, tr.legEs) + '</h2>' +
        '<p style="font-size:14px; font-weight:700; color:#afa63d; font-family:Raleway,sans-serif; letter-spacing:0.5px; margin-bottom:12px;">' + t(tr.routeEn, tr.routeEs) + '</p>' +
        '<p style="font-size:16px; line-height:1.55; color:rgba(255,255,255,0.85); margin-bottom:0;">' + t(tr.descEn, tr.descEs) + '</p>' +
        '<p style="font-size:13px; font-family:Raleway,sans-serif; text-transform:uppercase; letter-spacing:1px; font-weight:700; color:#afa63d; margin:14px 0 0;">' + t('We\'ll keep this as cheap as we can (price to be confirmed)', 'Lo haremos lo más económico posible (precio por confirmar)') + '</p>' +
      '</div>' +
      '<button type="button" id="wiz-yes-btn" style="' + BTN_YES + '">' + t('Yes, I\'d love a lift', 'Sí, me vendría bien') + '</button>' +
      '<button type="button" id="wiz-no-btn" style="' + BTN_NO + '">' + t('No thanks, I\'ll sort my own', 'No gracias, me las arreglo') + '</button>'
    );
    $('#wiz-yes-btn').on('click', function () { answers[step.id] = 'yes'; advance(step.id); });
    $('#wiz-no-btn').on('click', function () { answers[step.id] = 'no'; advance(step.id); });
  }

  function renderReview($c) {
    var vs = visibleSteps().filter(function (s) { return s.id !== 'intro' && s.id !== 'review'; });
    var rows = '';
    vs.forEach(function (step) {
      var label = '';
      var val   = answers[step.id] || '—';
      if (step.kind === 'count') {
        return; // count is implied by the people list; don't show a separate row
      } else if (step.kind === 'people') {
        label = t('Who\'s coming?', '¿Quiénes vienen?');
        val = (answers.people || []).join(', ') || '—';
      } else if (step.kind === 'text' || step.kind === 'date') {
        var f = FIELDS[step.id];
        label = f ? t(f.en, f.es) : step.id;
        if (step.kind === 'date' && answers[step.id]) val = formatDateLocale(answers[step.id]);
      } else if (step.kind === 'activity') {
        var a = ACT[step.id];
        label = a ? t(a.en, a.es) : step.id;
        var who = attendees(step.id);
        val = who.length ? who.join(', ') : t('No one', 'Nadie');
      } else if (step.kind === 'subchoice') {
        label = t('Scuba type', 'Tipo de buceo');
        var st = SCUBA_TYPES.find(function (x) { return x.value === val; });
        if (st) val = t(st.en, st.es);
      } else if (step.kind === 'transport') {
        var tr = TRANSPORT[step.id];
        label = tr ? t(tr.legEn, tr.legEs) : step.id;
        val = val === 'yes' ? t('Yes please', 'Sí por favor') : val === 'no' ? t('No thanks', 'No gracias') : val;
      }
      rows += '<tr style="border-bottom:1px solid rgba(255,255,255,0.1);">' +
        '<td style="padding:10px 0; font-size:14px; color:rgba(255,255,255,0.65); padding-right:16px; vertical-align:top; white-space:nowrap;">' + label + '</td>' +
        '<td style="padding:10px 0; font-size:15px; font-weight:600;">' + $('<div>').text(val).html() + '</td>' +
        '</tr>';
    });
    $c.html(
      '<h2 style="font-size:22px; margin-bottom:4px;">' + t('Looking good!', '¡Todo listo!') + '</h2>' +
      '<p style="font-size:15px; color:rgba(255,255,255,0.75); margin-bottom:20px;">' +
        t('Check your answers and hit submit when you\'re ready.', 'Revisa tus respuestas y envía cuando estés listo.') +
      '</p>' +
      '<table style="width:100%; border-collapse:collapse; margin-bottom:24px;">' + rows + '</table>' +
      '<button type="button" id="wiz-submit-btn" style="' + BTN_YES + '">' +
        t('Submit →', 'Enviar →') +
      '</button>' +
      '<p id="wiz-submit-error" style="display:none; color:#ff9f9f; font-size:14px; margin-top:12px;"></p>'
    );
    $('#wiz-submit-btn').on('click', submitForm);
  }

  // ── Navigation ────────────────────────────────────────────────────────────────
  function advance(fromId) {
    var vs = visibleSteps();
    var idx = -1;
    for (var i = 0; i < vs.length; i++) { if (vs[i].id === fromId) { idx = i; break; } }
    if (idx < 0 || idx >= vs.length - 1) return;
    var next = vs[idx + 1].id;
    history.push(next);
    renderStep(next);
    scrollToTop();
  }

  function goBack() {
    if (history.length <= 1) return;
    history.pop();
    renderStep(currentStep());
    scrollToTop();
  }

  function scrollToTop() {
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  // ── Submission ────────────────────────────────────────────────────────────────
  function submitForm() {
    var $btn = $('#wiz-submit-btn');
    var $err = $('#wiz-submit-error');
    $btn.prop('disabled', true).text(t('Submitting…', 'Enviando…'));
    $err.hide();

    // Build a flat payload matching the existing FormEasy columns. Per-person
    // activity choices collapse to a comma-separated list of attending names
    // (empty when no one is going); names holds the full party list.
    var payload = $.extend({}, answers);
    payload.names = (answers.people || []).join(', ');
    ACTIVITY_IDS.forEach(function (id) { payload[id] = attendees(id).join(', '); });
    // Internal-only state — not FormEasy columns.
    delete payload.people;
    delete payload.peopleCount;
    // scubaType is only asked when someone is doing scuba. FormEasy rejects
    // submissions that omit a configured field, so always send it (blank when
    // not asked).
    if (payload.scubaType === undefined) payload.scubaType = '';
    // arrival is already stored as ISO YYYY-MM-DD — unambiguous for the backend,
    // regardless of the viewer's locale.

    function doSubmit(token) {
      if (token) payload.gCaptchaResponse = token;

      // No endpoint configured — show thanks immediately
      if (!ACTIVITIES_ENDPOINT) {
        showThanks();
        return;
      }

      fetch(ACTIVITIES_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          // FormEasy replies { status: 'OK', message: 'Data logged successfully' } on
          // success, or an error object otherwise. Treat a success status as success and
          // surface the real reason for anything else.
          if (data && (data.status === 'OK' || data.result === 'success')) {
            showThanks();
            return;
          }
          var serverMsg = data && (data.error || data.message);
          console.error('Activities form rejected by server:', data);
          $btn.prop('disabled', false).text(t('Submit →', 'Enviar →'));
          $err.text(serverMsg || t('Something went wrong — please try again.', 'Algo salió mal — por favor intenta de nuevo.')).show();
        })
        .catch(function (err) {
          console.error('Activities form submission error:', err);
          $btn.prop('disabled', false).text(t('Submit →', 'Enviar →'));
          $err.text(t('Something went wrong — please try again.', 'Algo salió mal — por favor intenta de nuevo.')).show();
        });
    }

    if (typeof grecaptcha !== 'undefined' && ACTIVITIES_ENDPOINT) {
      grecaptcha.ready(function () {
        grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit' })
          .then(doSubmit)
          .catch(function () { doSubmit(null); });
      });
    } else {
      doSubmit(null);
    }
  }

  function showThanks() {
    $('#activities-wizard').hide();
    $('#activities-thanks').show();
    scrollToTop();
  }

  // ── Boot ──────────────────────────────────────────────────────────────────────
  $('#wiz-back-btn').on('click', goBack);
  renderStep('intro');

  // Re-render the current step when the site language is toggled so that
  // dynamically-injected text switches immediately (no .label-en/.label-es here).
  $('#langSlider').on('input change', function () {
    var sid = currentStep();
    // Preserve any partially-typed input before wiping the DOM.
    var $field = $('#wiz-field');
    if ($field.length) { answers[sid] = $field.val(); }
    if (sid === 'peopleCount' && $('#wiz-count').length) {
      var n = parseInt($('#wiz-count').val(), 10);
      if (!isNaN(n) && n >= 1) answers.peopleCount = n;
    }
    if (sid === 'people' && $('#wiz-people-rows').length) {
      answers.people = collectPeople();
    }
    // Activity selections only persist to `answers` on Next. Capture the current
    // three-state per-person choices (including undecided) into a transient draft
    // so re-rendering after the language switch restores them exactly.
    if ($('#wiz-people-toggles .wiz-person-choice').length) {
      var states = [];
      $('#wiz-people-toggles .wiz-person-choice').each(function () {
        states[parseInt($(this).attr('data-idx'), 10)] = $(this).attr('data-attending') || '';
      });
      activityDraft = { id: sid, states: states };
    }
    renderStep(sid);
  });

}(jQuery));
