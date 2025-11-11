import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

// Definición de tipos
type Role = 'votante' | 'admin';

interface Profile {
  id: string;
  full_name: string | null; // Usamos 'string | null' ya que el nombre puede ser nulo al inicio
  role: Role;
  created_at: string;
  dni: string | null; // 🚨 AÑADIDO: Campo DNI
}

// Función de Ayuda para obtener el Perfil
const fetchProfile = async (userId: string): Promise<Profile | null> => {
  // Asegúrate de que tu tabla profiles en Supabase tenga el campo 'dni'
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at, dni') // 🚨 AÑADIDO 'dni' aquí
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error al obtener perfil:', error);
    return null;
  }
  
  if (data) {
    return { ...data, role: data.role as Role };
  }

  return null;
};

// HOOK PRINCIPAL
export function useAuth() {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<Profile | null>(null);
  const [cargando, setCargando] = useState(true);

  const rol = perfil?.role || null; 

  // Función para manejar la obtención del perfil y la sesión
  const handleSession = useCallback(async (session: { user: User } | null) => {
    const user = session?.user ?? null;
    setUsuario(user);
    
    if (user) {
      const profileData = await fetchProfile(user.id);
      setPerfil(profileData);
    } else {
      setPerfil(null);
    }
    
    setCargando(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, [handleSession]);

  // --- NUEVA FUNCIÓN: ACTUALIZAR EL PERFIL (Necesaria para DNI y Nombre) ---
  const updateVotante = async (updates: { dni?: string | null; full_name?: string | null }) => {
    if (!usuario) {
        return { error: new Error("Usuario no autenticado.") };
    }
    
    // Llamada a Supabase para actualizar la tabla 'profiles'
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', usuario.id) // Actualizamos solo el perfil del usuario actual
      .select('id, full_name, role, created_at, dni') // 🚨 Volvemos a solicitar los campos actualizados
      .single(); 
      
    if (error) {
        return { error };
    }

    // Actualizamos el estado de React con los nuevos datos
    if (data) {
        setPerfil(data as Profile); 
    }
    
    return { error: null };
  };

  // --- Funciones de autenticación existentes ---
  const iniciarSesion = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const registrarse = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
  };

  return { 
    usuario, 
    perfil, 
    rol, 
    cargando, 
    iniciarSesion, 
    registrarse, 
    cerrarSesion,
    updateVotante // 💡 EXPORTAMOS LA FUNCIÓN CLAVE
  };
}