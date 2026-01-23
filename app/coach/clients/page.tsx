"use client";

import { useState } from "react";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Search, MoreHorizontal, MessageCircle, X, Copy, ExternalLink, Send, Key } from "lucide-react";

export default function ClientsPage() {
    const clients = useQuery(api.coach.getClients);
    // Fallback for demo if no clients assigned
    const allClients = useQuery(api.coach.getAllClientsForDemo);
    const createClient = useMutation(api.users.createClient);

    const displayClients = (clients && clients.length > 0) ? clients : allClients;

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        age: "",
        sex: "male",
        height: "170",
        goal: "muscle_gain" as "fat_loss" | "muscle_gain" | "recomp",
        phone: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newClientCredentials, setNewClientCredentials] = useState<{ email: string; password: string; name: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createClient({
                email: formData.email,
                name: formData.name,
                age: formData.age ? parseInt(formData.age) : undefined,
                sex: formData.sex,
                height: formData.height ? parseInt(formData.height) : undefined,
                goal: formData.goal,
                phone: formData.phone || undefined,
            });
            // Show credentials instead of closing immediately
            setNewClientCredentials({
                email: formData.email,
                name: formData.name,
                password: "CoachEnControl2025", // Default password
            });
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to create client");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewCredentials = (client: any) => {
        setFormData({ ...formData, phone: client.phone || "", email: client.email, name: client.name || "" });
        setNewClientCredentials({
            email: client.email,
            name: client.name || "Client",
            password: "CoachEnControl2025",
        });
        setShowModal(true);
    };

    const handleWhatsAppResend = (client: any) => {
        const message = `¡Hola ${client.name || "Client"}! 👋

Te recuerdo tus credenciales para CoachEnControl:

🔐 *Tus credenciales de acceso:*
📧 Email: ${client.email}
🔑 Contraseña: CoachEnControl2025

🌐 Accede aquí: ${window.location.origin}/login

¡Nos vemos en el gym! 💪`;

        const encodedMessage = encodeURIComponent(message);
        const phone = client.phone?.replace(/\D/g, '');
        const whatsappUrl = phone
            ? `https://wa.me/${phone}?text=${encodedMessage}`
            : `https://wa.me/?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewClientCredentials(null);
        setFormData({ email: "", name: "", age: "", sex: "male", height: "170", goal: "muscle_gain", phone: "" });
    };

    const handleWhatsAppShare = () => {
        if (!newClientCredentials) return;

        const message = `¡Hola ${newClientCredentials.name}! 👋

Te he registrado en CoachEnControl, tu plataforma para seguimiento de entrenamientos y nutrición.

🔐 *Tus credenciales de acceso:*
📧 Email: ${newClientCredentials.email}
🔑 Contraseña: ${newClientCredentials.password}

🌐 Accede aquí: ${window.location.origin}/login

Por favor cambia tu contraseña después del primer inicio de sesión.

¡Nos vemos en el gym! 💪`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = formData.phone
            ? `https://wa.me/${formData.phone.replace(/\D/g, '')}?text=${encodedMessage}`
            : `https://wa.me/?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    const copyCredentials = () => {
        if (!newClientCredentials) return;
        const text = `Email: ${newClientCredentials.email}\nPassword: ${newClientCredentials.password}`;
        navigator.clipboard.writeText(text);
        alert("Credentials copied to clipboard!");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/80 dark:bg-zinc-950/80 backdrop-blur sticky top-0 z-10 py-4 border-b border-zinc-200 dark:border-zinc-900">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Clients</h2>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-zinc-400 dark:text-zinc-500" size={18} />
                        <input placeholder="Search clients..." className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#B2FF59] w-64" />
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-emerald-600 dark:bg-[#B2FF59] text-white dark:text-black px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 shadow-lg"
                    >
                        + Add Client
                    </button>
                </div>
            </div>

            {/* Add Client Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                                {newClientCredentials ? (formData.email ? "Client Credentials" : "Client Added Successfully!") : "Add New Client"}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-zinc-600 dark:text-zinc-400" />
                            </button>
                        </div>

                        {newClientCredentials ? (
                            <div className="p-6 space-y-6">
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-center">
                                    <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                                        Client has been created and linked to your account.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700">
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wider font-semibold">Access Credentials</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-zinc-600 dark:text-zinc-300">Email:</span>
                                                <span className="font-mono text-zinc-900 dark:text-white">{newClientCredentials.email}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-zinc-600 dark:text-zinc-300">Password:</span>
                                                <span className="font-mono text-zinc-900 dark:text-white">{newClientCredentials.password}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={copyCredentials}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl font-medium transition-colors"
                                        >
                                            <Copy size={18} />
                                            Copy
                                        </button>
                                        <button
                                            onClick={handleWhatsAppShare}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-bold transition-colors shadow-lg"
                                        >
                                            <MessageCircle size={18} />
                                            WhatsApp
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCloseModal}
                                    className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="client@example.com"
                                        className="w-full px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#B2FF59]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="John Doe"
                                        className="w-full px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#B2FF59]"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                            Age
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                            placeholder="25"
                                            className="w-full px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#B2FF59]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                            Sex
                                        </label>
                                        <select
                                            value={formData.sex}
                                            onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#B2FF59]"
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                        Height (cm)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.height}
                                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                        placeholder="170"
                                        className="w-full px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#B2FF59]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                        Goal
                                    </label>
                                    <select
                                        value={formData.goal}
                                        onChange={(e) => setFormData({ ...formData, goal: e.target.value as "fat_loss" | "muscle_gain" | "recomp" })}
                                        className="w-full px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#B2FF59]"
                                    >
                                        <option value="muscle_gain">Muscle Gain</option>
                                        <option value="fat_loss">Fat Loss</option>
                                        <option value="recomp">Recomposition</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                        Phone Number (WhatsApp)
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+52 1 234 567 8900"
                                        className="w-full px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#B2FF59]"
                                    />
                                    <p className="text-[10px] text-zinc-500 mt-1 italic">Include country code for direct WhatsApp sharing (e.g., 521...)</p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-3 bg-emerald-600 dark:bg-[#B2FF59] text-white dark:text-black rounded-xl font-bold hover:opacity-90 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? "Adding..." : "Add Client"}
                                    </button>
                                </div>
                            </form>
                        )}

                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm dark:shadow-none">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
                        <tr>
                            <th className="p-4 font-medium text-zinc-600 dark:text-zinc-400">Client</th>
                            <th className="p-4 font-medium text-zinc-600 dark:text-zinc-400">Status</th>
                            <th className="p-4 font-medium text-zinc-600 dark:text-zinc-400">Goal</th>
                            <th className="p-4 font-medium text-zinc-600 dark:text-zinc-400">Compliance</th>
                            <th className="p-4 font-medium text-zinc-600 dark:text-zinc-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {displayClients?.map((client) => (
                            <tr key={client._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                                <td className="p-4">
                                    <Link href={`/coach/clients/${client._id}`} className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold text-sm">
                                            {client.name?.[0] || client.email[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white group-hover:text-blue-500 transition-colors">{client.name || "Unnamed Client"}</p>
                                            <p className="text-xs text-zinc-500">{client.email}</p>
                                        </div>
                                    </Link>
                                </td>
                                <td className="p-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                                        Active
                                    </span>
                                </td>
                                <td className="p-4 capitalize text-zinc-300">
                                    {client.goal?.replace("_", " ") || "N/A"}
                                </td>
                                <td className="p-4">
                                    <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-[85%]"></div>
                                    </div>
                                    <span className="text-xs text-zinc-500 mt-1 block">85% Adherence</span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2 text-zinc-400">
                                        <button
                                            onClick={() => handleViewCredentials(client)}
                                            className="p-2 hover:bg-zinc-800 rounded-lg hover:text-[#B2FF59] transition-colors"
                                            title="View Credentials"
                                        >
                                            <Key size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleWhatsAppResend(client)}
                                            className="p-2 hover:bg-zinc-800 rounded-lg hover:text-[#25D366] transition-colors"
                                            title="Send WhatsApp"
                                        >
                                            <MessageCircle size={18} />
                                        </button>
                                        <Link href={`/coach/clients/${client._id}`} className="p-2 hover:bg-zinc-800 rounded-lg hover:text-white transition-colors">
                                            <MoreHorizontal size={18} />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {displayClients?.length === 0 && (
                    <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
                        No clients found.
                    </div>
                )}
            </div>
        </div>
    );
}
