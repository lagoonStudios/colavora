import { db } from "@/db";
import {
  EventsQueueTable,
  TEventsQueueData,
  TEventsQueueInsertData,
} from "../schema/eventsQueue";
import { asc, eq } from "drizzle-orm";

class EventsQueueRepository {
  private static instance: EventsQueueRepository;
  constructor() {}

  static getInstance(): EventsQueueRepository {
    if (!EventsQueueRepository.instance) {
      EventsQueueRepository.instance = new EventsQueueRepository();
    }
    return EventsQueueRepository.instance;
  }

  async insertEvent(
    data: TEventsQueueInsertData
  ): Promise<{ id: number; message: string }> {
    try {
      const res = await db.insert(EventsQueueTable).values({
        eventType: data.eventType,
        body: data.body,
        shipmentID: data.shipmentID,
      });

      return {
        id: res.lastInsertRowId,
        message: "Event inserted successfully",
      };
    } catch (error) {
      console.error("🚀 ~ insertEvent ~ error:", error);
      throw error;
    }
  }

  async removeEvent(id: number): Promise<{ message: string }> {
    try {
      await db.delete(EventsQueueTable).where(eq(EventsQueueTable.id, id));
      return { message: "Event deleted successfully" };
    } catch (error) {
      console.error("🚀 ~ removeEvent ~ error:", error);
      throw error;
    }
  }

  async getEventsQueue(): Promise<TEventsQueueData[]> {
    try {
      const res = await db
        .select({
          id: EventsQueueTable.id,
          eventType: EventsQueueTable.eventType,
          body: EventsQueueTable.body,
          shipmentID: EventsQueueTable.shipmentID,
          tries: EventsQueueTable.tries,
        })
        .from(EventsQueueTable)
        .orderBy(asc(EventsQueueTable.id));

      return res;
    } catch (error) {
      console.error("🚀 ~ getEventsQueue ~ error:", error);
      throw error;
    }
  }

  async getEventsQueuedIds(): Promise<number[]> {
    try {
      const res = await db
        .select({ id: EventsQueueTable.id })
        .from(EventsQueueTable);
      return res.map(({ id }) => id);
    } catch (error) {
      console.error("🚀 ~ getEventsQueuedIds ~ error:", error);
      throw error;
    }
  }

  async getEventsByID(id: number): Promise<TEventsQueueData> {
    try {
      const res = await db
        .select({
          id: EventsQueueTable.id,
          eventType: EventsQueueTable.eventType,
          body: EventsQueueTable.body,
          shipmentID: EventsQueueTable.shipmentID,
          tries: EventsQueueTable.tries,
        })
        .from(EventsQueueTable)
        .where(eq(EventsQueueTable.id, id));
      return res[0];
    } catch (error) {
      console.error("🚀 ~ getEventsByID ~ error:", error);
      throw error;
    }
  }
}

export type EventsQueueRepositoryType = EventsQueueRepository;
export const EventsQueueLocalService = EventsQueueRepository.getInstance();
