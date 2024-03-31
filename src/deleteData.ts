import {eventList} from "./SimulateDB/EventData";
import {doAudit} from "./storeData";

/**
 * Löscht ein Event aus der Liste der Events unabhängig davon, ob es genehmigt wurde oder nicht.
 * @param eventId
 * - Die ID des Events, das gelöscht werden soll.
 * @function doAudit
 * - Schreibt einen Audit-Log in die Datei auditLog.json.
 * @returns string
 * - Eine Bestätigung, dass das Event gelöscht wurde, oder eine Meldung, dass kein Event gefunden wurde.
 */
export async function deleteEvent (eventId: string) {
    if (eventList.approvedEvents.find(event => event.entry.eventId === eventId) !== undefined) {
        eventList.approvedEvents = eventList.approvedEvents.filter(event => event.entry.eventId !== eventId);
        doAudit("System", "Event deleted", eventId);
        return 'Event with Id '+ eventId+' deleted successfully';
    }
    if (eventList.unapprovedEvents.find(event => event.entry.eventId === eventId) !== undefined) {
        eventList.unapprovedEvents = eventList.unapprovedEvents.filter(event => event.entry.eventId !== eventId);
        doAudit("System", "Event deleted", eventId);
        return 'Event with Id '+ eventId+' deleted successfully';
    }
    return 'No event found';
}

/**
 * Löscht ein Highlight aus einem Event
 *
 * @param eventId
 * - Die ID des Events, aus dem das Highlight gelöscht werden soll.
 * @param highlightId
 * - Die ID des Highlights, das gelöscht werden soll.
 * @function doAudit
 * - Schreibt einen Audit-Log in die Datei auditLog.json.
 * @returns string
 * - Eine Bestätigung, dass das Highlight gelöscht wurde, oder eine Meldung, dass kein Event oder Highlight gefunden wurde.
 */
export async function deleteHighlight(eventId: string, highlightId: string) {
    console.log
    const event = eventList.approvedEvents.find(event => event.entry.eventId === eventId);
    if (event !== undefined) {
        if (event.entry.highlight !== undefined) {
            event.entry.highlight = event.entry.highlight.filter(highlight => highlight.highlightID !== highlightId);
            event.entry.numberOfHighlights--;
            doAudit("System", "Highlight deleted", highlightId);
            return 'Highlight with Id '+ highlightId+' deleted successfully';
        }
        return 'No event found';
    }
    return 'No highlight found';
}