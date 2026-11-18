/**
 * UMBULAB AI GROWTH OS — SCRIPT SEGURO DE BACKUP DO SUPABASE STORAGE
 * Ficheiro: scripts/backup-storage.ts
 * 
 * OBJETIVO:
 *   Descarrega todos os ficheiros (blobs) dos buckets do Supabase Storage
 *   (especificamente 'projetos', 'quotes', 'project-attachments') para uma pasta local segura.
 * 
 * SEGURANÇA E PRIVACIDADE:
 *   - pg_dump exporta apenas metadados relacionais (storage.objects).
 *   - Este script exporta os binários reais para garantir um backup 100% integral.
 *   - NUNCA exibe chaves, tokens ou credenciais nos logs.
 *   - Gera um manifest.json com hashes SHA-256 e tamanhos para verificação de integridade.
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// Carregamento simples e nativo de variáveis de ambiente de .env / .env.local
function loadLocalEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const key = trimmed.slice(0, idx).trim();
          let val = trimmed.slice(idx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      });
    }
  }
}

loadLocalEnv();

async function runStorageBackup() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ [BACKUP STORAGE] Erro: SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY não configuradas no ambiente.');
    console.error('   Certifique-se de que constam no ficheiro .env protegido.');
    process.exit(1);
  }

  // Sanitizar a URL para exibição segura nos logs (sem segredos)
  const urlHost = new URL(supabaseUrl).host;
  console.log(`🔐 [BACKUP STORAGE] Conectando a: https://${urlHost}`);

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.resolve(process.cwd(), 'backups', 'storage', `storage_backup_${timestamp}`);
  fs.mkdirSync(backupDir, { recursive: true });

  console.log(`📦 [BACKUP STORAGE] Pasta de destino local: ${backupDir}`);

  // 1. Listar buckets disponíveis
  const { data: buckets, error: bucketsErr } = await supabase.storage.listBuckets();
  if (bucketsErr) {
    console.error('❌ Erro ao listar buckets no Supabase:', bucketsErr.message);
    process.exit(1);
  }

  const bucketNames = buckets.map(b => b.name);
  console.log(`🔎 Buckets detetados na infraestrutura: ${bucketNames.join(', ')}`);

  // Buckets essenciais a garantir
  const targetBuckets = ['projetos', 'quotes', 'project-attachments'];
  for (const tb of targetBuckets) {
    if (!bucketNames.includes(tb)) {
      console.log(`ℹ️ [Nota] Bucket '${tb}' não existe no projeto atual (apenas serão copiados os buckets existentes).`);
    }
  }

  const manifest: {
    createdAt: string;
    totalFiles: number;
    totalBytes: number;
    files: Array<{ bucket: string; path: string; size: number; sha256: string }>;
  } = {
    createdAt: new Date().toISOString(),
    totalFiles: 0,
    totalBytes: 0,
    files: []
  };

  for (const bucket of buckets) {
    console.log(`\n📂 Processando bucket: [${bucket.name}]...`);
    const bucketFolder = path.join(backupDir, bucket.name);
    fs.mkdirSync(bucketFolder, { recursive: true });

    async function downloadFolder(prefix = '') {
      const { data: files, error: filesErr } = await supabase.storage.from(bucket.name).list(prefix, {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' }
      });

      if (filesErr) {
        console.warn(`   ⚠️ Erro ao listar ficheiros em ${bucket.name}/${prefix}:`, filesErr.message);
        return;
      }

      if (!files || files.length === 0) {
        return;
      }

      for (const item of files) {
        const itemPath = prefix ? `${prefix}/${item.name}` : item.name;

        // Caso seja uma subpasta
        if (item.id === null) {
          await downloadFolder(itemPath);
        } else {
          // Descarregar ficheiro binário
          const { data: blob, error: downloadErr } = await supabase.storage.from(bucket.name).download(itemPath);
          if (downloadErr) {
            console.warn(`   ⚠️ Falha no download de ${bucket.name}/${itemPath}:`, downloadErr.message);
          } else if (blob) {
            const buffer = Buffer.from(await blob.arrayBuffer());
            const localFilePath = path.join(bucketFolder, itemPath);
            fs.mkdirSync(path.dirname(localFilePath), { recursive: true });
            fs.writeFileSync(localFilePath, buffer);

            const hash = crypto.createHash('sha256').update(buffer).digest('hex');
            manifest.totalFiles++;
            manifest.totalBytes += buffer.length;
            manifest.files.push({
              bucket: bucket.name,
              path: itemPath,
              size: buffer.length,
              sha256: hash
            });

            console.log(`   ✓ [${bucket.name}] ${itemPath} (${(buffer.length / 1024).toFixed(1)} KB) - SHA256: ${hash.slice(0, 8)}...`);
          }
        }
      }
    }

    await downloadFolder();
  }

  // Gravar manifesto de integridade
  fs.writeFileSync(path.join(backupDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

  console.log('\n================================================================================');
  console.log(`✅ [BACKUP STORAGE CONCLUÍDO]`);
  console.log(`   Total de ficheiros descarregados: ${manifest.totalFiles}`);
  console.log(`   Volume total: ${(manifest.totalBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`   Manifesto de integridade gravado: ${path.join(backupDir, 'manifest.json')}`);
  console.log('================================================================================');
}

if (require.main === module) {
  runStorageBackup().catch(err => {
    console.error('❌ Erro fatal no backup do Storage:', err.message || err);
    process.exit(1);
  });
}
