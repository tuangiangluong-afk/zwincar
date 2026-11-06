export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            tenants: {
                Row: {
                    id: string
                    name: string
                    domain: string
                    phone_number: string | null
                    email: string | null
                    primary_color: string | null
                    gtm_id: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    name: string
                    domain: string
                    phone_number?: string | null
                    email?: string | null
                    primary_color?: string | null
                    gtm_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    domain?: string
                    phone_number?: string | null
                    email?: string | null
                    primary_color?: string | null
                    gtm_id?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            content_pages: {
                Row: {
                    id: string
                    tenant_id: string
                    path: string
                    section: string
                    key: string
                    value: string | null
                    type: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    tenant_id: string
                    path: string
                    section: string
                    key: string
                    value?: string | null
                    type?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    tenant_id?: string
                    path?: string
                    section?: string
                    key?: string
                    value?: string | null
                    type?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            vehicles: {
                Row: {
                    id: string
                    tenant_id: string
                    name: string
                    description: string | null
                    capacity_passengers: number | null
                    capacity_luggage: number | null
                    image_url: string | null
                    price_class: string | null
                    display_order: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    tenant_id: string
                    name: string
                    description?: string | null
                    capacity_passengers?: number | null
                    capacity_luggage?: number | null
                    image_url?: string | null
                    price_class?: string | null
                    display_order?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    tenant_id?: string
                    name?: string
                    description?: string | null
                    capacity_passengers?: number | null
                    capacity_luggage?: number | null
                    image_url?: string | null
                    price_class?: string | null
                    display_order?: number | null
                    created_at?: string
                }
                Relationships: []
            }
            faqs: {
                Row: {
                    id: string
                    tenant_id: string
                    question: string
                    answer: string
                    category: string | null
                    display_order: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    tenant_id: string
                    question: string
                    answer: string
                    category?: string | null
                    display_order?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    tenant_id?: string
                    question?: string
                    answer?: string
                    category?: string | null
                    display_order?: number | null
                    created_at?: string
                }
                Relationships: []
            }
            pois: {
                Row: {
                    id: string
                    tenant_id: string
                    name: string
                    slug: string
                    type: string
                    content_intro: string | null
                    content_bus_pain: string | null
                    content_taxi_solution: string | null
                    parking_difficulty: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    tenant_id: string
                    name: string
                    slug: string
                    type: string
                    content_intro?: string | null
                    content_bus_pain?: string | null
                    content_taxi_solution?: string | null
                    parking_difficulty?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    tenant_id?: string
                    name?: string
                    slug?: string
                    type?: string
                    content_intro?: string | null
                    content_bus_pain?: string | null
                    content_taxi_solution?: string | null
                    parking_difficulty?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            spintax_templates: {
                Row: {
                    id: string
                    tenant_id: string
                    type: string
                    variations: string[]
                    created_at: string
                }
                Insert: {
                    id?: string
                    tenant_id: string
                    type: string
                    variations: string[]
                    created_at?: string
                }
                Update: {
                    id?: string
                    tenant_id?: string
                    type?: string
                    variations?: string[]
                    created_at?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
