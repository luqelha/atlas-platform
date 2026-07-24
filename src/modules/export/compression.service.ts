import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ZipArchive } from 'archiver';

@Injectable()
export class CompressionService {
  private readonly storageDir = path.join(process.cwd(), 'storage');
  private readonly rawLogPath = path.join(this.storageDir, 'raw_logs');
  private readonly exportPath = path.join(this.storageDir, 'exports');

  constructor() {
    if (!fs.existsSync(this.exportPath)) {
      fs.mkdirSync(this.exportPath, { recursive: true });
    }
  }

  async compressLogs(jobId: string): Promise<{ zipName: string; size: number }> {
    return new Promise((resolve, reject) => {
      const zipName = `export-${jobId}.zip`;
      const output = fs.createWriteStream(path.join(this.exportPath, zipName));
      
      const archive = new ZipArchive({
        zlib: { level: 9 },
      });

      output.on('close', () => {
        resolve({
          zipName,
          size: archive.pointer(),
        });
      });

      archive.on('error', reject);
      archive.pipe(output);

      if (fs.existsSync(this.rawLogPath)) {
        const files = fs.readdirSync(this.rawLogPath);
        files.forEach(file => {
          archive.file(
            path.join(this.rawLogPath, file),
            { name: file },
          );
        });
      }

      archive.finalize();
    });
  }
}

