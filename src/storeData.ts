import {EventCustom, EventList} from "./SimulateDB/EventInterface";
import * as fs from 'fs';
import {eventList} from "./SimulateDB/EventData";
import uuid4 from "uuid4";

/**
 * Fügt ein Event hinzu zur Liste der nicht genehmigten Events.
 * Davor wird geprüft, ob das übergebene Event den Anforderungen entspricht mit der Funktion validateEvent.
 * @param event
 * - Das Event, das hinzugefügt werden soll und am API Endpunkt übergeben wurde.
 * @function validateEvent
 * - Prüft, ob das übergebene Event den Anforderungen entspricht.
 * @function doAudit
 * - Schreibt in die Audit-Datei, dass ein Event hinzugefügt wurde.
 * @returns string
 * - Gibt eine Nachricht zurück, ob das Event hinzugefügt wurde oder nicht.
 */
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

/**
 * Akzeptiert ein Event, das zuvor in der Liste der nicht genehmigten Events gefunden wurde.
 * Dafür wird das Event in die Liste der genehmigten Events verschoben und aus der Liste der nicht genehmigten Events entfernt.
 * @param eventId
 * - Die ID des Events, das genehmigt werden soll.
 * @function doAudit
 * - Schreibt in die Audit-Datei, dass ein Event genehmigt wurde.
 * @returns string
 * - Gibt eine Nachricht zurück, ob das Event genehmigt wurde oder ob es bereits genehmigt wurde oder das es diese Event-Id nicht zuordnen kann.
 */
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

/**
 * Fügt ein Highlight zu einem Event hinzu.
 * @param highliteData
 * - Die Daten des Highlights, die am API Endpunkt übergeben wurden.
 * @function validateHighlight
 * - Prüft, ob die übergebenen Daten den Anforderungen entsprechen.
 * @function doAudit
 * - Schreibt in die Audit-Datei, dass ein Highlight hinzugefügt wurde.
 * @returns string
 * - Gibt eine Nachricht zurück, ob das Highlight hinzugefügt wurde oder ob das Event nicht gefunden wurde.
 */
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

/**
 * Bearbeitet ein Event, das zuvor in der Liste der genehmigten oder nicht genehmigten Events gefunden wurde.
 * @param event
 * - Das Event, das bearbeitet werden soll und am API Endpunkt übergeben wurde. Es muss die ID des Events enthalten. Die anderen Felder sind optional.
 * @params event.entry.id
 * - Die ID des Events, das bearbeitet werden soll.
 * @function validateToEditEvent
 * - Prüft, ob die übergebenen Daten den Anforderungen entsprechen.
 * @function doAudit
 * - Schreibt in die Audit-Datei, dass ein Event bearbeitet wurde.
 * @returns string
 * - Gibt eine Nachricht zurück, ob das Event bearbeitet wurde oder ob es bereits genehmigt wurde oder das es diese Event-Id nicht zuordnen kann.
 */
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
            if (event.entry.location !== null && event.entry.location !== undefined){
                eventToEdit.entry.location = event.entry.location;
                message = 'Event edited';
            }
            if (event.entry.time !== null && event.entry.time !== undefined){
                eventToEdit.entry.time = event.entry.time;
                message = 'Event edited';
            }
            if (event.entry.date !== null && event.entry.date !== undefined) {
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

/**
 * Validiert, ob die übergebenen Eventdaten den Anforderungen entsprechen ein neues Event hinzuzufügen.
 * @param event
 * - Das Event, das hinzugefügt werden soll und am API Endpunkt übergeben wurde.
 * @param event.createdOn
 * - Der Zeitstempel, wann das Event erstellt wurde.
 * @param event.createdBy
 * - Der Nutzername des Erstellers des Events.
 * @param event.softwareVersion
 * - Die Softwareversion, die zum Erstellen des Events verwendet wurde.
 * @param event.entry.title
 * - Der Titel des Events.
 * @param event.entry.beschreibung
 * - Die Beschreibung des Events.
 * @param event.entry.location
 * - Der Ort des Events.
 * @param event.entry.date
 * - Das Datum des Events.
 * @param event.entry.price
 * - Der Preis des Events.
 *
 * @returns boolean
 * - Gibt zurück, ob die übergebenen Daten den Anforderungen entsprechen.
 */
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
function validateToEditEvent(event: EventCustom){
    return true
}

//ToDo implement
function validateHighlight(highliteData: any){
    return true;
}

/**
 * Schreibt in die Audit-Datei, dass ein Nutzer eine Aktion durchgeführt hat.
 * @param createdBy
 * - Der Nutzername des Nutzers, der die Aktion durchgeführt hat.
 * @param action
 * - Die Aktion, die der Nutzer durchgeführt hat.
 * @param eventId
 * - Die ID des Events, zu dem die Aktion durchgeführt wurde.
 */
export async function doAudit(createdBy: string, action: string, eventId: string) {
    let text = 'Nutzer: ' +  createdBy + ' hat folgende Aktionen durchgeführt: ' + action + ' am ' + Date.now() + ' mit dem Event '+ eventId +'\n';
    fs.appendFile('src/SimulateDB/audit.txt', text, (error) => {
        if (error) throw error;
    });
}

