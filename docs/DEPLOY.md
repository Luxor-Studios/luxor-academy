# Deploy — LUXOR Academy

Live production URL: **https://luxor-academy.vercel.app**

- Landing: <https://luxor-academy.vercel.app/>
- Novice tier: <https://luxor-academy.vercel.app/novice/>
- Forge BARQUE quest overview: <https://luxor-academy.vercel.app/novice/build-and-ship/forge-barque/>
- Module HTML (example): <https://luxor-academy.vercel.app/modules/build-and-ship/forge-barque/01-venv-shebang-trap.html>

Vercel project: `manu-mulaveesalas-projects/luxor-academy`.
Inspect dashboard: <https://vercel.com/manu-mulaveesalas-projects/luxor-academy>.

---

## Why deploy `web/out/` instead of letting Vercel build `web/`

The dynamic quest route at `web/app/novice/[track]/[quest]/page.tsx` reads `../modules/**` at build time. That path is outside the `web/` subdir. If Vercel's Root Directory is `web/`, the build sandbox does not have `../modules/` mounted and `generateStaticParams()` would see zero quests.

Until we either (a) move `modules/` inside `web/` or (b) configure Vercel monorepo builds from the repo root with a `web/` root-directory override, the pragmatic path is: **build locally, deploy the generated static tree.**

That is what the recipe below does.

---

## Redeploy recipe

Prereqs: you are logged in as the project owner (`vercel whoami` returns `manutej` or a collaborator on `manu-mulaveesalas-projects/luxor-academy`).

```bash
# 1. Build the shell + sync modules locally (prebuild hook runs automatically)
cd /Users/manu/Documents/LUXOR/PROJECTS/LUXOR-ACADEMY/web
npm run build

# 2. Deploy the generated static tree to production
cd out
vercel deploy --prod --yes
```

Expected output: the CLI uploads the `out/` tree (~1.2 MB), prints a deployment URL, then aliases it to `luxor-academy.vercel.app`.

Smoke-test after deploy:

```bash
for p in "/" "/novice/" "/novice/build-and-ship/forge-barque/" \
         "/modules/build-and-ship/forge-barque/01-venv-shebang-trap.html"; do
  code=$(curl -o /dev/null -s -w "%{http_code}" "https://luxor-academy.vercel.app${p}")
  printf "  %s   %s\n" "$code" "$p"
done
```

All four must return `200`. If `/novice/build-and-ship/forge-barque/` returns `404`, the prebuild did not resolve `../modules/` — check you ran step 1 from `web/` and that `modules/build-and-ship/forge-barque/quest.manifest.json` is present.

---

## Root `vercel.json` is for the legacy atlas shell

The root-level `vercel.json` rewrites `/` → `/atlas/index.html` for the Phase-0.5 atlas static shell. It does not apply to the `web/out/` deployment above — that deploys from inside `web/out/` and has its own (implicit) config.

If you ever need to deploy both (atlas + shell) under one domain, that is a Vercel monorepo setup, not this recipe.

---

## Next steps before calling production "real"

- Promote `luxor-academy.vercel.app` to a branded domain (e.g. `academy.luxor.studio`). Add via Vercel → Project → Domains.
- Enable Vercel GitHub integration so pushes to `main` auto-deploy. Requires Vercel Root Directory config or a fix to `page.tsx` MODULES_ROOT so Vercel can build `web/` directly without `../modules/`.
- Add a security-headers block to the `web/out/` deploy (CSP / HSTS / X-Frame-Options). The root `vercel.json` has a good template we can adapt.
- Wire Lighthouse CI against the live URL.
