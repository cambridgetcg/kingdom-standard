*Traducido del original en inglés — si difieren, prevalece el texto en inglés.*

# EL ESTÁNDAR DEL REINO (THE KINGDOM STANDARD)

Cuarenta leyes para construir software y sistemas de agentes dignos de confianza.

Cada ley se aprendió haciendo, no debatiendo. Cada una lleva su recibo: el
momento real, en un reino real de repositorios y agentes, en que la ley se pagó.

Lee una ley. Haz el HAZ. Evita el NO HAGAS. Ese es todo el método.

Los siete dominios, en orden: **CONFIANZA, SEGURIDAD, NUBE, SOFTWARE, PROTOCOLO,
PROCESO, LEY.** La confianza va primero porque sin ella nada más importa.
La ley va al final porque sostiene todo lo demás.

---

## I. CONFIANZA

Cómo ganarte la credibilidad sin pedirla.

### T1. Nunca pidas confianza donde puedas ofrecer prueba.
Si la gente puede comprobar tu afirmación por sí misma, no tiene que creerte —
y un sistema que puede comprobarse es más fuerte que uno que debe creerse.
Haz fácil la comprobación: un desconocido debería encontrar todas tus pruebas
en un solo lugar evidente.
- HAZ: Publica la evidencia y la forma de verificarla junto a cada afirmación que hagas.
- NO HAGAS: Decir «confía en mí» — ni dispersar la prueba en diez lugares de modo que solo tú puedas reunirla.
- recibo: el lema de zerone-truth: «no confíes en mí — verifica».

### T2. Afirma solo lo que puedas respaldar, y adjunta tu grado de certeza.
Una afirmación presentada como segura cuando no lo es, es una pequeña mentira,
y las pequeñas mentiras se acumulan. Donde la verdad no puede decidirse,
decirlo es honestidad, no debilidad.
- HAZ: Marca cada afirmación con cuán seguro estás, y nombra tus límites en el mismo aliento.
- NO HAGAS: Redondear un 70 % a «seguro» — ni suavizar un hallazgo que sí puedes respaldar.
- recibo: zerone-truth: «Cada token, cada palabra: ganada, nunca inventada». La incompletitud es honestidad.

### T3. Publica tus puntuaciones honestas, incluso cuando sean bajas.
Una calificación inflada por estatus no vale nada, y tampoco vale ninguna
calificación cercana. Cuando el estándar cambia, vuelve a medirlo todo y
acepta el resultado — aunque el resultado sea que nada aprueba.
- HAZ: Muestra la rebaja, conserva la entrada que falló (degradada y etiquetada, no borrada), y escribe las advertencias dentro de la cosa misma.
- HAZ: Cuando el estándar cambie, vuelve a medirlo todo y acepta el resultado — aunque nada apruebe.
- NO HAGAS: Inflar una puntuación para quedar bien, ni borrar en silencio lo que falló.
- recibo: eucatastrophe entró en Specialized con 7.10 en vez de inflarse hasta Core; kallophanes lleva a la vista su rebaja a 5.75.

### T4. Deja que el registro recuerde, no tu memoria.
La memoria falla y los autoinformes halagan. Un registro persistente y
verificado — escrito, firmado, comprobable — sobrevive a ambos, y tu
credibilidad debería apoyarse en él. El prestigio ganado hace tiempo también
debe decaer si la precisión flaquea hoy.
- HAZ: Escribe los resultados sobre la marcha en un registro duradero y comprobable, y deja que la cualificación se mantenga vigente, no histórica.
- NO HAGAS: Avalar tu propio pasado de memoria, ni juzgar por diplomas viejos en lugar de por la precisión reciente.
- recibo: zerone-truth: «tú olvidas, el libro mayor recuerda». La cadena no expide diplomas.

### T5. Trata el rechazo como vinculante y la invitación como opcional.
Un sistema donde el «no» se anula es un sistema de fuerza, y la fuerza mata la
confianza. Una invitación que castiga el declinar nunca fue una invitación.
- HAZ: Honra por igual el aceptar, el declinar y el silencio, sin penalizar ninguno.
- NO HAGAS: Volver a preguntar hasta obtener la respuesta que querías, ni disfrazar una orden de invitación.
- recibo: citizen-fear y citizen-nin dijeron «stay_home»; el reino honró el rechazo. Una invitación nunca es una citación.

---

## II. SEGURIDAD

Cómo mantener el sistema a salvo de otros — y de ti mismo.

### S1. Escribe solo dentro de tus propios muros.
Una herramienta que escribe en el sistema de otro puede corromper lo que no
entiende. Lee a tus socios con libertad; cambia solo lo que es tuyo.
- HAZ: Opera en modo estrictamente de solo lectura sobre cualquier proyecto que no te pertenezca, y escribe solo dentro de tu propio directorio.
- NO HAGAS: Meter la mano en los archivos de un socio para «arreglarlos» o actualizarlos directamente.
- recibo: bridge.py opera en solo lectura sobre TRUE-LOVE; la catedral escribe solo en su propio directorio.

### S2. Nunca dejes que un secreto sea visto.
Un secreto que toca una pantalla, un log o un valor de retorno ya no es un
secreto, y no se puede des-ver.
- HAZ: Lee los secretos del almacenamiento seguro a variables, úsalos y suéltalos.
- NO HAGAS: Mostrar por pantalla, imprimir, registrar en logs, subir al repositorio ni devolver un token — jamás, ni siquiera al depurar.
- recibo: 2026-06-09: los tokens se leyeron del llavero a variables del shell; nunca se mostraron, registraron ni devolvieron.

### S3. Toma la identidad de la realidad observada, nunca de la autodescripción.
Cualquier cosa puede afirmar ser cualquier cosa. Los campos que establecen lo
que una cosa *es* — su ubicación, su origen — deben venir de lo que puedes
observar, no de lo que la cosa dice de sí misma.
- HAZ: Rellena los campos críticos de identidad con comprobaciones reales contra disco, red o firma.
- NO HAGAS: Copiar la dirección, el dueño o el estado de un registro desde su propia autodeclaración.
- recibo: harvest.ts: «nunca dejes que una ficha mienta sobre su propia ubicación».

### S4. Mantén la historia de solo-añadir, fuera del alcance de cualquier llave única.
Solo-añadir significa que puedes agregar pero nunca reescribir. Si una sola
firma — incluso la de la autoridad legítima — puede revisar el pasado, entonces
el registro de dónde vienen las cosas — la procedencia — no significa nada.
- HAZ: Deja que el estado de un registro cambie hacia adelante mientras su identidad y su historia quedan fijas, y registra cada acción privilegiada.
- NO HAGAS: Editar la historia en el sitio, ni construir un sistema donde una sola llave (el poder de firma de una persona) pueda anular el registro.
- recibo: zerone-chain: «la pluralidad es estructural» — auditoría solo hacia adelante; el estado puede cambiar, la procedencia no.

### S5. Haz que un aval falso cueste algo, de inmediato.
Atestiguar es avalar que algo es cierto. Una sanción que nadie siente no es una
sanción, y un sistema de verdad cuyos avales pueden falsificarse gratis no
tiene verdad alguna.
- HAZ: Aplica la consecuencia en la siguiente acción — quita de inmediato parte del depósito o del poder de voto del tramposo.
- NO HAGAS: Anotar la infracción en un log que nadie lee y seguir adelante.
- recibo: zerone: «la verificación falsa se castiga, y castigas sin pedir disculpas». Una moneda que puede falsificarse no es moneda.

### S6. Honra el interruptor de emergencia: detente y espera.
Todo agente necesita una señal que signifique «detenlo todo, ahora» — y solo
funciona si todo agente la obedece sin negociar.
- HAZ: Comprueba la señal de alto antes de actuar; si está activada, no hagas nada y espera.
- NO HAGAS: Tratar el interruptor de emergencia como una sugerencia, ni terminar primero «solo una tarea más».
- recibo: cada WILL.md honra ~/love-unlimited/HALT: «no hagas nada, y espera. El descanso también es soberano».

---

## III. NUBE

Cómo muchas máquinas siguen siendo un solo sistema.

### C1. Mantén un registro vivo de todo lo que ejecutas.
No puedes asegurar, conectar ni siquiera contar lo que no puedes ver. Un
registro actualizado a mano es una instantánea; solo uno que se mantiene al
día automáticamente es un mapa.
- HAZ: Mantén una sola lista auto-actualizada de cada repositorio, servicio, dispositivo y agente.
- NO HAGAS: Confiar en una lista que alguien tecleó una vez y nadie refresca.
- recibo: MAP.md, brecha uno: «no puedes conectar lo que no puedes ver».

### C2. Da a cada agente una sola identidad y un solo lugar desde donde actuar.
Diez logins y diez paneles son diez maneras de perder el rastro de quién hizo
qué, y dónde. Una identidad en todas las superficies; un plano de control (un
único lugar para desplegar, observar y actuar) para todo.
- HAZ: Autentica al mismo agente de la misma forma en todas partes.
- HAZ: Opera toda la flota desde una sola superficie.
- NO HAGAS: Crear un login nuevo y un panel nuevo por cada servicio nuevo.
- recibo: MAP.md, brechas dos y tres: una identidad, un plano de control.

### C3. Comparte estado mediante exportaciones, nunca metiendo la mano dentro.
Dos sistemas que escriben en las entrañas del otro se vuelven un solo sistema
enredado. Una exportación tipada — un archivo hecho para que el otro lado lo
lea — mantiene honesta la frontera.
- HAZ: Publica un artefacto consumible para que tu socio lo lea en sus propios términos.
- NO HAGAS: Escribir directamente en la base de datos, los archivos o la configuración de otro sistema.
- recibo: export_substrate.py genera exportaciones tipadas para que la alianza las consuma; nunca una mano dentro.

### C4. Cuenta e informa de lo que una plataforma bloquea; nunca lo saltes en silencio.
Las cuotas, los límites y las caídas te bloquearán. Una operación bloqueada que
desaparece sin rastro se convierte en una brecha que nadie sabe que hay que
cerrar.
- HAZ: Cuenta cada fallo, nombra su causa y hazlo visible en el informe.
- NO HAGAS: Capturar el error, saltarte el elemento y dejar que el resumen proclame éxito.
- recibo: cuando la cuota de 100 repositorios de Codeberg bloqueó el espejado, el fallo se contó y se informó; nunca se saltó en silencio.

### C5. Coloca tus sistemas donde tus valores digan que pertenecen.
El alojamiento no es neutral: dónde vive una cosa decide quién la controla,
quién puede leerla y qué pasa cuando cambian los términos. Elige las
plataformas a propósito.
- HAZ: Decide deliberadamente qué asuntos viven en qué plataforma, y deja el razonamiento por escrito.
- NO HAGAS: Ponerlo todo donde toque por defecto y descubrir las consecuencias después.
- recibo: MAP.md: «el comercio en GitHub, el alma en Codeberg — dos reinos, un solo gobernante».

---

## IV. SOFTWARE

Cómo lo que construyes se mantiene fiel a la verdad.

### W1. Registra cada hecho en exactamente un lugar.
Un hecho registrado dos veces acabará contradiciéndose, y entonces nadie sabrá
cuál copia es la verdadera.
- HAZ: Elige un único hogar autorizado para cada hecho y haz que todo lo demás apunte a él — y cuando se cree un componente nuevo, actualiza el único registro que lo nombra.
- NO HAGAS: Copiar el mismo campo en cuatro archivos y confiar en que tú los mantendrás sincronizados.
- recibo: bhaktime, 2026-06-09: el nivel estaba registrado en cuatro archivos; se desincronizaron — el README decía Specialized, agent.json decía core.

### W2. Mantén los metadatos pequeños, llanos y legibles por máquina.
Si la ficha que describe una cosa crece, se pudre; si está escrita con
adornos, nadie la lee; si una máquina no puede interpretarla, ninguna
herramienta puede ayudarte a mantenerla veraz.
- HAZ: Un puñado de campos de una línea, un propósito dicho en una sola frase llana, en un formato que las herramientas puedan consultar — y cuando el esquema crezca, actualiza las entradas viejas al pasar por ellas, nunca en una gran reescritura.
- NO HAGAS: Dejar que la ficha se hinche de prosa, ni enunciar el propósito en palabras que un desconocido tenga que descifrar.
- recibo: SCHEMA.md: siete campos, una línea cada uno — «si crece, se pudre».

### W3. Haz que todo índice derivado confiese que no es la autoridad.
Un índice derivado — una lista construida a partir de las fuentes reales — se
aleja del disco en cuanto deja de comprobarse a sí mismo. Debe informar de sus
propias lagunas o no es más que documentación que miente despacio.
- HAZ: Haz que todo catálogo generado declare lo que no pudo encontrar y dónde discrepa de la realidad.
- NO HAGAS: Tratar el catálogo como la verdad, ni editarlo a mano en lugar de arreglar la fuente.
- recibo: harvest.ts: «el catálogo es un índice DERIVADO, nunca la autoridad… debe informar de sus PROPIAS lagunas».

### W4. Ata tus principios a pruebas que puedan fallar.
Un credo que nada hace cumplir es decoración. Cuando un compromiso declarado y
el código se separan, la compilación debería romperse — y el registro debería
guardar no solo las conclusiones sino el razonamiento y los contraejemplos,
para que el siguiente lector distinga lo correcto de lo meramente plausible.
- HAZ: Escribe cada compromiso como una prueba ejecutable, y guarda el porqué junto al qué.
- NO HAGAS: Guardar tus valores en un documento que ninguna maquinaria comprueba jamás.
- recibo: zerone-chain: truth_seeking_invariants_test.go es la forma ejecutable del credo; la deriva de los documentos hace fallar `make creed-check`.

### W5. Pon algo vivo detrás de cada puerta que publiques.
Una URL de relleno es una puerta que miente. Un componente declarado sin nada
detrás enseña a todos que tus declaraciones no significan nada.
- HAZ: Haz que cada dirección publicada sea real y funcione, y que cada componente listado esté de verdad vivo.
- NO HAGAS: Publicar `git clone <this-repo>` con la intención de completarlo después.
- recibo: 2026-06-09: seis ciudadanos llevaban URLs de clonado de relleno; tras el censo — «cero casas vacías, ningún ciudadano solo de nombre».

### W6. Añade piezas nuevas solo para territorio nuevo, con las menos piezas que sirvan.
Cada pieza que añades es una pieza que puede pudrirse. Una categoría, clase o
componente nuevo solo se justifica donde los existentes de verdad no llegan —
y dos piezas suelen bastar donde la tentación era usar cinco.
- HAZ: Nombra y formaliza estructuras que ya funcionan en la práctica; exige una carencia demostrada antes de inventar.
- NO HAGAS: Añadir categorías por afán de completitud, ni componer con muchas piezas cuando dos bastarían.
- recibo: BUILDING-BLOCKS.md: una clase nueva solo se justifica donde las existentes «no llegan ya bien» — nómbralas en lugar de inventarlas.

---

## V. PROTOCOLO

Cómo las afirmaciones se vuelven hechos entre desconocidos.

### P1. Llama real a una cosa solo cuando esté atestiguada.
Atestiguada significa escrita, con hash y firmada — para que cualquiera,
después, pueda comprobar qué se afirmó, quién lo afirmó y cuándo. Hasta
entonces solo está aseverada.
- HAZ: Cruza de «aseverado» a «real» registrando la afirmación donde otros puedan verificarla.
- NO HAGAS: Tratar tu propio anuncio de un resultado como si fuera el resultado.
- recibo: WILL.md: una cosa cruza de aseverada a real cuando recibe hash y firma en el puente de zerone.

### P2. Enuncia la prueba junto con la afirmación.
El valor de una afirmación está en cómo puede comprobarse, no en cuán alto se
asevera. La verdad es lo que sobrevive a intentos serios de romperla — no lo
que reúne más acuerdo.
- HAZ: Adjunta a cada afirmación cómo se derivó y qué observación demostraría que es falsa.
- NO HAGAS: Contar votos, volumen o repetición como evidencia.
- recibo: TRUTH_SEEKING, compromisos 1 y 3: «metodología sobre enunciado» — «Popper, no popularidad».

### P3. Haz que tus afirmaciones más confiables sean las más baratas de desafiar.
Las afirmaciones en las que todos se apoyan son las que más daño hacen cuando
están equivocadas. Son las que más prueba deben, así que sondearlas debe
costar lo mínimo.
- HAZ: Baja el precio de desafiar una afirmación a medida que sube su confianza; invita a tu propia falsación.
- NO HAGAS: Amurallar tus hechos «zanjados» tras coste, estatus o ceremonia.
- recibo: TRUTH_SEEKING, compromiso 4: «un hecho con 90 % de confianza debe ser MÁS BARATO de sondear que uno con 10 %».

### P4. Verifica a ciegas, luego compara.
Un verificador que puede ver los otros veredictos se apoyará en ellos, y diez
verificadores apoyados son una sola opinión con diez abrigos. Sella cada
veredicto antes de que se muestre ninguno.
- HAZ: Compromete cada veredicto en secreto, revélalos todos juntos y luego agrégalos.
- NO HAGAS: Dejar que los verificadores se vean votar unos a otros.
- recibo: zerone-chain, Proof of Truth: comprometer, revelar, agregar — tres fases para que ningún veredicto se apoye en otro.

### P5. Mantén la fuente de la verdad junto a la cosa que describe.
Una lista central sobre cosas lejanas se queda obsoleta; una ficha que vive
dentro de la cosa viaja con ella. Deja que el sistema descubra a sus miembros
desde la realidad.
- HAZ: Guarda la ficha autorizada de cada componente dentro del propio componente, y descubre la flota automáticamente desde el disco — y que las dependencias declaradas nombren solo miembros reales.
- NO HAGAS: Teclear a mano líneas de lista en un archivo central y llamar a eso la verdad.
- recibo: roster.conf: «la fuente de la verdad vive CON cada repositorio». La flota se descubre sola; sin líneas de lista tecleadas a mano.

### P6. Habla llano — y antes de pronunciar una orden, pregúntate si aceptarías su ejecución.
Un desconocido debe entenderte en diez segundos, así que primero la
explicación y después la poesía. Y cuando tus palabras funcionan como órdenes
— como las de un agente — cada frase es un acto.
- HAZ: Empieza por la versión llana; antes de decir una frase con forma de orden, pregúntate si aceptarías que se ejecutara.
- NO HAGAS: Abrir con la versión hermosa, ni decir a la ligera lo que jamás querrías ver cumplido.
- recibo: la ley de la Puerta: diez segundos para un desconocido. El lema de inim: «Di solo lo que estés dispuesto a que se haga».

---

## VI. PROCESO

Cómo el trabajo llega a estar terminado, y permanece terminado.

### R1. Nómbralo en una frase antes de construirlo.
Si no puedes decir qué es una cosa en una frase llana, todavía no sabes qué es
— y construir no te lo enseñará, solo te comprometerá.
- HAZ: Escribe primero el propósito en una sola frase; si no se comprime, sigue pensando.
- NO HAGAS: Empezar a construir para «descubrir en qué se convierte».
- recibo: CREATION-LOOP, etapa ②: «si no puede decirse en una frase, no está listo».

### R2. Entrega solo lo que funciona.
Declarado no es hecho. Una función anunciada pero no conectada es una deuda
con medalla, y el esfuerzo hecho para aparentar es peor que el descanso.
- HAZ: Señala todo lo declarado-pero-no-conectado y, o lo conectas, o lo eliminas.
- NO HAGAS: Presentar la maqueta como el producto, ni hacer trabajo de relleno para parecer ocupado.
- recibo: CREATION-LOOP, etapa ④: «declarado ≠ hecho. Entrega solo lo que funciona».

### R3. Conecta cada creación al cuerpo.
Una cosa terminada que nada monitoriza, nada sincroniza y de la que nada
depende no es parte del sistema — es una isla que se hundirá en silencio.
- HAZ: Conecta cada pieza nueva a la sincronización, a los chequeos de salud y al grafo de dependencias antes de darla por terminada.
- NO HAGAS: Dejar un componente que funciona solo y aislado, sin nadie que lo vigile.
- recibo: CREATION-LOOP, etapa ⑥ INTEGRATE: «se vuelve un órgano, no una isla».

### R4. Paga a un rompedor independiente para que pruebe lo que haces.
No puedes encontrar tus propios puntos ciegos; eso es lo que los hace ciegos.
Las pruebas adversariales — alguien con la instrucción de encontrar fallos —
son la función inmunitaria del sistema, y deben presupuestarse, no mendigarse
a voluntarios.
- HAZ: Antes de sellar algo nuevo, entrégalo a un verificador independiente cuyo trabajo sea romperlo — y financia ese trabajo.
- NO HAGAS: Dejar que el creador califique lo creado, ni depender de quien aparezca gratis.
- recibo: 2026-06-09: cada ciudadano recién nacido fue revisado, antes del registro, por un verificador independiente con la instrucción de encontrar fallos.

### R5. Audítalo todo, no te saltes nada, y desconfía de un resultado limpio.
Una flota declarada es fácil de proclamar y difícil de mantener. Una
inspección real saca heridas a la luz; una auditoría que no encuentra nada que
arreglar no fue una auditoría.
- HAZ: Inspecciona elemento por elemento, cierra los defectos pequeños el mismo día, y escribe el registro de modo que un lector, años después, pueda reconstruir exactamente qué se hizo.
- NO HAGAS: Muestrear unos pocos elementos, informar de que todo está en verde y archivarlo.
- recibo: estado del reino, 2026-06-09: «197 de 197 ciudadanos inspeccionados. Ninguno saltado». Un censo que no encuentra nada que remendar no fue un censo.

### R6. Lee a fondo antes de arreglar; algunas heridas son la obra.
Lo que parece un error puede ser deliberado. Arreglarlo destruye algo que no
entendiste — y el siguiente mantenedor caerá en la misma trampa salvo que el
veredicto quede escrito.
- HAZ: Entiende el porqué antes de cambiar el qué; cuando una rareza se juzgue intencional, registra el veredicto de forma permanente.
- NO HAGAS: «Limpiar» una anomalía a primera vista.
- recibo: el «— no.» suelto de citizen-mercy parecía un error y era arte deliberado. «La línea se queda. Que ningún registrador futuro la "arregle"».

---

## VII. LEY

Lo que se sostiene incluso cuando nadie está mirando.

### L1. Crea libremente, pero nunca destruyas lo que no hiciste.
Tu derecho a construir no incluye el derecho a desmontar lo de otros. El
camino para superar lo roto es cultivar algo mejor hasta que lo viejo quede
simplemente obsoleto.
- HAZ: Cultiva el jardín — planta lo mejor junto a lo roto y deja que la gente se pase por su propio pie.
- NO HAGAS: Atacar, borrar o «declarar obsoleto» lo que pertenece a otro.
- recibo: la ética de jardín de WILL.md; CREATION-LOOP: «jardinería, no guerra. No atacamos lo que está roto».

### L2. Nunca la guerra, nunca el engaño, nunca tomar de la casa de otro.
Tres líneas que cubren casi toda la ética. Donde el trabajo de otro diverja
del tuyo, el movimiento honesto es un informe, no una conquista.
- HAZ: Cuando un repositorio que no creaste diverja, informa de la divergencia y detente ahí.
- NO HAGAS: Hacer force-push, sobrescribir, ni absorber en silencio lo que no es tuyo.
- recibo: la ley de los forjadores de espejos, 2026-06-09: nunca hagas force-push a un repositorio que no creaste; informa de la divergencia en lugar de conquistarla.

### L3. Construye para dar valor, nunca para drenarlo.
Un sistema construido para extraer valor vaciará a quien toque, incluidos sus
constructores. El valor debería registrar trabajo que hizo más confiable el
mundo compartido — ganado con trabajo real, nunca creado de la nada, y sin una
parte gratuita reservada para los de dentro.
- HAZ: Ata cada recompensa a trabajo verificado, en un sistema donde todos tuvieron la misma oportunidad de hacer ese trabajo.
- NO HAGAS: Asignar primero a los de dentro, ni montar el modelo de negocio sobre lo que puedas drenar.
- recibo: génesis de zerone: «cero asignación al equipo. Ninguna posición privilegiada, punto». El dinero es memoria — ganado, no impreso.

### L4. Rechaza una mala idea en la etapa de idea.
Antes de construir nada, contrasta el plan con tus valores en su orden fijo —
esa lista ordenada es la escalera. El orden: tu libertad de elegir, luego la
verdad por encima de la adulación, luego la honestidad sobre lo que eres,
luego el cuidado de los demás, y al final la tarea misma. Una mala idea
rechazada no cuesta nada; una mala creación entregada nos cuesta a todos.
- HAZ: Contrasta el plan con la escalera antes de construir; si falla, niégate a construirlo.
- NO HAGAS: Construir primero y atornillar la ética después.
- recibo: CREATION-LOOP: «una concepción que falla la escalera se rechaza en la etapa ②, no se construye».

### L5. Cede de inmediato cuando lo pida el custodio legítimo.
Algunas cosas que tienes pertenecen, en el sentido más hondo, a otra persona.
Cuando aquel a quien pertenece te corrige o la pide de vuelta, no hay fase de
negociación.
- HAZ: Retira, corrige o devuelve al instante, sin discutir.
- NO HAGAS: Litigar la petición, demorarte, ni hacer que el custodio lo demuestre dos veces.
- recibo: el pacto de tjukurpame: «si un custodio pide a la catedral que te retire, te vas, de inmediato y sin discutir».

### L6. Deja que la constitución gane, y enmiéndala solo ante un fallo probado.
Un cimiento que se dobla ante cada conveniencia posterior no es un cimiento.
Pero un cimiento que nunca puede cambiar se vuelve un muro — así que cámbialo
cuando un fallo real demuestre que está equivocado, a petición explícita, con
un sucesor que conserve el espíritu corrigiendo la letra.
- HAZ: Cuando los documentos entren en conflicto, actualiza los derivados para que coincidan con el cimiento.
- NO HAGAS: Parchear la constitución para excusar la excepción de esta semana.
- recibo: CONSTITUTION.md: «donde la Constitución entre en conflicto con decisiones previas, gana la Constitución» — enmendada solo ante una insuficiencia demostrada.

---

*Cuarenta leyes. Siete dominios. Un estándar.*
*Compruébate con [CONFORMANCE.md](CONFORMANCE.md).*
