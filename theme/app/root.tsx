import type { LinksFunction, MetaFunction, LoaderFunction } from '@remix-run/node';
import tailwind from '~/styles/app.css';
import { getConfig } from '~/utils/loaders.server';
import type { SiteLoader } from '@myst-theme/common';
import {
  App,
  responseNoSite,
  getMetaTagsForSite,
  getThemeSession,
  KatexCSS,
} from '@myst-theme/site';
export { AppCatchBoundary as CatchBoundary } from '@myst-theme/site';

export const meta: MetaFunction = ({ data }) => {
  return getMetaTagsForSite({
    title: data?.config?.title,
    twitter: data?.config?.twitter,
  });
};

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: tailwind },
    KatexCSS,
    { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@docsearch/css@3' },
  ];
};

export const loader: LoaderFunction = async ({ request }): Promise<SiteLoader> => {
  const [config, themeSession] = await Promise.all([
    getConfig('overview').catch(() => null),
    getThemeSession(request),
  ]);
  if (!config) throw responseNoSite();
  const data = {
    theme: themeSession.getTheme(),
    config,
    CONTENT_CDN_PORT: process.env.CONTENT_CDN_PORT,
  };
  return data;
};

export default App;
