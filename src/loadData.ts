
import {EventCustom} from "./SimulateDB/EventInterface";
import {eventList} from "./SimulateDB/EventData";

/**
 * Der Server hat folgende Endpunkte:
 *
 *  GET     /v1/events/approved
 *  GET     /v1/events/unapproved
 *  GET     /v1/events/loadEvent
 *  GET     /v1/events/searchEvent
 *  POST    /v1/events/addNewEvent
 *  DELETE  /v1/events/deleteEvent
 *  PATCH   /v1/events/approveEvent
 *  PUT     /v1/events/editEvent
 *  POST    /v1/events/addHighlight
 *  DELETE  /v1/events/deleteHighlight
 *  POST    /v1/startup
 *
 */

/**
 * @function getApprovedEvents
 * - Gibt alle Events zurück, die bereits genehmigt wird in GET /v1/events/approved aufgerufen
 * @returns {Promise<EventCustom[]>}
 * - Liste aller Events, die bereits genehmigt wurden
 */
export async function getApprovedEvents() {
        return  eventList.approvedEvents.sort((a, b) => b.createdOn - a.createdOn);
}

/**
 * @function getUnapprovedEvents
 * - Gibt alle Events zurück, die noch nicht genehmigt wurden, wird in GET /v1/events/unapproved aufgerufen
 * @returns {Promise<EventCustom[]>}
 * - Liste aller Events, die noch nicht genehmigt wurden
 */
export async function getUnapprovedEvents() {
    return eventList.unapprovedEvents.sort((a, b) => b.createdOn - a.createdOn);
}

/**
 * @function getSpecificEvent
 * - Gibt ein spezifisches Event zurück, das anhand der Event-ID gefunden wird, wird in GET /v1/events/loadEvent aufgerufen
 * @param eventID
 * - Die ID des Events, das gefunden werden soll
 * @returns {Promise<EventCustom | string>}
 */
export async function getSpecificEvent(eventID: string) {
    const approvedEvents = eventList.approvedEvents;
    const unapprovedEvents = eventList.unapprovedEvents;
    let event: EventCustom | undefined = approvedEvents.find(event => event.entry.eventId === eventID);
    if (event === undefined) {
        event = unapprovedEvents.find(event => event.entry.eventId === eventID);
    }
    if (event === undefined) {
        return ('Event not found');
    }
    return event;
}

/**
 * @function searchEventApproved
 * - Sucht nach einem Event in den genehmigten Events, wird in GET /v1/events/searchEvent aufgerufen
 * @param searchKey
 * - Der Suchbegriff, nach dem gesucht werden soll
 * @returns {Promise<EventCustom[] | string>}
 */
export async function searchEventApproved(searchKey: string) {
    let foundEvents: EventCustom[] = [];
    eventList.approvedEvents.forEach(event => {
        if (event.createdBy.includes(searchKey) || event.entry.title.includes(searchKey) || event.entry.beschreibung.includes(searchKey) || event.entry.location.includes(searchKey)){
            foundEvents.push(event);
        }
    })
    if(foundEvents.length === 0){
        return ('No event found');
    }
    return foundEvents;
}

/**
 * @function searchEventUnapproved
 * - Sucht nach einem Event in den ungenehmigten Events, wird in GET /v1/events/searchEvent aufgerufen
 * @param searchKey
 * - Der Suchbegriff, nach dem gesucht werden soll
 * @returns {Promise<EventCustom[] | string>}
 */
export async function searchEventUnapproved(searchKey: string) {
    let foundEvents: EventCustom[] = [];
    eventList.unapprovedEvents.forEach(event => {
        if (event.createdBy.includes(searchKey) || event.entry.title.includes(searchKey) || event.entry.beschreibung.includes(searchKey) || event.entry.location.includes(searchKey)){
            foundEvents.push(event);
        }
    })
    if(foundEvents.length === 0){
        return ('No event found');
    }
    return foundEvents;
}