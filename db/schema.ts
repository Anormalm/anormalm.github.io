import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const visitorSignals = sqliteTable(
  'visitor_signals',
  {
    day: text('day').notNull(),
    countryCode: text('country_code').notNull(),
    latitudeCell: integer('latitude_cell').notNull(),
    longitudeCell: integer('longitude_cell').notNull(),
    signalCount: integer('signal_count').notNull().default(1),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.day, table.countryCode, table.latitudeCell, table.longitudeCell],
    }),
  ],
);
