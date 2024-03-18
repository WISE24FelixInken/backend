import {EventCustom} from "./SimulateDB/EventInterface";
import * as fs from 'fs';
import {eventList} from "./SimulateDB/EventData";
import uuid4 from "uuid4";
import exp from "node:constants";
import {throws} from "node:assert";
export async function addEvent(event: EventCustom){
    if (validateEvent(event)){
        const entryToAdd =  {
            title: event.entry.title,
            beschreibung: event.entry.beschreibung,
            location: event.entry.location,
            date: event.entry.date,
            eventId: uuid4(),
            price: event.entry.price,
            numberOfHighlights: 0
        }
        const eventToAdd: EventCustom = {
            createdOn: event.createdOn,
            createdBy: event.createdBy,
            softwareVersion: event.softwareVersion,
            entry: entryToAdd
        }
        eventList.unapprovedEvents.push(eventToAdd);
        return ('Event added to unapproved events.')
    }
    return ('Object dose not match the required structure. Please check the documentation.');
}

export async function approveEvent(eventId: string){
    const eventToApprove = eventList.unapprovedEvents.find(event => event.entry.eventId === eventId);
    if (eventToApprove !== undefined){
        eventList.approvedEvents.push(eventToApprove);
        eventList.unapprovedEvents = eventList.unapprovedEvents.filter(event => event.entry.eventId !== eventId);
        return ('Event approved');
    }
    return ('Event not found');
}

export async function addHighlight(highliteData: any ){
    if (validateHighlight(highliteData)){
    const event = eventList.approvedEvents.find(event => event.entry.eventId === highliteData.eventId);
    if (event !== undefined){
        event.entry.numberOfHighlights++;
        const highlight = {
            title: highliteData.title,
            description: highliteData.description,
            highlightID: uuid4()
        }
        if (event.entry.highlight === undefined){
            event.entry.highlight = [];
        }
        event.entry.highlight.push(highlight);
        return ('Highlight added');
    }
    return ('Event not found');
    }
}
function validateEvent(event: EventCustom){
    const sendedKeys = Object.keys(event);
    const sendedEntryKeys = Object.keys(event.entry);
    const requiredKeys = ['createdOn', 'createdBy', 'softwareVersion', 'entry'];
    const requiredEntryKeys = ['title', 'beschreibung', 'location', 'date', 'price'];

    if(sendedKeys.toString() !== requiredKeys.toString() || sendedEntryKeys.toString() !== requiredEntryKeys.toString()){
        console.log('keys not matching');
        return false;
    }else{
        if(typeof event.createdOn !== 'number')
        {
            console.log('createdOn not matching');
            return false;
        }
        if(typeof event.createdBy !== 'string')
        {
            console.log('createdBy not matching');
            return false;
        }
        if(typeof event.softwareVersion !== 'string')
        {
            console.log('softwareVersion not matching');
            return false;
        }
        if(typeof event.entry.title !== 'string')
        {
            console.log('title not matching');
            return false;
        }
        if(typeof event.entry.beschreibung !== 'string')
        {
            console.log('beschreibung not matching');
            return false;
        }
        if(typeof event.entry.location !== 'string')
        {
            console.log('location not matching');
            return false;
        }
        if(typeof event.entry.date !== 'string')
        {
            console.log('date not matching');
            return false;
        }
        if(typeof event.entry.price !== 'number')
        {
            console.log('price not matching');
            return false;
        }else {
            return true;
        }
    }
}

function validateHighlight(highliteData: any){
    return true;
}