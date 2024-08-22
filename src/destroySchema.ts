import * as path from 'path';
import {promises as fs} from 'fs';
import {Migrator, FileMigrationProvider} from 'kysely';
import {db} from './database';

async function migrateDown() {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, 'migrations'),
    }),
  });

  const {error, results} = await migrator.migrateDown();

  results?.forEach(it => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was reverted successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to revert migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate down');
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrateDown();
