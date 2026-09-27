const STORAGE_KEYS = {
  players: "impostor-players-v1",
  settings: "impostor-settings-v1",
  round: "impostor-round-v1",
  shared: "impostor-shared-state-v1",
  theme: "impostor-theme-v1",
};

const defaultSettings = {
  impostorCount: 1,
  jesterCount: 0,
  detectiveCount: 0,
  itemsPerDetective: 1,
  doppelgangerCount: 0,
  difficulty: "random",
  jesterProbability: 25,
  detectiveProbability: 25,
  doppelgangerProbability: 0,
  jesterRandomEnabled: false,
  detectiveRandomEnabled: false,
  doppelgangerRandomEnabled: false,
};

const detectiveDefaultMessage = "Extrawort: Käse";

const detectiveItems = [
  { name: "🔫 Instant Vote", description: "Der DT kann jederzeit einen Spieler sofort aus dem Spiel entfernen.", minPlayers: 0 },
  { name: "❤️ Wiederbelebung", description: "Der DT kann einen ausgespielten Spieler wieder zurückholen.", minPlayers: 0 },
  { name: "🚫 Extra-Wort", description: "Der DT bestimmt ein zusätzliches verbotenes Wort.", minPlayers: 0 },
  { name: "🛡️ Immunität", description: "Der DT schützt einen Spieler für mehrere Runden.", minPlayers: 0 },
  { name: "🔄 Rollenwechsel", description: "Der DT darf die Sitzordnung frei verändern.", minPlayers: 0 },
  { name: "⏭️ Skip", description: "Der DT kann einen Hinweis überspringen lassen.", minPlayers: 0 },
  { name: "⚖️ Zwangsvote", description: "Der DT erzwingt sofort eine Abstimmung.", minPlayers: 0 },
  { name: "❌ Veto", description: "Der DT kann eine Abstimmung aufheben.", minPlayers: 0 },
  { name: "⚡ Fast Forward", description: "Jeder muss pro Runde zwei Hinweise geben.", minPlayers: 0 },
  { name: "🔫 Goldene Pistole", description: "Der DT trifft einen Impostor direkt. Kein Impostor = Schütze scheidet aus.", minPlayers: 8 },
];

const rulesHtml = `
  <h1>IMPOSTOR</h1>
  <h3>Das Partyspiel um Bluff, Misstrauen und Chaos</h3>

  <h2>1. Spielidee</h2>
  <p>Bei <strong>IMPOSTOR</strong> kennen die meisten Spieler ein geheimes Wort. Sie müssen es beschreiben, ohne das Wort selbst zu nennen oder zu offensichtlich zu verraten.</p>
  <p>Doch nicht jeder kennt das Wort:</p>
  <ul>
    <li>Die <strong>Impostoren</strong> kennen das Wort nicht und müssen es anhand von Hinweisen herausfinden.</li>
    <li>Der <strong>Jester</strong> kennt das Wort und möchte absichtlich aus dem Spiel fliegen.</li>
    <li>Der <strong>Doppelgänger</strong> verfolgt kein eigenes Teamziel, sondern gewinnt mit der Partei, die das Spiel gewinnt – solange er selbst nicht eliminiert wurde.</li>
    <li>Der <strong>Detektiv</strong> kennt das Wort und ist eine öffentlich bekannte Sonderrolle.</li>
  </ul>
  <p>Durch Beschreibungen, Diskussionen, Lügen, Anschuldigungen und Abstimmungen versuchen die Spieler herauszufinden, wem sie vertrauen können.</p>
  <p><strong>Bluffen und Lügen sind ausdrücklich Teil des Spiels.</strong></p>

  <h2>2. Rollen</h2>

  <h3>Normale Spieler</h3>
  <p>Normale Spieler:</p>
  <ul>
    <li>kennen das geheime Wort,</li>
    <li>beschreiben es nach den geltenden Regeln,</li>
    <li>dürfen lügen und bluffen,</li>
    <li>dürfen andere beschuldigen,</li>
    <li>dürfen behaupten, eine andere Rolle zu besitzen,</li>
    <li>gewinnen, wenn die Impostoren ausscheiden und ihre letzte Chance scheitert.</li>
  </ul>

  <h3>Impostor</h3>
  <p>Der Impostor kennt das geheime Wort <strong>nicht</strong>.</p>
  <p>Stattdessen erhält er Hinweise, mit denen er versuchen muss, das Wort herauszufinden.</p>

  <h4>Mehrere Impostoren</h4>
  <p>Wenn mehrere Impostoren im Spiel sind:</p>
  <ul>
    <li>kennen sie sich gegenseitig,</li>
    <li>sehen alle exakt dieselben Hinweiswörter,</li>
    <li>erhalten sie so viele Hinweiswörter wie Impostoren im Spiel sind.</li>
  </ul>
  <p>Impostoren dürfen sich <strong>offen</strong> miteinander absprechen.</p>
  <p>Verboten ist lediglich geheime Kommunikation, beispielsweise:</p>
  <ul>
    <li>private Nachrichten,</li>
    <li>heimliche Chats,</li>
    <li>Nachrichten über Discord,</li>
    <li>andere nicht für alle sichtbare Kommunikation.</li>
  </ul>
  <p>Offene Gespräche, Blicke, Gesten, Winken oder gegenseitige Absprachen am Tisch sind erlaubt.</p>
  <p>Ein Impostor darf sogar einen anderen Impostor beschuldigen oder gegen ihn stimmen.</p>

  <h4>Das Wort erraten</h4>
  <p>Ein Impostor darf jederzeit versuchen, das geheime Wort zu erraten.</p>
  <p>Das ist nicht an seinen eigenen Zug gebunden und darf auch während einer Diskussion oder als Unterbrechung erfolgen.</p>
  <p>Sobald ein Impostor das exakte Wort oder eine grammatikalisch zulässige Variante davon als <strong>Rateversuch</strong> nennt, gilt das Wort als erraten.</p>
  <ul>
    <li><strong>Treffer:</strong> Die Impostoren gewinnen sofort.</li>
    <li><strong>Falscher Versuch:</strong> Der Impostor bleibt im Spiel, darf aber nicht einfach aufgrund desselben Versuchs erneut raten.</li>
  </ul>

  <h4>Versehentliches Nennen des Wortes</h4>
  <p>Nennt ein Impostor das geheime Wort während seiner Beschreibung versehentlich selbst, zählt dies ebenfalls als erfolgreicher Rateversuch.</p>
  <p>Die Absicht spielt dabei keine Rolle.</p>

  <h3>Jester</h3>
  <p>Der Jester kennt das geheime Wort.</p>
  <p>Er möchte jedoch <strong>eliminiert werden</strong>.</p>
  <p>Der Jester gewinnt sofort, sobald er aus dem Spiel entfernt wird – unabhängig davon, wodurch dies geschieht.</p>
  <p>Das gilt beispielsweise bei:</p>
  <ul>
    <li>einer Abstimmung,</li>
    <li>einem Detektiv-Item,</li>
    <li>einem anderen Spieleffekt.</li>
  </ul>

  <h4>Informationen des Jesters</h4>
  <p>Der Jester kennt:</p>
  <ul>
    <li>das geheime Wort,</li>
    <li>die Anzahl der Impostoren,</li>
    <li>die Anzahl der Jester,</li>
    <li>ob Doppelgänger im Spiel sind,</li>
    <li>wer der Detektiv ist.</li>
  </ul>
  <p>Er kennt jedoch <strong>nicht die anderen Jester</strong>.</p>
  <p>Auch wenn mehrere Jester gleichzeitig im Spiel sind, wissen sie nicht voneinander.</p>

  <h4>Jester und Beschreibungen</h4>
  <p>Der Jester ist von fast allen normalen Beschreibungsregeln befreit.</p>
  <p>Er darf beispielsweise:</p>
  <ul>
    <li>mehr als drei Wörter benutzen,</li>
    <li>einen vollständigen Satz sagen,</li>
    <li>bewusst eine ungewöhnliche Beschreibung verwenden,</li>
    <li>andere Spieler provozieren,</li>
    <li>absichtlich verdächtig wirken.</li>
  </ul>
  <p>Das ist regelkonform.</p>
  <p>Allerdings ist es möglicherweise keine besonders clevere Strategie, offen gegen die Beschreibungsregeln zu verstoßen, da dies seine Rolle verraten kann.</p>
  <p>Die allgemeine Regel gegen das direkte Nennen bzw. Verwenden des Zielwortes oder seiner Wortbestandteile bleibt bestehen.</p>

  <h3>Doppelgänger</h3>
  <p>Der Doppelgänger ist eine eigenständige geheime Rolle.</p>
  <p>Er ist:</p>
  <ul>
    <li>kein normaler Spieler,</li>
    <li>kein Impostor,</li>
    <li>kein Jester.</li>
  </ul>
  <p>Der Doppelgänger kennt ausschließlich seine eigene Rolle.</p>
  <p>Er kennt <strong>nicht</strong>:</p>
  <ul>
    <li>das geheime Wort,</li>
    <li>die Impostoren,</li>
    <li>die Impostor-Hinweise,</li>
    <li>den Detektiv,</li>
    <li>andere Doppelgänger.</li>
  </ul>
  <p>Wenn mehrere Doppelgänger im Spiel sind, wissen sie nicht voneinander.</p>

  <h4>Ziel des Doppelgängers</h4>
  <p>Der Doppelgänger gewinnt mit der Partei, die das Spiel gewinnt.</p>
  <p>Das kann sein:</p>
  <ul>
    <li>die normalen Spieler,</li>
    <li>die Impostoren,</li>
    <li>der Jester.</li>
  </ul>
  <p>Die einzige Voraussetzung:</p>
  <p><strong>Der Doppelgänger darf selbst nicht eliminiert worden sein.</strong></p>
  <p>Wird er vor dem Spielende herausgewählt oder anderweitig entfernt, verliert er unabhängig davon, wer anschließend gewinnt.</p>
  <p>Der Doppelgänger muss niemals öffentlich erklären, zu welcher Seite er gehört oder wen er unterstützt.</p>

  <h3>Detektiv</h3>
  <p>Der Detektiv ist eine <strong>öffentliche Rolle</strong>.</p>
  <p>Alle Spieler wissen, wer der Detektiv ist.</p>
  <p>Der Detektiv:</p>
  <ul>
    <li>kennt das geheime Wort,</li>
    <li>kennt die Anzahl der Impostoren,</li>
    <li>kennt die Anzahl der Jester,</li>
    <li>weiß, ob Doppelgänger im Spiel sind,</li>
    <li>kennt seine eigene Rolle.</li>
  </ul>
  <p>Er beschreibt das Wort grundsätzlich wie ein normaler Spieler.</p>

  <h4>Abstimmungen</h4>
  <p>Der Detektiv ist grundsätzlich <strong>nicht stimmberechtigt</strong>.</p>
  <p>Er kann jedoch durch ein entsprechendes Detektiv-Item vorübergehend oder auf andere Weise eine Abstimmung auslösen bzw. daran teilnehmen, sofern dies in der Beschreibung des jeweiligen Items vorgesehen ist.</p>
  <p>Der Detektiv kann selbst herausgewählt werden.</p>

  <h2>3. Detektiv-Items</h2>
  <p>Der Detektiv erhält eine Auswahl verschiedener Items.</p>
  <p>Alle Spieler wissen:</p>
  <ul>
    <li>welche Items grundsätzlich verfügbar sind,</li>
    <li>wie viele Items zur Auswahl stehen,</li>
    <li>wie viele davon der Detektiv verwenden kann.</li>
  </ul>
  <p>Die konkreten verfügbaren Items und die Anzahl der Items, die der Detektiv verwenden kann, werden öffentlich bekannt gegeben. Dadurch weiß jeder, welche Möglichkeiten dem Detektiv zur Verfügung hat.</p>
  <p>Der Detektiv kann selbst entscheiden, wann er ein Item verwendet.</p>
  <p>Er darf sich auch von anderen Spielern beraten lassen.</p>

  <h3>Einmalige Verwendung</h3>
  <p>Ein verwendetes Item ist verbraucht.</p>

  <h3>Übertragbare Items</h3>
  <p>Bestimmte Items können an andere Spieler weitergegeben werden.</p>
  <p>Beispiel: <strong>Goldene Pistole</strong></p>
  <p>Der Detektiv kann sie einem anderen Spieler geben.</p>
  <p>Danach kann der Detektiv das Item <strong>nicht zurückfordern</strong>.</p>
  <p>Der Spieler, der das Item besitzt, entscheidet selbst, was er damit macht.</p>
  <p>Er darf:</p>
  <ul>
    <li>das Item wie vorher besprochen einsetzen,</li>
    <li>etwas anderes behaupten und etwas anderes tun,</li>
    <li>darüber lügen,</li>
    <li>es für einen anderen Zweck einsetzen, sofern die Item-Regeln dies erlauben,</li>
    <li>es an einen weiteren Spieler weitergeben,</li>
    <li>es behalten.</li>
  </ul>
  <p>Ein Spieler könnte beispielsweise behaupten: „Ich benutze die Goldene Pistole gegen B." und sie anschließend trotzdem gegen jemand anderen einsetzen.</p>
  <p>Auch ein Jester darf ein übertragenes Item besitzen und entsprechend seiner eigenen Strategie einsetzen.</p>

  <h3>Detektiv wird eliminiert</h3>
  <p>Wird der Detektiv eliminiert, wird ein Detektiv-Item, das sich zu diesem Zeitpunkt noch beim Detektiv befindet, deaktiviert, sofern es über das gesamte Spiel hinweg aktiv war.</p>
  <p>Bereits an andere Spieler übertragene Items verfallen nicht und bleiben weiterhin aktiv. Sie können entsprechend ihrer jeweiligen Item-Regeln genutzt werden.</p>

  <h2>4. Beschreibungen</h2>
  <p>In jeder Runde sagt jeder lebende Spieler einmal etwas zum geheimen Wort.</p>

  <h3>Normale Beschreibung</h3>
  <p>Eine Beschreibung besteht grundsätzlich aus <strong>einem Wort</strong>.</p>
  <p>Es sind bis zu <strong>drei Wörter</strong> erlaubt, wenn diese zusammen eine sinnvolle kurze Wortgruppe oder Aussage bilden.</p>
  <p>Die Beschreibung muss einen nachvollziehbaren Bezug zum geheimen Wort besitzen.</p>
  <p>Der Zusammenhang darf auch indirekt oder assoziativ sein.</p>

  <h3>Verbotene Beschreibungen</h3>
  <p>Nicht erlaubt sind:</p>
  <ul>
    <li>das geheime Wort selbst,</li>
    <li>Bestandteile des geheimen Wortes,</li>
    <li>Teile bzw. Wortstämme des Zielwortes,</li>
    <li>zusammengesetzte Wörter, die einen verbotenen Bestandteil enthalten,</li>
    <li>Übersetzungen des Zielwortes,</li>
    <li>einzelne Buchstaben oder Silben als Hinweis,</li>
    <li>Aussagen wie „Der erste Teil des Wortes ist …",</li>
    <li>allgemein anerkannte Synonyme oder alternative Bezeichnungen,</li>
    <li>grammatikalische Varianten des Zielwortes.</li>
  </ul>
  <p>Beispielsweise darf eine Beschreibung nicht dadurch zulässig gemacht werden, dass lediglich Singular und Plural oder eine andere grammatikalische Form verwendet wird.</p>

  <h3>Fair Play</h3>
  <p>Auch wenn ein bestimmtes verbotenes Wort theoretisch so unbekannt ist, dass andere Spieler es nicht erkennen würden, soll es nicht absichtlich als Schlupfloch verwendet werden.</p>
  <p>Das Spiel lebt davon, dass die Spieler versuchen, <strong>clever zu beschreiben, ohne die Regeln auszutricksen</strong>.</p>

  <h2>5. Bluffen und Lügen</h2>
  <p>IMPOSTOR ist ausdrücklich ein Spiel mit Täuschung.</p>
  <p>Spieler dürfen über ihre Informationen lügen.</p>
  <p>Sie dürfen beispielsweise behaupten:</p>
  <ul>
    <li>„Ich bin der Detektiv."</li>
    <li>„Ich kenne das Wort."</li>
    <li>„Ich bin Impostor."</li>
    <li>„B ist definitiv der Impostor."</li>
    <li>„Ich habe gerade Item X benutzt."</li>
  </ul>
  <p>Ob eine solche Aussage wahr ist, bleibt jedem selbst überlassen.</p>

  <h3>Technische Informationen</h3>
  <p>Nicht erlaubt ist es, Informationen zu verwenden, die ein Spieler ausschließlich durch einen Blick hinter die technische Umsetzung des Spiels erhalten kann.</p>
  <p>Informationen aus:</p>
  <ul>
    <li>Quellcode,</li>
    <li>internen Spieldaten,</li>
    <li>technischen Debug-Informationen,</li>
    <li>anderen nicht für das Spiel vorgesehenen technischen Quellen</li>
  </ul>
  <p>dürfen nicht zum eigenen Vorteil verwendet oder anderen Spielern zugänglich gemacht werden.</p>

  <h2>6. Rundenablauf</h2>
  <p>Die erste Runde beginnt bei einem beliebigen Spieler.</p>
  <p>Die Gruppe kann beispielsweise festlegen, wer anfangen möchte.</p>
  <p>Danach geht es der Reihe nach weiter.</p>
  <p>Beispiel:</p>
  <p><strong>A → B → C → D → A → B …</strong></p>
  <p>Wird B eliminiert, wird daraus:</p>
  <p><strong>A → C → D → A → C …</strong></p>
  <p>Jeder lebende Spieler ist einmal pro Runde an der Reihe.</p>
  <p>Eine Runde endet, sobald alle noch lebenden Spieler einmal an der Reihe waren.</p>
  <p>Diskussionen dürfen jederzeit stattfinden.</p>
  <p>Es gibt keine vorgeschriebene Diskussionsphase.</p>

  <h2>7. Abstimmungen</h2>
  <p>Eine Abstimmung kann von <strong>jedem stimmberechtigten Spieler jederzeit</strong> ausgelöst werden.</p>
  <p>Der Spieler, der die Abstimmung startet, kann seine Anschuldigung erklären.</p>
  <p>Danach darf die Gruppe diskutieren.</p>
  <p>Die beschuldigte Person erhält die Möglichkeit, sich kurz zu verteidigen.</p>
  <p>Anschließend wird offen abgestimmt.</p>

  <h3>Stimmberechtigt</h3>
  <p>Stimmberechtigt sind grundsätzlich:</p>
  <ul>
    <li>normale Spieler,</li>
    <li>Impostoren,</li>
    <li>Jester,</li>
    <li>Doppelgänger.</li>
  </ul>
  <p>Der Detektiv ist grundsätzlich nicht stimmberechtigt.</p>

  <h3>Echte Mehrheit</h3>
  <p>Eine Person wird nur eliminiert, wenn sie <strong>mehr als 50 % der gesamten Stimmberechtigten</strong> auf sich vereint.</p>
  <p>Es reicht also nicht, genau die Hälfte der Stimmen zu bekommen.</p>
  <p>Beispiel:</p>
  <p>Bei 4 Stimmberechtigten reichen 2 Stimmen <strong>nicht</strong>.</p>
  <p>Es werden mindestens 3 Stimmen benötigt.</p>

  <h3>Keine Mehrheit</h3>
  <p>Erreicht niemand eine echte Mehrheit, wird niemand eliminiert.</p>
  <p>Das Spiel läuft anschließend normal weiter.</p>
  <p>Es gibt keinen automatischen Wiederholungszwang.</p>

  <h2>8. Sonderregel: Drei erfolglose Abstimmungen</h2>
  <p>Um zu verhindern, dass eine Gruppe das Spiel durch endlose Pattsituationen blockiert, gilt:</p>
  <p><strong>Sobald mindestens 4 Spieler leben und drei Abstimmungen hintereinander erfolglos geblieben sind, muss anschließend ein Spieler ausscheiden.</strong></p>
  <p>Eine Abstimmung gilt als erfolglos, wenn niemand eine echte Mehrheit von mehr als 50 % der Stimmberechtigten erreicht.</p>

  <h3>Wer muss gehen?</h3>
  <p>Wenn sich die Spieler nach der dritten erfolglosen Abstimmung <strong>nicht darauf einigen können, wer ausscheidet</strong>, wird derjenige eliminiert, der die <strong>erste der drei erfolglosen Abstimmungen gestartet hat</strong>.</p>
  <p>Damit kann eine Gruppe das Spiel nicht unbegrenzt durch Uneinigkeit am Leben halten.</p>

  <h2>9. Ausscheiden</h2>
  <p>Wird ein Spieler eliminiert, wird seine tatsächliche Rolle aufgedeckt.</p>
  <p>Bis zu diesem Zeitpunkt darf der Spieler gelogen haben.</p>
  <p>Nach der Aufdeckung ist seine tatsächliche Rolle bekannt.</p>

  <h3>Ausgeschiedener Impostor</h3>
  <p>Wird ein Impostor durch eine Abstimmung eliminiert, erhält er <strong>genau einen letzten Rateversuch</strong>.</p>
  <p>Er darf das geheime Wort nennen.</p>
  <ul>
    <li><strong>Richtig:</strong> Das gesamte Impostor-Team gewinnt sofort.</li>
    <li><strong>Falsch:</strong> Der Impostor ist endgültig ausgeschieden.</li>
  </ul>
  <p>Es gibt keinen zweiten Versuch.</p>
  <p>Bleibt nach einem falschen letzten Rateversuch kein lebender Impostor mehr übrig, gewinnen die normalen Spieler.</p>
  <p>Bleibt mindestens ein anderer Impostor am Leben, wird weitergespielt.</p>

  <h3>Ausgeschiedener Jester</h3>
  <p>Wird der Jester eliminiert, gewinnt er sofort.</p>

  <h3>Ausgeschiedener Doppelgänger</h3>
  <p>Wird der Doppelgänger eliminiert, verliert er.</p>
  <p>Das Spiel selbst läuft entsprechend der normalen Siegbedingungen weiter.</p>

  <h3>Ausgeschiedener Detektiv</h3>
  <p>Der Detektiv verliert und scheidet aus.</p>
  <p>Ein Detektiv-Item, das sich zu diesem Zeitpunkt noch beim Detektiv befindet, wird deaktiviert, sofern es über das gesamte Spiel hinweg aktiv war.</p>
  <p>Bereits weitergegebene Items verfallen nicht und bleiben erhalten.</p>

  <h2>10. Die Impostor-Mehrheitsregel</h2>
  <p>Das Spiel endet für die Impostoren, sobald eine Abstimmung gegen sie faktisch nicht mehr sinnvoll möglich ist.</p>
  <p>Dafür wird die Anzahl der lebenden Impostoren mit den <strong>relevanten lebenden Gegenspielern</strong> verglichen.</p>
  <p>Die Impostoren gewinnen sofort, wenn:</p>
  <p><strong>Anzahl lebender Impostoren ≥ Anzahl relevanter lebender Gegenspieler</strong></p>

  <h3>Wer zählt als Gegenspieler?</h3>
  <p>Grundsätzlich zählen:</p>
  <ul>
    <li>normale Spieler,</li>
    <li>Jester,</li>
    <li>Doppelgänger.</li>
  </ul>
  <p>Der Detektiv zählt <strong>niemals</strong> für diese Berechnung.</p>

  <h3>Sonderregel für den Jester</h3>
  <p>Solange <strong>mindestens 4 Spieler leben</strong>, zählt der Jester als Gegenspieler.</p>
  <p>Sobald <strong>weniger als 4 Spieler leben</strong>, zählt der Jester nicht mehr für diese Berechnung.</p>
  <p>Der Doppelgänger zählt dagegen <strong>immer</strong>, unabhängig davon, wie viele Spieler noch leben.</p>

  <h3>Beispiel 1</h3>
  <p><strong>1 Impostor + 1 normaler Spieler + 1 Jester</strong></p>
  <p>Es leben nur 3 Spieler.</p>
  <p>Der Jester zählt deshalb nicht mehr.</p>
  <p>Damit stehen:</p>
  <p><strong>1 Impostor : 1 relevanter Gegenspieler</strong></p>
  <p>Die Impostoren gewinnen.</p>

  <h3>Beispiel 2</h3>
  <p><strong>1 Impostor + 1 normaler Spieler + 1 Doppelgänger</strong></p>
  <p>Der Doppelgänger zählt auch bei nur 3 Spielern.</p>
  <p>Damit stehen:</p>
  <p><strong>1 Impostor : 2 relevante Gegenspieler</strong></p>
  <p>Das Spiel geht weiter.</p>
  <p>Der Doppelgänger muss dabei nicht erklären, auf wessen Seite er steht.</p>

  <h2>11. Siegbedingungen</h2>

  <h3>Normale Spieler</h3>
  <p>Die normalen Spieler gewinnen, wenn:</p>
  <ul>
    <li>kein Impostor mehr lebt,</li>
    <li>und ein ausgeschiedener letzter Impostor seinen finalen Rateversuch falsch abgegeben hat.</li>
  </ul>
  <p>Der Jester gewinnt nicht automatisch mit den normalen Spielern, solange er noch lebt.</p>

  <h3>Impostoren</h3>
  <p>Die Impostoren gewinnen, wenn:</p>
  <ol>
    <li>ein Impostor das geheime Wort korrekt errät,</li>
    <li>ein ausgeschiedener Impostor seinen letzten Rateversuch korrekt abgibt,</li>
    <li>die Impostor-Mehrheitsregel erreicht wird.</li>
  </ol>
  <p>Alle Impostoren gewinnen gemeinsam.</p>
  <p>Das gilt auch für bereits ausgeschiedene Impostoren, wenn ein noch gültiger finaler Rateversuch ihres Teams erfolgreich ist.</p>

  <h3>Jester</h3>
  <p>Der Jester gewinnt, sobald er eliminiert wird.</p>
  <p>Das Spiel endet in diesem Moment.</p>

  <h3>Doppelgänger</h3>
  <p>Der Doppelgänger gewinnt mit der Partei, die das Spiel gewinnt, <strong>solange er selbst nicht eliminiert wurde</strong>.</p>
  <p>Er kann daher gemeinsam mit:</p>
  <ul>
    <li>den normalen Spielern,</li>
    <li>den Impostoren,</li>
    <li>oder dem Jester</li>
  </ul>
  <p>gewinnen.</p>

  <h2>12. Rollenverteilung</h2>
  <p>Die genaue Rollenverteilung kann an die Größe der Gruppe angepasst werden.</p>
  <p>Mehrere Sonderrollen können gleichzeitig vorhanden sein, sofern die Spielerzahl dies sinnvoll zulässt.</p>
  <p>Mehrere Jester oder mehrere Doppelgänger sind möglich.</p>
  <p>Mehrere Doppelgänger kennen sich nicht.</p>
  <p>Bei einer zufälligen Zusammenstellung kann es vorkommen, dass eine Runde ungewöhnlich viele oder ungünstig kombinierte Sonderrollen enthält.</p>
  <p>Wenn eine Kombination offensichtlich nicht sinnvoll oder gewünscht ist, kann die Rollenverteilung neu ausgelost werden.</p>

  <h2>13. Grundprinzip des Spiels</h2>
  <p>IMPOSTOR funktioniert am besten, wenn die Spieler ihre Informationen nicht nur logisch, sondern auch sozial bewerten.</p>
  <p>Ein Spieler darf:</p>
  <ul>
    <li>überzeugend lügen,</li>
    <li>völlig falsche Anschuldigungen machen,</li>
    <li>sich absichtlich verdächtig verhalten,</li>
    <li>andere Spieler gegeneinander ausspielen,</li>
    <li>einen Mitspieler verteidigen,</li>
    <li>einen Verbündeten beschuldigen,</li>
    <li>sich als eine andere Rolle ausgeben,</li>
    <li>oder bewusst Chaos verursachen.</li>
  </ul>
  <p>Solange die Regeln eingehalten werden, ist <strong>Täuschung kein Regelbruch, sondern Teil des Spiels</strong>.</p>
  <p>Das Ziel ist nicht, möglichst ordentlich zu spielen.</p>
  <p>Das Ziel ist, die anderen davon zu überzeugen, dass <strong>du recht hast</strong>.</p>
`;


const state = {
  lobbyCode: null,
  currentPlayerId: sessionStorage.getItem("impostor-player-id") || null,
  hostId: null,
  isHost: false,
  players: [],
  settings: { ...defaultSettings },
  round: null,
  wordDeck: [],
  wordDeckByDifficulty: {
    easy: [],
    medium: [],
    hard: [],
    veryHard: [],
  },
  detectiveMessage: "",
  statusMessage: "",
  lobbyPollTimer: null,
  supabaseUserId: null,
  rolePayload: null,
  syncedRoundId: null,
  roundIdFromServer: null,
  currentScreen: "login",
  previousScreen: null,
  screenDirection: "forward",
};

let supabaseClient = null;
let subscriptionChannel = null;
let supabaseReady = false;

document.addEventListener("DOMContentLoaded", async () => {
  initializeTheme();
  bindEvents();
  await loadWords();
  if (!state.currentPlayerId) {
    if (!window.SUPABASE_CONFIG || !window.SUPABASE_CONFIG.url) {
      // Lokaler Modus: frischer Start ohne Multiplayer-Reste.
      localStorage.removeItem(STORAGE_KEYS.shared);
      localStorage.removeItem(STORAGE_KEYS.players);
      localStorage.removeItem(STORAGE_KEYS.round);
      state.lobbyCode = null;
      state.players = [];
      state.round = null;
    } else {
      // Supabase-Modus: Identität kommt aus der Auth-Session (Restore der Lobby bleibt erhalten).
      localStorage.removeItem(STORAGE_KEYS.round);
      state.round = null;
    }
  }
  hydrateSharedState();
  hydrateSettings();
  hydratePlayers();
  hydrateRound();
  syncFromStorage();
  supabaseReady = await initSupabase();
  if (supabaseReady) {
    state.currentPlayerId = state.supabaseUserId;
    saveIdentity(state.supabaseUserId);
    state.round = null;
    localStorage.removeItem(STORAGE_KEYS.round);
  }
  
  // Try to rejoin lobby on reload instead of deleting the player.
  // The player only leaves via the explicit "Leave Lobby" button.
  if (supabaseReady && state.lobbyCode) {
    try {
      const lobby = await loadLobby(state.lobbyCode);
      if (lobby) {
        state.players = lobby.players;
        state.settings = lobby.settings;
        state.hostId = lobby.hostId;
        state.isHost = state.hostId === state.currentPlayerId;
        state.round = lobby.round;
        state.roundIdFromServer = lobby.roundId;
        if (lobby.roundId) await loadOwnRolePayload(lobby.roundId);
        await loadLatestDetectiveMessage();
        // Ensure we're still in lobby_players (re-insert on reload)
        try {
          await supabaseClient
            .from("lobby_players")
            .upsert({
              lobby_code: state.lobbyCode,
              player_id: state.currentPlayerId,
              name: state.players.find(p => p.id === state.currentPlayerId)?.name || "Spieler",
            }, { onConflict: "lobby_code,player_id" });
        } catch (e) {
          console.warn("Could not re-join lobby on reload:", e);
          state.lobbyCode = null;
          state.players = [];
          state.hostId = null;
          state.isHost = false;
          state.roundIdFromServer = null;
          state.rolePayload = null;
          localStorage.removeItem(STORAGE_KEYS.shared);
        }
        if (state.lobbyCode) {
          subscribeToLobby();
          
          // Navigate to appropriate screen
          if (state.roundIdFromServer && state.rolePayload) {
            state.currentScreen = "game";
          } else if (state.roundIdFromServer) {
            state.currentScreen = "role-loading";
          } else {
            state.currentScreen = "lobby";
          }
        }
      } else {
        // Lobby no longer exists
        state.lobbyCode = null;
        state.players = [];
        state.hostId = null;
        state.isHost = false;
        state.roundIdFromServer = null;
        state.rolePayload = null;
        localStorage.removeItem(STORAGE_KEYS.shared);
      }
    } catch (error) {
      console.warn("Could not restore lobby on reload:", error.message);
      state.lobbyCode = null;
      state.players = [];
      state.hostId = null;
      state.isHost = false;
      state.roundIdFromServer = null;
      state.rolePayload = null;
      localStorage.removeItem(STORAGE_KEYS.shared);
    }
  }
  render();
});

window.addEventListener("storage", (event) => {
  if (!event.key || event.key !== STORAGE_KEYS.shared) return;
  if (!event.newValue) return;

  try {
    const incoming = JSON.parse(event.newValue);
    if (!incoming) return;

    if (incoming.lobbyCode) state.lobbyCode = incoming.lobbyCode;
    if (incoming.hostId) state.hostId = incoming.hostId;
    if (Array.isArray(incoming.players) && (!supabaseReady || !state.lobbyCode)) state.players = incoming.players;
    if (incoming.settings) state.settings = { ...defaultSettings, ...incoming.settings };
    if (incoming.round && !(supabaseReady && state.lobbyCode)) state.round = incoming.round;
    render();
  } catch (error) {
    console.warn("Shared state sync failed:", error);
  }
});

// ============ SCREEN NAVIGATION ============
function navigateToScreen(screenName, direction = "forward") {
  const validScreens = ["login", "lobby", "role-loading", "game"];
  if (!validScreens.includes(screenName)) return;
  
  state.previousScreen = state.currentScreen;
  state.screenDirection = direction;
  state.currentScreen = screenName;
  renderScreens();
}

// ============ PLAYER AVATAR GENERATOR ============
function generatePlayerAvatar(playerId) {
  const colors = ["#8b5cf6", "#22d3ee", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];
  const colorIndex = playerId.charCodeAt(0) % colors.length;
  const color = colors[colorIndex];
  const initiale = playerId[0].toUpperCase();
  
  const svg = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" fill="${color}" rx="50%"/>
    <text x="16" y="20" font-size="16" font-weight="bold" fill="white" text-anchor="middle">${initiale}</text>
  </svg>`;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// ============ LEAVE CONFIRMATION MODAL ============
function showLeaveConfirmation() {
  const modal = document.createElement("div");
  modal.className = "confirm-modal";
  modal.innerHTML = `
    <div class="confirm-modal-backdrop"></div>
    <div class="confirm-modal-dialog">
      <h2>Lobby verlassen</h2>
      <p>Sicher, dass du die Lobby verlassen möchtest?</p>
      <div class="confirm-modal-footer">
        <button class="secondary" data-action="cancel">Abbrechen</button>
        <button class="primary" data-action="confirm">Ja, verlassen</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  const cancelBtn = modal.querySelector('[data-action="cancel"]');
  const confirmBtn = modal.querySelector('[data-action="confirm"]');
  const backdrop = modal.querySelector(".confirm-modal-backdrop");
  
  const closeModal = () => {
    if (modal.parentElement) modal.remove();
  };
  
  cancelBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeModal();
  }, { once: true });
  
  confirmBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeModal();
    leaveLobby();
  }, { once: true });
  
  backdrop.addEventListener("click", (e) => {
    e.stopPropagation();
    closeModal();
  });
}

// ============ LEAVE LOBBY ============
async function leaveLobby() {
  try {
    if (state.lobbyCode && supabaseReady) {
      await supabaseClient
        .from("lobby_players")
        .delete()
        .eq("lobby_code", state.lobbyCode)
        .eq("player_id", state.currentPlayerId);
      
      if (subscriptionChannel) {
        subscriptionChannel.unsubscribe();
      }
    }
    
    state.lobbyCode = null;
    state.players = [];
    state.round = null;
    state.rolePayload = null;
    state.hostId = null;
    state.isHost = false;
    state.roundIdFromServer = null;
    
    localStorage.removeItem(STORAGE_KEYS.shared);
    localStorage.removeItem(STORAGE_KEYS.round);
    
    navigateToScreen("login", "backward");
  } catch (error) {
    console.error("Error leaving lobby:", error);
    showStatus("Fehler beim Verlassen der Lobby");
  }
}

function bindEvents() {
  const rulesModal = document.getElementById("rules-modal");
  const rulesContent = document.getElementById("rules-content");

  document.getElementById("theme-select").addEventListener("change", (event) => {
    applyTheme(event.target.value);
    localStorage.setItem(STORAGE_KEYS.theme, event.target.value);
  });

  document.getElementById("rules-btn").addEventListener("click", () => {
    if (!rulesContent) return;
    rulesContent.innerHTML = rulesHtml;
    if (rulesModal) {
      rulesModal.classList.remove("hidden");
      rulesModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  });

  document.getElementById("close-rules-btn").addEventListener("click", () => {
    if (!rulesModal) return;
    rulesModal.classList.add("hidden");
    rulesModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  });

  document.querySelectorAll("[data-close]").forEach((element) => {
    element.addEventListener("click", () => {
      if (!rulesModal) return;
      rulesModal.classList.add("hidden");
      rulesModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && rulesModal && !rulesModal.classList.contains("hidden")) {
      rulesModal.classList.add("hidden");
      rulesModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  });

  // Use event delegation for dynamic button handling
  document.addEventListener("click", async (event) => {
    const btn = event.target.closest("#create-lobby-btn");
    if (btn) {
      event.preventDefault();
      event.stopPropagation();
      const name = getPlayerName();
      if (!name) {
        showStatus("Gib zuerst deinen Namen ein.");
        return;
      }
      const code = generateLobbyCode();
      const player = { id: supabaseReady ? state.supabaseUserId : createPlayerId(), name };
      if (!player.id) {
        showStatus("Multiplayer-Identität nicht verfügbar.");
        return;
      }
      state.currentPlayerId = player.id;
      state.lobbyCode = code;
      state.hostId = player.id;
      state.isHost = true;
      state.players = [player];
      state.round = null;
      saveIdentity(player.id);
      try {
        if (supabaseReady) {
          const synced = await syncToSupabase();
          if (!synced) {
            showStatus("Fehler beim Speichern. Versuche es erneut.");
            return;
          }
          const joined = await addPlayerToLobby(player);
          if (!joined) {
            showStatus("Fehler beim Beitreten. Versuche es erneut.");
            return;
          }
          subscribeToLobby();
        }
        state.statusMessage = "";
        navigateToScreen("lobby", "forward");
        render();
      } catch (error) {
        console.error("Lobby creation failed:", error);
        showStatus(error.message || "Lobby konnte nicht erstellt werden.");
      }
      return;
    }

    const joinBtn = event.target.closest("#join-lobby-btn");
    if (joinBtn) {
      event.preventDefault();
      event.stopPropagation();
      const name = getPlayerName();
      const code = document.getElementById("join-code-input").value.trim().toUpperCase();
      if (!name || !code) {
        showStatus("Gib deinen Namen und einen Lobby-Code ein.");
        return;
      }
      if (!supabaseReady) {
        showStatus("Multiplayer ist nicht verbunden. Prüfe die Supabase-Konfiguration.");
        return;
      }
      if (!isValidLobbyCode(code)) {
        showStatus("Ungültiger Lobby-Code (5 Zeichen, ohne 0/O/1/I).");
        return;
      }

      try {
        const lobby = await loadLobby(code);
        if (!lobby) {
          showStatus("Diese Lobby wurde nicht gefunden.");
          return;
        }
        const player = { id: supabaseReady ? state.supabaseUserId : createPlayerId(), name };
        state.currentPlayerId = player.id;
        state.lobbyCode = code;
        state.hostId = lobby.hostId;
        state.isHost = state.hostId === player.id;
        state.players = [...lobby.players, player];
        state.settings = { ...defaultSettings, ...lobby.settings };
        state.round = lobby.round || null;
        saveIdentity(player.id);
        const joined = await addPlayerToLobby(player);
        if (!joined) {
          showStatus("Fehler beim Beitreten. Versuche es erneut.");
          return;
        }
        if (lobby.roundId) await loadOwnRolePayload(lobby.roundId);
        await loadLatestDetectiveMessage();
        subscribeToLobby();
        state.statusMessage = "";
        navigateToScreen("lobby", "forward");
        render();
      } catch (error) {
        console.error("Lobby join failed:", error);
        showStatus(error.message || "Fehler beim Beitreten.");
      }
      return;
    }

    const leaveBtn = event.target.closest("#leave-lobby-btn, #leave-game-btn");
    if (leaveBtn) {
      event.preventDefault();
      event.stopPropagation();
      showLeaveConfirmation();
      return;
    }

    const startGameBtn = event.target.closest("#start-game-btn");
    if (startGameBtn) {
      event.preventDefault();
      event.stopPropagation();
      console.log("Start game button clicked");
      handleStartGame();
      return;
    }

    const resetLobbyBtn = event.target.closest("#reset-lobby-btn");
    if (resetLobbyBtn) {
      event.preventDefault();
      event.stopPropagation();
      handleResetLobby();
      return;
    }

    const endGameBtn = event.target.closest("#end-game-btn");
    if (endGameBtn) {
      event.preventDefault();
      event.stopPropagation();
      handleEndGame();
      return;
    }

    const newRoundBtn = event.target.closest("#new-round-btn");
    if (newRoundBtn) {
      event.preventDefault();
      event.stopPropagation();
      handleNewRound();
      return;
    }
    
    // Settings control buttons (increase/decrease counters)
    const controlBtn = event.target.closest("[data-action][data-target]");
    if (controlBtn) {
      event.preventDefault();
      event.stopPropagation();
      if (!state.isHost) return;
      const target = controlBtn.dataset.target;
      const action = controlBtn.dataset.action;
      const current = Number(state.settings[target]) || 0;
      const next = action === "increase" ? current + 1 : Math.max(0, current - 1);
      state.settings[target] = next;
      saveSettings();
      syncToSupabase();
      renderSettings();
      return;
    }
  }, { capture: false });
}

async function handleStartGame() {
  try {
    console.log("handleStartGame() called, isHost:", state.isHost);
    if (!state.isHost) throw new Error("Nur der Host kann das Spiel starten.");
    if (!state.lobbyCode) {
      throw new Error("Erstelle zuerst eine Lobby.");
    }

    console.log("Computing role counts...");
    const roleCounts = computeRoleCounts(state.settings);
    console.log("Role counts:", roleCounts);

    if (state.players.length < roleCounts.total + 1) {
      throw new Error(`Nicht genügend Spieler (${state.players.length}) für die Rollenverteilung (${roleCounts.total + 1}).`);
    }

    console.log("Creating game round...");
    state.round = createGameRound(state.players, state.settings, roleCounts);
    console.log("Round created:", state.round?.id);
    saveRound();
    
    console.log("Syncing to Supabase...");
    // Sync to Supabase to notify other players (publishes roles internally)
    const synced = await syncToSupabase();
    console.log("Sync result:", synced);
    if (!synced) {
      showStatus("Fehler beim Speichern des Spielstarts.");
      state.round = null;
      return;
    }
    
    console.log("Navigating to role-loading screen...");
    // Navigate to role-loading screen
    navigateToScreen("role-loading", "forward");
    render();
    console.log("Game started successfully!");
  } catch (error) {
    console.error("handleStartGame() error:", error);
    showStatus(error.message);
  }
}

async function handleResetLobby() {
  if (!state.isHost) {
    showStatus("Nur der Host kann eine neue Runde starten.");
    return;
  }
  state.round = null;
  state.rolePayload = null;
  state.detectiveMessage = "";
  state.roundIdFromServer = null;
  saveRound();
  await syncToSupabase();
  navigateToScreen("lobby", "forward");
  render();
}

async function handleEndGame() {
  if (!state.isHost) {
    showStatus("Nur der Host kann das Spiel beenden.");
    return;
  }
  state.round = null;
  state.rolePayload = null;
  state.detectiveMessage = "";
  state.roundIdFromServer = null;
  state.statusMessage = "Spiel beendet.";
  saveRound();
  await syncToSupabase();
  navigateToScreen("lobby", "backward");
  render();
}

async function handleNewRound() {
  if (!state.isHost) {
    showStatus("Nur der Host kann eine neue Runde starten.");
    return;
  }
  
  try {
    const roleCounts = computeRoleCounts(state.settings);

    if (state.players.length < roleCounts.total + 1) {
      throw new Error("Nicht genügend Spieler für die Rollenverteilung.");
    }

    state.round = createGameRound(state.players, state.settings, roleCounts);
    saveRound();
    
    // Sync to Supabase to notify other players (publishes roles internally)
    const synced = await syncToSupabase();
    if (!synced) {
      showStatus("Fehler beim Speichern der neuen Runde.");
      state.round = null;
      return;
    }
    
    // Navigate to role-loading screen
    navigateToScreen("role-loading", "forward");
    render();
  } catch (error) {
    showStatus(error.message);
    render();
  }
}

// Global event listeners for input/range changes
document.addEventListener("input", (event) => {
  if (!state.isHost) return;
  
  // Handle range inputs for probabilities
  const rangeInput = event.target;
  if (rangeInput.type === "range") {
    const configKey = rangeInput.id;
    if (!configKey) return;
    state.settings[configKey] = Number(rangeInput.value);
    const outputEl = document.getElementById(`${configKey}Value`);
    if (outputEl) outputEl.textContent = `${rangeInput.value}%`;
    saveSettings();
    syncToSupabase();
  }
});

document.addEventListener("change", (event) => {
  if (!state.isHost) return;
  
  // Handle checkboxes
  if (event.target.type === "checkbox") {
    const configKey = event.target.id;
    if (!configKey) return;
    state.settings[configKey] = event.target.checked;
    saveSettings();
    syncToSupabase();
  }
  
  // Handle select dropdowns
  if (event.target.tagName === "SELECT") {
    if (event.target.id === "difficulty-select") {
      state.settings.difficulty = event.target.value;
      saveSettings();
      syncToSupabase();
    }
  }
});

function initializeTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) || "meme";
  applyTheme(savedTheme);
  document.getElementById("theme-select").value = savedTheme;
}

function applyTheme(theme) {
  const validThemes = ["meme", "neon", "classic", "crt", "bsod", "cork"];
  const selectedTheme = validThemes.includes(theme) ? theme : "meme";
  document.body.dataset.theme = selectedTheme;
  const selector = document.getElementById("theme-select");
  if (selector) selector.value = selectedTheme;
}

function getPlayerName() {
  return document.getElementById("player-name").value.trim();
}

function createPlayerId() {
  const id = createId();
  saveIdentity(id);
  return id;
}

function saveIdentity(id) {
  sessionStorage.setItem("impostor-player-id", id);
}

async function loadWords() {
  try {
    const response = await fetch("./data/words.json");
    if (!response.ok) throw new Error("JSON konnte nicht geladen werden.");
    const rawWords = await response.json();
    state.wordDeckByDifficulty = normalizeWordDeck(rawWords);
    state.wordDeck = Object.values(state.wordDeckByDifficulty).flat();
  } catch (error) {
    console.error("Word deck load failed:", error);
    state.wordDeckByDifficulty = {
      easy: [
        { word: "Baum", clues: ["Wald", "Blätter", "Stamm", "Natur", "Holz"] },
        { word: "Haus", clues: ["Dach", "Zimmer", "Familie", "Wohnen", "Fenster"] },
        { word: "Auto", clues: ["Motor", "Räder", "Fahren", "Straße", "Benzin"] },
        { word: "Katze", clues: ["Schnurrbart", "Tatzen", "Meow", "Haustier", "Whisker"] },
        { word: "Buch", clues: ["Lesen", "Seiten", "Geschichte", "Buchstaben", "Umschlag"] },
      ],
      medium: [],
      hard: [],
      veryHard: [],
    };
    state.wordDeck = Object.values(state.wordDeckByDifficulty).flat();
  }
}

function normalizeWordDeck(rawWords) {
  const normalized = {
    easy: [],
    medium: [],
    hard: [],
    veryHard: [],
  };

  if (!rawWords || typeof rawWords !== "object") return normalized;

  if (Array.isArray(rawWords)) {
    normalized.easy = rawWords;
    normalized.medium = rawWords;
    normalized.hard = rawWords;
    normalized.veryHard = rawWords;
    return normalized;
  }

  Object.entries(normalized).forEach(([difficultyKey, value]) => {
    const category = rawWords[difficultyKey] || rawWords[difficultyKey.toLowerCase()] || rawWords[difficultyKey.replace(/([A-Z])/g, "-$1").toLowerCase()];
    if (Array.isArray(category)) {
      normalized[difficultyKey] = category;
    }
  });

  if (!Object.values(normalized).some((list) => list.length)) {
    const flatWords = Object.values(rawWords).flat().filter(Boolean);
    normalized.easy = flatWords;
    normalized.medium = flatWords;
    normalized.hard = flatWords;
    normalized.veryHard = flatWords;
  }

  return normalized;
}

function hydrateSettings() {
  const saved = localStorage.getItem(STORAGE_KEYS.settings);
  if (!saved) {
    saveSettings();
    return;
  }

  try {
    const parsed = JSON.parse(saved);
    state.settings = { ...defaultSettings, ...parsed };
  } catch (error) {
    console.warn("Settings invalid:", error);
    state.settings = { ...defaultSettings };
  }
}

function hydratePlayers() {
  const saved = localStorage.getItem(STORAGE_KEYS.players);
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    state.players = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Players invalid:", error);
    state.players = [];
  }
}

function hydrateRound() {
  const saved = localStorage.getItem(STORAGE_KEYS.round);
  if (!saved) return;

  try {
    state.round = JSON.parse(saved);
  } catch (error) {
    console.warn("Round invalid:", error);
    state.round = null;
  }
}

function hydrateSharedState() {
  const saved = localStorage.getItem(STORAGE_KEYS.shared);
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    if (parsed.lobbyCode) state.lobbyCode = parsed.lobbyCode;
    if (parsed.hostId) state.hostId = parsed.hostId;
    if (Array.isArray(parsed.players)) state.players = parsed.players;
    if (parsed.settings) state.settings = { ...defaultSettings, ...parsed.settings };
    if (parsed.round) state.round = parsed.round;
  } catch (error) {
    console.warn("Shared state invalid:", error);
  }
}

function syncFromStorage() {
  hydrateSharedState();
  hydrateSettings();
  hydratePlayers();
  hydrateRound();
}

function savePlayers() {
  localStorage.setItem(STORAGE_KEYS.players, JSON.stringify(state.players));
  persistSharedState();
  syncToSupabase();
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(state.settings));
  persistSharedState();
}

function saveRound() {
  // Im Supabase-Modus landet die Runde NIE in localStorage – nur die eigene Rolle.
  if (state.round && !supabaseReady) {
    localStorage.setItem(STORAGE_KEYS.round, JSON.stringify(state.round));
  } else {
    localStorage.removeItem(STORAGE_KEYS.round);
  }
  persistSharedState();
}

function persistSharedState() {
  const payload = {
    lobbyCode: state.lobbyCode,
    players: state.players,
    settings: state.settings,
    round: supabaseReady ? null : state.round,
    hostId: state.hostId,
    updatedAt: Date.now(),
  };
  localStorage.setItem(STORAGE_KEYS.shared, JSON.stringify(payload));
}

function render() {
  renderScreens();
  renderLobbyMeta();
  renderLobbyPlayers();
  renderSettings();
  renderPrivateRoleCard();
  renderRoundSummary();
}

function renderScreens() {
  const activeRoundId = state.roundIdFromServer;
  const hasFreshPayload = Boolean(state.rolePayload) && (!state.syncedRoundId || state.syncedRoundId === activeRoundId);

  // Round started: if still on lobby, navigate to role-loading or directly to game
  // if the payload was already loaded (e.g. by polling before the subscription).
  if (activeRoundId && state.currentScreen === "lobby") {
    if (hasFreshPayload) {
      navigateToScreen("game", "forward");
    } else {
      state.rolePayload = null;
      navigateToScreen("role-loading", "forward");
    }
    return;
  }

  // New round while already on game screen: wait on role-loading for fresh payload
  if (activeRoundId && state.currentScreen === "game" && !hasFreshPayload) {
    state.rolePayload = null;
    navigateToScreen("role-loading", "forward");
    return;
  }

  // Host ended the game or reset the lobby: bring everyone but the host (who already
  // navigated itself) back to the lobby.
  if (!activeRoundId && !state.isHost && (state.currentScreen === "game" || state.currentScreen === "role-loading")) {
    navigateToScreen("lobby", "backward");
    return;
  }

  document.querySelectorAll(".screen").forEach(screen => {
    screen.removeAttribute("data-active");
  });
  
  const activeScreen = document.querySelector(`[data-screen="${state.currentScreen}"]`);
  if (activeScreen) {
    activeScreen.setAttribute("data-active", "true");
    activeScreen.setAttribute("data-direction", state.screenDirection);
  }
  
  // Auto-navigate to game once the payload for the current round has arrived.
  if (state.currentScreen === "role-loading" && hasFreshPayload) {
    setTimeout(() => {
      navigateToScreen("game", "forward");
    }, 300);
  }
}

function renderLobbyMeta() {
  // Only show connection status on login screen
  const connection = document.getElementById("connection-status");
  if (connection) {
    connection.textContent = supabaseReady ? "● Multiplayer verbunden" : "○ Multiplayer nicht verbunden";
    connection.style.color = supabaseReady ? "var(--green)" : "var(--gold)";
  }
  
  // Only show lobby meta on login screen
  const meta = document.getElementById("lobby-meta");
  if (!meta) return; // Element doesn't exist on this screen
  
  if (!state.lobbyCode) {
    meta.textContent = "Trage deinen Namen ein und erstelle eine Lobby oder nutze einen Einladungscode.";
    meta.classList.add("empty-state");
    return;
  }
  
  // Hide lobby info from login screen
  meta.textContent = "Lobby-Code und Host sichtbar nach Beitritt.";
  meta.classList.add("empty-state");
}

function renderLobbyPlayers() {
  const container = document.getElementById("player-list");
  if (!container) return; // Player list doesn't exist on this screen
  
  const playerCountEl = document.getElementById("player-count");
  if (playerCountEl) playerCountEl.textContent = state.players.length;
  
  // Show lobby info (code and host) on lobby screen
  const lobbyInfoEl = document.getElementById("lobby-info");
  if (lobbyInfoEl && state.lobbyCode) {
    const host = state.players.find((player) => player.id === state.hostId) || state.players[0];
    lobbyInfoEl.innerHTML = `
      <div class="lobby-code-display">
        <strong>Lobby-Code:</strong> <span class="lobby-code-value">${escapeHtml(state.lobbyCode)}</span>
      </div>
      <div class="lobby-host-display">
        <strong>Host:</strong> <span>${escapeHtml(host?.name || "wird geladen")}</span>
      </div>
    `;
  } else if (lobbyInfoEl) {
    lobbyInfoEl.innerHTML = "";
  }
  
  if (!state.players.length) {
    container.innerHTML = '<div class="empty-state">Noch keine Spieler hinzugefügt.</div>';
    return;
  }

  container.innerHTML = state.players
    .map(
      (player) => `
        <div class="player-tag ${player.id === state.hostId ? "is-host" : ""} ${player.id === state.currentPlayerId ? "is-you" : ""}">
          <img class="player-avatar" 
               src="${generatePlayerAvatar(player.id)}" 
               alt="Avatar" 
               loading="lazy" />
          <span class="player-name">${escapeHtml(player.name)}</span>
          ${player.id === state.hostId ? '<span class="host-badge">👑 HOST</span>' : ""}
          ${state.isHost && player.id !== state.currentPlayerId ? `<button type="button" class="remove-player-btn" data-remove-id="${player.id}" aria-label="Spieler entfernen">×</button>` : ""}
        </div>
      `
    )
    .join("");
}

function renderSettings() {
  const hostControlsEl = document.getElementById("host-controls");
  if (hostControlsEl) hostControlsEl.classList.remove("hidden");
  
  const hostActionsEl = document.getElementById("host-actions");
  if (hostActionsEl) hostActionsEl.classList.toggle("hidden", !state.isHost);
  
  const settingsPermEl = document.getElementById("settings-permission");
  if (settingsPermEl) settingsPermEl.textContent = state.isHost ? "Du bist der Host" : "Nur der Host kann ändern";
  
  const currentPlayerLabelEl = document.getElementById("current-player-label");
  if (currentPlayerLabelEl) {
    currentPlayerLabelEl.textContent = state.currentPlayerId
      ? `Verbunden als ${state.players.find((player) => player.id === state.currentPlayerId)?.name || "Spieler"}`
      : "Noch keinem Spieler beigetreten";
  }
  
  Object.entries(state.settings).forEach(([key, value]) => {
    const node = document.getElementById(key);
    if (node) node.textContent = String(value);
  });

  const jesterProbEl = document.getElementById("jesterProbability");
  if (jesterProbEl) jesterProbEl.value = state.settings.jesterProbability;
  
  const detectiveProbEl = document.getElementById("detectiveProbability");
  if (detectiveProbEl) detectiveProbEl.value = state.settings.detectiveProbability;
  
  const doppelgangerProbEl = document.getElementById("doppelgangerProbability");
  if (doppelgangerProbEl) doppelgangerProbEl.value = state.settings.doppelgangerProbability;
  
  const difficultySelectEl = document.getElementById("difficulty-select");
  if (difficultySelectEl) difficultySelectEl.value = state.settings.difficulty || "random";

  const jesterProbValueEl = document.getElementById("jesterProbabilityValue");
  if (jesterProbValueEl) jesterProbValueEl.textContent = `${state.settings.jesterProbability}%`;
  
  const detectiveProbValueEl = document.getElementById("detectiveProbabilityValue");
  if (detectiveProbValueEl) detectiveProbValueEl.textContent = `${state.settings.detectiveProbability}%`;
  
  const doppelgangerProbValueEl = document.getElementById("doppelgangerProbabilityValue");
  if (doppelgangerProbValueEl) doppelgangerProbValueEl.textContent = `${state.settings.doppelgangerProbability}%`;

  const jesterRandomEl = document.getElementById("jesterRandomEnabled");
  if (jesterRandomEl) jesterRandomEl.checked = !!state.settings.jesterRandomEnabled;
  
  const detectiveRandomEl = document.getElementById("detectiveRandomEnabled");
  if (detectiveRandomEl) detectiveRandomEl.checked = !!state.settings.detectiveRandomEnabled;
  
  const doppelgangerRandomEl = document.getElementById("doppelgangerRandomEnabled");
  if (doppelgangerRandomEl) doppelgangerRandomEl.checked = !!state.settings.doppelgangerRandomEnabled;

  state.detectiveMessage = state.settings.detectiveMessage || state.detectiveMessage || "";
  document.querySelectorAll("[data-action], #jesterProbability, #detectiveProbability, #doppelgangerProbability, #jesterRandomEnabled, #detectiveRandomEnabled, #doppelgangerRandomEnabled, #difficulty-select").forEach((control) => {
    control.disabled = !state.isHost;
  });
}

function renderPrivateRoleCard() {
  const card = document.getElementById("private-role-card");
  if (!card) return; // Card doesn't exist on this screen
  
  const existingInput = document.getElementById("detective-message-input");
  const draftMessage = existingInput ? existingInput.value : null;
  if (!state.currentPlayerId) {
    card.classList.add("empty-state");
    card.textContent = "Nach dem Spielstart erscheint hier nur deine eigene Rolle.";
    return;
  }

  const player = state.players.find((entry) => entry.id === state.currentPlayerId);
  if (!player) {
    card.classList.add("empty-state");
    card.textContent = "Dieser Spieler existiert nicht mehr.";
    return;
  }

  const role = state.rolePayload || (state.round ? getPlayerRoleInfo(player.id, state.round) : null);
  if (!role) {
    card.classList.add("empty-state");
    card.textContent = state.roundIdFromServer
      ? "Runde gestartet · Rolle wird geladen …"
      : "Nach dem Spielstart erscheint hier nur deine eigene Rolle.";
    return;
  }

  const badgeClass = `role-${role.key}`;
  const detectiveMessage = state.round ? (state.round.detectiveMessage || "") : (state.detectiveMessage || "");
  const canReadMessage = ["detective", "jester", "player"].includes(role.key);
  card.classList.remove("empty-state");
  card.innerHTML = `
    <span class="role-badge ${badgeClass}">${role.label}</span>
    <h3>${escapeHtml(player.name)}</h3>
    <div class="role-info">${escapeHtml(role.message).replace(/\n/g, "<br>")}</div>
    ${detectiveMessage ? `
      <div class="detective-chat-bubble ${canReadMessage ? "is-readable" : "is-redacted"}" aria-label="Detektiv-Nachricht">
        <span class="chat-label">Detektiv</span>
        <span class="chat-message">${canReadMessage ? escapeHtml(detectiveMessage).replace(/\n/g, "<br>") : "████████████"}</span>
      </div>
    ` : ""}
    ${role.key === "detective" ? `
      <div class="detective-message-editor">
        <label for="detective-message-input">Nachricht an die Mitspieler</label>
        <textarea id="detective-message-input" rows="3" aria-label="Detektiv-Nachricht" placeholder="${detectiveDefaultMessage}"></textarea>
        <button id="send-detective-message-btn" class="secondary" type="button">Nachricht senden</button>
      </div>
    ` : ""}
  `;
  const messageInput = document.getElementById("detective-message-input");
  if (messageInput) {
    messageInput.value = draftMessage !== null ? draftMessage : detectiveMessage;
    messageInput.placeholder = detectiveDefaultMessage;
  }
}

document.addEventListener("click", async (event) => {
  if (event.target.id !== "send-detective-message-btn") return;
  if (!state.currentPlayerId) return;
  const isDetective = state.round
    ? state.round.detectives.includes(state.currentPlayerId)
    : Boolean(state.rolePayload && state.rolePayload.key === "detective");
  if (!isDetective) return;

  const message = document.getElementById("detective-message-input").value.trim();
  if (supabaseReady && state.lobbyCode) {
    const { error } = await supabaseClient
      .from("lobby_messages")
      .insert({ lobby_code: state.lobbyCode, author_id: state.currentPlayerId, message });
    if (error) {
      showStatus(`Nachricht konnte nicht gesendet werden (${error.code || "Supabase"}): ${error.message}`);
      return;
    }
    state.detectiveMessage = message;
    renderPrivateRoleCard();
    return;
  }
  if (!state.round) return;
  state.round.detectiveMessage = message;
  saveRound();
  renderPrivateRoleCard();
});

async function addPlayerToLobby(player) {
  try {
    const { error } = await supabaseClient.from("lobby_players").upsert({
      lobby_code: state.lobbyCode,
      player_id: player.id,
      name: player.name,
    }, { onConflict: "lobby_code,player_id" });
    if (error) {
      throw new Error(`Spieler konnte nicht beitreten (${error.code || "Supabase"}): ${error.message}`);
    }
  } catch (error) {
    console.warn("Player join failed:", error);
    showStatus(error.message || "Spieler konnte nicht beitreten.");
    return false;
  }
  state.statusMessage = "";
  await refreshLobbyPlayers();
  return true;
}

async function removePlayerFromLobby(playerId) {
  const { error } = await supabaseClient
    .from("lobby_players")
    .delete()
    .eq("lobby_code", state.lobbyCode)
    .eq("player_id", playerId);
  if (error) console.warn("Player removal failed:", error);
}

function renderRoundSummary() {
  const status = document.getElementById("round-status");
  const summary = document.getElementById("round-summary");
  const hostGameControls = document.getElementById("host-game-controls");

  // state.round only exists locally for the host; every player relies on
  // roundIdFromServer to know whether a round is actually live.
  const roundActive = Boolean(state.roundIdFromServer);

  if (hostGameControls) {
    hostGameControls.classList.toggle("hidden", !state.isHost || !roundActive);
  }
  
  if (!status || !summary) return; // Elements don't exist on this screen

  if (state.statusMessage) {
    status.textContent = state.statusMessage;
    summary.innerHTML = "";
    return;
  }

  if (!roundActive) {
    status.textContent = "Noch keine Runde gestartet.";
    summary.innerHTML = "";
    return;
  }

  status.textContent = "Runde läuft · Deine geheime Rolle steht rechts.";
  summary.innerHTML = `<span class="round-live">● LIVE</span><br><span>${state.players.length} Spieler sind dabei.</span>`;
}

function getPlayerRoleInfo(playerId, round) {
  const sharedRoleText = getSharedRoleText(round);
  if (round.impostors.includes(playerId)) {
    return {
      key: "impostor",
      label: "Impostor",
      message: [sharedRoleText, `Deine Hilfswörter: ${round.impostorClues[playerId] || "???"}`, `Mitspieler: ${getNamesForIds(round.impostors.filter((x) => x !== playerId)) || "Keine"}`].filter(Boolean).join("\n"),
    };
  }

  if (round.jesters.includes(playerId)) {
    return {
      key: "jester",
      label: "Jester",
      message: [sharedRoleText, `Gesuchtes Wort: ${round.word}`, "Ziel: Lass dich rausvoten!"].filter(Boolean).join("\n"),
    };
  }

  if (round.detectives.includes(playerId)) {
    const items = round.detectiveItemsMap[playerId] || [];
    return {
      key: "detective",
      label: "Detektiv",
      message: [sharedRoleText, `Gesuchtes Wort: ${round.word}`, `Deine Items:\n- ${items.join("\n- ") || "Keine Items"}`].filter(Boolean).join("\n"),
    };
  }

  if (round.doppelgangers.includes(playerId)) {
    return {
      key: "doppelganger",
      label: "Doppelgänger",
      message: "Du bist der Doppelgänger. Du erhältst keine weiteren Informationen.",
    };
  }

  return {
    key: "player",
    label: "Spieler",
    message: [sharedRoleText, `Gesuchtes Wort: ${round.word}`].filter(Boolean).join("\n"),
  };
}

function getSharedRoleText(round, players = state.players, settings = state.settings) {
  const detectiveNames = getNamesForIds(round.detectives);
  const availableItems = detectiveItems.filter((item) => item.minPlayers <= players.length);
  const itemList = availableItems.map((item) => `${item.name}: ${item.description}`).join("\n- ") || "Keine Items";
  const jesterText = round.jesters.length > 0 ? `Jester: ${round.jesters.length} dabei` : "";

  return [
    `Impostoren: ${round.impostors.length}`,
    jesterText,
    `Detektiv${round.detectives.length === 1 ? "" : "en"}: ${detectiveNames}`,
    round.detectives.length ? `Detektiv-Items zur Auswahl (nutzbar: ${settings.itemsPerDetective} pro Detektiv):\n- ${itemList}` : "",
    `Doppelgänger dabei: ${round.doppelgangers.length > 0 ? "Ja" : "Nein"}`,
  ].filter(Boolean).join("\n");
}

function buildRolePayloads(round, players, settings) {
  const result = {};
  const sharedRoleText = getSharedRoleText(round, players, settings);

  round.impostors.forEach((id) => {
    result[id] = {
      key: "impostor",
      label: "Impostor",
      message: [sharedRoleText, `Deine Hilfswörter: ${round.impostorClues[id] || "???"}`, `Mitspieler: ${getNamesForIds(round.impostors.filter((x) => x !== id)) || "Keine"}`].filter(Boolean).join("\n"),
    };
  });

  round.jesters.forEach((id) => {
    result[id] = {
      key: "jester",
      label: "Jester",
      message: [sharedRoleText, `Gesuchtes Wort: ${round.word}`, "Ziel: Lass dich rausvoten!"].filter(Boolean).join("\n"),
    };
  });

  round.detectives.forEach((id) => {
    const items = round.detectiveItemsMap[id] || [];
    result[id] = {
      key: "detective",
      label: "Detektiv",
      message: [sharedRoleText, `Gesuchtes Wort: ${round.word}`, `Deine Items:\n- ${items.join("\n- ") || "Keine Items"}`].filter(Boolean).join("\n"),
    };
  });

  round.doppelgangers.forEach((id) => {
    result[id] = {
      key: "doppelganger",
      label: "Doppelgänger",
      message: "Du bist der Doppelgänger. Du erhältst keine weiteren Informationen.",
    };
  });

  players.forEach((player) => {
    if (!result[player.id]) {
      result[player.id] = {
        key: "player",
        label: "Spieler",
        message: [sharedRoleText, `Gesuchtes Wort: ${round.word}`].filter(Boolean).join("\n"),
      };
    }
  });

  return result;
}

function getNamesForIds(ids) {
  return ids
    .map((id) => state.players.find((player) => player.id === id)?.name)
    .filter(Boolean)
    .join(", ") || "Keine";
}

function createGameRound(players, settings, roleCounts) {
  const word = selectGameWord();
  const shuffledPlayers = shuffle([...players]);

  const counts = roleCounts || computeRoleCounts(settings);
  const aJester = counts.jesters;
  const aDetective = counts.detectives;
  const aDoppel = counts.doppelgangers;

  const minimumPlayers = counts.total + 1;
  if (players.length < minimumPlayers) {
    throw new Error("Nicht genügend Spieler für diese Rollenverteilung.");
  }

  const impostors = shuffledPlayers.slice(0, counts.impostors).map((player) => player.id);
  const remaining = shuffledPlayers.slice(counts.impostors);

  const jesters = remaining.slice(0, aJester).map((player) => player.id);
  const remainingAfterJester = remaining.slice(aJester);

  const detectives = remainingAfterJester.slice(0, aDetective).map((player) => player.id);
  const remainingAfterDetective = remainingAfterJester.slice(aDetective);

  const doppelgangers = remainingAfterDetective.slice(0, aDoppel).map((player) => player.id);

  const impostorClues = {};
  // Alle Impostoren sehen exakt dieselbe Hinweiswort-Menge (so viele wie Impostoren im Spiel sind).
  const clueCount = Math.min(impostors.length, word.clues.length);
  const sharedClues = shuffle([...word.clues]).slice(0, clueCount);
  const clueText = sharedClues.length ? sharedClues.join(", ") : "???";
  impostors.forEach((impostorId) => {
    impostorClues[impostorId] = clueText;
  });

  const detectiveItemsMap = {};
  const availableItems = detectiveItems.filter((item) => item.minPlayers <= players.length);
  detectives.forEach((playerId) => {
    detectiveItemsMap[playerId] = shuffle([...availableItems]).slice(0, settings.itemsPerDetective).map((item) => `${item.name}: ${item.description}`);
  });

  return {
    id: createId(),
    word: word.word,
    clues: word.clues,
    impostorClues,
    impostors,
    jesters,
    detectives,
    doppelgangers,
    detectiveItemsMap,
    detectiveMessage: "",
    createdAt: Date.now(),
  };
}

function calculateRoleCount(baseCount, probability, randomEnabled) {
  if (baseCount <= 0) return 0;
  if (!randomEnabled) return baseCount;

  let count = 0;
  for (let i = 0; i < baseCount; i += 1) {
    if (Math.random() * 100 < probability) {
      count += 1;
    }
  }
  return count;
}

// Einmal berechnet und sowohl für den Start-Guard als auch für die Runde selbst verwendet,
// damit Prüfung und tatsächliche Rollenverteilung nie auseinanderlaufen.
function computeRoleCounts(settings) {
  const impostors = Math.max(0, Number(settings.impostorCount) || 0);
  const jesters = calculateRoleCount(settings.jesterCount, settings.jesterProbability, settings.jesterRandomEnabled);
  const detectives = calculateRoleCount(settings.detectiveCount, settings.detectiveProbability, settings.detectiveRandomEnabled);
  const doppelgangers = calculateRoleCount(settings.doppelgangerCount, settings.doppelgangerProbability, settings.doppelgangerRandomEnabled);
  return { impostors, jesters, detectives, doppelgangers, total: impostors + jesters + detectives + doppelgangers };
}

function selectGameWord() {
  const difficulty = state.settings?.difficulty || "random";
  const activeDeck = difficulty === "random"
    ? state.wordDeck
    : state.wordDeckByDifficulty[difficulty] || state.wordDeck;

  if (!activeDeck || !activeDeck.length) {
    return { word: "Baum", clues: ["Wald", "Blätter", "Stamm", "Natur", "Holz"] };
  }

  return activeDeck[Math.floor(Math.random() * activeDeck.length)];
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const LOBBY_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const LOBBY_CODE_REGEX = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{5}$/;

function isValidLobbyCode(code) {
  return typeof code === "string" && LOBBY_CODE_REGEX.test(code);
}

function generateLobbyCode() {
  const chars = LOBBY_CODE_CHARS;
  let code = "";
  for (let i = 0; i < 5; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function showStatus(message) {
  state.statusMessage = message;
  const statusEl = document.getElementById("status-message");
  if (statusEl) statusEl.textContent = message;
  const roundStatus = document.getElementById("round-status");
  if (roundStatus) roundStatus.textContent = message;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function createId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function initSupabase() {
  if (!window.SUPABASE_CONFIG || !window.SUPABASE_CONFIG.url || !window.SUPABASE_CONFIG.anonKey) {
    return false;
  }

  try {
    if (!window.supabase) {
      console.warn("Supabase SDK nicht verfügbar.");
      return false;
    }

    supabaseClient = window.supabase.createClient(
      window.SUPABASE_CONFIG.url,
      window.SUPABASE_CONFIG.anonKey,
      { auth: { storage: window.sessionStorage } }
    );

    // Identität über eine anonyme Auth-Session (Gerät = Spieler). Nur so kann RLS
    // Rollendaten pro Spieler abschotten – eine statische Seite braucht dafür Auth.
    let { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      const { data, error } = await supabaseClient.auth.signInAnonymously();
      if (error) {
        console.warn("Anonymous sign-in failed:", error.message);
        showStatus("Multiplayer: Anonymous Sign-In ist in Supabase nicht aktiviert (Auth → Providers → Anonymous).");
        return false;
      }
      user = data.user;
    }
    state.supabaseUserId = user.id;
    return true;
  } catch (error) {
    console.warn("Supabase init failed:", error);
    state.supabaseUserId = null;
    return false;
  }
}

async function loadLobby(code) {
  let results;
  try {
    results = await Promise.all([
      supabaseClient.from("game_state").select("*").eq("id", code).maybeSingle(),
      supabaseClient.from("lobby_players").select("player_id, name").eq("lobby_code", code),
    ]);
  } catch (error) {
    throw new Error(`Supabase-Verbindung fehlgeschlagen: ${error.message || "Netzwerkfehler"}`);
  }

  const [stateResult, playersResult] = results;
  if (stateResult.error || playersResult.error) {
    const error = stateResult.error || playersResult.error;
    throw new Error(`Lobby konnte nicht geladen werden (${error.code || "Supabase"}): ${error.message}`);
  }
  const data = stateResult.data;
  if (!data) return null;
  const settings = data.settings || {};
  return {
    players: (playersResult.data || []).map((player) => ({ id: player.player_id, name: player.name })),
    settings: { ...defaultSettings, ...settings },
    hostId: data.host_id || playersResult.data?.[0]?.player_id || null,
    round: data.round || null, // nur im lokalen Modus befüllt; sonst kommen Rollen über player_rounds
    roundId: data.round_id || null,
  };
}

async function refreshLobbyPlayers() {
  if (!state.lobbyCode) return;
  const { data, error } = await supabaseClient
    .from("lobby_players")
    .select("player_id, name")
    .eq("lobby_code", state.lobbyCode);
  if (error) {
    console.warn("Lobby read failed:", error);
    return;
  }
  state.players = (data || []).map((player) => ({
    id: player.player_id,
    name: player.name,
  }));
  render();
}

function subscribeToLobby() {
  if (!supabaseReady || !supabaseClient || !state.lobbyCode) return;
  if (subscriptionChannel) supabaseClient.removeChannel(subscriptionChannel);
  if (state.lobbyPollTimer) clearInterval(state.lobbyPollTimer);

  subscriptionChannel = supabaseClient
    .channel(`lobby-${state.lobbyCode}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "game_state", filter: `id=eq.${state.lobbyCode}` }, (payload) => {
      const row = payload.new;
      if (!row) return;
      const settings = row.settings || {};
      state.settings = { ...defaultSettings, ...settings };
      state.hostId = row.host_id || state.hostId;
      state.isHost = state.hostId === state.currentPlayerId;
      state.roundIdFromServer = row.round_id || null;
      
      if (row.round_id) {
        // Spiel wurde gestartet - zur role-loading screen navigieren
        if (state.currentScreen === "lobby") {
          navigateToScreen("role-loading", "forward");
        }
        if (!state.rolePayload || state.syncedRoundId !== row.round_id) loadOwnRolePayload(row.round_id);
      } else if (!state.round) {
        state.rolePayload = null;
        state.syncedRoundId = null;
      }
      render();
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "lobby_players", filter: `lobby_code=eq.${state.lobbyCode}` }, () => {
      refreshLobbyPlayers();
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "player_rounds", filter: `player_id=eq.${state.currentPlayerId}` }, (payload) => {
      if (!payload.new || !payload.new.payload) return;
      state.rolePayload = payload.new.payload;
      state.syncedRoundId = payload.new.round_id || state.roundIdFromServer;
      render();
    })
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "lobby_messages", filter: `lobby_code=eq.${state.lobbyCode}` }, (payload) => {
      if (!payload.new || !payload.new.message) return;
      state.detectiveMessage = payload.new.message;
      renderPrivateRoleCard();
    })
    .subscribe();

  // Sofort einmal abrufen statt bis zu 3s auf den ersten Intervall-Tick zu warten.
  refreshLobbyPlayers();
  refreshGameState();

  state.lobbyPollTimer = setInterval(() => {
    refreshLobbyPlayers();
    refreshGameState();
  }, 3000);
}

// Fallback-Polling für verlorene Realtime-Verbindungen: holt zusätzlich den
// Spielzustand (Settings, Host, Rundenstart), nicht nur die Spielerliste.
async function refreshGameState() {
  if (!state.lobbyCode) return;
  const { data, error } = await supabaseClient
    .from("game_state")
    .select("id, host_id, settings, round_id")
    .eq("id", state.lobbyCode)
    .maybeSingle();
  if (error) {
    console.warn("Game state read failed:", error);
    return;
  }
  if (!data) return;
  const settings = data.settings || {};
  state.settings = { ...defaultSettings, ...settings };
  state.hostId = data.host_id || state.hostId;
  state.isHost = state.hostId === state.currentPlayerId;
  const roundId = data.round_id || null;
  // Der Host publiziert die Rollen erst NACH dem Schreiben von round_id, daher kann
  // die erste Abfrage hier noch leer sein - so lange weiter versuchen, bis sie passt.
  if (roundId && (!state.rolePayload || state.syncedRoundId !== roundId)) {
    await loadOwnRolePayload(roundId);
  } else if (!roundId && !state.round) {
    state.rolePayload = null;
    state.syncedRoundId = null;
  }
  state.roundIdFromServer = roundId;
  render();
}

// Holt ausschließlich die eigene Rollen-Zeile (RLS erlaubt nur die eigene).
async function loadOwnRolePayload(roundId) {
  if (!roundId || !state.currentPlayerId) return;
  const { data, error } = await supabaseClient
    .from("player_rounds")
    .select("payload")
    .eq("lobby_code", state.lobbyCode)
    .eq("player_id", state.currentPlayerId)
    .eq("round_id", roundId)
    .maybeSingle();
  if (error) {
    console.warn("Own role payload read failed:", error);
    return;
  }
  if (data && data.payload) {
    state.rolePayload = data.payload;
    state.syncedRoundId = roundId;
    render();
  }
  // Noch keine Zeile gefunden: der Host hat round_id bereits gesetzt, aber die
  // Rollen-RPC läuft noch. Nur das Poll-Fallback/Realtime auf player_rounds
  // versucht es erneut - game_state.round_id bleibt die einzige Quelle dafür,
  // ob die Runde tatsächlich beendet wurde.
}

async function loadLatestDetectiveMessage() {
  if (!supabaseReady || !state.lobbyCode) return;
  const { data, error } = await supabaseClient
    .from("lobby_messages")
    .select("message")
    .eq("lobby_code", state.lobbyCode)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.warn("Detective message read failed:", error);
    return;
  }
  if (data && data.message) state.detectiveMessage = data.message;
}

async function syncToSupabase() {
  if (!supabaseReady || !supabaseClient || !state.lobbyCode) return true;

  try {
    const hasRound = Boolean(state.round);
    const payload = {
      id: state.lobbyCode,
      host_id: state.hostId,
      settings: state.settings,
      round_id: hasRound ? state.round.id : null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabaseClient
      .from("game_state")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      throw new Error(`Lobby konnte nicht gespeichert werden (${error.code || "Supabase"}): ${error.message}`);
    }

    if (hasRound && state.syncedRoundId !== state.round.id) {
      await publishRolePayloads(state.round);
    }

    if (!hasRound && state.syncedRoundId) {
      await supabaseClient.from("player_rounds").delete().eq("lobby_code", state.lobbyCode);
      await supabaseClient.from("lobby_messages").delete().eq("lobby_code", state.lobbyCode);
      state.rolePayload = null;
      state.syncedRoundId = null;
    }

    return true;
  } catch (error) {
    console.warn("Supabase sync failed:", error);
    showStatus(error.message || "Lobby konnte nicht gespeichert werden.");
    return false;
  }
}

// Der Host verteilt pro Spieler NUR dessen eigene Rolle. Das geheime Wort, die
// komplette Rollenzuordnung und die Impostor-Hilfswörter verlassen den Host nie als Ganzes.
async function publishRolePayloads(round) {
  const rolePayloads = buildRolePayloads(round, state.players, state.settings);
  const rows = state.players.map((player) => ({
    lobby_code: state.lobbyCode,
    player_id: player.id,
    round_id: round.id,
    payload: rolePayloads[player.id] || { key: "player", label: "Spieler", message: "Du hast keine geheime Info." },
  }));

  const { error } = await supabaseClient.rpc("publish_player_rounds", {
    round_rows: rows,
  });

  if (error) {
    // Debug: Prüfe, ob game_state Zeile mit der game_state mit korrektem host_id existiert
    const { data: gameState, error: checkError } = await supabaseClient
      .from("game_state")
      .select("id, host_id")
      .eq("id", state.lobbyCode)
      .maybeSingle();
    
    const debugInfo = gameState
      ? `game_state existiert (host_id="${gameState.host_id}", dein currentPlayerId="${state.currentPlayerId}", state.hostId="${state.hostId}")`
      : `game_state existiert NICHT für lobby_code="${state.lobbyCode}"`;
    
    const migrationHint = error.code === "42501" || error.code === "42883"
      ? " Bitte supabase/fix-player-rounds-rls.sql einmal im Supabase SQL-Editor ausführen."
      : "";
    const fullError = `Rollen konnten nicht verteilt werden (${error.code || "Supabase"}): ${error.message}.${migrationHint} [Debug: ${debugInfo}]`;
    console.error(fullError);
    throw new Error(fullError);
  }

  state.rolePayload = rolePayloads[state.currentPlayerId] || null;
  state.syncedRoundId = round.id;
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.warn("Service worker registration failed:", error);
    });
  });
}
