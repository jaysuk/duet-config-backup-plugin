#!/usr/bin/env node
/**
 * Print the static footer appended to every GitHub Release body: install instructions and the
 * DuetWebControl version the ZIP was built against.
 *
 * The DWC details come from the CI build environment (the release workflow sets these after it
 * checks out DuetWebControl); read from plugin.json so it also reads sensibly when run locally.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(readFileSync(join(here, "..", "plugin.json"), "utf8"));
const pkgVersion = manifest.version;

const dwcVersion = process.env.DWC_VERSION || "";
const dwcSha = process.env.DWC_SHA || "";
const dwcRef = process.env.DWC_REF || "v3.7-dev";
const dwcBuiltAgainst = dwcVersion
	? `**DuetWebControl ${dwcVersion}**${dwcSha ? ` (\`${dwcSha}\`, ref \`${dwcRef}\`)` : ` (ref \`${dwcRef}\`)`}`
	: `DuetWebControl (ref \`${dwcRef}\`)`;

const out = `
---

### 📦 Install
1. Download \`DuetConfigBackup-${pkgVersion}.zip\` from the **Assets** below.
2. In DuetWebControl, go to **Settings → General → Plugins** and click **Install Plugin**.
3. Select the downloaded ZIP and accept the third-party-plugin prompt.
4. Reload DWC if asked.

> 🔧 Built against ${dwcBuiltAgainst}. Use a DuetWebControl build at or near this version.
`;

process.stdout.write(out.replace(/^\n/, ""));
