export function generateWhatsAppLink(phone: string, message: string) {
    // Remove non-numeric characters
    const cleanPhone = phone.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
