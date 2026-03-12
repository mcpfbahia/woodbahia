import { type MetadataRoute } from 'next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '~/lib/firebase';
import { initialModels } from '~/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.woodbahia.site';
  
  // Base routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/modelos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/diario-de-obras`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/simulador`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/politica-de-privacidade`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/termos-de-uso`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  // Dynamic model routes
  let modelRoutes: MetadataRoute.Sitemap = [];
  
  try {
    if (db) {
      const querySnapshot = await getDocs(collection(db, "models"));
      modelRoutes = querySnapshot.docs.map((doc) => ({
        url: `${baseUrl}/modelo/${doc.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("Error fetching models for sitemap:", error);
  }

  // Fallback to initialModels if Firebase has no data or fails
  if (modelRoutes.length === 0) {
    modelRoutes = initialModels.map((model) => ({
      url: `${baseUrl}/modelo/${model.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  }

  return [...staticRoutes, ...modelRoutes];
}
