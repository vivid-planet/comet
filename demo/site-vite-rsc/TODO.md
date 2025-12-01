TODO done:
- redirect von / auf /en
- language parsen und validaten
- page.tsx: not-found, redirect
- Layout
- language am html tag
- dam rewrite
- robots.txt
- cache headers (html response)
- cache header für loader daten vgl. RSC request (der per fetch gemacht wird)
- admin redirect
- status
- @comet eslint verwenden
- 404 wenn siteConfig nicht matched
- 404 wenn /assets/ nicht matched
- sitemap.xml, baseUrl berücksichtigen
- Link Document: redirect/404
- 404 seite mit content und mehrsprachigkeit
- site-preview
- cache headers nicht in site-preview (html response, rsc response)
- rsc response nicht basierend auf Accept header anfordern sondern eine andere url verwenden (.rsc/* oder so)
- predefinedPage und übersetzte pfade für zB /news
- aktiven menüpunkt stylen
- link zu predefined page: von irgendwo: client component
- link zu predefined page: von news list auf detail
- link zu predefined page: von irgendwo: server component (konkretes bsp fehlt, ist aber möglich)
- PathContext: beinhaltet predefined pages, unbenennen in was besseres - Router o.ä.
- Root component einsparen?
- fetch cache, mit redis option (nicht in site-preview)
- visibility param (bei gql requests mitschicken)
- InternalLinkBlockProps <Link> verwenden (nicht nötig)
- bessere löusng für predefined pages, kein if in Root component sondern eine map o.ä.
- seo tags, incl. title u. description
- 404 nicht als error loggen
- react-focus-lock build problem lösen (oder alternatives package?)
- block-preview
- Component: PixelImageBlock
- Component: Slider (feiglt)
- Component: alle Link
- Component MediaBlock: DamVideoBlock, VimeoVideoBlock (wegen PixelImageBlock in nextjs) -> PR im comet
- alle responses gezip? html, assets, svg?
- gql im client mit persistedqueries (news mehr laden)
- beispiel für api route (/graphql ist schon eine)


TODO:
- renderRscPayload in library (wie mehrsprachigkeit u.a. optional?)
- rsc-entry file besser strukturieren
- schöne 404 seite wenn language nicht matched, wenn predefined page nicht matched
- 404 rendern für rsc request, auch 404 http response status? 404 fehler anzeigen (derzeit wird error throwed)
- FEIGLT: cache haders abhängig von page abschaltbar oder konfigurierbar (html response, rsc response)
- error handling wenn RSC request failed (oder lange dauert?)
  - testen: server stoppen und klicken
  - wie macht next das?
- wenn RSC request ein redirect machen würde (link auf / redirected auf /en) funktioniert das noch nicht
- das regelmäßig durchgehen: https://github.com/vitejs/vite-plugin-react/commits/main/packages/plugin-rsc/examples/starter (letzter stand: 17.11.25)
- im dev modus kein max-age header? (wegen browser cache, eventuell nur s-maxage?)

middlewares:
- csp header
- redirect to main host
- cdn origin check (bei next im server)


futureLib:
- config auf die auch die library zugreifen kann (image größen): 
  - import { appConfig } from 'virtual:app-config';
  - vite plugin appConfigPlugin 
- die ganze vite config in ein plugin auslagern damit nicht so viel im projekt liegen muss
- NextImage features implementieren
  - sizes? oder geht das eh browser nativ schon?
  - placeholder
  - preload / priority?
  - lazy loading?
  - fill
  - ...

später:
- "use cache" evaluieren (statt fetch cache, um einzelne pages cachebar zu machen (und cache-header zu beeinflussen))
- möglichst viel server components machen, lösung für block-preivew-hoc finden
