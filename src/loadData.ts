import * as fs from 'fs/promises';
import {throws} from "node:assert";

import {eventList} from "./SimulateDB/EventData";
import {EventCustom} from "./SimulateDB/EventInterface";
export async function getApprovedEvents() {
        return  eventList.approvedEvents.sort((a, b) => b.createdOn - a.createdOn);
}

export async function getUnapprovedEvents() {
    return eventList.unapprovedEvents.sort((a, b) => b.createdOn - a.createdOn);
}

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