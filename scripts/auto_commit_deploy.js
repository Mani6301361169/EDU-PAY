import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const logFile = path.join(rootDir, 'auto_commit.log');

function log(msg) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${msg}`;
  console.log(entry);
  try {
    fs.appendFileSync(logFile, entry + '\n');
  } catch (_e) {
    // Ignore log file append errors
  }
}

function runCmd(cmd, cwd = rootDir, retries = 1) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return execSync(cmd, { cwd, encoding: 'utf-8', env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } });
    } catch (err) {
      if (attempt === retries) throw err;
      log(`Command failed (attempt ${attempt}/${retries}): ${cmd}. Retrying in 3s...`);
      execSync('node -e "setTimeout(() => {}, 3000)"');
    }
  }
}

export async function runAutoCommitWorkflow() {
  log('Starting Automated Git & Deployment Workflow...');

  try {
    // 1. Check for uncommitted changes
    const statusOutput = runCmd('git status --porcelain');
    const statusLines = statusOutput.trim().split('\n').filter(Boolean);

    if (statusLines.length === 0) {
      log('No uncommitted file changes detected. Repository is clean and in sync.');
      return { status: 'CLEAN', message: 'No uncommitted changes' };
    }

    log(`Detected ${statusLines.length} modified/untracked file(s).`);

    // 2. Safeguard: Run Build & Lint Verification before committing
    log('Running pre-commit verification (Frontend Lint & Build)...');
    try {
      runCmd('npm run lint', path.join(rootDir, 'frontend'));
      runCmd('npm run build', path.join(rootDir, 'frontend'));
      runCmd('node --test src/utils/*.test.js', path.join(rootDir, 'frontend'));
      log('Pre-commit verification PASSED cleanly.');
    } catch (verificationError) {
      log(`CRITICAL: Pre-commit verification FAILED! Aborting commit to protect repository integrity.\n${verificationError.message}`);
      return { status: 'FAILED_VERIFICATION', error: verificationError.message };
    }

    // 3. Generate Meaningful Commit Message based on file changes
    const modifiedFiles = statusLines.map((l) => l.slice(3).trim());
    let category = 'refactor';
    if (modifiedFiles.some((f) => f.includes('backend'))) category = 'feat(backend)';
    else if (modifiedFiles.some((f) => f.includes('pages/Admin'))) category = 'feat(admin)';
    else if (modifiedFiles.some((f) => f.includes('pages/Student') || f.includes('pages/Parent'))) category = 'feat(portal)';
    else if (modifiedFiles.some((f) => f.includes('components') || f.includes('styles'))) category = 'style(ui)';
    else if (modifiedFiles.some((f) => f.endsWith('.md'))) category = 'docs';

    const fileSummary = modifiedFiles.slice(0, 3).map((f) => path.basename(f)).join(', ');
    const commitMsg = `${category}: automated sync of ${fileSummary}${modifiedFiles.length > 3 ? ` and ${modifiedFiles.length - 3} other files` : ''}`;

    // 4. Stage and Commit
    log(`Staging files and committing with message: "${commitMsg}"...`);
    runCmd('git add .');
    runCmd(`git commit -m "${commitMsg}"`);

    const commitHash = runCmd('git rev-parse --short HEAD').trim();
    log(`Successfully created commit [${commitHash}]: ${commitMsg}`);

    // 5. Safeguard: Push to GitHub main with retries for network resilience
    log('Pushing commit to GitHub main repository...');
    runCmd('git push origin main', rootDir, 3);
    log('Git push to main branch SUCCESSFUL. Render deployment automatically triggered via webhook!');

    // 6. Deploy to GitHub Pages
    log('Deploying updated build to GitHub Pages (gh-pages)...');
    try {
      runCmd('npx gh-pages -d dist', path.join(rootDir, 'frontend'), 2);
      log('GitHub Pages deployment SUCCESSFUL.');
    } catch (ghPagesErr) {
      log(`WARNING: GitHub Pages deploy encountered an issue: ${ghPagesErr.message}. Main branch push succeeded.`);
    }

    log(`Automated Git & Render deployment workflow completed successfully for commit [${commitHash}].`);
    return { status: 'SUCCESS', commitHash, commitMsg };
  } catch (globalErr) {
    log(`ERROR in auto-commit workflow: ${globalErr.message}`);
    return { status: 'ERROR', error: globalErr.message };
  }
}

// Execute directly if run via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runAutoCommitWorkflow();
}
