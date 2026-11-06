import { NextResponse } from "next/server";

export async function GET() {
    const spec = {
        openapi: "3.0.0",
        info: {
            title: "API Taxi France",
            description: "API globale du réseau Taxi France permettant d'effectuer des demandes de réservations et de nous contacter. Chaque ville du réseau dispose également de son propre /openapi.json.",
            version: "1.0.0",
            contact: {
                name: "Taxi France",
                url: "https://taxifrance.fr",
                email: "contact@taxifrance.fr"
            }
        },
        externalDocs: {
            description: "Documentation complète pour agents IA — Taxi France",
            url: "https://taxifrance.fr/llms.txt"
        },
        servers: [
            {
                url: "https://taxifrance.fr",
                description: "Serveur principal Hub"
            }
        ],
        tags: [
            { name: "Réservation", description: "Endpoints de réservation de courses taxi" },
            { name: "Contact", description: "Endpoints de prise de contact" }
        ],
        paths: {
            "/api/lead": {
                post: {
                    operationId: "createBooking",
                    tags: ["Réservation"],
                    summary: "Créer une demande de réservation de taxi (Lead)",
                    description: "Enregistre une réservation de trajet dans notre système et notifie le chauffeur de la zone concernée. Le client sera rappelé pour confirmation.",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["phone", "pickupLocation", "dropoffLocation", "pickupTime"],
                                    properties: {
                                        clientName: {
                                            type: "string",
                                            description: "Nom du client"
                                        },
                                        phone: {
                                            type: "string",
                                            description: "Numéro de téléphone de contact (obligatoire)"
                                        },
                                        pickupLocation: {
                                            type: "string",
                                            description: "Adresse de départ (obligatoire)"
                                        },
                                        dropoffLocation: {
                                            type: "string",
                                            description: "Adresse d'arrivée (obligatoire)"
                                        },
                                        pickupTime: {
                                            type: "string",
                                            format: "date-time",
                                            description: "Date et heure de prise en charge au format ISO 8601 (obligatoire)"
                                        },
                                        passengers: {
                                            type: "integer",
                                            minimum: 1,
                                            maximum: 7,
                                            description: "Nombre de passagers (optionnel, défaut: 1)"
                                        },
                                        vehicleType: {
                                            type: "string",
                                            enum: ["sedan", "van", "pmr"],
                                            description: "Type de véhicule souhaité (optionnel)"
                                        },
                                        price: {
                                            type: "string",
                                            description: "Estimation de prix (optionnel, ex: '25€')"
                                        },
                                        tenantId: {
                                            type: "string",
                                            description: "Identifiant du locataire/ville (optionnel)"
                                        },
                                        domain: {
                                            type: "string",
                                            description: "Nom de domaine d'origine pour lier la ville correspondante (optionnel, ex: 'taxiaplaisir.com')"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        "200": {
                            description: "Réservation enregistrée et email envoyé avec succès",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                example: true
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Champs obligatoires manquants ou invalides"
                        },
                        "500": {
                            description: "Erreur interne du serveur"
                        }
                    }
                }
            },
            "/api/contact": {
                post: {
                    operationId: "sendContactMessage",
                    tags: ["Contact"],
                    summary: "Envoyer un message de contact",
                    description: "Permet de soumettre une demande générale de renseignement au réseau.",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["name", "email", "message"],
                                    properties: {
                                        name: {
                                            type: "string",
                                            description: "Nom de la personne"
                                        },
                                        email: {
                                            type: "string",
                                            format: "email",
                                            description: "Adresse email de contact"
                                        },
                                        subject: {
                                            type: "string",
                                            description: "Sujet du message"
                                        },
                                        message: {
                                            type: "string",
                                            description: "Contenu du message"
                                        },
                                        domain: {
                                            type: "string",
                                            description: "Domaine émetteur (ex: 'taxifrance.fr')"
                                        },
                                        city: {
                                            type: "string",
                                            description: "Nom de la ville de référence"
                                        },
                                        confirm_email: {
                                            type: "string",
                                            description: "Champ anti-spam honeypot (doit être laissé vide)"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        "200": {
                            description: "Message envoyé avec succès"
                        },
                        "400": {
                            description: "Champs obligatoires manquants"
                        },
                        "500": {
                            description: "Erreur interne"
                        }
                    }
                }
            }
        }
    };

    return NextResponse.json(spec, {
        headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" }
    });
}
