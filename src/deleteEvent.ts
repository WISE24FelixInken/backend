import {eventList} from "./SimulateDB/EventData";

export async function deleteEvent (eventId: string) {
    if (eventList.approvedEvents.find(event => event.entry.eventId === eventId) !== undefined) {
        eventList.approvedEvents = eventList.approvedEvents.filter(event => event.entry.eventId !== eventId);
        return 'Event with Id '+ eventId+' deleted successfully';
    }
    if (eventList.unapprovedEvents.find(event => event.entry.eventId === eventId) !== undefined) {
        eventList.unapprovedEvents = eventList.unapprovedEvents.filter(event => event.entry.eventId !== eventId);
        return 'Event with Id '+ eventId+' deleted successfully';
    }
    return 'No event found';
}