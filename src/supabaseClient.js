import { createClient } from '@supabase/supabase-js'

// Copia estos valores desde tu dashboard de Supabase
const supabaseUrl = "https://isqlyupnpmhvaefyuiti.supabase.co"
const supabaseKey = "sb_publishable_ZM-zWdtEOWIOnTBQf0ymoQ_MXjod7Vl"

export const supabase = createClient(supabaseUrl, supabaseKey)
