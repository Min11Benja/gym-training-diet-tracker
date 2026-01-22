"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SmartFormData {
    // Section 1: Context
    name: string;
    email: string;
    instagram: string;
    country: string;

    // Section 2: Qualification
    clients: "1-10" | "11-30" | "31-100" | "+100";
    price: "<$50" | "$50-100" | "$100-200" | "+$200";
    problem: "Abandono de clientes" | "Seguimiento consume demasiado tiempo" | "Falta de adherencia a dieta/entreno" | "Escalar sin perder calidad";
    trackingMethod: "WhatsApp" | "Sheets / Notion" | "App" | "PDFs";

    // Section 3: Intention
    intention: "Sí" | "Tal vez" | "No";

    // UTMs
    utm_source?: string;
    utm_campaign?: string;
    utm_medium?: string;
    utm_content?: string;
}

export async function submitSmartForm(data: SmartFormData) {
    try {
        // 1. Calculate Lead Score
        let score = 0;

        // +3 puntos → +30 clientes
        if (data.clients === "31-100" || data.clients === "+100") {
            score += 3;
        }

        // +3 puntos → cobra +$100
        if (data.price === "$100-200" || data.price === "+$200") {
            score += 3;
        }

        // +2 puntos → problema = abandono
        if (data.problem === "Abandono de clientes") {
            score += 2;
        }

        // +2 puntos → usa herramientas digitales (App / Sheets / Notion)
        // Prompt says "usa herramientas digitales", usually assumes not just manual PDFs. 
        // Let's count App and Sheets/Notion.
        if (data.trackingMethod === "App" || data.trackingMethod === "Sheets / Notion") {
            score += 2;
        }

        // +1 punto → intención “sí”
        if (data.intention === "Sí") {
            score += 1;
        }

        // Classification
        let classification = "❌ No ICP";
        if (score >= 8) classification = "🔥 Lead ideal";
        else if (score >= 5) classification = "🟡 Explorar";

        // 2. Prepare Email Content
        const subject = `Nuevo lead beta – ${score} pts – ${data.name}`;

        const body = `
      Nuevo coach interesado en el beta

      Nombre: ${data.name}
      Email: ${data.email}
      País: ${data.country}
      Instagram/Web: ${data.instagram}

      Clientes activos: ${data.clients}
      Precio promedio: ${data.price}
      Problema principal: ${data.problem}
      Herramientas actuales: ${data.trackingMethod}

      Intención de pago: ${data.intention}
      Lead Score: ${score} (${classification})

      UTM:
      Source: ${data.utm_source || 'N/A'}
      Campaign: ${data.utm_campaign || 'N/A'}
      Medium: ${data.utm_medium || 'N/A'}
      Content: ${data.utm_content || 'N/A'}
    `;

        // 3. Send Email (only if API key context exists, else log for dev)
        // In a real scenario we'd throw if no key, but for dev robustness:
        if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
                from: "CoachEnControl Beta <onboarding@resend.dev>", // Default Resend sender for testing, user should update
                to: ["delivered@resend.dev"], // Placeholder, user will likely change this
                subject: subject,
                text: body,
            });
        } else {
            console.log("RESEND_API_KEY missing. Simulating email send:");
            console.log(subject);
            console.log(body);
        }

        return { success: true, score, classification };

    } catch (error) {
        console.error("SmartForm submission error:", error);
        return { success: false, error: "Failed to submit form." };
    }
}
