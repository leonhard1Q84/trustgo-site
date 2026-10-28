import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trustgo.rentals';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/*/checkout/', '/*/account/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
