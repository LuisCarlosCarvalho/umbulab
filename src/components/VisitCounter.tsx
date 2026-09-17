import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function VisitCounter() {
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const { error } = await supabase.rpc('increment_site_views');

        if (error) {
          // Silent log for public noise reduction
          return; 
        }

        const { data, error: fetchError } = await supabase
          .from('site_analytics')
          .select('value')
          .eq('metric_name', 'total_views')
          .maybeSingle();

        if (fetchError) return; // Silent
        else if (data) {
          setVisitCount(Number(data.value));
        }
        if (error) return; // Silent for noise reduction
      } catch (error) {
        console.error('Error tracking visit:', error);
      } finally {
        setLoading(false);
      }
    };

    trackVisit();
  }, []);

  if (loading || visitCount === null) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Eye className="w-4 h-4" />
      <span>{visitCount.toLocaleString('pt-BR')} visitas</span>
    </div>
  );
}
