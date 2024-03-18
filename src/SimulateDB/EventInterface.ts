export interface EventCustom {
    createdOn: number;
    createdBy: string;
    softwareVersion: string;
    entry: {
        title: string;
        beschreibung: string;
        location: string;
        date: string;
        eventId: string;
        price: number;
        numberOfHighlights: number;
        highlight?: highlight[];
    }
}

export interface EventList{
    safedData: string;
    approvedEvents: EventCustom[];
    unapprovedEvents: EventCustom[];
}

export interface highlight{
    title: string;
    description: string;
    highlightID: string;
}