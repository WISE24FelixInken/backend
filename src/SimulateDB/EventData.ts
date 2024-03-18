import {EventList, EventCustom} from "./EventInterface";
import uuid4 from "uuid4";

let exampleEvent1: EventCustom = {
    createdOn: 1636433072,
    createdBy: "GebhardtF",
    softwareVersion: "1.0.0",
    entry: {
        title: "Beispiel Event 1",
        beschreibung: "Dies ist ein Beispiel Event",
        location: "Heidenheim",
        date: "2023-03-10",
        eventId: uuid4(),
        price: 100,
        numberOfHighlights: 0,
    }
}

let exampleEvent2: EventCustom = {
    createdOn: 1696443072,
    createdBy: "MüllerI",
    softwareVersion: "1.0.0",
    entry: {
        title: "Tiger",
        beschreibung: "Dies ist ein Beispiel Event",
        location: "Heidenheim",
        date: "2023-03-10",
        eventId: uuid4(),
        price: 100,
        numberOfHighlights: 0,
    }
}

let exampleEvent4: EventCustom = {
    createdOn: 1696433072,
    createdBy: "GebhardtF",
    softwareVersion: "1.0.0",
    entry: {
        title: "Beispiel Event 4",
        beschreibung: "Dies ist ein Beispiel Event",
        location: "Heidenheim",
        date: "2023-03-10",
        eventId: uuid4(),
        price: 100,
        numberOfHighlights: 0,
    }
}

let exampleEvent3: EventCustom = {
    createdOn: 1692433072,
    createdBy: "Inken",
    softwareVersion: "1.0.0",
    entry: {
        title: "Wal",
        beschreibung: "Dies ist ein Beispiel Event",
        location: "Isny",
        date: "2023-03-10",
        eventId: uuid4(),
        price: 100,
        numberOfHighlights: 0,
    }
}

export let eventList: EventList = {
    safedData: "2023-03-01",
    approvedEvents: [exampleEvent1, exampleEvent2],
    unapprovedEvents: [exampleEvent3, exampleEvent4]
}