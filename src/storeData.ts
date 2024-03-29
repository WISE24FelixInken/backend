import {EventCustom, EventList} from "./SimulateDB/EventInterface";
import * as fs from 'fs';
import {eventList} from "./SimulateDB/EventData";
import uuid4 from "uuid4";

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
        doAudit(event.createdBy, 'added event to unapproved events.', entryToAdd.eventId);
        return ('Event added to unapproved events.')
    }
    return ('Object dose not match the required structure. Please check the documentation.');
}
export async function approveEvent(eventId: string){
    let eventToApprove = eventList.unapprovedEvents.find(event => event.entry.eventId === eventId);
    if (eventToApprove !== undefined){
        eventList.approvedEvents.push(eventToApprove);
        eventList.unapprovedEvents = eventList.unapprovedEvents.filter(event => event.entry.eventId !== eventId);
        doAudit("System", 'approved', eventId);
        return ('Event approved');
    }
    eventToApprove = eventList.approvedEvents.find(event => event.entry.eventId === eventId);
    if (eventToApprove !== undefined){
        return ('Event already approved');
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
        doAudit("System", 'added highlight', event.entry.eventId);
        return ('Highlight added');
    }
    return ('Event not found');
    }
}
export async function editEvent(event: EventCustom){
    if (validateToEditEvent(event)){
        let eventToEdit
        let message = 'Event not found';
        if(eventList.approvedEvents.find(eventToEdit => eventToEdit.entry.eventId === event.entry.eventId)!== undefined){
            eventToEdit = eventList.approvedEvents.find(eventToEdit => eventToEdit.entry.eventId === event.entry.eventId);
            console.log('approved', eventToEdit);
        }
        if(eventList.unapprovedEvents.find(eventToEdit => eventToEdit.entry.eventId === event.entry.eventId)!== undefined){
            eventToEdit = eventList.unapprovedEvents.find(eventToEdit => eventToEdit.entry.eventId === event.entry.eventId);
            console.log('unapproved', eventToEdit);
        }
        if (eventToEdit !== undefined){
            message ='No changes made to the event. Please check the documentation.';
            if (event.entry.title !== null && event.entry.title !== undefined){
                eventToEdit.entry.title = event.entry.title;
                message = 'Event edited';
            }
            if (event.entry.beschreibung !== null && event.entry.beschreibung !== undefined){
                eventToEdit.entry.beschreibung = event.entry.beschreibung;
                message = 'Event edited';
            }
            if (event.entry.location !== null && event.entry.location){
                eventToEdit.entry.location = event.entry.location;
                message = 'Event edited';
            }
            if (event.entry.date !== null && event.entry.price !== undefined) {
                eventToEdit.entry.date = event.entry.date;
                message = 'Event edited';
            }
            if (event.entry.price !== null && event.entry.price !== undefined) {
                eventToEdit.entry.price = event.entry.price;
                message = 'Event edited';
            }
            doAudit(event.createdBy, 'edited', event.entry.eventId);
        }

        return (message);
    }
}
//ToDo implement
function validateToEditEvent(event: EventCustom){
    return true
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
//ToDo implement
function validateHighlight(highliteData: any){
    return true;
}

async function doAudit(createdBy: string, action: string, eventId: string) {
    let text = 'Nutzer: ' +  createdBy + ' hat folgende Aktionen durchgeführt: ' + action + ' am ' + Date.now() + ' mit dem Event '+ eventId +'\n';
    fs.appendFile('src/SimulateDB/audit.txt', text, (error) => {
        if (error) throw error;
    });
}

