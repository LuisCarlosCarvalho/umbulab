import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase, Project, Service, Profile, QuoteRequest, MarketingProduct, Portfolio, BlogPost, ClientLogo } from '../lib/supabase';
import { getErrorMessage } from '../lib/errors';

export type AdminData = {
  projects: (Project & { client: Profile; service: Service })[];
  clients: Profile[];
  quotes: QuoteRequest[];
  marketingProducts: MarketingProduct[];
  portfolioItems: Portfolio[];
  services: Service[];
  blogPosts: BlogPost[];
  clientLogos: ClientLogo[];
  loading: boolean;
  errorStatus: boolean;
  loadData: () => Promise<void>;
};

// Global Memory Cache for Optimistic UI (SWR Pattern)
const globalAdminCache: Record<string, any> = {};

export function useAdminData(activeTab: string) {
  const abortControllerRef = useRef<AbortController | null>(null);
  const [projects, setProjects] = useState<(Project & { client: Profile; service: Service })[]>([]);
  const [clients, setClients] = useState<Profile[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [marketingProducts, setMarketingProducts] = useState<MarketingProduct[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<Portfolio[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [clientLogos, setClientLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(false);
  const [stats, setStats] = useState({
    projects: 0,
    clients: 0,
    quotes: 0,
    blogPosts: 0
  });

  const loadData = useCallback(async () => {
    // Environment Check
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setLoading(false);
      return;
    }

    // Aborta requisição anterior se existir (Limpeza de Zumbis)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const signal = controller.signal;

    console.log(`[Admin Data] DEBUG: Iniciando fetch para tab: ${activeTab}... VITE_SUPABASE_URL está configurado:`, !!import.meta.env.VITE_SUPABASE_URL);

    setLoading(true);
    setErrorStatus(false);
    try {
      // Golden Rule: Verify Session & Token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        setLoading(false);
        return;
      }

      // Optimistic UI: Paint Cached Data Instantly if available
      const cached = globalAdminCache[activeTab];
      if (cached) {
        if (cached.projects) setProjects(cached.projects);
        if (cached.clients) setClients(cached.clients);
        if (cached.quotes) setQuotes(cached.quotes);
        if (cached.marketingProducts) setMarketingProducts(cached.marketingProducts);
        if (cached.portfolioItems) setPortfolioItems(cached.portfolioItems);
        if (cached.services) setServices(cached.services);
        if (cached.blogPosts) setBlogPosts(cached.blogPosts);
        if (cached.clientLogos) setClientLogos(cached.clientLogos);
        if (cached.stats) setStats(cached.stats);
        setLoading(false); // Unlock UI instantly
      } else {
        setLoading(true);
      }

      const currentTabUpdates: any = {};

      // Check current tab
      if (activeTab === 'projects') {
        try {
          const { data: projectsData, error: projectsError } = await supabase
            .from('projects')
            .select(`
              *,
              client:profiles!client_id(*),
              service:services(*)
            `)
            .order('created_at', { ascending: false })
            .abortSignal(signal);
          
          if (projectsError) throw projectsError;
          setProjects(projectsData || []);
          currentTabUpdates.projects = projectsData || [];
        } catch (err) {
          console.error('[Admin Data] Projects fetch error:', err);
        }

        try {
          const { data: servicesData } = await supabase
            .from('services')
            .select('*')
            .order('name')
            .abortSignal(signal);
          setServices(servicesData || []);
          currentTabUpdates.services = servicesData || [];
        } catch (err) {
          console.error('[Admin Data] Services fetch error under projects:', err);
        }

        try {
          const { data: clientsData } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'client')
            .order('full_name')
            .abortSignal(signal);
          setClients(clientsData || []);
          currentTabUpdates.clients = clientsData || [];
        } catch (err) {
          console.error('[Admin Data] Clients fetch error under projects:', err);
        }
      } else if (activeTab === 'clients') {
        try {
          const { data: clientsData, error: clientsError } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'client')
            .order('created_at', { ascending: false })
            .abortSignal(signal);
          
          if (clientsError) throw clientsError;
          setClients(clientsData || []);
          currentTabUpdates.clients = clientsData || [];
        } catch (err) {
          console.error('[Admin Data] Clients fetch error:', err);
        }

        try {
          const { data: projectsData } = await supabase
            .from('projects')
            .select(`
              *,
              client:profiles!client_id(*),
              service:services(*)
            `)
            .order('created_at', { ascending: false })
            .abortSignal(signal);
          setProjects(projectsData || []);
          currentTabUpdates.projects = projectsData || [];
        } catch (err) {
          console.error('[Admin Data] Projects fetch error under clients:', err);
        }
      } else if (activeTab === 'quotes' || activeTab === 'messages') {
        try {
          const { data: quotesData, error: quotesError } = await supabase
            .from('quote_requests')
            .select('*')
            .order('created_at', { ascending: false })
            .abortSignal(signal);
            
          if (quotesError) throw quotesError;
          
          const quoteIds = (quotesData || []).map(q => q.id);
          if (quoteIds.length > 0) {
            const { data: messagesData } = await supabase
              .from('quote_messages')
              .select('*')
              .in('quote_id', quoteIds)
              .order('created_at', { ascending: true });
            
            if (messagesData) {
              quotesData.forEach(q => {
                q.messages = messagesData.filter(m => m.quote_id === q.id);
              });
            }
          }
          
          setQuotes(quotesData || []);
          currentTabUpdates.quotes = quotesData || [];
        } catch (err) {
          console.error('[Admin Data] Quotes/Messages fetch error:', err);
        }
      } else if (activeTab === 'infoproducts') {
        try {
          const { data: productsData, error } = await supabase
            .from('marketing_products')
            .select('*')
            .order('created_at', { ascending: false })
            .abortSignal(signal);
          if (error) throw error;
          setMarketingProducts(productsData || []);
          currentTabUpdates.marketingProducts = productsData || [];
        } catch (err) {
          console.error('[Admin Data] InfoProducts fetch error:', err);
        }
      } else if (activeTab === 'portfolio') {
        try {
          const { data: portfolioData, error } = await supabase
            .from('portfolio')
            .select('*')
            .order('created_at', { ascending: false })
            .abortSignal(signal);
          if (error) throw error;
          setPortfolioItems(portfolioData || []);
          currentTabUpdates.portfolioItems = portfolioData || [];
        } catch (err) {
          console.error('[Admin Data] Portfolio fetch error:', err);
        }
      } else if (activeTab === 'services') {
        try {
          const { data: servicesData, error } = await supabase
            .from('services')
            .select('*')
            .order('name')
            .abortSignal(signal);
          if (error) throw error;
          setServices(servicesData || []);
          currentTabUpdates.services = servicesData || [];
        } catch (err) {
          console.error('[Admin Data] Services fetch error:', err);
        }
      } else if (activeTab === 'blog') {
        try {
          const { data: blogData, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false })
            .abortSignal(signal);
          if (error) throw error;
          setBlogPosts(blogData || []);
          currentTabUpdates.blogPosts = blogData || [];
        } catch (err) {
          console.error('[Admin Data] Blog fetch error:', err);
        }
      } else if (activeTab === 'logos') {
        try {
          const { data: logosData, error } = await supabase
            .from('client_logos')
            .select('*')
            .order('order_index', { ascending: true })
            .abortSignal(signal);
          if (error) throw error;
          setClientLogos(logosData || []);
          currentTabUpdates.clientLogos = logosData || [];
        } catch (err) {
          console.error('[Admin Data] Logos fetch error:', err);
        }
      } else if (activeTab === 'overview') {

        // Fetch each stat independently to prevent one failure from blocking the others
        const fetchCount = async (table: string, filter?: { col: string, val: string }) => {
          try {
            let query = supabase.from(table).select('*', { count: 'exact', head: true });
            if (filter) query = query.eq(filter.col, filter.val);
            const { count, error } = await query.abortSignal(signal);
            if (error) throw error;
            return count || 0;
          } catch (err) {
            console.warn(`[Admin Data] Failed to fetch count for ${table}:`, err);
            return 0;
          }
        };

        const [projectsCount, clientsCount, quotesCount, blogCount] = await Promise.all([
          fetchCount('projects'),
          fetchCount('profiles', { col: 'role', val: 'client' }),
          fetchCount('quote_requests'),
          fetchCount('blog_posts')
        ]);

        const statsData = {
          projects: projectsCount,
          clients: clientsCount,
          quotes: quotesCount,
          blogPosts: blogCount
        };
        setStats(statsData);
        currentTabUpdates.stats = statsData;
      }
      
      // Persist to Central Cache
      globalAdminCache[activeTab] = { ...(globalAdminCache[activeTab] || {}), ...currentTabUpdates };
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return;
      }
      
      const errMessage = getErrorMessage(error);
      if (errMessage.includes('Invalid data') || errMessage.includes('PIN Company')) {
        return;
      }
      console.error('[Admin Data] DEBUG ERROR - Non-critical load error:', errMessage, error);
    } finally {
      console.log(`[Admin Data] DEBUG: Fetch concluído para tab: ${activeTab}`);
      setLoading(false);
    }
  }, [activeTab]);

  // Timeout de Segurança: Reduzido para 10s conforme solicitação core
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading((currentLoading) => {
        if (currentLoading) {
          console.warn('[Admin Data] Aviso: Timeout de 10s atingido. Ativando recuperação manual.');
          setErrorStatus(true);
          return false;
        }
        return currentLoading;
      });
    }, 10000); // 10s timeout
    return () => {
      clearTimeout(timeout);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    projects,
    clients,
    quotes,
    marketingProducts,
    portfolioItems,
    services,
    blogPosts,
    clientLogos,
    stats,
    loading,
    errorStatus,
    setErrorStatus,
    loadData
  };
}
