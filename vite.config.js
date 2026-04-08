import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import Busboy from "busboy";

import { cloudflare } from "@cloudflare/vite-plugin";

// Plugin personalizado para manejar API en desarrollo
const apiPlugin = {
  name: "api-plugin",
  configureServer(server) {
    return () => {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === "/send-reservation" && req.method === "POST") {
          const contentType = req.headers["content-type"];

          if (contentType && contentType.includes("multipart/form-data")) {
            // Parsear FormData con archivo
            const bb = Busboy({ headers: req.headers });
            const fields = {};
            let fileReceived = false;

            bb.on("file", (fieldname, file, fileInfo) => {
              if (fieldname === "voucherFile") {
                fileReceived = true;
                console.log(`📄 Archivo recibido: ${fileInfo.filename}`);
                // Drenamos el stream del archivo
                file.on("data", () => {
                  // Procesando archivo...
                });
                file.on("end", () => {
                  console.log(
                    `✅ Archivo procesado: ${fileInfo.filename} (${fileInfo.encoding})`,
                  );
                });
              }
            });

            bb.on("field", (fieldname, val) => {
              fields[fieldname] = val;
            });

            bb.on("close", () => {
              console.log("📧 Reserva recibida con archivo:", {
                nombre: fields.name,
                email: fields.email,
                referencia: fields.refNumber,
                archivoAdjunto: fileReceived ? "✓ Sí" : "✗ No",
              });

              res.setHeader("Content-Type", "application/json");
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  success: true,
                  message: fileReceived
                    ? "Reserva recibida con comprobante"
                    : "Reserva recibida sin comprobante",
                  refNumber: fields.refNumber,
                  fileReceived,
                }),
              );
            });

            req.pipe(bb);
          } else {
            // Parsear JSON
            let body = "";

            req.on("data", (chunk) => {
              body += chunk.toString();
            });

            req.on("end", async () => {
              try {
                const data = JSON.parse(body);

                // Validar que el captcha token exista
                if (!data.recaptchaToken) {
                  console.error("❌ Token de reCAPTCHA no proporcionado");
                  res.setHeader("Content-Type", "application/json");
                  res.statusCode = 400;
                  res.end(
                    JSON.stringify({
                      success: false,
                      message: "reCAPTCHA token faltante.",
                    }),
                  );
                  return;
                }

                // Validar honeypot
                if (data.hp) {
                  console.warn("🚨 Honeypot detectado - Posible bot");
                  res.setHeader("Content-Type", "application/json");
                  res.statusCode = 400;
                  res.end(
                    JSON.stringify({
                      success: false,
                      message: "Validación fallida.",
                    }),
                  );
                  return;
                }

                // En desarrollo, simular validación de reCAPTCHA
                console.log(
                  "🔐 Verificando token de reCAPTCHA en desarrollo...",
                );
                console.log(
                  `   Token: ${data.recaptchaToken.substring(0, 20)}...`,
                );

                // Simular verificación exitosa (en producción se verifica con Google)
                console.log("✅ Token de reCAPTCHA válido (desarrollo)");

                console.log("📧 Reserva recibida en desarrollo:", {
                  nombre: data.name,
                  email: data.email,
                  referencia: data.refNumber,
                  captchaVerificado: true,
                });

                res.setHeader("Content-Type", "application/json");
                res.statusCode = 200;
                res.end(
                  JSON.stringify({
                    success: true,
                    message: "Reserva recibida correctamente",
                    refNumber: data.refNumber,
                  }),
                );
              } catch (error) {
                console.error("❌ Error procesando reserva:", error);
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 500;
                res.end(
                  JSON.stringify({
                    success: false,
                    message: "Error procesando la reserva",
                  }),
                );
              }
            });
          }
        } else {
          next();
        }
      });
    };
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), apiPlugin, cloudflare()],
});