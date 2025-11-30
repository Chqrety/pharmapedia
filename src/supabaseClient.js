import { createClient } from '@supabase/supabase-js'

// Ambil URL & Key dari Dashboard Supabase -> Project Settings -> API
const supabaseUrl = 'https://bgrtdmbovmzgpwztdrfb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJncnRkbWJvdm16Z3B3enRkcmZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODEyMDEsImV4cCI6MjA4MDA1NzIwMX0.f1T0gkX2qbP00HAHhcPlYMvvWbnItwZK-pCfoLIy25k'

export const supabase = createClient(supabaseUrl, supabaseKey)