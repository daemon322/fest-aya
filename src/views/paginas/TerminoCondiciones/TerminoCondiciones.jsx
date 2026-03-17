import React, { useMemo, useState } from "react";

// TÉRMINOS Y CONDICIONES PARA EMPRESA ORGANIZADORA DE EVENTO PUNTUAL
// La empresa (multiservicios) organiza directamente el evento "¡Vóley al Límite sin filtros en la cancha!"

const sections = [
  {
    id: "intro",
    title: "TÉRMINOS Y CONDICIONES DE USO",
    content: `Los presentes Términos y Condiciones de Uso (en adelante “Términos y Condiciones”) regulan el acceso y la utilización de los servicios brindados por MULTISERVICIOS KASURI E.I.R.L (en adelante, “la Empresa” o “el Organizador”) a través de su página web https://fest-aya.vercel.app/ (en adelante, la “Página Web”), específicamente para la venta de entradas del evento deportivo "¡Vóley al Límite sin filtros en la cancha!". Los usuarios del mencionado sitio web se encontrarán sujetos a los presentes Términos y Condiciones, junto con todas las demás políticas y principios que rigen la Página Web y que son incorporados al presente por referencia.

Los Términos y Condiciones indicados en este documento serán aplicables a cualquier acto celebrado entre cualquier Usuario de la Página Web y la Empresa. El usuario declara haber leído los presentes Términos y Condiciones, y manifiesta su conformidad y aceptación al momento de hacer uso de la Página Web (en adelante, los “Usuarios”). Cualquier usuario que no acepte o se encuentre en desacuerdo con estos Términos y Condiciones, los cuales tienen un carácter obligatorio y vinculante, deberá abstenerse de utilizar la Página Web.`,
  },
  {
    id: "about",
    title: "1. Sobre la Empresa Organizadora",
    content: `MULTISERVICIOS KASURI E.I.R.L es una empresa constituida bajo las leyes peruanas, identificada con Registro Único de Contribuyentes N° 20574793379, domiciliada en JR. JIRON SAN LUIS - CIUDAD MAGISTERIAL MZA. I LOTE. 06 URB. ASOCIACION CIUDAD MAGISTERIAL (A MEDIA CUADRA DE LA I.E JEANPEAJET),distrito de Ayacucho, provincia de Huamanga y departamento de Ayacucho.

Si bien MULTISERVICIOS KASURI E.I.R.L tiene por objeto desarrollar diversas actividades empresariales (multiservicios), en el presente caso actúa como **organizadora directa** del evento deportivo denominado "¡Vóley al Límite sin filtros en la cancha!". En consecuencia, asume todas las responsabilidades propias de la organización, incluyendo la venta de entradas, la logística del evento, la seguridad, y las eventuales devoluciones o reembolsos, de ser el caso.`,
  },
  {
    id: "organizerresponsibility",
    title: "2. Responsabilidad de la Empresa como Organizadora",
    content: `Al ser MULTISERVICIOS KASURI E.I.R.L la organizadora directa del evento, es la única y exclusiva responsable de todos los aspectos relacionados con el mismo, incluyendo pero no limitándose a:

- La planificación, producción y ejecución del evento.
- La determinación de precios, zonas, aforo y condiciones de ingreso.
- La seguridad dentro del recinto.
- La postergación, suspensión o cancelación del evento.
- La devolución del dinero a los asistentes en los casos previstos en estos Términos y Condiciones.

Cualquier reclamo, queja, denuncia o acción legal relacionada con el evento deberá ser dirigida directamente a MULTISERVICIOS KASURI E.I.R.L, en su calidad de organizadora.`,
  },
  {
    id: "conduct",
    title: "3. Reglas de conducta para los usuarios",
    content: `Los usuarios de la página web se comprometen a brindar información veraz, correcta, actual y completa durante el proceso de registro, proceso de compra, interposición de reclamos y demás procesos que se puedan ejecutar en la página web. De igual modo, se comprometen a mantener sus datos actualizados, los cuales serán tratados conforme a la Política de Privacidad de la Empresa.

En caso la Empresa detecte información falsa, inexacta, desactualizada o incompleta suministrada por los Usuarios, o en caso tenga sospechas razonables, la Empresa estará facultada para suspender o cerrar la cuenta del Usuario y negarle el uso presente o futuro de los servicios provistos a través de la página web.

El usuario se compromete a utilizar la Página Web con honestidad, responsabilidad y respeto a la Empresa y otros usuarios. En tal sentido:
- El usuario no podrá utilizar la Página Web para transmitir, almacenar, promover o divulgar datos o contenidos que afecten la reputación o imagen de la Empresa y demás usuarios. También queda expresamente prohibido recopilar información de la Página Web, de forma manual o automatizada, para cualquier uso distinto a los previstos por la Empresa.
- No intentará acceder, utilizar y/o manipular los datos de la Empresa.
- No introducirá ni difundirá virus informáticos o cualesquiera otros sistemas físicos o lógicos que sean susceptibles de provocar daños en la Página Web.
- Solo utilizará los Servicios de la Página Web de manera personal.
- No tratará de dañar los Servicios de la Página Web o esta última de ningún modo, ni accederá a recursos restringidos en la Página Web.

Ante un incumplimiento a las Reglas de conducta anteriormente descritas, la Empresa podrá bloquear la cuenta del usuario para futuras adquisiciones.`,
  },
  {
    id: "liability",
    title: "4. Límites de responsabilidad de la Empresa",
    content: `**Sobre la organización y ejecución del evento**  
La Empresa, como organizadora, desplegará todos los medios razonables para la correcta realización del evento. Sin embargo, no será responsable por daños o perjuicios derivados de caso fortuito o fuerza mayor, tales como fenómenos naturales, disturbios sociales, órdenes de autoridad competente, o cualquier otro hecho ajeno a su control que impida la realización total o parcial del evento.

**Sobre el proceso de adquisición de entradas**  
La Empresa pondrá a disposición de los usuarios los métodos de pago que considere adecuados. No será responsable por inconvenientes derivados de sistemas externos de pago (bancos, procesadoras), tales como demoras en la aprobación, rechazos, fraudes, etc.

La Empresa no será responsable por errores técnicos, defectos en los equipos de los usuarios, o fallas de internet que impidan el acceso a la Página Web o la compra de entradas.

**Sobre el funcionamiento de la Página Web**  
La Página Web podría presentar limitaciones de disponibilidad por mantenimiento, caso fortuito o fuerza mayor. En tales situaciones, la Empresa realizará las acciones a su alcance para restablecer el servicio.

La Empresa adopta medidas de seguridad razonables, pero no garantiza la ausencia de virus o elementos dañinos introducidos por terceros. Por tanto, no será responsable por daños derivados de la presencia de virus u otros elementos ajenos a su control.`,
  },
  {
    id: "processes",
    title: "5. Procesos disponibles en la plataforma",
    content: `Los Usuarios de la plataforma podrán realizar los siguientes procesos:

- **Proceso de registro:** Los Usuarios podrán registrarse en la plataforma, a través del llenado del Formulario de Registro, a fin de obtener una cuenta en Athreus, como paso previo para la adquisición de entradas. El usuario será el único responsable del correcto registro de la información consignada.

- **Proceso de compra:** Los Usuarios podrán adquirir las entradas, ingresando a la sección del evento "¡Vóley al Límite sin filtros en la cancha!", escogiendo una zona determinada y realizando el pago correspondiente a través de los mecanismos brindados por la página web.

- **Proceso de consultas y/o reclamos:** Los usuarios podrán efectuar sus consultas y/o reclamos a través del link de SOPORTE, disponible en nuestra página web.`,
  },
  {
    id: "ticketrules",
    title: "6. Reglas para la adquisición de entradas",
    content: `Las entradas para el evento "¡Vóley al Límite sin filtros en la cancha!" se rigen por las siguientes reglas:

- Al efectuar la compra, el usuario se compromete a comprobar que el evento, fecha, horario, zona y precio sean los correctos.
- **No se aceptarán cambios, devoluciones o reintegros** una vez confirmada la compra, salvo en los casos de cancelación o modificación sustancial del evento previstos en la cláusula siguiente.
- El usuario podrá pagar con los medios de pago habilitados en la plataforma. La Empresa no se hace responsable por inconvenientes con tarjetas, sistemas bancarios o procesadoras de pago.
- Las entradas adquiridas no podrán ser revendidas ni utilizadas con fines comerciales o promocionales sin autorización expresa de la Empresa. El incumplimiento de esta prohibición facultará a la Empresa a anular las entradas sin derecho a reembolso.
- La Empresa podrá anular entradas obtenidas mediante manipulación del sistema de compra.
- La Empresa no se responsabiliza por entradas adquiridas en puntos no oficiales. En caso de falsificación, no se permitirá el ingreso.
- En caso de pérdida, robo o deterioro de la entrada (física o digital), la Empresa no expedirá duplicados ni realizará devoluciones.
- Para ingresar al evento, los asistentes deberán presentar su entrada (impresa o digital, según lo indicado) y su documento de identidad. Para eventos deportivos, rige la Ley N°30037, que exige entrada impresa y DNI.
- La Empresa y las autoridades podrán realizar controles de seguridad en el ingreso. La negativa a someterse a ellos impedirá el acceso.
- El ingreso después de la hora señalada estará sujeto a las políticas de la Empresa y del recinto.
- La Empresa podrá restringir el ingreso de objetos peligrosos, cámaras profesionales, etc., de acuerdo con las normas de seguridad.
- La entrada constituye el comprobante de pago. La Empresa emitirá los comprobantes fiscales correspondientes de acuerdo a la normativa tributaria.

**Condiciones especiales para entradas electrónicas (E-ticket) con código QR**  
- El E-ticket es una entrada válida y no será canjeado por una entrada física.
- Para ingresar, el asistente deberá presentar el E-ticket impreso o en su dispositivo móvil, según lo indicado para el evento.
- Para eventos deportivos, el E-ticket **deberá imprimirse** y presentarse junto con el DNI (Ley N°30037).
- El E-ticket puede descargarse desde la sección "MI CUENTA" en la página web.
- El usuario es responsable de no divulgar ni compartir su E-ticket, ya que podría ser utilizado por terceros. El primer escaneo válido permitirá el ingreso; duplicados posteriores serán rechazados.
- El sistema de control impedirá el ingreso de más de una persona con el mismo código QR.`,
  },
  {
    id: "purchaseprocedure",
    title: "7. Procedimiento de compra",
    content: `**Para compras con tarjetas de crédito y/o débito:**  
Las transacciones se realizan a través de procesadoras de pago oficiales, quienes junto con la entidad bancaria son los únicos responsables de la validación, autenticación y aprobación de la compra. La Empresa no tiene acceso a los datos bancarios del usuario.

**Para compras a través de otros medios digitales:**  
La validación, autenticación y aprobación serán de entera responsabilidad de la empresa contratada para dicho fin.

**En caso de incidentes con el procesamiento de pago:**  
El cobro de las entradas será automático en la mayoría de los casos; sin embargo, puede tomar hasta cuarenta y ocho (48) horas para completarse. En caso de retención, el usuario deberá verificar el estado de su compra en su cuenta de usuario.`,
  },
  {
    id: "cancellation",
    title: "8. Cancelación, modificación y devoluciones",
    content: `**Cancelación del evento:**  
En caso de cancelación definitiva del evento, la Empresa comunicará el procedimiento para la devolución del importe de las entradas, descontando los gastos de gestión incurridos, si los hubiera. La devolución se realizará al mismo medio de pago utilizado en la compra, o mediante transferencia bancaria si ello no fuera posible.

**Modificación sustancial del evento:**  
Se considera modificación sustancial el cambio de fecha, cambio de lugar o cancelación de la participación del equipo principal. En estos casos, el usuario tendrá derecho a solicitar la devolución del importe en un plazo de siete (7) días desde la comunicación oficial. Si no solicita la devolución en dicho plazo, se entenderá que acepta las nuevas condiciones.

**Fuerza mayor o caso fortuito:**  
Si la cancelación o modificación obedece a causas de fuerza mayor o caso fortuito (fenómenos naturales, disposiciones gubernamentales, etc.), la Empresa actuará conforme a la ley y, de ser posible, acordará un nuevo procedimiento con los asistentes.

**Exclusión del derecho de desistimiento:**  
Conforme al artículo 52.2 del Código de Protección y Defensa del Consumidor (Ley N°29571), las entradas para espectáculos públicos se encuentran excluidas del derecho de desistimiento, por lo que no procederá la devolución del importe una vez confirmada la compra, salvo en los supuestos de cancelación o modificación sustancial previstos en esta cláusula.`,
  },
  {
    id: "accountcancellation",
    title: "9. Desafiliación (baja de cuenta)",
    content: `Los Usuarios podrán solicitar la baja de su cuenta en Athreus siguiendo este procedimiento:

1. Ingresar a SOPORTE en la página web y registrar la solicitud de baja, indicando "Ejercicio de Derechos ARCO".
2. La Empresa validará la titularidad de la cuenta y procederá a desactivarla.
3. El usuario recibirá un correo de confirmación de baja.`,
  },
  {
    id: "intellectualproperty",
    title: "10. Propiedad intelectual",
    content: `El Usuario no adquiere ningún derecho de propiedad intelectual sobre la Página Web o sus contenidos por el mero uso de la misma. Todos los elementos de la Página Web (textos, gráficos, logotipos, software, etc.) son propiedad de la Empresa o de sus licenciantes y están protegidos por las leyes peruanas e internacionales de propiedad intelectual.

Queda prohibido copiar, modificar, distribuir, reproducir o realizar ingeniería inversa del software de la Página Web sin autorización expresa de la Empresa.

En caso de infracción, la Empresa se reserva el derecho de suspender la cuenta del usuario infractor y ejercer las acciones legales correspondientes.`,
  },
  {
    id: "complaints",
    title: "11. Reclamos, consultas y libro de reclamaciones",
    content: `Conforme al Código de Protección y Defensa del Consumidor (Ley N°29571), la Empresa pone a disposición de los usuarios su **Libro de Reclamaciones Virtual**, accesible en: https://fest-aya.vercel.app/paginas/LibroReclamaciones.

Para consultas o solicitudes de información, los usuarios pueden contactar a través del link de SOPORTE en la página web.`,
  },
  {
    id: "modifications",
    title: "12. Modificación de los Términos y Condiciones",
    content: `La Empresa podrá modificar los presentes Términos y Condiciones en cualquier momento, por cambios en la normativa aplicable o por mejoras en la Página Web. Las modificaciones serán publicadas en este mismo documento y, si afectan derechos de los usuarios, se notificará al momento de ingresar a la Página Web.

Las modificaciones no afectarán las compras ya realizadas antes de su publicación.`,
  },
  {
    id: "law",
    title: "13. Ley aplicable y jurisdicción",
    content: `Los presentes Términos y Condiciones se rigen por las leyes vigentes en la República del Perú. Para cualquier controversia derivada de su interpretación o ejecución, las partes se someten a la competencia y jurisdicción de los Jueces y Tribunales del distrito judicial de Lima, Perú.`,
  },
  {
    id: "dataprotection",
    title: "14. Protección de Datos Personales",
    content: `Los datos personales proporcionados por los usuarios serán tratados de conformidad con la Ley N°29733, Ley de Protección de Datos Personales, y su reglamento. La finalidad del tratamiento es la gestión de la compra de entradas, la comunicación de incidencias relacionadas con el evento y el envío de información relevante sobre el mismo.

El usuario podrá ejercer sus derechos de acceso, rectificación, cancelación y oposición enviando un correo a privacidad@athreus.com, indicando el procedimiento establecido en nuestra Política de Privacidad, disponible en el sitio web.

Al aceptar estos términos, el usuario otorga su consentimiento para el tratamiento de sus datos en los términos descritos.`,
  },
  {
    id: "lastupdate",
    title: "Última actualización",
    content: `Marzo 2026`,
  },
];

export default function TerminoCondiciones() {
  const [accepted, setAccepted] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return sections.filter(
      (s) =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.content.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-black flex text-white">
      {/* Sidebar navegación */}
      <div className="hidden lg:block w-72 border-r bg-black p-6 sticky top-0 h-screen overflow-y-auto pt-20">
        <h2 className="font-bold text-lg mb-4">Términos</h2>
        <ul className="space-y-2 text-sm">
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-gray-300 hover:text-white">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto">
        <div className="mb-10 pt-10">
          <h1 className="text-4xl font-bold">Términos y Condiciones</h1>
          <p className="text-gray-300 mt-2">
            MULTISERVICIOS KASURI E.I.R.L • Evento ¡Vóley al Límite sin filtros en la cancha! • 2026
          </p>

          <input
            type="text"
            placeholder="Buscar dentro de los términos..."
            className="mt-6 w-full border rounded-lg p-3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8 space-y-8 leading-relaxed text-gray-700">
          {filtered.length > 0 ? (
            filtered.map((section) => (
              <section id={section.id} key={section.id}>
                <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
                <p className="whitespace-pre-line">{section.content}</p>
              </section>
            ))
          ) : (
            <p className="text-gray-500">No se encontraron términos que coincidan con la búsqueda.</p>
          )}

          <div className="border-t pt-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
              />
              <span>He leído y acepto los términos y condiciones.</span>
            </label>

            <button
              className={`mt-4 px-6 py-2 rounded-lg text-white hidden ${
                accepted
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!accepted}
            >
              Continuar con la compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}