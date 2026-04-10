import { createClient } from '@supabase/supabase-js'

// Copia estos valores desde tu dashboard de Supabase
const supabaseUrl = "https://wvijlpcgtpbkybcyawtw.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2aWpscGNndHBia3liY3lhd3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDUwMDksImV4cCI6MjA5MTQyMTAwOX0.T-qbeV1pjR28cvN-_ZTNZot6-7fZg10OXqhWeXCCRlc"

export const supabase = createClient(supabaseUrl, supabaseKey)
