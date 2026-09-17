import { createClient } from '@supabase/supabase-js';
import Parser from 'rss-parser';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use service role just for cron execution (it's safe here because it's a server-to-server webhook, given we protect it with a secret)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req: Request) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  // Security: Check for CRON_SECRET via Bearer token
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const expectedSecret = process.env.CRON_SECRET;

  // We only allow execution if CRON_SECRET is configured in Vercel and matches the token
  if (!expectedSecret || token !== expectedSecret) {
    return new Response(JSON.stringify({ error: 'Unauthorized or misconfigured CRON_SECRET' }), { status: 401 });
  }

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: 'Supabase credentials missing.' }), { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const parser = new Parser({
    customFields: {
      item: ['description', 'content:encoded', 'summary', 'image', 'enclosure', 'media:content']
    }
  });

  try {
    // 1. Fetch the RSS configuration
    const { data: configData, error: configError } = await supabase
      .from('configuracoes')
      .select('valor')
      .eq('chave', 'blog_rss_sync')
      .single();

    if (configError) {
      return new Response(JSON.stringify({ error: \`Erro no Banco (configuracoes): \${configError.message}\` }), { status: 200 });
    }
    if (!configData || !configData.valor) {
      return new Response(JSON.stringify({ error: 'Nenhuma configuração de RSS encontrada no banco.' }), { status: 200 });
    }

    const rssConfig = configData.valor;
    if (!rssConfig.enabled || !rssConfig.url) {
      return new Response(JSON.stringify({ error: 'A automação está desligada ou a URL está vazia. Salve as configurações e marque "Automação Ligada".' }), { status: 200 });
    }

    // 2. Fetch and parse the RSS feed
    let feed;
    try {
      feed = await parser.parseURL(rssConfig.url);
    } catch (initialError) {
      console.log('Failed to parse original URL as RSS, trying fallbacks...');
      const baseUrl = rssConfig.url.replace(/\\/$/, ''); // Remove trailing slash
      const fallbacks = [
        \`\${baseUrl}/feed\`,
        \`\${baseUrl}/rss\`,
        \`\${baseUrl}/feed.xml\`
      ];

      let success = false;
      for (const fallbackUrl of fallbacks) {
        try {
          feed = await parser.parseURL(fallbackUrl);
          success = true;
          console.log(\`Successfully parsed fallback URL: \${fallbackUrl}\`);
          break;
        } catch (e) {
          // ignore
        }
      }

      if (!success) {
        throw new Error('A URL fornecida não é um Feed RSS válido. Tente adicionar /feed no final do link (Ex: https://blog.meo.pt/feed)');
      }
    }

    if (!feed.items || feed.items.length === 0) {
      return new Response(JSON.stringify({ message: 'No items found in RSS feed.' }), { status: 200 });
    }

    let insertedCount = 0;

    // 3. Process each item (up to latest 10 to avoid timeouts)
    for (const item of feed.items.slice(0, 10)) {
      // Create slug from title
      const title = item.title || 'Untitled';
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\\u0300-\\u036f]/g, '')
        .replace(/[^\\w\\s-]/g, '')
        .trim()
        .replace(/\\s+/g, '-');

      // Check if it already exists
      const { data: existingPost } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (existingPost) {
        continue; // Skip if already exists
      }

      // Try to extract an image URL
      let imageUrl = 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&auto=format&fit=crop&q=60';
      if (item.enclosure && item.enclosure.url && item.enclosure.url.match(/\\.(jpeg|jpg|gif|png)$/)) {
        imageUrl = item.enclosure.url;
      } else if (item['media:content'] && item['media:content'].$) {
        imageUrl = item['media:content'].$.url;
      } else if (item.content || item['content:encoded']) {
        const imgMatch = (item.content || item['content:encoded']).match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) imageUrl = imgMatch[1];
      }

      // Prepare content and excerpt
      let content = item['content:encoded'] || item.content || item.description || '';
      let excerpt = item.contentSnippet || item.summary || item.description || '';
      if (excerpt.length > 250) {
        excerpt = excerpt.substring(0, 247) + '...';
      }

      // Fallbacks
      if (!content) content = \`<p>\${excerpt}</p>\`;

      const postData = {
        title: title,
        slug: slug,
        excerpt: excerpt,
        content: content,
        featured_image_url: imageUrl,
        status: 'published',
        published_at: item.isoDate || item.pubDate || new Date().toISOString()
      };

      const { error: insertError } = await supabase.from('blog_posts').insert([postData]);
      if (!insertError) {
        insertedCount++;
      } else {
        console.error('Error inserting post:', slug, insertError);
      }
    }

    // 4. Update last_synced
    await supabase
      .from('configuracoes')
      .update({
        valor: {
          ...rssConfig,
          last_synced: new Date().toISOString()
        }
      })
      .eq('chave', 'blog_rss_sync');

    return new Response(JSON.stringify({
      success: true,
      message: \`RSS Sync complete. Inserted \${insertedCount} new posts.\`,
      feedTitle: feed.title
    }), { status: 200 });

  } catch (error: any) {
    console.error('RSS Sync error:', error.message);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
  }
}
