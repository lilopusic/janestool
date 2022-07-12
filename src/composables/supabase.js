import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'

const supabaseUrl = 'https://ldzvczkewdibfwvhqutn.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkenZjemtld2RpYmZ3dmhxdXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTA1OTYxNjUsImV4cCI6MTk2NjE3MjE2NX0.FIg0tCVPd5AtHfCA0SYeiV0r0gyFETOwLbsyQjC5NXI'
const supabase = createClient(supabaseUrl, SUPABASE_KEY)

export default supabase

export const userRef = ref(null)
