import { mockInvoice } from "../data/mockInvoice";
import type { Invoice } from "../types/invoice";

/**
 * Mock API to simulate search by code / contact / upload XML.
 * Replace with real axios calls when backend ready.
 */

export async function searchByCode(code: string): Promise<Invoice | null> {
  // simulate network latency
  await new Promise((r) => setTimeout(r, 600));
  // naive: return mock if code non-empty
  return code ? mockInvoice : null;
}

export async function searchByContact(q: string): Promise<Invoice[] | null> {
  await new Promise((r) => setTimeout(r, 700));
  return q ? [mockInvoice] : null;
}

export async function uploadXmlFile(file: File): Promise<Invoice | null> {
  await new Promise((r) => setTimeout(r, 900));
  // pretend success
  return mockInvoice;
}
