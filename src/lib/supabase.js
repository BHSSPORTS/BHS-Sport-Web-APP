import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database helper functions
export const db = {
  // Match Results
  async getMatchResults(filters = {}) {
    let query = supabase
      .from('match_results')
      .select(`
        *,
        home_team:teams!home_team_id(name, logo_url),
        away_team:teams!away_team_id(name, logo_url),
        sport:sports(name, icon)
      `)
      .order('match_date', { ascending: false })

    if (filters.sport) query = query.eq('sport_id', filters.sport)
    if (filters.team) query = query.or(`home_team_id.eq.${filters.team},away_team_id.eq.${filters.team}`)
    if (filters.dateFrom) query = query.gte('match_date', filters.dateFrom)
    if (filters.dateTo) query = query.lte('match_date', filters.dateTo)

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async createMatchResult(matchData) {
    const { data, error } = await supabase
      .from('match_results')
      .insert([matchData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateMatchResult(id, updates) {
    const { data, error } = await supabase
      .from('match_results')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteMatchResult(id) {
    const { error } = await supabase
      .from('match_results')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Teams
  async getTeams() {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  },

  async createTeam(teamData) {
    const { data, error } = await supabase
      .from('teams')
      .insert([teamData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Sports
  async getSports() {
    const { data, error } = await supabase
      .from('sports')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  },

  // Team Sheets
  async getTeamSheets(filters = {}) {
    let query = supabase
      .from('team_sheets')
      .select(`
        *,
        team:teams(name, logo_url),
        sport:sports(name, icon)
      `)
      .order('match_date', { ascending: false })

    if (filters.team) query = query.eq('team_id', filters.team)
    if (filters.sport) query = query.eq('sport_id', filters.sport)

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async createTeamSheet(sheetData) {
    const { data, error } = await supabase
      .from('team_sheets')
      .insert([sheetData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Kit Marks
  async getKitMarks(filters = {}) {
    let query = supabase
      .from('kit_marks')
      .select(`
        *,
        student:students(name, year_group),
        kit:kit_items(name, category)
      `)
      .order('date_awarded', { ascending: false })

    if (filters.student) query = query.eq('student_id', filters.student)
    if (filters.kit) query = query.eq('kit_id', filters.kit)

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // PE Groups
  async getPEGroups() {
    const { data, error } = await supabase
      .from('pe_groups')
      .select(`
        *,
        teacher:teachers(name),
        students:students(name, year_group)
      `)
      .order('name')
    
    if (error) throw error
    return data
  },

  // Photos
  async uploadPhoto(file, metadata) {
    const fileName = `${Date.now()}-${file.name}`
    
    const { data, error } = await supabase.storage
      .from('sports-photos')
      .upload(fileName, file, {
        metadata: metadata
      })
    
    if (error) throw error
    return data
  },

  async getPhotos(filters = {}) {
    let query = supabase
      .from('photos')
      .select('*')
      .order('uploaded_at', { ascending: false })

    if (filters.category) query = query.eq('category', filters.category)
    if (filters.uploadedBy) query = query.eq('uploaded_by', filters.uploadedBy)

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Analytics
  async getTeamStats(teamId, dateRange) {
    const { data, error } = await supabase
      .from('match_results')
      .select('*')
      .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
      .gte('match_date', dateRange.from)
      .lte('match_date', dateRange.to)
    
    if (error) throw error
    return data
  },

  // Admin functions
  async getUsers() {
    const { data, error } = await supabase.auth.admin.listUsers()
    if (error) throw error
    return data.users
  },

  async createUser(userData) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      user_metadata: {
        name: userData.name,
        role: userData.role,
        department: userData.department
      }
    })
    
    if (error) throw error
    return data.user
  }
}

export default supabase
