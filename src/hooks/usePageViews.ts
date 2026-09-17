import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function usePageViews() {
  useEffect(() => {
    const trackView = async () => {
      const sessionKey = 'umbulab_visited_session';
      
      // Checa o sessionStorage para evitar incrementos no mesmo F5
      if (!sessionStorage.getItem(sessionKey)) {
        try {
          // Dispara a função atômica no backend
          const { error } = await supabase.rpc('increment_site_views');
          
          if (!error) {
            sessionStorage.setItem(sessionKey, 'true');
          } else {
            console.error('UmbuLab Analytics: Erro ao registrar visita', error);
          }
        } catch (err) {
          console.error('UmbuLab Analytics: Exceção no contador de visitas', err);
        }
      }
    };

    trackView();
  }, []);
}
