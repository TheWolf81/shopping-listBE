import {
  ColumnType,
  Generated,
  Insertable,
  JSONColumnType,
  Selectable,
  Updateable,
} from 'kysely';

export interface Database {
  user: UserTable;
  list: ListTable;
  listItem: ListItemTable;
  listUser: ListUserTable;
}
export interface UserTable {

  id: Generated<number>;
  nickname: string;
  password: string;
  last_name: string | null;
  created_at: ColumnType<Date, string | undefined, never>;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export interface ListTable {
  id: Generated<number>;
  title: string;
  description: string | null;
  created_at: ColumnType<Date, string | undefined, never>;
}

export type Pet = Selectable<ListTable>;
export type NewPet = Insertable<ListTable>;
export type PetUpdate = Updateable<ListTable>;

export interface ListItemTable {
  id: Generated<number>;
  userId: number;
  listId: number;
  name: string;
  quantity: number;
  unit: string;
  status: string;
  created_at: ColumnType<Date, string | undefined, never>;
}

export type ListItem = Selectable<ListItemTable>;
export type NewListItem = Insertable<ListItemTable>;
export type ListItemUpdate = Updateable<ListItemTable>;

export interface ListUserTable {
  id: Generated<number>;
  userId: number;
  listId: number;
  role: string;
}

export type ListUser = Selectable<ListUserTable>;
export type NewListUser = Insertable<ListUserTable>;
export type ListUserUpdate = Updateable<ListUserTable>;
