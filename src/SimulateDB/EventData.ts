import {EventList, EventCustom} from "./EventInterface";
export let eventList: EventList;
export let exampleEvent1: EventCustom = {
    createdOn: 1636433072,
    createdBy: "GebhardtF",
    softwareVersion: "1.0.0",
    entry: {
        title: "Tiershow",
        beschreibung: "Dies ist ein Beispiel Event",
        location: "Heidenheim",
        date: "2023-03-10",
        time: "12:00",
        eventId: "98031157-6fb6-4c15-a127-d9d27dc4594c",
        price: 100,
        numberOfHighlights: 0,
    }
}

export let exampleEvent2: EventCustom = {
    createdOn: 1696443072,
    createdBy: "MüllerI",
    softwareVersion: "1.0.0",
    entry: {
        title: "Autoshow",
        beschreibung: "Dies ist ein Beispiel Event",
        location: "Heidenheim",
        date: "2023-03-10",
        eventId: "8ffc423a-fa62-4ad9-afec-788a7af93e87",
        price: 100,
        numberOfHighlights: 1,
        highlight: [
            {
                title: "Twingo",
                description: "Dies ist KEIN Highlight",
                highlightID: "c8d7b1e1-a3b2-4102-af75-83a1e1ea77ef"
            },
            {
                title: "Porsche",
                description: "Dies ist EIN Highlight",
                highlightID: "2ce2a56b-aef2-449c-9863-5638f5597000"
            }
        ]
    }
}

export let exampleEvent4: EventCustom = {
    createdOn: 1696433072,
    createdBy: "GebhardtF",
    softwareVersion: "1.0.0",
    entry: {
        title: "Blumenshow",
        beschreibung: "Ein weiteres Beispiel Event",
        location: "Heidenheim",
        date: "2023-03-10",
        eventId: "d2dfe257-f53a-4507-a99e-2d2905fa63a1",
        price: 100,
        numberOfHighlights: 0,
    }
}

export let exampleEvent3: EventCustom = {
    createdOn: 1692433072,
    createdBy: "Inken",
    softwareVersion: "1.0.0",
    entry: {
        title: "Baumshow",
        beschreibung: "Dies ist ein Beispiel Event",
        location: "Isny",
        date: "2023-03-10",
        eventId: "d2dfe257-f53a-4507-a99e-2d2905fa63a1",
        price: 100,
        numberOfHighlights: 0,
    }
}

export async function startUp(){
    console.log('startUp', eventList);
    eventList = {
        safedData: Date.now().toString(),
        approvedEvents: [exampleEvent1, exampleEvent2],
        unapprovedEvents: [exampleEvent3, exampleEvent4]
    }
    console.log(eventList)
}