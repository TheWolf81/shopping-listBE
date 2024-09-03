import {Kysely, Migrator, sql} from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  //USER TABLE
  await db.schema
    .createTable('user')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('nickname', 'varchar', col => col.notNull().unique())
    .addColumn('password', 'varchar')
    .addColumn('created_at', 'timestamp', col =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  //SHOPPING LIST TABLE
  await db.schema
    .createTable('list')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('title', 'varchar', col => col.notNull())
    .addColumn('description', 'varchar')
    .addColumn('created_at', 'timestamp', col =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  //LIST ITEM TABLE
  await db.schema
    .createTable('list_item')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('user_id', 'integer', col =>
      col.references('user.id').onDelete('set null')
    )
    .addColumn('list_id', 'integer', col =>
      col.references('list.id').onDelete('cascade').notNull()
    )
    .addColumn('name', 'varchar', col => col.notNull())
    .addColumn('quantity', 'double precision', col => col.notNull())
    .addColumn('unit', 'varchar', col => col.notNull())
    .addColumn('status', 'varchar', col => col.notNull())
    .addColumn('created_at', 'timestamp', col =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  //LIST USER TABLE
  await db.schema
    .createTable('list_user')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('user_id', 'integer', col =>
      col.references('user.id').onDelete('cascade').notNull()
    )
    .addColumn('list_id', 'integer', col =>
      col.references('list.id').onDelete('cascade').notNull()
    )
    .addColumn('role', 'varchar', col => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('list_item').execute();
  await db.schema.dropTable('list_user').execute();
  await db.schema.dropTable('user').execute();
  await db.schema.dropTable('list').execute();
}
