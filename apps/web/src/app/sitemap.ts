import type { MetadataRoute } from 'next';

export default function Sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chatvibe-web.fly.dev';
  const routes = ['/', '/auth', '/video', '/chat', '/explore', '/profile', '/privacy', '/terms', '/safety', '/premium'];
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    ...routes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '/' ? 1 : 0.8,
    })),
  ];
}
