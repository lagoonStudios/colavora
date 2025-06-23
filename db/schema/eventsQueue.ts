import { EventsQueueType } from "@hooks/eventsQueue/eventsQueue.types";
import { sqliteTable, integer, text, index } from "drizzle-orm/sqlite-core";

export const EventsQueueTable = sqliteTable(
  "eventsQueue",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    body: text().notNull(),
    eventType: text().$type<EventsQueueType>().notNull(),
    shipmentID: integer().notNull(),
    tries: integer().notNull().default(0),
  },
  (table) => [index("shipment_idx").on(table.shipmentID)]
);

export type TEventsQueueData = typeof EventsQueueTable.$inferSelect;
export type TEventsQueueInsertData = Omit<TEventsQueueData, "id" | "tries">;
