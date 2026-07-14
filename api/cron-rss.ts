import { createClient } from '@supabase/supabase-js';
import Parser from 'rss-parser';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Supabase credentials missing.' });
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

    if (configError || !configData?.valor) {
      return res.status(200).json({ message: 'No RSS config found or disabled. Sync skipped.' });
    }

    const rssConfig = configData.valor;
    if (!rssConfig.enabled || !rssConfig.url) {
      return res.status(200).json({ message: 'RSS sync is disabled or URL is missing.' });
    }

    // 2. Fetch and parse the RSS feed
    const feed = await parser.parseURL(rssConfig.url);
    if (!feed.items || feed.items.length === 0) {
      return res.status(200).json({ message: 'No items found in RSS feed.' });
    }

    let insertedCount = 0;

    // 3. Process each item (up to latest 10 to avoid timeouts)
    for (const item of feed.items.slice(0, 10)) {
      // Create slug from title
      const title = item.title || 'Untitled';
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

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
      if (item.enclosure && item.enclosure.url && item.enclosure.url.match(/\.(jpeg|jpg|gif|png)$/)) {
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
      if (!content) content = `<p>${excerpt}</p>`;

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

    return res.status(200).json({
      success: true,
      message: `RSS Sync complete. Inserted ${insertedCount} new posts.`,
      feedTitle: feed.title
    });
  } catch (error) {
    console.error('RSS Sync error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
