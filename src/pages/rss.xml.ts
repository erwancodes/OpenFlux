import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { loadAllArticles } from '../utils/articles';

export function GET(context: APIContext) {
  const articles = loadAllArticles().slice(0, 50);

  return rss({
    title: 'OpenFlux par Erwan Codes — Veille technologique',
    description: 'Les derniers articles tech, IA, DevOps, Cloud, Cybersécurité, Robotique et Vibe Coding agrégés par Erwan Codes.',
    site: context.site!,
    items: articles.map((article) => ({
      title: `OpenFlux - ${article.title}`,
      pubDate: new Date(article.pubDate),
      description: article.description,
      link: `/article/${article.id}/`,
      categories: article.categories,
    })),
    customData: '<language>fr</language>',
  });
}
