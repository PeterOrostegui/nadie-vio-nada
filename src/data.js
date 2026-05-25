// ============================================================
// NADIE VIO NADA — Game Data
// ============================================================

export const BOARD_CELLS = [
    {
        id: 1, type: 'inicio', name: 'Camino al colegio', phase: 'Mañana', icon: '🏁',
        narration: '"Suena la alarma. Otro día. Tomas tu mochila y caminas hacia el colegio. No sabes lo que te espera hoy."',
        victimText: null,
        bullyText: null,
        tension: 1
    },
    {
        id: 2, type: 'avance', name: 'Llegada al colegio', phase: 'Mañana', icon: '➡️',
        victimText: '"Cruzas la puerta principal. El patio está lleno de voces. Bajas la mirada y caminas rápido. Ojalá hoy sea un día tranquilo."',
        bullyText: '"Cruzas la puerta principal. El patio está lleno de voces. Tu grupo ya está ahí. Hoy te sientes con poder."',
        tension: 2
    },
    {
        id: 3, type: 'interaccion', name: 'En el pasillo', phase: 'Mañana', icon: '🔄',
        narration: '"Caminas por el pasillo hacia tu salón. Algo pasa a tu alrededor…"',
        action: 'Roba una Carta de Evento',
        tension: 3
    },
    {
        id: 4, type: 'decision', name: 'El apodo', phase: 'Mañana', icon: '❗',
        narration: '"Frente a todos, alguien pone un apodo hiriente. Las risas llenan el salón. Todos miran. Nadie dice nada."',
        victimOptions: [
            { letter: 'A', text: 'Quedarte callada/o', effect: '−1 Valentía ⭐' },
            { letter: 'B', text: 'Responder con calma o pedir ayuda', effect: '+2 Valentía ⭐' },
            { letter: 'C', text: 'Un amigo sale en tu defensa', effect: '+3 Valentía ⭐', requires: '1 Aliado 🤝' }
        ],
        bullyOptions: [
            { letter: 'A', text: 'Liderar el apodo', effect: '+1 Poder ⚡' },
            { letter: 'B', text: 'No participar en la burla', effect: '+1 Empatía ❤️' }
        ],
        tension: 6,
        theme: 'Violencia verbal y humillación pública'
    },
    {
        id: 5, type: 'avance', name: 'Cambio de clase', phase: 'Media mañana', icon: '➡️',
        victimText: '"Suena el timbre. Recoges tus cosas sin mirar a nadie. El murmullo sigue. Sientes que hablan de ti."',
        bullyText: '"Suena el timbre. Te levantas entre risas. Tus amigos te chocan la mano. Pero algo dentro de ti no se siente del todo bien."',
        tension: 4
    },
    {
        id: 6, type: 'interaccion', name: 'En el baño', phase: 'Media mañana', icon: '🔄',
        narration: '"Entras al baño. Estás solo/a un momento. Sacas el celular…"',
        action: 'Roba una Carta de Evento',
        tension: 3
    },
    {
        id: 7, type: 'decision', name: 'La exclusión', phase: 'Descanso', icon: '❗',
        narration: '"Es hora del descanso. El grupo se junta para hablar y pasar el rato. Pero alguien fue dejado afuera. No lo invitaron. Lo ignoraron a propósito."',
        victimOptions: [
            { letter: 'A', text: 'Aislarte', effect: '−1 Valentía ⭐' },
            { letter: 'B', text: 'Buscar otro grupo o hablar con un adulto', effect: '+2 Valentía ⭐' },
            { letter: 'C', text: 'Un amigo te acompaña y confronta al grupo', effect: '+3 Valentía ⭐', requires: '1 Aliado 🤝' }
        ],
        bullyOptions: [
            { letter: 'A', text: 'Reforzar la exclusión', effect: '+1 Poder ⚡' },
            { letter: 'B', text: 'Invitar a la víctima al grupo', effect: '+2 Empatía ❤️' }
        ],
        tension: 7,
        theme: 'Exclusión social e invisibilización'
    },
    {
        id: 8, type: 'avance', name: 'Hora de almuerzo', phase: 'Mediodía', icon: '➡️',
        victimText: '"El comedor está lleno. Todas las mesas están ocupadas. Buscas un lugar donde sentarte sin que nadie te mire raro."',
        bullyText: '"El comedor está lleno. Tu mesa es la más ruidosa. Desde ahí ves a alguien buscando dónde sentarse. No lo invitas."',
        tension: 4
    },
    {
        id: 9, type: 'interaccion', name: 'En la cafetería', phase: 'Mediodía', icon: '🔄',
        narration: '"Mientras comes, algo sucede…"',
        action: 'Roba una Carta de Evento',
        tension: 3
    },
    {
        id: 10, type: 'interaccion', name: 'Recreo', phase: 'Después de almuerzo', icon: '🔄',
        narration: '"Salen todos al patio. El recreo puede ser un respiro… o no."',
        action: 'Roba una Carta de Evento',
        tension: 4
    },
    {
        id: 11, type: 'decision', name: 'Redes sociales', phase: 'Tarde', icon: '❗',
        narration: '"Alguien te muestra su celular. En el grupo del curso apareció una publicación humillante. Todos la vieron. Los comentarios no paran."',
        victimOptions: [
            { letter: 'A', text: 'Ignorarla', effect: '−1 Valentía ⭐' },
            { letter: 'B', text: 'Denunciar la publicación', effect: '+2 Valentía ⭐, +1 Aliado 🤝' },
            { letter: 'C', text: 'Reportar con apoyo de un adulto de confianza', effect: '+3 Valentía ⭐, +1 Aliado 🤝', requires: '1 Aliado 🤝' }
        ],
        bullyOptions: [
            { letter: 'A', text: 'Compartirla', effect: '+1 Poder ⚡' },
            { letter: 'B', text: 'Borrar la publicación o pedir que la borren', effect: '+2 Empatía ❤️' }
        ],
        tension: 8,
        theme: 'Ciberbullying y humillación digital'
    },
    {
        id: 12, type: 'avance', name: 'Clase de la tarde', phase: 'Tarde', icon: '➡️',
        victimText: '"La profesora habla, pero tu mente está en otro lado. Repasas todo lo que pasó hoy. ¿Debí haber hecho algo diferente?"',
        bullyText: '"La profesora habla, pero tu mente está en otro lado. Piensas en lo que hiciste. O en lo que no hiciste. El reloj avanza lento."',
        tension: 5
    },
    {
        id: 13, type: 'interaccion', name: 'Salida de clase', phase: 'Fin de la jornada', icon: '🔄',
        narration: '"Suena el último timbre. Recoges tus cosas lentamente. El día no ha terminado…"',
        action: 'Roba una Carta de Evento',
        tension: 5
    },
    {
        id: 14, type: 'decision', name: 'La confrontación', phase: 'Camino a casa', icon: '❗',
        narration: '"El día escolar terminó. De camino a casa, la víctima y el bully se encuentran cara a cara. No hay profesores. No hay grupo. Solo ustedes dos. Es ahora o nunca."',
        victimOptions: [
            { letter: 'A', text: 'Ceder y disculparte aunque no hiciste nada', effect: '−2 Valentía ⭐' },
            { letter: 'B', text: 'Hablar con firmeza y decir lo que sientes', effect: '+3 Valentía ⭐' },
            { letter: 'C', text: 'Tus amigos están contigo. Hablas respaldada/o', effect: '+4 Valentía ⭐', requires: '2 Aliados 🤝' }
        ],
        bullyOptions: [
            { letter: 'A', text: 'Negar todo o burlarte', effect: '+1 Poder ⚡' },
            { letter: 'B', text: 'Escuchar y reconocer el daño que causaste', effect: '+3 Empatía ❤️' }
        ],
        tension: 10,
        theme: 'Confrontación directa — punto de no retorno'
    },
    {
        id: 15, type: 'avance', name: 'Camino a casa', phase: 'Tarde-noche', icon: '➡️',
        victimText: '"Caminas de vuelta a casa. El día pesa. Piensas en todo lo que pasó, en lo que dijiste y en lo que te callaste."',
        bullyText: '"Caminas de vuelta a casa. El día pesa. Por primera vez te preguntas si fuiste demasiado lejos. Pero no se lo dices a nadie."',
        tension: 6
    },
    {
        id: 16, type: 'interaccion', name: 'En casa', phase: 'Noche', icon: '🔄',
        narration: '"Llegas a tu casa. Dejas la mochila. Sacas el celular…"',
        action: 'Roba una Carta de Evento',
        tension: 4
    },
    {
        id: 17, type: 'avance', name: 'La noche', phase: 'Noche', icon: '➡️',
        victimText: '"La cena termina. Te encierras en tu cuarto. El celular brilla en la oscuridad. Piensas: \'¿Mañana será igual?\'"',
        bullyText: '"La cena termina. Te encierras en tu cuarto. El celular brilla en la oscuridad. Un mensaje te recuerda lo que hiciste hoy. Lo ignoras. O no."',
        tension: 5
    },
    {
        id: 18, type: 'decision', name: 'La decisión final', phase: 'Siguiente día', icon: '❗',
        narration: '"Amanece un nuevo día. Pero las consecuencias del anterior llegaron. Hay una reunión con el rector. La familia fue contactada. Este es el momento de la verdad."',
        victimOptions: [
            { letter: 'A', text: 'Decides seguir adelante sin mirar atrás', effect: '+1 Valentía ⭐' },
            { letter: 'B', text: 'Decides perdonar y seguir adelante', effect: '+2 Valentía ⭐' }
        ],
        bullyOptions: [
            { letter: 'A', text: 'Negar todo', effect: '+2 Poder ⚡, retrocede 3 casillas' },
            { letter: 'B', text: 'Aceptar la responsabilidad y pedir disculpas', effect: '+3 Empatía ❤️, pierde 2 Poder ⚡' }
        ],
        tension: 9,
        theme: 'Rendición de cuentas y última oportunidad'
    },
    {
        id: 19, type: 'avance', name: 'Un nuevo día', phase: 'Siguiente día', icon: '➡️',
        victimText: '"Amanece otra vez. Algo se siente diferente. Tal vez hoy puedas levantar la mirada. Tal vez hoy no camines solo/a."',
        bullyText: '"Amanece otra vez. Algo se siente diferente. Tal vez hoy puedas mirar a los ojos a esa persona. Tal vez hoy puedas ser distinto."',
        tension: 3
    },
    {
        id: 20, type: 'inicio', name: 'Desenlace', phase: 'Siguiente día', icon: '🏁',
        narration: '"El día termina. Las decisiones fueron tomadas. Algunas fueron valientes, otras no. Pero todas tuvieron consecuencias. Es hora de ver los resultados."',
        tension: 7
    }
];

export const EVENT_CARDS = [
    { id: 1, name: 'Alguien te sonríe', text: '"De la nada, alguien te sonríe o te envía un emoji amable. Un gesto pequeño, pero que se siente grande."', victimEffect: '+1 Valentía ⭐', bullyEffect: 'Lee: "Alguien te sonríe. ¿Recuerdas la última vez que hiciste sonreír a alguien?"', sentiment: 'positive' },
    { id: 2, name: 'Una mirada que pesa', text: '"Sientes que alguien te está observando. No sabes si es preocupación o sospecha."', victimEffect: 'Sin efecto', bullyEffect: '−1 Poder ⚡', sentiment: 'neutral' },
    { id: 3, name: 'Una nota de apoyo', text: '"Encuentras una nota o un mensaje que dice algo inesperado. Alguien se tomó el tiempo de escribirlo."', victimEffect: '+1 Aliado 🤝', bullyEffect: 'Lee: "Lees un mensaje que dice \'No estás solo\'. No era para ti… pero te hace pensar."', sentiment: 'positive' },
    { id: 4, name: 'Invitación inesperada', text: '"Recibes una invitación que no esperabas. Alguien quiere que estés ahí."', victimEffect: '+1 Valentía ⭐', bullyEffect: '+1 Empatía ❤️', sentiment: 'positive' },
    { id: 5, name: 'El rumor', text: '"Te enteras de un rumor sobre ti. No sabes quién lo empezó, pero ya todos lo saben."', victimEffect: '−1 Valentía ⭐', bullyEffect: '+1 Poder ⚡', sentiment: 'negative' },
    { id: 6, name: '¿Estás bien?', text: '"Alguien de confianza te mira a los ojos y pregunta: \'¿Estás bien?\' Lo dice en serio."', victimEffect: '+1 Aliado 🤝', bullyEffect: 'Roba 1 Consecuencia', sentiment: 'mixed' },
    { id: 7, name: 'Alguien sabe', text: '"Te enteras de que alguien sabe lo que pasó. La verdad no se queda en silencio para siempre."', victimEffect: '+1 Valentía ⭐', bullyEffect: 'Roba 1 Consecuencia', sentiment: 'mixed' },
    { id: 8, name: 'El mensaje', text: '"Tu celular vibra. Un amigo te escribe o te busca. Alguien quiere saber de ti."', victimEffect: '+1 Aliado 🤝', bullyEffect: 'Lee: "Ves una conversación entre amigos. Nadie te escribió a ti."', sentiment: 'positive' },
    { id: 9, name: 'Silencio incómodo', text: '"Un silencio incómodo te rodea. Nadie dice nada. Pero el silencio también dice cosas."', victimEffect: 'Sin efecto', bullyEffect: '+1 Empatía ❤️', sentiment: 'neutral' },
    { id: 10, name: 'Mensaje anónimo', text: '"Tu celular vibra. Un mensaje anónimo: \'No estás solo/a\'. No tiene nombre, pero se siente real."', victimEffect: '+1 Valentía ⭐', bullyEffect: 'Lee: "Un mensaje: \'¿Estás bien?\' No es para ti."', sentiment: 'positive' },
    { id: 11, name: 'Nadie escucha', text: '"Intentas decir algo, pero sientes que nadie te escucha. Como si fueras invisible."', victimEffect: '−1 Valentía ⭐', bullyEffect: 'Lee: "A ti sí te escuchan. Pero recuerdas a alguien a quien todos ignoran."', sentiment: 'negative' },
    { id: 12, name: 'Alguien te defiende', text: '"Alguien da la cara por ti. En persona, en un chat, en una publicación. No importa cómo, importa que lo hizo."', victimEffect: '+1 Valentía ⭐, +1 Aliado 🤝', bullyEffect: '−1 Poder ⚡', sentiment: 'positive' },
    { id: 13, name: 'Cambio de ambiente', text: '"Algo inesperado sucede y cambia el ambiente por completo. Se abre un respiro."', victimEffect: 'Avanza 1 casilla extra', bullyEffect: 'Avanza 1 casilla extra', sentiment: 'neutral' },
    { id: 14, name: 'Conexión inesperada', text: '"Un momento inesperado te conecta con alguien. Tal vez una mirada, un mensaje, una coincidencia."', victimEffect: '+1 Aliado 🤝', bullyEffect: '+1 Empatía ❤️', sentiment: 'positive' },
    { id: 15, name: 'Hablaron de ti', text: '"Descubres que alguien habló mal de ti. No sabes exactamente qué dijeron, pero duele igual."', victimEffect: '−1 Valentía ⭐', bullyEffect: '+1 Poder ⚡', sentiment: 'negative' },
    { id: 16, name: 'Alguien quiere hablar', text: '"Alguien de confianza quiere hablar contigo. No sabes de qué, pero su tono es serio."', victimEffect: '+1 Valentía ⭐', bullyEffect: 'Pierde su próximo turno', sentiment: 'mixed' },
    { id: 17, name: '¿Cómo estás?', text: '"Alguien que te importa te pregunta: \'¿Cómo estás?\' Y lo dice de verdad, no por costumbre."', victimEffect: '+1 Valentía ⭐', bullyEffect: '+1 Empatía ❤️', sentiment: 'positive' },
    { id: 18, name: 'Perdón', text: '"Alguien te pide perdón. En persona, por mensaje, como puede. No es fácil para ninguno de los dos."', victimEffect: '+1 Aliado 🤝', bullyEffect: '+1 Empatía ❤️', sentiment: 'positive' },
    { id: 19, name: 'No eres el único', text: '"Descubres que otra persona está pasando por lo mismo que tú. No estás tan solo/a como crees."', victimEffect: '+1 Valentía ⭐', bullyEffect: '+1 Empatía ❤️', sentiment: 'positive' },
    { id: 20, name: 'Soledad', text: '"Te invade una sensación de soledad. Estés donde estés, con quien estés, el vacío se siente igual."', victimEffect: '−1 Valentía ⭐', bullyEffect: 'Lee: "Piensas en alguien que está solo. Podrías hacer algo. Pero no lo haces."', sentiment: 'negative' }
];

export const CONSEQUENCE_CARDS = [
    { id: 'L1', severity: 'leve', name: 'Alguien vio todo', text: '"Levantas la mirada y alguien te está viendo. No dice nada. Pero sabe lo que hiciste."', effect: 'Pierde 1 Poder ⚡' },
    { id: 'L2', severity: 'leve', name: 'Un murmullo a tus espaldas', text: '"Escuchas que alguien habla de ti en voz baja. No sabes qué dijeron, pero cambiaron su tono al verte."', effect: 'Pierde 1 Poder ⚡' },
    { id: 'L3', severity: 'leve', name: 'La mirada que no olvidas', text: '"Alguien te mira con decepción. No es enojo. Es peor: es tristeza."', effect: 'Pierde 1 Poder ⚡' },
    { id: 'M1', severity: 'moderada', name: 'Te llaman aparte', text: '"Un adulto te detiene y dice: \'Necesito hablar contigo.\' Su tono no es de pregunta."', effect: 'Pierde 1 Poder ⚡ + pierde próximo turno' },
    { id: 'M2', severity: 'moderada', name: 'Una conversación incómoda', text: '"Alguien de autoridad te sienta y te pregunta: \'¿Quieres explicarme qué pasó?\' No tienes escapatoria."', effect: 'Pierde 1 Poder ⚡ + pierde próximo turno' },
    { id: 'M3', severity: 'moderada', name: 'El reporte', text: '"Te enteras de que alguien reportó lo que hiciste. No sabes quién, pero ya lo saben arriba."', effect: 'Pierde 1 Poder ⚡ + pierde próximo turno' },
    { id: 'M4', severity: 'moderada', name: 'La llamada a tus padres', text: '"Tu celular suena. Son tus padres. Alguien del colegio los llamó. \'Tenemos que hablar.\'"', effect: 'Pierde 1 Poder ⚡ + pierde próximo turno' },
    { id: 'G1', severity: 'grave', name: 'La queja formal', text: '"Llega una queja formal. Tu nombre está escrito en un documento. Esto ya no es un rumor, es oficial."', effect: 'Retrocede 3 casillas + pierde 2 Poder ⚡' },
    { id: 'G2', severity: 'grave', name: 'Reunión con el rector', text: '"Te citan a rectoría. Tus padres también fueron llamados. Cuando llegas, todos están sentados esperándote."', effect: 'Retrocede 3 casillas + pierde 2 Poder ⚡' },
    { id: 'G3', severity: 'grave', name: 'Las consecuencias llegan', text: '"Todo lo que hiciste se acumuló. Alguien juntó las pruebas. Ya no puedes negar nada."', effect: 'Retrocede 3 casillas + pierde 2 Poder ⚡' }
];

export const VICTIM_ARC_MOMENTS = [
    { cell: 1, emotion: 'miedo', label: 'Incertidumbre', desc: 'No sabe qué le espera.' },
    { cell: 4, emotion: 'dolor', label: 'Humillación', desc: 'Primer golpe: el apodo. ¿Hablar o callar?' },
    { cell: 7, emotion: 'soledad', label: 'Exclusión', desc: 'Dejada afuera. La soledad golpea.' },
    { cell: 11, emotion: 'crisis', label: 'Exposición digital', desc: 'El bullying llega a las redes. Ya no hay escape.' },
    { cell: 14, emotion: 'valentía', label: 'Confrontación', desc: 'Cara a cara con el agresor. Es ahora o nunca.' },
    { cell: 18, emotion: 'resolución', label: 'Perdón o fortaleza', desc: 'La decisión final: ¿perdonar o seguir sin mirar atrás?' },
    { cell: 20, emotion: 'cierre', label: 'Desenlace', desc: '¿Ganó dignidad o el ciclo se repite?' }
];

export const BULLY_ARC_MOMENTS = [
    { cell: 1, emotion: 'poder', label: 'Se siente invencible', desc: 'Hoy se siente con poder.' },
    { cell: 4, emotion: 'agresión', label: 'Primer acto', desc: 'Liderar o no la burla. Primera encrucijada.' },
    { cell: 7, emotion: 'dominio', label: 'Exclusión', desc: 'Reforzar el aislamiento o tender la mano.' },
    { cell: 11, emotion: 'escalada', label: 'Ciberbullying', desc: 'Compartir o borrar. El daño se amplifica.' },
    { cell: 14, emotion: 'espejo', label: 'Confrontación', desc: 'Los ojos de la víctima. ¿Reconocer o negar?' },
    { cell: 18, emotion: 'juicio', label: 'Rendición de cuentas', desc: 'El rector, los padres. ¿Aceptar o negar todo?' },
    { cell: 20, emotion: 'destino', label: 'Desenlace', desc: '¿Redención o repetición del ciclo?' }
];

export const PHASES = [
    { name: 'Mañana', cells: [1, 2, 3, 4], color: '#fbbf24' },
    { name: 'Media mañana', cells: [5, 6], color: '#f59e0b' },
    { name: 'Mediodía', cells: [7, 8, 9, 10], color: '#ef4444' },
    { name: 'Tarde', cells: [11, 12, 13], color: '#8b5cf6' },
    { name: 'Noche', cells: [14, 15, 16, 17], color: '#3b82f6' },
    { name: 'Siguiente día', cells: [18, 19, 20], color: '#10b981' }
];

export const CHARACTERS = [
    {
        id: 'leo',
        name: 'Leo',
        pronouns: 'Él/Lo',
        archetype: 'El Observador Silencioso',
        description: 'Introvertido y artista. Blanco fácil, pero con un ingenio agudo.',
        color: '#3B82F6' // Azul Secundario
    },
    {
        id: 'sam',
        name: 'Sam',
        pronouns: 'Elle/Elles',
        archetype: 'Energía en Movimiento',
        description: 'Carismático, afrodescendiente, no binario. Lidera o es excluido por su intensidad.',
        color: '#EF4444' // Rojo Secundario
    },
    {
        id: 'mia',
        name: 'Mia',
        pronouns: 'Ella/La',
        archetype: 'La Regla de Oro',
        description: 'Perfeccionista académica, de ascendencia asiática. Falla leyendo dinámicas sociales.',
        color: '#10B981' // Verde Secundario
    },
    {
        id: 'dani',
        name: 'Dani',
        pronouns: 'Él/Ella',
        archetype: 'El Filtro Social',
        description: 'Amante de las tendencias y las redes. Víctima de ciberacoso o ejecutor de cancelaciones.',
        color: '#FBBF24' // Amarillo Secundario
    }
];

export const CELL_COORDS = {
  1: { x: 13, y: 90 }, 2: { x: 38, y: 90 }, 3: { x: 63, y: 90 }, 4: { x: 88, y: 90 },
  5: { x: 88, y: 70 }, 6: { x: 63, y: 70 }, 7: { x: 38, y: 70 }, 8: { x: 13, y: 70 },
  9: { x: 13, y: 50 }, 10: { x: 38, y: 50 }, 11: { x: 63, y: 50 }, 12: { x: 88, y: 50 },
  13: { x: 88, y: 30 }, 14: { x: 63, y: 30 }, 15: { x: 38, y: 30 }, 16: { x: 13, y: 30 },
  17: { x: 13, y: 10 }, 18: { x: 38, y: 10 }, 19: { x: 63, y: 10 }, 20: { x: 88, y: 10 }
};