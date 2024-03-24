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

export async function deleteHighlight(eventId: string, highlightId: string) {
    console.log
    const event = eventList.approvedEvents.find(event => event.entry.eventId === eventId);
    if (event !== undefined) {
        if (event.entry.highlight !== undefined) {
            event.entry.highlight = event.entry.highlight.filter(highlight => highlight.highlightID !== highlightId);
            event.entry.numberOfHighlights--;
            return 'Highlight with Id '+ highlightId+' deleted successfully';
        }
        return 'No event found';
    }
    return 'No highlight found';
}